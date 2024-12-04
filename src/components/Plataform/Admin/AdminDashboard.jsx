import { Add, Search, Visibility, Delete, Assignment } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminNavbar from './Navigation/AdminNavbar';
import CreateClientModal from './Clients/CreateClientModal';
import ClientDetailsModal from './Clients/ClientDetailsModal';
import CreateBankModal from './Banks/CreateBankModal';
import { AccountBalance } from '@mui/icons-material';

import logoAngelCor from "../../../../public/angelcor_logo.png"

function AdminDashboard() {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isCreateBankModalOpen, setIsCreateBankModalOpen] = useState(false);
    const [banks, setBanks] = useState([]);

    useEffect(() => {
        checkAuth();
        fetchBanks();
    }, []);

    const checkAuth = async () => {
        try {
            const adminDataString = localStorage.getItem('adminToken');
            if (!adminDataString) {
                navigate('/login');
                return;
            }

            const adminData = JSON.parse(adminDataString);
            if (!adminData || !adminData.token) {
                navigate('/login');
                return;
            }

            // Tenta fazer a requisição com o token
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/client/find-all`, {
                headers: {
                    'Authorization': `Bearer ${adminData.token}`
                }
            });

            // Se chegou aqui, o token é válido
            setClients(response.data || []);
            setLoading(false);

        } catch (error) {
            // Se der erro 401 ou qualquer outro erro, redireciona para o login
            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem('adminToken');
                navigate('/login');
            }
            setLoading(false);
        }
    };

    const fetchBanks = async () => {
        try {
            const adminData = JSON.parse(localStorage.getItem('adminToken'));
            
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
            <AdminNavbar logo={logoAngelCor} area="Dashboard"/>

            <main className="w-full max-w-[1200px] mx-auto p-4 space-y-6">
                {/* Actions Bar */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="w-full md:w-auto flex items-center justify-center gap-2 
                            bg-[#1f1f1f] hover:bg-[#e67f00] px-4 py-3 md:py-2 
                            rounded-lg transition-all text-base">
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
                            onClick={() => setIsCreateBankModalOpen(true)}
                            className="w-full md:w-auto flex items-center justify-center gap-2 
                            bg-[#1f1f1f] hover:bg-[#e67f00] px-4 py-3 md:py-2 
                            rounded-lg transition-all text-base"
                        >
                            <Add />
                            Criar Novo Colaborador
                        </button>
                    </div>

                    <div className="w-full flex items-center gap-2 bg-white/5 
                        border border-white/10 rounded-lg px-3 py-3 md:py-2">
                        <Search className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            className="bg-transparent outline-none text-sm w-full"
                        />
                    </div>
                </div>

                {/* Dashboard Cards - Ajustado para mobile */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10">
                        <h3 className="text-sm md:text-lg font-semibold mb-2">Total de Clientes</h3>
                        <p className="text-2xl md:text-3xl font-bold text-[#e67f00]">{clients.length}</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10">
                        <h3 className="text-sm md:text-lg font-semibold mb-2">Clientes Com Propostas</h3>
                        <p className="text-2xl md:text-3xl font-bold text-green-500">
                            {clients.filter(client => client.hasProposal).length}
                        </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10">
                        <h3 className="text-sm md:text-lg font-semibold mb-2">Clientes Sem Propostas</h3>
                        <p className="text-2xl md:text-3xl font-bold text-red-500">
                            {clients.filter(client => !client.hasProposal).length}
                        </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10">
                        <h3 className="text-sm md:text-lg font-semibold mb-2">Bancos cadastrados</h3>
                        <p className="text-2xl md:text-3xl font-bold text-[#fff]">
                            {banks.length}
                        </p>
                    </div>
                </div>

                {/* Table - Ajustado para rolagem horizontal em mobile */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                    <div className="p-4 border-b border-white/10">
                        <h2 className="text-lg md:text-xl font-semibold">Lista de Clientes</h2>
                    </div>

                    {/* Container com rolagem horizontal */}
                    <div className="overflow-x-auto">
                        <table className="w-full" style={{ minWidth: '800px' }}>
                            <thead className="text-left text-gray-400 text-sm bg-[#1f1f1f2d]">
                                <tr>
                                    <th className="p-4 font-medium">Nome</th>
                                    <th className="p-4 font-medium">Email</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clients.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-8 text-gray-400">
                                            Nenhum cliente cadastrado
                                        </td>
                                    </tr>
                                ) : (
                                    clients.map(client => (
                                        <tr key={client.id} className="border-t border-white/10">
                                            <td className="p-4">{client.name}</td>
                                            <td className="p-4">{client.email}</td>
                                            <td className="p-4">
                                                {client.hasProposal ? (
                                                    <span className="text-green-500">Com proposta</span>
                                                ) : (
                                                    <span className="text-red-500">Sem proposta</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        title="Ver detalhes"
                                                        onClick={() => handleOpenDetails(client)}
                                                        className="p-2 text-gray-400 hover:text-white hover:bg-[#133785] 
                                                            rounded-lg transition-all"
                                                    >
                                                        <Visibility fontSize="small" />
                                                    </button>

                                                    <button
                                                        title="Criar proposta"
                                                        className="p-2 text-gray-400 hover:text-white hover:bg-[#e67f00] 
                                                            rounded-lg transition-all"
                                                    >
                                                        <Assignment fontSize="small" />
                                                    </button>

                                                    <button
                                                        title="Excluir cliente"
                                                        className="p-2 text-gray-400 hover:text-white hover:bg-red-600 
                                                            rounded-lg transition-all"
                                                    >
                                                        <Delete fontSize="small" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Seção de Bancos - Ajustado para mobile */}
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
            </main>

            <CreateClientModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

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
        </div>
    );
}

export default AdminDashboard;