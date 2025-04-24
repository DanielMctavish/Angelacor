import React, { useState, useEffect, useRef } from 'react';
import { Close, Send, Search, ArrowBack, Person } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';
import axios from 'axios';
import { toast } from '@components/Common/Toast/Toast';

function AdminChat({ isOpen, onClose, proposals = [] }) {
    const [selectedProposal, setSelectedProposal] = useState(null);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProposals, setFilteredProposals] = useState(proposals);
    const [observations, setObservations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [socket, setSocket] = useState(null);
    const [clientsData, setClientsData] = useState({}); // Para armazenar os dados completos dos clientes
    const messagesEndRef = useRef(null);
    const proposalIdRef = useRef(null);
    const messageIdsSet = useRef(new Set()); // Para rastrear IDs de mensagens já exibidas
    const userIdRef = useRef(null); // Para armazenar o ID do administrador atual

    // Função para buscar dados completos do cliente
    const fetchClientData = async (email) => {
        try {
            const adminData = JSON.parse(localStorage.getItem('adminToken'));
            if (!adminData || !adminData.token) return null;

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/client/find-by-email?email=${email}`,
                {
                    headers: {
                        Authorization: `Bearer ${adminData.token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar dados do cliente:', error);
            return null;
        }
    };

    // Carregar dados dos clientes quando as propostas mudarem
    useEffect(() => {
        const loadClientsData = async () => {
            const newClientsData = {};
            for (const proposal of proposals) {
                if (proposal.client?.email && !clientsData[proposal.client.email]) {
                    const clientData = await fetchClientData(proposal.client.email);
                    if (clientData) {
                        newClientsData[proposal.client.email] = clientData;
                    }
                }
            }
            setClientsData(prev => ({ ...prev, ...newClientsData }));
        };

        if (proposals.length > 0) {
            loadClientsData();
        }
    }, [proposals]);

    // Inicializar o socket quando o componente montar ou quando o painel for aberto
    useEffect(() => {
        if (isOpen && proposals && proposals.length > 0) {
            console.log("observando propostas -> ", proposals[0].client);
            
            // Obter dados do admin
            const adminData = JSON.parse(localStorage.getItem('adminToken') || '{}');
            if (adminData && adminData.user && adminData.user.id) {
                userIdRef.current = adminData.user.id;
            }
            
            const newSocket = io(import.meta.env.VITE_API_URL);
            setSocket(newSocket);
            
            // Configurar eventos globais do socket
            newSocket.on('connect', () => {
                console.log('Conexão WebSocket estabelecida');
            });
            
            newSocket.on('disconnect', () => {
                console.log('Desconectado do WebSocket');
            });
            
            return () => {
                newSocket.disconnect();
            };
        }
    }, [isOpen, proposals]);

    // Função para adicionar observações sem duplicação
    const addObservationsWithoutDuplicates = (newObservations) => {
        if (Array.isArray(newObservations)) {
            // Filtrar observações para adicionar apenas as que não são do admin atual
            const newUniqueObservations = newObservations.filter(obs => {
                // Se a observação não tem ID, verificar se é de um colaborador
                if (!obs.id) {
                    // Aceitar apenas se não for do administrador
                    return !obs.isAdmSender && !obs.Admin && !obs.AdminId;
                }
                
                // Verificar se já existe no Set
                if (messageIdsSet.current.has(obs.id)) {
                    return false; // Já existe, filtrar
                }
                
                // Se a observação veio do WebSocket e é do admin atual, não adicionar
                if (obs.isAdmSender || obs.AdminId || obs.Admin) {
                    // Se o ID do admin corresponde ao do usuário atual, não adicionar
                    if (obs.AdminId === userIdRef.current || (obs.Admin && obs.Admin.id === userIdRef.current)) {
                        console.log("Ignorando mensagem do admin atual via WebSocket:", obs);
                        return false;
                    }
                }
                
                // Adicionar ao Set e incluir na lista
                messageIdsSet.current.add(obs.id);
                return true;
            });

            if (newUniqueObservations.length > 0) {
                setObservations(prev => {
                    // Combinar observações anteriores com novas e ordenar
                    const combined = [...prev, ...newUniqueObservations];
                    return combined.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                });
            }
        } else if (newObservations) {
            // Caso seja uma única observação, verificar se é de um colaborador
            const obs = newObservations;
            
            // Se já existe no Set, ignorar
            if (obs.id && messageIdsSet.current.has(obs.id)) {
                return;
            }
            
            // Se for do admin atual, ignorar
            if (obs.isAdmSender || obs.AdminId || obs.Admin) {
                if (obs.AdminId === userIdRef.current || (obs.Admin && obs.Admin.id === userIdRef.current)) {
                    console.log("Ignorando mensagem única do admin atual via WebSocket:", obs);
                    return;
                }
            }
            
            // Se a observação é válida (não é do admin atual), adicionar
            if (obs.id) {
                messageIdsSet.current.add(obs.id);
            }
            
            setObservations(prev => {
                const combined = [...prev, obs];
                return combined.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            });
        }
    };

    // Entrar na sala da proposta quando uma proposta é selecionada
    useEffect(() => {
        if (selectedProposal && socket) {
            proposalIdRef.current = selectedProposal.id;
            
            // Limpar o set de IDs quando mudar de proposta
            messageIdsSet.current.clear();
            
            // Entrar na sala da proposta
            socket.emit('join-proposal', selectedProposal.id);
            
            // Nome da sala para ouvir as mensagens
            const roomName = `angelcor-conversation-${selectedProposal.id}`;
            
            // Ouvir por novas mensagens na sala específica
            socket.on(roomName, (data) => {
                console.log("Recebendo mensagem no chat lateral:", data);
                if (data && data.observations && Array.isArray(data.observations)) {
                    addObservationsWithoutDuplicates(data.observations);
                }
            });
            
            // Também ouvimos o evento 'new-observation' caso o servidor esteja usando este método
            socket.on('new-observation', (data) => {
                console.log("Recebendo via new-observation no chat lateral:", data);
                if (data && data.observations && Array.isArray(data.observations)) {
                    addObservationsWithoutDuplicates(data.observations);
                } else if (data && Array.isArray(data)) {
                    addObservationsWithoutDuplicates(data);
                } else if (data) {
                    // Se for uma única observação nova
                    addObservationsWithoutDuplicates(data);
                }
            });
            
            return () => {
                // Parar de ouvir eventos quando a proposta mudar
                socket.off(roomName);
                socket.off('new-observation');
            };
        }
    }, [selectedProposal, socket]);

    // Rolar para o final da conversa quando novas mensagens chegarem
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [observations]);
    
    // Carregar observações quando uma proposta for selecionada
    useEffect(() => {
        if (selectedProposal) {
            // Limpar o set de IDs quando mudar de proposta
            messageIdsSet.current.clear();
            
            // Se a proposta já tem observações, use-as diretamente
            if (selectedProposal.observations && selectedProposal.observations.length > 0) {
                const sortedObservations = [...selectedProposal.observations].sort(
                    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                );
                
                // Adicionar todos os IDs ao set para evitar duplicações futuras
                sortedObservations.forEach(obs => {
                    if (obs.id) messageIdsSet.current.add(obs.id);
                });
                
                setObservations(sortedObservations);
                setLoading(false);
                
                // Atualizar a referência do ID da proposta sempre que a proposta mudar
                if (selectedProposal.id) {
                    proposalIdRef.current = selectedProposal.id;
                }
            } else {
                // Caso contrário, carregue as observações do backend
                loadObservations(selectedProposal.id);
            }
        }
    }, [selectedProposal]);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredProposals(proposals);
        } else {
            const term = searchTerm.toLowerCase();
            const filtered = proposals.filter(proposal => 
                proposal.proposalType?.toLowerCase().includes(term) || 
                proposal.client?.name?.toLowerCase().includes(term) ||
                proposal.bank?.name?.toLowerCase().includes(term)
            );
            setFilteredProposals(filtered);
        }
    }, [searchTerm, proposals]);

    // Função para carregar observações de uma proposta
    const loadObservations = async (proposalId) => {
        setLoading(true);
        try {
            const adminData = JSON.parse(localStorage.getItem('adminToken'));
            if (!adminData || !adminData.token) return;
            
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/observation/list/${proposalId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${adminData.token}`
                    }
                }
            );
            
            if (response.data) {
                const sortedObservations = [...response.data].sort(
                    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                );
                
                // Adicionar todos os IDs ao set para evitar duplicações futuras
                sortedObservations.forEach(obs => {
                    if (obs.id) messageIdsSet.current.add(obs.id);
                });
                
                setObservations(sortedObservations);
            }
        } catch (error) {
            console.error('Erro ao carregar observações:', error);
            toast.error('Não foi possível carregar as observações');
        } finally {
            setLoading(false);
        }
    };

    // Função para formatar data
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    // Formatar tempo relativo
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

    // Enviar observação via websocket
    const handleSendObservation = async () => {
        if (!message.trim() || !selectedProposal || sendingMessage) return;
        
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
            if (!adminData || !adminData.token) return;
            
            // Atualizar o ID do admin caso não esteja definido
            if (!userIdRef.current && adminData.user && adminData.user.id) {
                userIdRef.current = adminData.user.id;
            }
            
            console.log('Enviando mensagem:', {
                observations: [{
                    observation: message.trim(),
                    isAdmSender: true,
                    AdminId: adminData.user.id
                }]
            });
            
            // Criar um ID temporário local para a mensagem
            const tempId = 'temp-' + Date.now();
            
            // Atualizar estado local imediatamente com ID temporário para feedback do usuário
            const tempObservation = {
                id: tempId, // ID temporário para rastreamento
                Admin: adminData.user,
                AdminId: adminData.user.id,
                observation: message.trim(),
                isAdmSender: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            // Adicionar ao Set de IDs para evitar duplicação quando o WebSocket enviar de volta
            messageIdsSet.current.add(tempId);
            
            // Adicionar à lista de observações
            setObservations(prev => [...prev, tempObservation]);
            
            // Enviar via API usando o mesmo padrão do ProposalChatAdm
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/proposal/update?proposalId=${currentProposalId}`,
                {
                    observations: [{
                        observation: message.trim(),
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
            
            // Se a API retornar o ID real da mensagem, atualize no Set
            if (response.data && response.data.observation && response.data.observation.id) {
                messageIdsSet.current.add(response.data.observation.id);
                
                // Remover o tempId do Set pois já temos o ID real
                messageIdsSet.current.delete(tempId);
            }
            
            setMessage('');
            
            toast.success('Mensagem enviada!');
        } catch (error) {
            console.error('Erro ao enviar observação:', error.response?.data || error);
            toast.error('Erro ao enviar mensagem');
        } finally {
            setSendingMessage(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendObservation();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: -350, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -350, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="fixed left-0 top-0 h-screen w-[320px] bg-[#0f1117] border-r border-white/10 z-50 flex flex-col shadow-xl"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#133785] to-[#1a4ba8] p-4 flex justify-between items-center border-b border-white/5">
                        <h2 className="text-white font-semibold">Observações & Chat</h2>
                        <button 
                            onClick={onClose}
                            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <Close />
                        </button>
                    </div>

                    {selectedProposal ? (
                        <>
                            {/* Chat Header */}
                            <div className="bg-[#1c1f2e] p-3 flex items-center gap-2 border-b border-white/5">
                                <button 
                                    onClick={() => setSelectedProposal(null)}
                                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <ArrowBack className="text-white/80" />
                                </button>
                                <div>
                                    <h3 className="text-white font-medium">{selectedProposal.proposalType}</h3>
                                    <p className="text-xs text-gray-400">
                                        {selectedProposal.client?.name} • {formatDate(selectedProposal.proposalDate)}
                                    </p>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gradient-to-b from-[#131620] to-[#15192a]">
                                {loading ? (
                                    <div className="flex justify-center items-center h-full">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#e67f00]"></div>
                                    </div>
                                ) : observations.length === 0 ? (
                                    <div className="text-center text-gray-400 py-10">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                                            <Send className="text-white/20 text-xl transform rotate-45" />
                                        </div>
                                        Nenhuma observação encontrada. 
                                        <br />Inicie uma conversa!
                                    </div>
                                ) : (
                                    observations.map((obs, index) => (
                                        <div 
                                            key={obs.id || index}
                                            className={`flex ${obs.isAdmSender ? 'justify-end' : 'justify-start'} mb-1.5 items-end gap-2`}
                                        >
                                            {/* Avatar para mensagens de colaboradores */}
                                            {!obs.isAdmSender && (
                                                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-white/5">
                                                    {obs.colaborator?.url_profile_cover ? (
                                                        <img 
                                                            src={obs.colaborator.url_profile_cover} 
                                                            alt={obs.colaborator?.name || 'Colaborador'}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Person className="text-gray-400 text-sm" />
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div 
                                                className={`max-w-[75%] rounded-lg px-3 py-2 text-sm shadow-sm
                                                    ${obs.isAdmSender 
                                                        ? 'bg-gradient-to-r from-[#1849ad] to-[#133785] text-white rounded-tr-none' 
                                                        : 'bg-white/5 backdrop-blur-sm text-white/95 rounded-tl-none'
                                                    }`}
                                            >
                                                <p className="text-xs font-medium mb-1">
                                                    {obs.isAdmSender 
                                                        ? (obs.Admin?.name || 'Administrador') 
                                                        : (obs.colaborator?.name || 'Colaborador')}
                                                </p>
                                                <p>{obs.observation}</p>
                                                <p className="text-xs opacity-60 mt-1 text-right">
                                                    {formatRelativeTime(obs.createdAt)}
                                                </p>
                                            </div>

                                            {/* Avatar para mensagens de admin */}
                                            {obs.isAdmSender && (
                                                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-white/5">
                                                    {obs.Admin?.url_profile_cover ? (
                                                        <img 
                                                            src={obs.Admin.url_profile_cover} 
                                                            alt={obs.Admin?.name || 'Administrador'}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Person className="text-gray-400 text-sm" />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <div className="p-3 border-t border-white/5 bg-[#1c1f2e]">
                                <div className="flex items-center gap-2">
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Digite sua observação..."
                                        className="bg-[#131620] border border-white/5 rounded-lg px-3 py-2 resize-none w-full text-white text-sm outline-none focus:border-[#e67f00]/50 focus:ring-1 focus:ring-[#e67f00]/20 transition-all"
                                        rows="2"
                                        disabled={sendingMessage}
                                    />
                                    <button 
                                        onClick={handleSendObservation}
                                        className="bg-gradient-to-r from-[#e67f00] to-[#ff8c00] hover:from-[#ff8c00] hover:to-[#e67f00] text-white p-2 rounded-full transition-all shadow-md"
                                        disabled={!message.trim() || sendingMessage}
                                    >
                                        {sendingMessage ? (
                                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <Send />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Search */}
                            <div className="p-3 border-b border-white/5">
                                <div className="flex items-center gap-2 bg-[#1c1f2e] rounded-lg px-3 py-2">
                                    <Search className="text-gray-400 text-sm" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Buscar proposta..."
                                        className="bg-transparent outline-none text-sm w-full text-white"
                                    />
                                </div>
                            </div>

                            {/* Proposal List */}
                            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#131620] to-[#15192a]">
                                {!filteredProposals || filteredProposals.length === 0 ? (
                                    <div className="p-8 text-center text-gray-400">
                                        <Search className="text-gray-500 mx-auto mb-2 text-3xl" />
                                        Nenhuma proposta encontrada
                                    </div>
                                ) : (
                                    filteredProposals.map((proposal) => {
                                        const obsCount = proposal.observations?.length || 0;
                                        const clientFullData = proposal.client?.email ? clientsData[proposal.client.email] : null;
                                        
                                        return (
                                            <div
                                                key={proposal.id || proposal._id}
                                                onClick={() => setSelectedProposal(proposal)}
                                                className="p-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                                            >
                                                <div className="flex gap-3">
                                                    {/* Avatar do Cliente */}
                                                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-white/5">
                                                        {clientFullData?.url_profile_cover ? (
                                                            <img 
                                                                src={clientFullData.url_profile_cover} 
                                                                alt={clientFullData.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <Person className="text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h3 className="text-white font-medium">{proposal.proposalType}</h3>
                                                                <p className="text-xs text-gray-400">{proposal.client?.name}</p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {obsCount > 0 && (
                                                                    <div className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#e67f00] to-[#ff8c00] text-white text-xs shadow-sm">
                                                                        {obsCount}
                                                                    </div>
                                                                )}
                                                                <div className={`px-2 py-0.5 rounded-full text-xs shadow-sm ${proposal.isTrueContract ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                                    {proposal.isTrueContract ? 'Contrato' : 'Análise'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-between items-center mt-1.5">
                                                            <span className="text-xs text-gray-500">{proposal.bank?.name || "Banco não especificado"}</span>
                                                            <span className="text-xs text-gray-500">{formatDate(proposal.proposalDate)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default AdminChat;