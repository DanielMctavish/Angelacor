import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Add, Person, Description, AccountBalance, Calculate, Chat, Delete, ExpandMore, ExpandLess, KeyboardArrowDown } from '@mui/icons-material';
import { motion } from 'framer-motion';
import ColaboratorNavbar from "./components/ColaboratorNavbar";
import ClientsSection from "./components/ClientsSection";
import CreateClientModal from "./components/CreateClientModal";
import { toast } from '../../../Common/Toast/Toast';
import CreateNewProposal from '../proposals/CreateNewProposal';
import AnalyzeProposalModal from './manager/AnalyzeProposalModal';
import ProposalDetails from './ProposalDetails';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';

function ColaboradorDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
    const [allClients, setAllClients] = useState([]);
    const [proposals, setProposals] = useState([]);
    const [loadingProposals, setLoadingProposals] = useState(false);
    const [selectedProposal, setSelectedProposal] = useState(null);
    const [selectedProposalForDetails, setSelectedProposalForDetails] = useState(null);
    const [proposalToDelete, setProposalToDelete] = useState(null);
    const [isClientsExpanded, setIsClientsExpanded] = useState(true);
    const [isProposalsExpanded, setIsProposalsExpanded] = useState(true);
    const [expandedRows, setExpandedRows] = useState(new Set());

    // Definição dos passos de progresso
    const progressSteps = (client) => [
        !!client.url_profile_cover,
        !!client.phone,
        !!client.email,
        !!client.simulation,
        client.proposes?.length > 0
    ];

    // Definição das descrições dos passos
    const stepDescriptions = [
        'Foto de Perfil',
        'WhatsApp',
        'Email',
        'Simulação',
        'Proposta'
    ];

    useEffect(() => {
        checkAuth();
        getAllColaboratorClients();
        getAllColaboratorProposals();
    }, []);

    const checkAuth = () => {
        try {
            const colaboratorData = JSON.parse(localStorage.getItem('colaboratorData'));

            if (!colaboratorData || !colaboratorData.token) {
                navigate('/login-colaborador');
                return;
            }

            setUser(colaboratorData.user);
            setLoading(false);

        } catch (error) {
            console.error('Erro na autenticação:', error);
            localStorage.removeItem('colaboratorData');
            navigate('/login-colaborador');
            toast.error('Erro ao carregar dados. Por favor, faça login novamente.');
            setLoading(false);
        }
    };

    // Função auxiliar para verificar se o usuário tem privilégios administrativos
    const hasAdminPrivileges = (userFunction) => {
        return userFunction === 'Gerente' || userFunction === 'Sub Administrador';
    };

    const getAllColaboratorClients = async () => {
        const colaboratorData = JSON.parse(localStorage.getItem('colaboratorData'));

        const url = hasAdminPrivileges(colaboratorData.user.function)
            ? `${import.meta.env.VITE_API_URL}/client/find-all`
            : `${import.meta.env.VITE_API_URL}/client/find-all?colaboratorId=${colaboratorData.user.id}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${colaboratorData.token}`
                }
            });

            if (response.data) {
                setAllClients(response.data);
            }
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
            toast.error('Erro ao carregar clientes');
        }
    };

    const getAllColaboratorProposals = async () => {
        const colaboratorData = JSON.parse(localStorage.getItem('colaboratorData'));
        setLoadingProposals(true);

        const url = hasAdminPrivileges(colaboratorData.user.function)
            ? `${import.meta.env.VITE_API_URL}/proposal/find-all`
            : `${import.meta.env.VITE_API_URL}/proposal/find-all?colaboratorId=${colaboratorData.user.id}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${colaboratorData.token}`
                }
            });

            if (response.data.body) {
                // Ordenar propostas pela data mais recente
                const sortedProposals = response.data.body.sort((a, b) => {
                    return new Date(b.proposalDate) - new Date(a.proposalDate);
                });
                
                setProposals(sortedProposals);
            }
        } catch (error) {
            console.error("Erro ao buscar propostas:", error);
            toast.error('Erro ao carregar propostas');
        } finally {
            setLoadingProposals(false);
        }
    };

    const refreshData = async () => {
        try {
            const colaboratorData = JSON.parse(localStorage.getItem('colaboratorData'));

            const clientsResponse = await axios.get(
                `${import.meta.env.VITE_API_URL}/client/find-all?colaboratorId=${colaboratorData.user.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${colaboratorData.token}`
                    }
                }
            );
            setAllClients(clientsResponse.data);

            const colaboratorResponse = await axios.get(
                `${import.meta.env.VITE_API_URL}/colaborator/find?colaboratorId=${colaboratorData.user.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${colaboratorData.token}`
                    }
                }
            );

            const updatedUser = colaboratorResponse.data;
            setUser(updatedUser);

            localStorage.setItem('colaboratorData', JSON.stringify({
                ...colaboratorData,
                user: updatedUser
            }));

            const proposalsResponse = await axios.get(
                `${import.meta.env.VITE_API_URL}/proposal/find-all?colaboratorId=${colaboratorData.user.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${colaboratorData.token}`
                    }
                }
            );
            setProposals(proposalsResponse.data.body);

        } catch (error) {
            console.error('Erro ao atualizar dados:', error);
            toast.error('Erro ao atualizar dados');
        }
    };

    const handleClientUpdate = async () => {
        await refreshData();
    };

    const handleClientCreated = async () => {
        await refreshData();
    };

    const handleProposalCreated = async () => {
        await refreshData();
    };

    const handleDeleteProposal = async (proposalId) => {
        try {
            const colaboratorData = JSON.parse(localStorage.getItem('colaboratorData'));
            
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/proposal/delete?proposalId=${proposalId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${colaboratorData.token}`
                    }
                }
            );

            toast.success('Proposta excluída com sucesso!');
            getAllColaboratorProposals();
            setProposalToDelete(null); // Fecha o modal
        } catch (error) {
            console.error('Erro ao excluir proposta:', error);
            toast.error('Erro ao excluir proposta');
        }
    };

    // Função para atualizar apenas a proposta específica
    const handleProposalUpdate = async (proposalId) => {
        try {
            // Em vez de buscar apenas uma proposta, vamos atualizar todas
            await getAllColaboratorProposals();
        } catch (error) {
            console.error("Erro ao atualizar proposta:", error);
            toast.error('Erro ao atualizar proposta');
        }
    };

    const toggleRow = (proposalId) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(proposalId)) {
                newSet.delete(proposalId);
            } else {
                newSet.add(proposalId);
            }
            return newSet;
        });
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
        <div className={`min-h-screen ${
            hasAdminPrivileges(user?.function)
            ? 'bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#000000]' 
            : 'bg-gradient-to-br from-[#133785] via-[#0a1c42] to-[#1a1a1a]'
        }`}>
            <ColaboratorNavbar
                user={user}
            />
            
            {/* Seção de Clientes */}
            <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsClientsExpanded(!isClientsExpanded)}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            {isClientsExpanded ? (
                                <ExpandLess className="text-white" />
                            ) : (
                                <ExpandMore className="text-white" />
                            )}
                        </button>
                        <h2 className="text-xl text-white font-semibold">
                            {hasAdminPrivileges(user?.function) ? 'Todos os Clientes' : 'Meus Clientes'}
                        </h2>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#e67f00] hover:bg-[#ff8c00] 
                            rounded-lg transition-colors text-white"
                    >
                        <Add />
                        Novo Cliente
                    </button>
                </div>

                <motion.div
                    initial={false}
                    animate={{
                        height: isClientsExpanded ? 'auto' : 0,
                        opacity: isClientsExpanded ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                >
                    {allClients.length > 0 ? (
                        hasAdminPrivileges(user?.function) ? (
                            // Versão tabela para gerentes e sub administradores
                            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50">
                                            <th className="py-3 px-4 text-gray-600">Cliente</th>
                                            <th className="py-3 px-4 text-gray-600">Contato</th>
                                            <th className="py-3 px-4 text-gray-600">Progresso</th>
                                            {user?.function === 'Gerente' && (
                                                <th className="py-3 px-4 text-gray-600">Responsável</th>
                                            )}
                                            <th className="py-3 px-4 text-gray-600">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allClients.map((client) => (
                                            <tr key={client.id} className="border-b border-gray-100">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        {client.url_profile_cover ? (
                                                            <img
                                                                src={client.url_profile_cover}
                                                                alt={client.name}
                                                                className="w-8 h-8 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                                <Person className="text-gray-400" />
                                                            </div>
                                                        )}
                                                        <span className="text-gray-700">{client.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex flex-col text-sm">
                                                        <span className="text-gray-700">{client.phone}</span>
                                                        <span className="text-gray-500">{client.email}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex gap-1">
                                                        {progressSteps(client).map((completed, index) => (
                                                            <div
                                                                key={index}
                                                                className={`h-2 w-4 rounded-full ${
                                                                    completed ? 'bg-green-500' : 'bg-gray-200'
                                                                }`}
                                                                title={stepDescriptions[index]}
                                                            />
                                                        ))}
                                                    </div>
                                                </td>
                                                {user?.function === 'Gerente' && (
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            {client.colaborator?.url_profile_cover ? (
                                                                <img
                                                                    src={client.colaborator.url_profile_cover}
                                                                    alt={client.colaborator.name}
                                                                    className="w-8 h-8 rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                                    <Person className="text-gray-400" />
                                                                </div>
                                                            )}
                                                            <div className="flex flex-col">
                                                                <span className="text-gray-700">{client.colaborator?.name}</span>
                                                                <span className="text-gray-500 text-xs">{client.colaborator?.function}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                )}
                                                <td className="py-3 px-4">
                                                    <button
                                                        className="text-blue-400 hover:text-blue-300 transition-colors"
                                                        onClick={() => setSelectedProposal(client)}
                                                    >
                                                        {user?.function === 'Gerente' ? 'Analisar' : 'Ver detalhes'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            // Versão cards para colaboradores normais
                            <ClientsSection
                                displayedClients={allClients}
                                progressSteps={(client) => [
                                    !!client.url_profile_cover,
                                    !!client.phone,
                                    !!client.email,
                                    !!client.simulation,
                                    client.proposes?.length > 0
                                ]}
                                stepDescriptions={[
                                    'Foto de Perfil',
                                    'WhatsApp',
                                    'Email',
                                    'Simulação',
                                    'Proposta'
                                ]}
                                onClientUpdate={handleClientUpdate}
                            />
                        )
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`${
                                user?.function === 'Gerente' 
                                ? 'bg-white shadow-lg' 
                                : 'bg-white/10 backdrop-blur-sm'
                            } rounded-xl p-6`}
                        >
                            <p className={`text-center ${
                                user?.function === 'Gerente' ? 'text-gray-600' : 'text-gray-300'
                            }`}>
                                Nenhum cliente cadastrado.
                                <br />
                                Clique em "Novo Cliente" para começar!
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </div>

            {/* Seção de Propostas */}
            <section className={`w-full max-w-7xl mx-auto p-4 space-y-6 ${
                hasAdminPrivileges(user?.function) ? 'mt-6' : ''
            }`}>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsProposalsExpanded(!isProposalsExpanded)}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            {isProposalsExpanded ? (
                                <ExpandLess className="text-white" />
                            ) : (
                                <ExpandMore className="text-white" />
                            )}
                        </button>
                        <h2 className="text-xl text-white font-semibold flex items-center gap-2">
                            <Description />
                            {hasAdminPrivileges(user?.function) ? 'Todas as Propostas' : 'Minhas Propostas'}
                        </h2>
                    </div>
                    <button
                        onClick={() => setIsProposalModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#e67f00] hover:bg-[#ff8c00] 
                            rounded-lg transition-colors text-white"
                    >
                        <Add />
                        Nova Proposta
                    </button>
                </div>

                <motion.div
                    initial={false}
                    animate={{
                        height: isProposalsExpanded ? 'auto' : 0,
                        opacity: isProposalsExpanded ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                >
                    {loadingProposals ? (
                        <div className="text-center py-8 bg-white rounded-xl shadow-lg">
                            <p className="text-gray-600">Carregando propostas...</p>
                        </div>
                    ) : proposals.length > 0 ? (
                        <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50">
                                        <th className="py-3 px-4 text-gray-600">Cliente</th>
                                        <th className="py-3 px-4 text-gray-600">Banco</th>
                                        <th className="py-3 px-4 text-gray-600">Tipo</th>
                                        <th className="py-3 px-4 text-gray-600">Data</th>
                                        <th className="py-3 px-4 text-gray-600">Status</th>
                                        <th className="py-3 px-4 text-gray-600">Simulações</th>
                                        <th className="py-3 px-4 text-gray-600">Chat</th>
                                        {user?.function === 'Gerente' && (
                                            <th className="py-3 px-4 text-gray-600">Responsável</th>
                                        )}
                                        <th className="py-3 px-4 text-gray-600">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {proposals.map((proposal) => (
                                        <>
                                            <tr key={proposal.id} 
                                                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                                            >
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        {proposal.client?.url_profile_cover ? (
                                                            <img
                                                                src={proposal.client.url_profile_cover}
                                                                alt={proposal.client.name}
                                                                className="w-8 h-8 rounded-full object-cover border-2 border-white/10"
                                                            />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                                <Person className="text-gray-400" />
                                                            </div>
                                                        )}
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-700 font-medium">
                                                                {proposal.client?.name.split(' ')[0]}
                                                            </span>
                                                            <span className="text-gray-400 text-xs">
                                                                {proposal.client?.cpf}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                            <AccountBalance className="text-blue-500 text-xl" />
                                                        </div>
                                                        <span className="text-gray-700">{proposal.bank?.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="px-3 py-1 rounded-full text-xs bg-gray-100">
                                                        {proposal.proposalType}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-gray-700">
                                                            {new Date(proposal.proposalDate).toLocaleDateString('pt-BR')}
                                                        </span>
                                                        <span className="text-gray-400 text-xs">
                                                            {new Date(proposal.proposalDate).toLocaleTimeString('pt-BR')}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs ${
                                                        proposal.isTrueContract
                                                            ? 'bg-green-500/20 text-green-500'
                                                            : 'bg-yellow-500/20 text-yellow-500'
                                                    }`}>
                                                        {proposal.isTrueContract ? 'Contrato' : 'Em análise'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                                            <Calculate className="text-purple-500" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-700">
                                                                {proposal.currentSimulations?.length || 0}
                                                            </span>
                                                            {proposal.currentSimulations?.length > 0 && (
                                                                <span className="text-gray-400 text-xs">
                                                                    Última: {new Date(proposal.currentSimulations[proposal.currentSimulations.length - 1].date)
                                                                        .toLocaleDateString('pt-BR')}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {proposal.currentSimulations?.length > 0 && (
                                                            <button
                                                                onClick={() => toggleRow(proposal.id)}
                                                                className={`p-1 rounded-full hover:bg-gray-100 transition-transform ${
                                                                    expandedRows.has(proposal.id) ? 'rotate-180' : ''
                                                                }`}
                                                            >
                                                                <KeyboardArrowDown className="text-gray-400" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                                            <Chat className="text-orange-500" />
                                                        </div>
                                                        <span className="text-gray-700">
                                                            {proposal.observations?.length || 0}
                                                        </span>
                                                    </div>
                                                </td>
                                                {user?.function === 'Gerente' && (
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            {proposal.Colaborator?.url_profile_cover ? (
                                                                <img
                                                                    src={proposal.Colaborator.url_profile_cover}
                                                                    alt={proposal.Colaborator.name}
                                                                    className="w-8 h-8 rounded-full object-cover border-2 border-white/10"
                                                                />
                                                            ) : (
                                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                                    <Person className="text-gray-400" />
                                                                </div>
                                                            )}
                                                            <div className="flex flex-col">
                                                                <span className="text-gray-700">{proposal.Colaborator?.name}</span>
                                                                <span className="text-gray-400 text-xs">{proposal.Colaborator?.function}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                )}
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            className="text-blue-500 hover:text-blue-400 transition-colors font-medium"
                                                            onClick={() => hasAdminPrivileges(user?.function) 
                                                                ? setSelectedProposal(proposal)
                                                                : setSelectedProposalForDetails(proposal)
                                                            }
                                                        >
                                                            {hasAdminPrivileges(user?.function) ? 'Analisar' : 'Ver detalhes'}
                                                        </button>

                                                        {hasAdminPrivileges(user?.function) && (
                                                            <button
                                                                onClick={() => setProposalToDelete(proposal)}
                                                                className="p-1 text-red-400 hover:text-red-500 transition-colors"
                                                                title="Excluir proposta"
                                                            >
                                                                <Delete className="text-xl" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            {expandedRows.has(proposal.id) && proposal.currentSimulations?.length > 0 && (
                                                <tr>
                                                    <td colSpan={user?.function === 'Gerente' ? 9 : 8} className="bg-gray-50 border-b border-gray-100">
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="p-4"
                                                        >
                                                            <div className="grid gap-3">
                                                                {proposal.currentSimulations
                                                                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                                                                    .map((sim, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                                                                    >
                                                                        <div className="grid grid-cols-4 gap-4">
                                                                            <div>
                                                                                <span className="text-gray-500 text-sm">Parcela</span>
                                                                                <p className="text-gray-700 font-medium">
                                                                                    {parseFloat(sim.parcela).toLocaleString('pt-BR', {
                                                                                        style: 'currency',
                                                                                        currency: 'BRL'
                                                                                    })}
                                                                                </p>
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-gray-500 text-sm">Saldo Devedor</span>
                                                                                <p className="text-green-600 font-medium">
                                                                                    {parseFloat(sim.saldoDevedor).toLocaleString('pt-BR', {
                                                                                        style: 'currency',
                                                                                        currency: 'BRL'
                                                                                    })}
                                                                                </p>
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-gray-500 text-sm">Taxa</span>
                                                                                <p className="text-gray-700 font-medium">
                                                                                    {sim.taxa}% a.m.
                                                                                </p>
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-gray-500 text-sm">Prazo</span>
                                                                                <p className="text-gray-700 font-medium">
                                                                                    {sim.prazoRestante} meses
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="mt-2 text-xs text-gray-400">
                                                                            Simulado em: {new Date(sim.date).toLocaleString('pt-BR')}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-white rounded-xl shadow-lg">
                            <p className="text-gray-600">Nenhuma proposta encontrada</p>
                        </div>
                    )}
                </motion.div>
            </section>

            <CreateClientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleClientCreated}
            />

            <CreateNewProposal
                isOpen={isProposalModalOpen}
                onClose={() => setIsProposalModalOpen(false)}
                onSuccess={handleProposalCreated}
            />

            {/* Modal de Análise */}
            {selectedProposal && hasAdminPrivileges(user?.function) && (
                <AnalyzeProposalModal
                    isOpen={!!selectedProposal}
                    onClose={() => setSelectedProposal(null)}
                    proposal={selectedProposal}
                    onSuccess={() => {
                        getAllColaboratorProposals();
                        setSelectedProposal(null);
                    }}
                    onMessageSent={() => handleProposalUpdate(selectedProposal.id)}
                />
            )}

            {/* Modal de Detalhes */}
            <ProposalDetails
                isOpen={!!selectedProposalForDetails}
                onClose={() => setSelectedProposalForDetails(null)}
                proposal={selectedProposalForDetails}
                onMessageSent={() => selectedProposalForDetails && handleProposalUpdate(selectedProposalForDetails.id)}
            />

            {/* Modal de confirmação de exclusão */}
            <DeleteConfirmationModal
                isOpen={!!proposalToDelete}
                onClose={() => setProposalToDelete(null)}
                onConfirm={() => handleDeleteProposal(proposalToDelete?.id)}
                itemName="proposta"
            />
        </div>
    );
}

export default ColaboradorDashboard;