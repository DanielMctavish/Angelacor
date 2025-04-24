import { Add, Search, Chat, Groups, AccountBalance, ExpandLess, ExpandMore, Assignment, Analytics, TableChart, Calculate } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import AdminNavbar from './Navigation/AdminNavbar';
import CreateClientModal from './Clients/CreateClientModal';
import ClientDetailsModal from './Clients/ClientDetailsModal';
import CreateBankModal from './Banks/CreateBankModal';
import { Person as PersonIcon } from '@mui/icons-material';
import { toast } from '@components/Common/Toast/Toast';
import DeleteClientModal from './Clients/DeleteClientModal';
import ClientsListAdmin from './Clients/ClientsListAdmin';

import logoAngelCor from "../../../medias/logos/angelcor_logo.png"
import CreateProposalModal from './Proposals/CreateProposalModal';
import ListProposalsModal from './Proposals/ListProposalsModal';
import AdminChat from './AdminChat/AdminChat';
import SimulatorModal from './Simulator/SimulatorModal';

function AdminDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isCreateBankModalOpen, setIsCreateBankModalOpen] = useState(false);
    const [isCreateProposalModalOpen, setIsCreateProposalModalOpen] = useState(false);
    const [banks, setBanks] = useState([]);
    const [isListProposalsModalOpen, setIsListProposalsModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, client: null });
    const [isClientListExpanded, setIsClientListExpanded] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [allProposals, setAllProposals] = useState([]);
    const [isProposalsListExpanded, setIsProposalsListExpanded] = useState(true);
    const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const adminDataString = localStorage.getItem('adminToken');
            if (!adminDataString) {
                navigate('/admin-login');
                return;
            }

            const adminData = JSON.parse(adminDataString);
            if (!adminData || !adminData.token) {
                navigate('/admin-login');
                return;
            }

            const [clientsResponse, banksResponse] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/client/find-all`, {
                    headers: { 'Authorization': `Bearer ${adminData.token}` }
                }),
                axios.get(`${import.meta.env.VITE_API_URL}/bank/list`, {
                    headers: { 'Authorization': `Bearer ${adminData.token}` }
                })
            ]);

            // Ordenar clientes pelo mais recente
            const sortedClients = (clientsResponse.data || []).sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );

            setUser(adminData.user);
            setClients(sortedClients);
            setBanks(banksResponse.data || []);

            // Extrair todas as propostas de todos os clientes
            const proposals = sortedClients.reduce((acc, client) => {
                if (client.proposals && client.proposals.length > 0) {
                    // Adiciona informações do cliente em cada proposta
                    const clientProposals = client.proposals.map(proposal => ({
                        ...proposal,
                        client: {
                            id: client.id,
                            name: client.name,
                            email: client.email
                        }
                    }));
                    return [...acc, ...clientProposals];
                }
                return acc;
            }, []);

            // Ordenar propostas pela data mais recente
            const sortedProposals = proposals.sort((a, b) =>
                new Date(b.proposalDate) - new Date(a.proposalDate)
            );

            setAllProposals(sortedProposals);
            setLoading(false);

        } catch (error) {
            console.error('Erro na autenticação ou busca de dados:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem('adminToken');
                navigate('/admin-login');
            }
            setLoading(false);
        }
    };

    const fetchBanks = async () => {
        try {
            const adminDataString = localStorage.getItem('adminToken');
            if (!adminDataString) return;

            const adminData = JSON.parse(adminDataString);
            if (!adminData || !adminData.token) return;

            const response = await axios.get(`${import.meta.env.VITE_API_URL}/bank/list`, {
                headers: {
                    'Authorization': `Bearer ${adminData.token}`
                }
            });

            if (response.data) {
                setBanks(response.data);
            }
        } catch (error) {
            console.error('Erro ao buscar bancos:', error);
        }
    };

    const handleCreateSuccess = () => {
        checkAuth(); // Recarrega a lista de clientes
    };

    const handleOpenDetails = (client) => {
        setSelectedClient(client);
        setIsDetailsModalOpen(true);
    };

    const handleCreateBankSuccess = () => {
        fetchBanks();
    };

    const handleCreateProposalSuccess = () => {
        checkAuth(); // Recarrega a lista de clientes
        setIsCreateProposalModalOpen(false);
    };

    const handleEdit = (client) => {
        console.log('Editar cliente:', client);
    };

    const handleBlock = (client) => {
        console.log('Bloquear cliente:', client);
    };

    const handleDelete = (client) => {
        setDeleteModal({ isOpen: true, client });
    };

    const handleConfirmDelete = async () => {
        const client = deleteModal.client;
        try {
            const adminData = JSON.parse(localStorage.getItem('adminToken'));

            const response = await axios.delete(
                `${import.meta.env.VITE_API_URL}/client/delete?clientId=${client.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${adminData.token}`
                    }
                }
            );

            if (response.status === 200) {
                toast.success('Cliente excluído com sucesso!');
                setClients(clients.filter(c => c.id !== client.id));
                setDeleteModal({ isOpen: false, client: null });
            }
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
            toast.error(error.response?.data?.message || 'Erro ao excluir cliente');
        }
    };

    // Função para logout
    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin-login');
    };

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    if (loading) {
        return (
            <div className="w-full h-screen bg-gradient-to-b from-[#133785] to-[#0a1c42] 
                flex items-center justify-center text-white">
                Carregando...
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-[#133785] to-[#0a1c42] text-white">
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <AdminNavbar logo={logoAngelCor} area="Dashboard Administrativo" />
            </motion.div>

            <main className="w-full max-w-[1200px] mx-auto p-4 space-y-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col gap-4"
                >


                    {/* ---------------- menu de botões de ações ---------------- */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsCreateModalOpen(true)}
                            className="group relative flex flex-col items-center justify-center gap-2 
                            bg-white/5 hover:bg-[#e67f00]/20 border border-white/5 hover:border-[#e67f00]/30
                            px-4 py-4 rounded-xl transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl opacity-0 
                                group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="p-2 bg-[#e67f00]/20 rounded-lg group-hover:bg-[#e67f00]/30 
                                transition-colors duration-300">
                                <Add className="text-[#e67f00]" />
                            </div>
                            <span className="text-sm font-medium text-white/90 group-hover:text-white 
                                transition-colors duration-300">Novo Cliente</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsCreateBankModalOpen(true)}
                            className="group relative flex flex-col items-center justify-center gap-2 
                            bg-white/5 hover:bg-blue-500/20 border border-white/5 hover:border-blue-500/30
                            px-4 py-4 rounded-xl transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl opacity-0 
                                group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 
                                transition-colors duration-300">
                                <Add className="text-blue-400" />
                            </div>
                            <span className="text-sm font-medium text-white/90 group-hover:text-white 
                                transition-colors duration-300">Novo Banco</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/plataforma/colaboradores')}
                            className="group relative flex flex-col items-center justify-center gap-2 
                            bg-white/5 hover:bg-purple-500/20 border border-white/5 hover:border-purple-500/30
                            px-4 py-4 rounded-xl transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl opacity-0 
                                group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 
                                transition-colors duration-300">
                                <Groups className="text-purple-400" />
                            </div>
                            <span className="text-sm font-medium text-white/90 group-hover:text-white 
                                transition-colors duration-300">Colaboradores</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={toggleChat}
                            className={`group relative flex flex-col items-center justify-center gap-2 
                            ${isChatOpen 
                                ? 'bg-green-500/20 border-green-500/30' 
                                : 'bg-white/5 hover:bg-green-500/20 border-white/5 hover:border-green-500/30'} 
                            border px-4 py-4 rounded-xl transition-all duration-300`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl opacity-0 
                                group-hover:opacity-100 transition-opacity duration-300" />
                            <div className={`p-2 ${isChatOpen ? 'bg-green-500/30' : 'bg-green-500/20'} rounded-lg 
                                group-hover:bg-green-500/30 transition-colors duration-300`}>
                                <Chat className="text-green-400" />
                            </div>
                            <span className="text-sm font-medium text-white/90 group-hover:text-white 
                                transition-colors duration-300">Observações</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/plataforma/analytics')}
                            className="group relative flex flex-col items-center justify-center gap-2 
                            bg-white/5 hover:bg-indigo-500/20 border border-white/5 hover:border-indigo-500/30
                            px-4 py-4 rounded-xl transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl opacity-0 
                                group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="p-2 bg-indigo-500/20 rounded-lg group-hover:bg-indigo-500/30 
                                transition-colors duration-300">
                                <Analytics className="text-indigo-400" />
                            </div>
                            <span className="text-sm font-medium text-white/90 group-hover:text-white 
                                transition-colors duration-300">Métricas</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="group relative flex flex-col items-center justify-center gap-2 
                            bg-white/5 hover:bg-pink-500/20 border border-white/5 hover:border-pink-500/30
                            px-4 py-4 rounded-xl transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl opacity-0 
                                group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="p-2 bg-pink-500/20 rounded-lg group-hover:bg-pink-500/30 
                                transition-colors duration-300">
                                <TableChart className="text-pink-400" />
                            </div>
                            <span className="text-sm font-medium text-white/90 group-hover:text-white 
                                transition-colors duration-300">Tabelas</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsSimulatorOpen(true)}
                            className="group relative flex flex-col items-center justify-center gap-2 
                            bg-white/5 hover:bg-amber-500/20 border border-white/5 hover:border-amber-500/30
                            px-4 py-4 rounded-xl transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl opacity-0 
                                group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="p-2 bg-amber-500/20 rounded-lg group-hover:bg-amber-500/30 
                                transition-colors duration-300">
                                <Calculate className="text-amber-400" />
                            </div>
                            <span className="text-sm font-medium text-white/90 group-hover:text-white 
                                transition-colors duration-300">Simulador</span>
                        </motion.button>
                    </div>
                    {/* --------------------------------- fim do menu de botões de ações ---------------- */}

                    <div className="w-full flex items-center gap-2 bg-white/5 
                        border border-white/10 rounded-lg px-3 py-3 md:py-2">
                        <Search className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            className="bg-transparent outline-none text-sm w-full text-white"
                        />
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { title: "Total de Clientes", count: clients.length, color: "text-[#e67f00]" },
                        { title: "Clientes Com Propostas", count: clients.filter(client => client.proposals?.length > 0).length, color: "text-green-500" },
                        { title: "Clientes Sem Propostas", count: clients.filter(client => !client.proposals?.length).length, color: "text-red-500" },
                        { title: "Total de Propostas", count: clients.reduce((acc, client) => acc + (client.proposals?.length || 0), 0), color: "text-blue-500" }
                    ].map((card, index) => (
                        <motion.div
                            key={card.title}
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 + (index * 0.2) }}
                            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10"
                        >
                            <h3 className="text-sm md:text-lg font-semibold mb-2">{card.title}</h3>
                            <p className={`text-2xl md:text-3xl font-bold ${card.color}`}>
                                {card.count}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Seção de Propostas a serem aprovadas */}
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.1, type: "spring", stiffness: 100 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
                >
                    <div className="p-4 border-b border-white/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsProposalsListExpanded(!isProposalsListExpanded)}
                                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    {isProposalsListExpanded ? (
                                        <ExpandLess className="text-white" />
                                    ) : (
                                        <ExpandMore className="text-white" />
                                    )}
                                </button>
                                <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                                    <Assignment className="text-[#e67f00]" />
                                    Propostas a serem aprovadas
                                </h2>
                            </div>
                            <div className="text-sm text-gray-400">
                                {allProposals.filter(p => !p.isApproved).length} pendentes
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={false}
                        animate={{
                            height: isProposalsListExpanded ? 'auto' : 0,
                            opacity: isProposalsListExpanded ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="divide-y divide-white/5">
                            {allProposals.filter(p => !p.isApproved).length === 0 ? (
                                <div className="text-center text-gray-400 py-8">
                                    <Assignment className="mx-auto mb-2 text-3xl text-gray-500" />
                                    Nenhuma proposta pendente de aprovação
                                </div>
                            ) : (
                                allProposals
                                    .filter(p => !p.isApproved)
                                    .map((proposal) => (
                                        <div
                                            key={proposal.id}
                                            className="p-4 hover:bg-white/5 transition-all cursor-pointer"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-medium text-white">{proposal.proposalType}</h3>
                                                        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                                                            Aguardando Aprovação
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-400 mt-1">{proposal.client?.name}</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="text-xs text-gray-500">
                                                            {proposal.bank?.name || "Banco não especificado"}
                                                        </span>
                                                        <span className="text-xs text-gray-500">•</span>
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(proposal.proposalDate).toLocaleDateString('pt-BR')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => {/* Função para visualizar proposta */ }}
                                                    className="px-3 py-1 bg-[#e67f00] hover:bg-[#ff8c00] rounded-lg text-sm transition-colors"
                                                >
                                                    Visualizar
                                                </button>
                                            </div>
                                        </div>
                                    ))
                            )}
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.2, type: "spring", stiffness: 100 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
                >
                    <div className="p-4 border-b border-white/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsClientListExpanded(!isClientListExpanded)}
                                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    {isClientListExpanded ? (
                                        <ExpandLess className="text-white" />
                                    ) : (
                                        <ExpandMore className="text-white" />
                                    )}
                                </button>
                                <h2 className="text-lg md:text-xl font-semibold">Lista de Clientes</h2>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={false}
                        animate={{
                            height: isClientListExpanded ? 'auto' : 0,
                            opacity: isClientListExpanded ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <ClientsListAdmin
                            clients={clients}
                            onOpenDetails={handleOpenDetails}
                            onEdit={handleEdit}
                            onBlock={handleBlock}
                            onDelete={handleDelete}
                        />
                    </motion.div>
                </motion.div>
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.4, type: "spring", stiffness: 100 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
                >
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                        <div className="p-4 border-b border-white/10">
                            <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                                <AccountBalance />
                                Bancos Cadastrados
                            </h2>
                        </div>

                        <div className="p-4">
                            {banks.length === 0 ? (
                                <div className="text-center text-gray-400 py-8">
                                    Nenhum banco cadastrado
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                                    {banks.map((bank) => (
                                        <div
                                            key={bank.id}
                                            className="bg-[#272727] p-4 rounded-lg flex flex-col items-center gap-2 
                                            hover:bg-[#133785] transition-all cursor-pointer"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                                <AccountBalance className="text-[#e67f00]" />
                                            </div>
                                            <div className="text-center">
                                                <h3 className="font-medium text-sm md:text-base">{bank.name}</h3>
                                                <span className="text-xs md:text-sm text-gray-400">Código: {bank.bankCode}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Chat Modal */}
            <AdminChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} proposals={allProposals} />

            <AnimatePresence>
                {isCreateModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <CreateClientModal
                            isOpen={isCreateModalOpen}
                            onClose={() => setIsCreateModalOpen(false)}
                            onSuccess={handleCreateSuccess}
                        />
                    </motion.div>
                )}
                <ClientDetailsModal
                    isOpen={isDetailsModalOpen}
                    onClose={() => setIsDetailsModalOpen(false)}
                    client={selectedClient}
                />
                <CreateBankModal
                    isOpen={isCreateBankModalOpen}
                    onClose={() => setIsCreateBankModalOpen(false)}
                    onSuccess={handleCreateBankSuccess}
                />
                <CreateProposalModal
                    isOpen={isCreateProposalModalOpen}
                    onClose={() => setIsCreateProposalModalOpen(false)}
                    selectedClient={selectedClient}
                    onSuccess={handleCreateProposalSuccess}
                />
                <ListProposalsModal
                    isOpen={isListProposalsModalOpen}
                    onClose={() => setIsListProposalsModalOpen(false)}
                    client={selectedClient}
                />
                <DeleteClientModal
                    isOpen={deleteModal.isOpen}
                    onClose={() => setDeleteModal({ isOpen: false, client: null })}
                    onConfirm={handleConfirmDelete}
                    clientName={deleteModal.client?.name}
                />
                {isSimulatorOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <SimulatorModal
                            isOpen={isSimulatorOpen}
                            onClose={() => setIsSimulatorOpen(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default AdminDashboard;