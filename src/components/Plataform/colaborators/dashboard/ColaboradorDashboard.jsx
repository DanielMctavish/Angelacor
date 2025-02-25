import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Add, Person, Description } from '@mui/icons-material';
import { motion } from 'framer-motion';
import ColaboratorNavbar from "./components/ColaboratorNavbar";
import ClientsSection from "./components/ClientsSection";
import CreateClientModal from "./components/CreateClientModal";
import { toast } from '../../../Common/Toast/Toast';
import CreateNewProposal from '../proposals/CreateNewProposal';
import AnalyzeProposalModal from './manager/AnalyzeProposalModal';

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

    const getAllColaboratorClients = async () => {
        const colaboratorData = JSON.parse(localStorage.getItem('colaboratorData'));

        try {
            const url = colaboratorData.user.function === 'Gerente'
                ? `${import.meta.env.VITE_API_URL}/client/find-all`
                : `${import.meta.env.VITE_API_URL}/client/find-all?colaboratorId=${colaboratorData.user.id}`;

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${colaboratorData.token}`
                }
            });

            setAllClients(response.data);
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
            toast.error('Erro ao carregar clientes');
        }
    };

    const getAllColaboratorProposals = async () => {
        const colaboratorData = JSON.parse(localStorage.getItem('colaboratorData'));
        setLoadingProposals(true);

        try {
            const url = colaboratorData.user.function === 'Gerente'
                ? `${import.meta.env.VITE_API_URL}/proposal/find-all`
                : `${import.meta.env.VITE_API_URL}/proposal/find-all?colaboratorId=${colaboratorData.user.id}`;

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${colaboratorData.token}`
                }
            });

            setProposals(response.data.body);
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
            user?.function === 'Gerente' 
            ? 'bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#000000]' 
            : 'bg-gradient-to-br from-[#133785] via-[#0a1c42] to-[#1a1a1a]'
        }`}>
            <ColaboratorNavbar
                user={user}
            />
            
            {/* Seção de Clientes */}
            <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl text-white font-semibold">
                        {user?.function === 'Gerente' ? 'Todos os Clientes' : 'Meus Clientes'}
                    </h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#e67f00] hover:bg-[#ff8c00] 
                            rounded-lg transition-colors text-white"
                    >
                        <Add />
                        Novo Cliente
                    </button>
                </div>

                {allClients.length > 0 ? (
                    user?.function === 'Gerente' ? (
                        // Versão tabela para gerentes
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
            </div>

            {/* Seção de Propostas */}
            <section className={`w-full max-w-7xl mx-auto p-4 space-y-6 ${
                user?.function === 'Gerente' ? 'mt-6' : ''
            }`}>
                <div className="flex justify-between items-center">
                    <h2 className="text-xl text-white font-semibold flex items-center gap-2">
                        <Description />
                        {user?.function === 'Gerente' ? 'Todas as Propostas' : 'Minhas Propostas'}
                    </h2>
                    <button
                        onClick={() => setIsProposalModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#e67f00] hover:bg-[#ff8c00] 
                            rounded-lg transition-colors text-white"
                    >
                        <Add />
                        Nova Proposta
                    </button>
                </div>

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
                                    {user?.function === 'Gerente' && (
                                        <th className="py-3 px-4 text-gray-600">Responsável</th>
                                    )}
                                    <th className="py-3 px-4 text-gray-600">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {proposals.map((proposal) => (
                                    <tr key={proposal.id} className="border-b border-gray-100">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                {proposal.client?.url_profile_cover ? (
                                                    <img
                                                        src={proposal.client.url_profile_cover}
                                                        alt={proposal.client.name}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <Person className="text-gray-400" />
                                                    </div>
                                                )}
                                                <span className="text-gray-700">{proposal.client?.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-700">{proposal.bank?.name}</td>
                                        <td className="py-3 px-4 text-gray-700">{proposal.proposalType}</td>
                                        <td className="py-3 px-4 text-gray-700">
                                            {new Date(proposal.proposalDate).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${proposal.isTrueContract
                                                    ? 'bg-green-500/20 text-green-500'
                                                    : 'bg-yellow-500/20 text-yellow-500'
                                                }`}>
                                                {proposal.isTrueContract ? 'Contrato' : 'Em análise'}
                                            </span>
                                        </td>
                                        {user?.function === 'Gerente' && (
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    {proposal.Colaborator?.url_profile_cover ? (
                                                        <img
                                                            src={proposal.Colaborator.url_profile_cover}
                                                            alt={proposal.Colaborator.name}
                                                            className="w-8 h-8 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <Person className="text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col">
                                                        <span className="text-gray-700">{proposal.Colaborator?.name}</span>
                                                        <span className="text-gray-500 text-xs">{proposal.Colaborator?.function}</span>
                                                    </div>
                                                </div>
                                            </td>
                                        )}
                                        <td className="py-3 px-4">
                                            <button
                                                className="text-blue-400 hover:text-blue-300 transition-colors"
                                                onClick={() => setSelectedProposal(proposal)}
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
                    <div className="text-center py-8 bg-white rounded-xl shadow-lg">
                        <p className="text-gray-600">Nenhuma proposta encontrada</p>
                    </div>
                )}
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

            {selectedProposal && user?.function === 'Gerente' && (
                <AnalyzeProposalModal
                    isOpen={!!selectedProposal}
                    onClose={() => setSelectedProposal(null)}
                    proposal={selectedProposal}
                    onSuccess={() => {
                        getAllColaboratorProposals();
                        setSelectedProposal(null);
                    }}
                />
            )}
        </div>
    );
}

export default ColaboradorDashboard;