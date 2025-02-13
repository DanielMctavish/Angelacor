import { Add, Search, Visibility, Delete, Assignment, Groups } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import AdminNavbar from './Navigation/AdminNavbar';
import CreateClientModal from './Clients/CreateClientModal';
import ClientDetailsModal from './Clients/ClientDetailsModal';
import CreateBankModal from './Banks/CreateBankModal';
import { AccountBalance } from '@mui/icons-material';
import { Person } from '@mui/icons-material';

import logoAngelCor from "../../../medias/logos/angelcor_logo.png"
import CreateProposalModal from './Proposals/CreateProposalModal';
import ListProposalsModal from './Proposals/ListProposalsModal';

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

            setUser(adminData.user);
            setClients(clientsResponse.data || []);
            setBanks(banksResponse.data || []);
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

    // Função para logout
    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin-login');
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
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="w-full md:w-auto flex items-center justify-center gap-2 
                            bg-[#1f1f1f] hover:bg-[#e67f00] px-4 py-3 md:py-2 
                            rounded-lg transition-all text-base"
                        >
                            <Add />
                            Criar Novo Cliente
                        </button>
                        <button 
                            onClick={() => setIsCreateBankModalOpen(true)}
                            className="w-full md:w-auto flex items-center justify-center gap-2 
                            bg-[#1f1f1f] hover:bg-[#e67f00] px-4 py-3 md:py-2 
                            rounded-lg transition-all text-base"
                        >
                            <Add />
                            Criar Novo Banco
                        </button>
                        <button 
                            onClick={() => navigate('/plataforma/colaboradores')}
                            className="w-full md:w-auto flex items-center justify-center gap-2 
                            bg-[#343434] hover:bg-[#e67f00] px-4 py-3 md:py-2 
                            rounded-lg transition-all text-base"
                        >
                            <Groups />
                            Area de Colaboradores
                        </button>
                    </div>

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

                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.2, type: "spring", stiffness: 100 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
                >
                    <div className="p-4 border-b border-white/10">
                        <h2 className="text-lg md:text-xl font-semibold">Lista de Clientes</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="py-3 px-4">Nome</th>
                                    <th className="py-3 px-4">Responsável</th>
                                    <th className="py-3 px-4">Email</th>
                                    <th className="py-3 px-4">Telefone</th>
                                    <th className="py-3 px-4">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clients.map((client) => (
                                    <tr key={client.id} className="border-b border-white/10">
                                        <td className="py-3 px-4 flex items-center gap-3">
                                            {client.url_profile_cover ? (
                                                <img src={client.url_profile_cover} alt={client.name} className="w-10 h-10 rounded-full object-cover" />
                                            ) : (
                                                <Person className="text-gray-400" />
                                            )}
                                            {client.name}
                                        </td>
                                        <td className="py-3 px-4">
                                            {client.colaborator ? (
                                                <div className="flex items-center gap-2">
                                                    {client.colaborator.url_profile_cover ? (
                                                        <img 
                                                            src={client.colaborator.url_profile_cover} 
                                                            alt={client.colaborator.name} 
                                                            className="w-8 h-8 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <Person className="text-gray-400" />
                                                    )}
                                                    <div>
                                                        <div className="text-sm">{client.colaborator.name}</div>
                                                        <div className="text-xs text-gray-400">{client.colaborator.function}</div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">Não atribuído</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">{client.email}</td>
                                        <td className="py-3 px-4">{client.phone}</td>
                                        <td className="py-3 px-4">
                                            <button
                                                onClick={() => handleOpenDetails(client)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Ver detalhes
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
            </AnimatePresence>
        </div>
    );
}

export default AdminDashboard;