import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Close, Person, Send } from '@mui/icons-material';
import axios from 'axios';
import { toast } from '../../../Common/Toast/Toast';
import io from 'socket.io-client';

function ProposalChatAdm({ isOpen, onClose, proposal, onMessageSent }) {
    const [observations, setObservations] = useState([]);
    const [newObservation, setNewObservation] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);
    const [socket, setSocket] = useState(null);
    // Usar useRef para guardar o ID da proposta e evitar problemas de closure
    const proposalIdRef = useRef(null);

    // Inicializar o socket e entrar na sala
    useEffect(() => {
        if (isOpen && proposal?.id) {
            proposalIdRef.current = proposal.id;
            
            const newSocket = io(import.meta.env.VITE_API_URL);
            setSocket(newSocket);
            
            // Entrar na sala da proposta
            newSocket.emit('join-proposal', proposal.id);
            
            // Nome da sala para ouvir as mensagens
            const roomName = `angelcor-conversation-${proposal.id}`;
            
            // Ouvir por novas mensagens
            newSocket.on(roomName, (data) => {
                console.log("Recebendo mensagem no chat de admin:", data);
                if (data && data.observations && Array.isArray(data.observations)) {
                    const sortedObservations = [...data.observations].sort(
                        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                    );
                    setObservations(sortedObservations);
                }
            });
            
            // Também ouvimos o evento 'new-observation' caso o servidor esteja usando este método
            newSocket.on('new-observation', (data) => {
                console.log("Recebendo via new-observation no chat de admin:", data);
                if (data && data.observations && Array.isArray(data.observations)) {
                    const sortedObservations = [...data.observations].sort(
                        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                    );
                    setObservations(sortedObservations);
                } else if (data && Array.isArray(data)) {
                    const sortedObservations = [...data].sort(
                        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                    );
                    setObservations(sortedObservations);
                }
            });
            
            return () => {
                // Parar de ouvir eventos ao desmontar
                newSocket.off(roomName);
                newSocket.off('new-observation');
                newSocket.disconnect();
            };
        }
    }, [isOpen, proposal?.id]);

    useEffect(() => {
        if (proposal?.observations) {
            // Ordenar mensagens por data
            const sortedObservations = [...proposal.observations].sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );
            setObservations(sortedObservations);
            
            // Atualizar a referência do ID da proposta sempre que a proposta mudar
            if (proposal.id) {
                proposalIdRef.current = proposal.id;
            }
        }
    }, [proposal]);

    const handleAddObservation = async () => {
        if (!newObservation.trim() || sendingMessage) return;

        // Usar o ID da proposta da referência, para evitar problemas de closure
        const currentProposalId = proposalIdRef.current;
        
        if (!currentProposalId) {
            console.error('ID da proposta não disponível');
            toast.error('Erro ao enviar mensagem: ID da proposta não disponível');
            return;
        }

        setSendingMessage(true);
        try {
            const adminData = JSON.parse(localStorage.getItem('adminToken'));
            
            console.log('Enviando mensagem:', {
                observation: newObservation.trim(),
                isAdmSender: true,
                AdminId: adminData.user.id,
                proposalId: currentProposalId
            });

            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/proposal/update?proposalId=${currentProposalId}`,
                {
                    observations: [{
                        observation: newObservation.trim(),
                        isAdmSender: true,
                        AdminId: adminData.user.id
                    }]
                },
                {
                    headers: {
                        'Authorization': `Bearer ${adminData.token}`
                    }
                }
            );

            console.log('Resposta do servidor:', response.data);

            // Atualizar estado local
            const newObservationData = {
                Admin: adminData.user,
                AdminId: adminData.user.id,
                observation: newObservation.trim(),
                isAdmSender: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            setObservations(prev => [...prev, newObservationData]);
            setNewObservation('');
            
            toast.success('Mensagem enviada!');
            onMessageSent?.();
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error.response?.data || error);
            toast.error('Erro ao enviar mensagem');
        } finally {
            setSendingMessage(false);
        }
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

    if (!isOpen || !proposal) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#1f1f1f] rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
            >
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-white">Histórico de Mensagens</h3>
                        <p className="text-sm text-gray-400">
                            Proposta: {proposal.bank?.name} - {proposal.proposalType}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                    >
                        <Close />
                    </button>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {observations.map((obs, index) => (
                        <div key={index} className="bg-white/5 p-4 rounded-lg">
                            <div className="flex items-start gap-3">
                                {obs.isAdmSender || obs.Admin ? (
                                    obs.Admin?.url_profile_cover ? (
                                        <img
                                            src={obs.Admin.url_profile_cover}
                                            alt={obs.Admin.name}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                                            <Person className="text-gray-400 text-sm" />
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
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-white text-sm font-medium">
                                                {(obs.isAdmSender || obs.Admin) ? 
                                                    (obs.Admin?.name || 'Administrador') : 
                                                    (obs.colaborator?.name || 'Colaborador')}
                                            </span>
                                            <span className="text-gray-400 text-xs ml-2">
                                                {(obs.isAdmSender || obs.Admin) ? 'Administrador' : obs.colaborator?.function}
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

                {/* Input para Nova Mensagem */}
                <div className="p-4 border-t border-white/10">
                    <div className="flex gap-2 bg-white/5 rounded-lg p-2">
                        <input
                            type="text"
                            value={newObservation}
                            onChange={(e) => setNewObservation(e.target.value)}
                            placeholder="Digite uma mensagem..."
                            className="flex-1 bg-transparent border-none outline-none text-white text-sm"
                            disabled={sendingMessage}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddObservation()}
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
            </motion.div>
        </motion.div>
    );
}

export default ProposalChatAdm; 