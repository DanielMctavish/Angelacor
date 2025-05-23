import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Close, Person, AccountBalance, Description, AttachMoney, Send, Article, DoneAll } from '@mui/icons-material';
import axios from 'axios';
import { toast } from '../../../Common/Toast/Toast';
import io from 'socket.io-client';
import SimulationCalculator from './SimulationCalculator';

function ProposalDetails({ isOpen, onClose, proposal: initialProposal, onMessageSent }) {
    const [proposal, setProposal] = useState(initialProposal);
    const [observations, setObservations] = useState([]);
    const [newObservation, setNewObservation] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);
    const [socket, setSocket] = useState(null);
    const [showContract, setShowContract] = useState(false);

    // Inicializar socket e entrar na sala quando o componente montar
    useEffect(() => {

        if (isOpen && initialProposal?.id) {
            const newSocket = io(import.meta.env.VITE_API_URL);
            setSocket(newSocket);
            
            // Emitir evento de entrar na sala usando o formato correto
            newSocket.emit('join-proposal', initialProposal.id);

            // Nome da sala para ouvir as mensagens
            const roomName = `angelcor-conversation-${initialProposal.id}`;

            // Ouvir por novas mensagens no canal específico da sala
            newSocket.on(roomName, (data) => {
                console.log("observando mensagem! ", data)
                // O servidor está enviando um objeto { proposalId, observations, updatedAt }
                // Precisamos extrair as observations desse objeto
                if (data && data.observations && Array.isArray(data.observations)) {
                    const uniqueObservations = data.observations.filter(
                        (obs, index, self) => index === self.findIndex((o) => o.createdAt === obs.createdAt)
                    );
                    setObservations(uniqueObservations);
                }
            });

            // Também ouvimos o evento 'new-observation' caso o servidor esteja usando este método
            newSocket.on('new-observation', (data) => {
                console.log("Recebendo via new-observation: ", data);
                if (data && data.observations && Array.isArray(data.observations)) {
                    const uniqueObservations = data.observations.filter(
                        (obs, index, self) => index === self.findIndex((o) => o.createdAt === obs.createdAt)
                    );
                    setObservations(uniqueObservations);
                } else if (data && Array.isArray(data)) {
                    const uniqueObservations = data.filter(
                        (obs, index, self) => index === self.findIndex((o) => o.createdAt === obs.createdAt)
                    );
                    setObservations(uniqueObservations);
                }
            });

            return () => {
                // Parar de ouvir o evento ao desmontar
                newSocket.off(roomName);
                newSocket.off('new-observation');
                // Ao desmontar, desconectar o socket
                newSocket.disconnect();
            };
        }
    }, [isOpen, initialProposal?.id]);

    // Atualiza o estado local quando a prop muda
    useEffect(() => {
        setProposal(initialProposal);
        if (initialProposal?.observations) {
            const uniqueObservations = initialProposal.observations.filter(
                (obs, index, self) => index === self.findIndex((o) => o.createdAt === obs.createdAt)
            );
            setObservations(uniqueObservations);
        }
    }, [initialProposal]);

    // Função para adicionar observação
    const handleAddObservation = async () => {
        if (!newObservation.trim() || sendingMessage) return;
        setSendingMessage(true);
        try {
            const colaboratorData = JSON.parse(localStorage.getItem('colaboratorData'));
            const newObservationData = {
                observation: newObservation.trim(),
                colaboratorId: colaboratorData.user.id
            };

            await axios.patch(
                `${import.meta.env.VITE_API_URL}/proposal/update?proposalId=${proposal.id}`,
                { observations: [newObservationData] },
                { headers: { 'Authorization': `Bearer ${colaboratorData.token}` } }
            );

            setNewObservation('');
            toast.success('Mensagem enviada!');
            onMessageSent?.();
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            toast.error('Erro ao enviar mensagem');
        } finally {
            setSendingMessage(false);
        }
    };

    // Função para lidar com simulações salvas
    const handleSimulationSaved = (updatedSimulations) => {
        setProposal(prev => ({ ...prev, currentSimulations: updatedSimulations }));
    };

    // Formata o tempo relativo
    const formatRelativeTime = (date) => {
        const now = new Date();
        const diff = now - new Date(date);
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'agora mesmo';
        if (minutes < 60) return `há ${minutes} minutos`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `há ${hours} horas`;
        const days = Math.floor(hours / 24);
        if (days === 1) return 'há 1 dia';
        if (days < 7) return `há ${days} dias`;
        return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
    };

    if (!isOpen || !proposal) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 p-5"
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-[#1f1f1f] rounded-xl p-6 w-full h-full overflow-y-auto flex flex-col"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Detalhes da Proposta</h2>
                    <div className="flex items-center gap-4">
                        {(proposal.isTrueContract || proposal.contractStatus === 'aprovado') && proposal.contractContent && (
                            <button
                                onClick={() => setShowContract(!showContract)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-500 rounded-lg transition-colors"
                            >
                                <Article />
                                {showContract ? 'Ocultar Contrato' : 'Ver Contrato'}
                            </button>
                        )}
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                            <Close />
                        </button>
                    </div>
                </div>

                {/* Exibição do Contrato quando o botão é clicado e existe contrato */}
                {showContract && proposal.contractContent && (
                    <div className="mb-6 bg-white/5 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-[#e67f00] mb-4 flex items-center gap-2 justify-between">
                            <div className="flex items-center gap-2">
                                <Description /> Contrato
                            </div>
                            {proposal.clientSignature ? (
                                <div className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full flex items-center gap-1 text-sm">
                                    <DoneAll />
                                    Assinado pelo cliente
                                </div>
                            ) : (
                                <div className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full flex items-center gap-1 text-sm">
                                    Aguardando assinatura do cliente
                                </div>
                            )}
                        </h3>
                        <div 
                            className="bg-white p-6 rounded-lg prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: proposal.contractContent }}
                        />
                        
                        {proposal.clientSignature && (
                            <div className="mt-4 bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                                <h4 className="text-green-500 text-sm font-medium mb-2">Detalhes da Assinatura Digital</h4>
                                <div className="text-gray-300 text-xs space-y-1">
                                    {(() => {
                                        try {
                                            const signatureData = JSON.parse(proposal.clientSignature);
                                            return (
                                                <>
                                                    <p><strong>Cliente:</strong> {signatureData.clientName}</p>
                                                    <p><strong>CPF:</strong> {signatureData.clientCPF}</p>
                                                    <p><strong>Data:</strong> {new Date(signatureData.signatureDate).toLocaleString('pt-BR')}</p>
                                                    
                                                    {signatureData.geoLocation && typeof signatureData.geoLocation !== 'string' && (
                                                        <p><strong>Localização:</strong> {signatureData.geoLocation.city}, {signatureData.geoLocation.region} - {signatureData.geoLocation.country}</p>
                                                    )}
                                                    
                                                    <p><strong>IP:</strong> {signatureData.ipAddress}</p>
                                                </>
                                            );
                                        } catch (error) {
                                            return <p>Erro ao carregar detalhes da assinatura.</p>;
                                        }
                                    })()}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex gap-6 flex-1">
                    {/* Área 1: Informações da Proposta */}
                    <div className="w-1/2 space-y-6">
                        {/* Informações do Cliente */}
                        <div className="bg-white/5 p-4 rounded-lg space-y-3">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Person />
                                <h3 className="text-lg font-medium">Dados do Cliente</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-gray-400 text-sm">Nome:</span>
                                    <p className="text-white">{proposal.client?.name}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-sm">CPF:</span>
                                    <p className="text-white">{proposal.client?.cpf}</p>
                                </div>
                            </div>
                        </div>

                        {/* Informações da Proposta */}
                        <div className="bg-white/5 p-4 rounded-lg space-y-3">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Description />
                                <h3 className="text-lg font-medium">Dados da Proposta</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-gray-400 text-sm">Tipo:</span>
                                    <p className="text-white">{proposal.proposalType}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-sm">Data:</span>
                                    <p className="text-white">
                                        {new Date(proposal.proposalDate).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-sm">Empresa/Loja:</span>
                                    <p className="text-white">{proposal.storeCompany}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-sm">Convênio:</span>
                                    <p className="text-white">{proposal.agreement}</p>
                                </div>
                            </div>
                        </div>

                        {/* Informações Financeiras */}
                        <div className="bg-white/5 p-4 rounded-lg space-y-3">
                            <div className="flex items-center gap-2 text-gray-400">
                                <AttachMoney />
                                <h3 className="text-lg font-medium">Dados Financeiros</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-gray-400 text-sm">Valor do Contrato:</span>
                                    <p className="text-white">
                                        {parseFloat(proposal.contractValue).toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-sm">Parcelas:</span>
                                    <p className="text-white">{proposal.contractInstallments}x</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-sm">Taxa de Juros:</span>
                                    <p className="text-white">{proposal.contractInterestRate}% a.m.</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-sm">Parcelas Restantes:</span>
                                    <p className="text-white">{proposal.contractRemainingInstallments || 'N/A'}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-sm">Valor da Parcela:</span>
                                    <p className="text-green-400 font-medium">
                                        {(proposal.contractValue / proposal.contractInstallments).toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-sm">Status:</span>
                                    <p className={`${proposal.isTrueContract ? 'text-green-400' : 'text-yellow-400'}`}>
                                        {proposal.isTrueContract ? 'Contrato' : 'Em análise'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Conteúdo da Proposta */}
                        {proposal.proposalContent && (
                            <div className="bg-white/5 p-4 rounded-lg space-y-3">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Description />
                                    <h3 className="text-lg font-medium">Conteúdo da Proposta</h3>
                                </div>
                                <p className="text-white whitespace-pre-wrap">{proposal.proposalContent}</p>
                            </div>
                        )}
                    </div>

                    {/* Área 2: Simulação */}
                    <div className="w-1/2">
                        <SimulationCalculator 
                            proposal={proposal} 
                            onSimulationSaved={handleSimulationSaved} 
                        />
                    </div>
                </div>

                {/* Seção de Observações/Chat */}
                <div className="bg-white/5 rounded-lg p-6 mt-8">
                    <h3 className="text-lg font-semibold text-[#e67f00] mb-4">Observações</h3>

                    {/* Lista de Observações */}
                    <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                        {observations.map((obs, index) => (
                            <div key={index} className="bg-white/5 p-4 rounded-lg">
                                <div className="flex items-start gap-3">
                                    {obs.colaborator?.url_profile_cover || obs.Admin?.url_profile_cover ? (
                                        <img
                                            src={obs.colaborator?.url_profile_cover || obs.Admin?.url_profile_cover}
                                            alt={(obs.colaborator?.name || obs.Admin?.name || 'Usuário')}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                                            <Person className="text-gray-400 text-sm" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-white text-sm font-medium">
                                                    {obs.colaborator?.name || obs.Admin?.name || 'Usuário'}
                                                </span>
                                                <span className="text-gray-400 text-xs ml-2">
                                                    {obs.colaborator?.function || (obs.Admin || obs.isAdmSender ? 'Administrador' : '')}
                                                </span>
                                            </div>
                                            <span className="text-gray-400 text-xs">
                                                {formatRelativeTime(obs.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 mt-1 text-sm">
                                            {obs.observation}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input para Nova Observação */}
                    <div className="flex gap-2 bg-white/5 rounded-lg p-2">
                        <input
                            type="text"
                            value={newObservation}
                            onChange={(e) => setNewObservation(e.target.value)}
                            placeholder="Digite uma mensagem..."
                            className="flex-1 bg-transparent border-none outline-none text-white text-sm"
                            disabled={sendingMessage}
                        />
                        <button
                            onClick={handleAddObservation}
                            disabled={!newObservation.trim() || sendingMessage}
                            className="p-2 bg-[#e67f00] hover:bg-[#ff8c00] rounded-lg transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed min-w-[40px] h-[40px] flex items-center justify-center"
                        >
                            {sendingMessage ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Send className="text-xl" />
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default ProposalDetails;