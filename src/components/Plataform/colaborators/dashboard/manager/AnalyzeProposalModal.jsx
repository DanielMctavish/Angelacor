import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Close, Person, Description, CheckCircle, Cancel, Calculate, Send, WhatsApp } from '@mui/icons-material';
import axios from 'axios';
import { toast } from '../../../../Common/Toast/Toast';

function AnalyzeProposalModal({ isOpen, onClose, proposal, onSuccess, onMessageSent }) {
    const [loading, setLoading] = useState(false);
    const [decision, setDecision] = useState(null);
    const [observations, setObservations] = useState([]);
    const [newObservation, setNewObservation] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);
    const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);

    if (!isOpen || !proposal) return null;

    // Atualizar observações quando a proposta mudar
    useEffect(() => {
        if (proposal?.observations) {

            console.log("proposal.observations", proposal.observations)

            // Remover duplicatas comparando todo o objeto
            const uniqueObservations = proposal.observations.filter((obs, index, self) =>
                index === self.findIndex((o) => 
                    o.createdAt === obs.createdAt && 
                    o.observation === obs.observation && 
                    o.colaboratorId === obs.colaboratorId
                )
            );
            
            // Ordenar por data de criação
            const sortedObservations = uniqueObservations.sort((a, b) => 
                new Date(a.createdAt) - new Date(b.createdAt)
            );

            setObservations(sortedObservations);
        }
    }, [proposal]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatRelativeTime = (date) => {
        const now = new Date();
        const diff = now - new Date(date);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 1) return 'agora mesmo';
        if (minutes < 60) return `há ${minutes} minutos`;
        if (hours < 24) return `há ${hours} horas`;
        if (days === 1) return 'há 1 dia';
        if (days < 7) return `há ${days} dias`;
        
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleAnalyze = async (approved) => {
        setLoading(true);
        try {
            const colaboratorData = JSON.parse(localStorage.getItem('colaboratorData'));
            
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/proposal/update?proposalId=${proposal.id}`,
                {
                    isTrueContract: approved,
                    managerObservations: observations,
                    analyzedAt: new Date()
                },
                {
                    headers: {
                        'Authorization': `Bearer ${colaboratorData.token}`
                    }
                }
            );

            toast.success(`Proposta ${approved ? 'aprovada' : 'reprovada'} com sucesso!`);
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Erro ao analisar proposta:', error);
            toast.error('Erro ao analisar proposta');
        } finally {
            setLoading(false);
        }
    };

    const handleAddObservation = async () => {
        if (!newObservation.trim() || sendingMessage) return;

        setSendingMessage(true);
        try {
            const colaboratorData = JSON.parse(localStorage.getItem('colaboratorData'));
            
            // Enviar apenas a nova observação
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/proposal/update?proposalId=${proposal.id}`,
                {
                    observations: [{
                        observation: newObservation.trim(),
                        colaboratorId: colaboratorData.user.id
                    }]
                },
                {
                    headers: {
                        'Authorization': `Bearer ${colaboratorData.token}`
                    }
                }
            );

            // Atualizar estado local
            const newObservationData = {
                colaborator: colaboratorData.user,
                colaboratorId: colaboratorData.user.id,
                observation: newObservation.trim(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            setObservations(prev => [...prev, newObservationData]);
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

    // Função para formatar o número de telefone para o WhatsApp
    const formatWhatsappNumber = (phone) => {
        // Remove todos os caracteres não numéricos
        const numbers = phone.replace(/\D/g, '');
        // Adiciona o código do país se não existir
        return numbers.startsWith('55') ? numbers : `55${numbers}`;
    };

    // Função para abrir o WhatsApp Web
    const openWhatsapp = () => {
        const formattedNumber = formatWhatsappNumber(proposal.client?.phone);
        window.open(`https://web.whatsapp.com/send?phone=${formattedNumber}`, '_blank');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 p-[30px]"
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-[#1f1f1f] rounded-xl w-full h-full flex flex-col"
            >
                {/* Header */}
                <div className="p-8 border-b border-white/10 sticky top-0 bg-[#1f1f1f] z-10">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Análise de Proposta</h2>
                                <p className="text-gray-400">ID: {proposal.id}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm ${
                                proposal.isTrueContract
                                    ? 'bg-green-500/20 text-green-500'
                                    : 'bg-yellow-500/20 text-yellow-500'
                            }`}>
                                {proposal.isTrueContract ? 'Contrato' : 'Em análise'}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleAnalyze(false)}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 
                                    hover:bg-red-500/30 text-red-500 rounded-lg transition-colors"
                            >
                                <Cancel />
                                Reprovar
                            </button>
                            <button
                                onClick={() => handleAnalyze(true)}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-green-500/20 
                                    hover:bg-green-500/30 text-green-500 rounded-lg transition-colors"
                            >
                                <CheckCircle />
                                Aprovar
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                            >
                                <Close />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Conteúdo Principal com Scroll */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
                    {/* Seção 1: Informações do Cliente e Responsável */}
                    <div className="grid grid-cols-2 gap-8">
                        {/* Cliente */}
                        <div className="bg-white/5 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-[#e67f00] mb-4 flex items-center gap-2">
                                <Person /> Dados do Cliente
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 mb-4">
                                    {proposal.client?.url_profile_cover ? (
                                        <img
                                            src={proposal.client.url_profile_cover}
                                            alt={proposal.client.name}
                                            className="w-20 h-20 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center">
                                            <Person className="text-gray-400 text-4xl" />
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="text-white font-medium text-lg">{proposal.client?.name}</h4>
                                        <p className="text-gray-400">CPF: {proposal.client?.cpf}</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-gray-400">Tel: {proposal.client?.phone}</p>
                                            {proposal.client?.phone && (
                                                <button
                                                    onClick={openWhatsapp}
                                                    className="p-2 bg-green-500 hover:bg-green-600 rounded-lg 
                                                        transition-colors text-white flex items-center gap-2 text-sm"
                                                    title="Abrir WhatsApp Web"
                                                >
                                                    <WhatsApp className="text-lg" />
                                                    Conversar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-400 block">Email:</span>
                                        <span className="text-white">{proposal.client?.email}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block">Benefício:</span>
                                        <span className="text-white">{proposal.client?.matriculaBeneficio || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Responsável */}
                        <div className="bg-white/5 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-[#e67f00] mb-4">
                                Responsável pela Proposta
                            </h3>
                            <div className="flex items-center gap-4">
                                {proposal.Colaborator?.url_profile_cover ? (
                                    <img
                                        src={proposal.Colaborator.url_profile_cover}
                                        alt={proposal.Colaborator.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center">
                                        <Person className="text-gray-400 text-3xl" />
                                    </div>
                                )}
                                <div>
                                    <h4 className="text-white font-medium">{proposal.Colaborator?.name}</h4>
                                    <p className="text-gray-400">{proposal.Colaborator?.function}</p>
                                    <p className="text-gray-400">{proposal.Colaborator?.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Seção 2: Detalhes do Contrato */}
                    <div className="bg-white/5 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-[#e67f00] mb-4 flex items-center gap-2">
                            <Description /> Detalhes do Contrato
                        </h3>
                        <div className="grid grid-cols-3 gap-6">
                            <div>
                                <span className="text-gray-400 block text-sm">Banco</span>
                                <span className="text-white">{proposal.bank?.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-400 block text-sm">Tipo</span>
                                <span className="text-white">{proposal.proposalType}</span>
                            </div>
                            <div>
                                <span className="text-gray-400 block text-sm">Valor do Contrato</span>
                                <span className="text-green-400 font-medium">
                                    {formatCurrency(proposal.contractValue)}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-400 block text-sm">Parcelas</span>
                                <span className="text-white">{proposal.contractInstallments}x de {' '}
                                    <span className="text-green-400">
                                        {formatCurrency(proposal.contractValue / proposal.contractInstallments)}
                                    </span>
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-400 block text-sm">Taxa de Juros</span>
                                <span className="text-white">{proposal.contractInterestRate}% a.m.</span>
                            </div>
                            <div>
                                <span className="text-gray-400 block text-sm">Data da Proposta</span>
                                <span className="text-white">{formatDate(proposal.proposalDate)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Seção 3: Conteúdo da Proposta */}
                    <div className="bg-white/5 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-[#e67f00] mb-4 flex items-center gap-2">
                            <Description /> Conteúdo da Proposta
                        </h3>
                        <p className="text-white whitespace-pre-wrap bg-white/5 p-4 rounded-lg">
                            {proposal.proposalContent || 'Sem conteúdo adicional'}
                        </p>
                    </div>

                    {/* Seção 4: Simulações */}
                    <div className="bg-white/5 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-[#e67f00] mb-4 flex items-center gap-2">
                            <Calculate /> Simulações ({proposal.currentSimulations?.length || 0})
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {proposal.currentSimulations?.map((sim, index) => (
                                <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/5">
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <span className="text-gray-400 block">Parcela</span>
                                            <span className="text-white">
                                                {formatCurrency(parseFloat(sim.parcela))}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 block">Saldo Devedor</span>
                                            <span className="text-green-400">
                                                {formatCurrency(parseFloat(sim.saldoDevedor))}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 block">Taxa</span>
                                            <span className="text-white">{sim.taxa}% a.m.</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 block">Prazo</span>
                                            <span className="text-white">{sim.prazoRestante} meses</span>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-xs text-gray-500">
                                        {new Date(sim.date).toLocaleString('pt-BR')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Seção 5: Observações/Conversação */}
                    <div className="bg-white/5 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-[#e67f00] mb-4">Observações</h3>
                        
                        {/* Lista de Observações */}
                        <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                            {proposal.observations?.map((obs, index) => (
                                <div key={index} className="bg-white/5 p-4 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        {/* Avatar do usuário */}
                                        {obs.isAdmSender ? (
                                            obs.Admin?.url_profile_cover ? (
                                                <img
                                                    src={obs.Admin.url_profile_cover}
                                                    alt={obs.Admin.name}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-[#e67f00]/20 flex items-center justify-center">
                                                    <Person className="text-[#e67f00] text-sm" />
                                                </div>
                                            )
                                        ) : (
                                            obs.colaborator?.url_profile_cover ? (
                                                <img
                                                    src={obs.colaborator.url_profile_cover}
                                                    alt={obs.colaborator.name}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                                                    <Person className="text-gray-400 text-sm" />
                                                </div>
                                            )
                                        )}

                                        {/* Conteúdo da mensagem */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="text-white text-sm font-medium">
                                                        {obs.isAdmSender ? obs.Admin?.name : obs.colaborator?.name}
                                                    </span>
                                                    <span className="text-gray-400 text-xs ml-2">
                                                        {obs.isAdmSender ? 'Administrador' : obs.colaborator?.function}
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
                                className="p-2 bg-[#e67f00] hover:bg-[#ff8c00] rounded-lg 
                                    transition-colors text-white disabled:opacity-50 
                                    disabled:cursor-not-allowed min-w-[40px] h-[40px] flex items-center justify-center"
                            >
                                {sendingMessage ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Send className="text-xl" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default AnalyzeProposalModal; 