import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Add } from '@mui/icons-material';
import { motion } from 'framer-motion';
import ColaboratorNavbar from "./components/ColaboratorNavbar";
import ClientsSection from "./components/ClientsSection";
import CreateClientModal from "./components/CreateClientModal";
import { stepDescriptions } from "./data/mockData";
import { toast } from '../../../Common/Toast/Toast';

function ColaboradorDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [allClients, setAllClients] = useState([])

    useEffect(() => {
        checkAuth();
        getAllColaboratorClients()
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

    const handleClientCreated = (newClient) => {
        // Atualiza a lista de clientes no estado do usuário
        setUser(prev => ({
            ...prev,
            clients: [...(prev.clients || []), newClient]
        }));
    };

    const getAllColaboratorClients = async () => {
        const colaboratorData = JSON.parse(localStorage.getItem('colaboratorData'));

        try {

            await axios.get(`${import.meta.env.VITE_API_URL}/client/find-all?colaboratorId=${colaboratorData.user.id}`, {
                headers: {
                    'Authorization': `Bearer ${colaboratorData.token}`
                }
            }).then(response => {

                console.log("lista de clientes do colaborador... __>", response.data)

                setAllClients(response.data)
            })

        } catch (error) {
            console.log("erro at get clients list: ", error.message)
        }

    }

    if (loading) {
        return (
            <div className="w-full h-screen bg-gradient-to-b from-[#133785] to-[#0a1c42] 
                flex items-center justify-center text-white">
                Carregando...
            </div>
        );
    }

    return (
        <div className="w-full h-[100vh] flex flex-col items-center justify-start p-2 
        bg-gradient-to-b from-[#133785] to-[#0a1c42] text-white overflow-y-auto">
            <ColaboratorNavbar
                user={user}
                xp={user?.experience || 0}
                level={user?.level || 1}
            />

            {/* Área principal */}
            <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
                {/* Header com Boas-vindas e Botão */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-2xl font-bold">Bem-vindo, {user?.name}!</h1>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#e67f00] 
                            hover:bg-[#ff8c00] rounded-lg transition-colors"
                    >
                        <Add />
                        Novo Cliente
                    </motion.button>
                </div>

                {/* Lista de Clientes */}
                {allClients.length > 0 ? (
                    <ClientsSection
                        displayedClients={allClients}
                        progressSteps={(allClients) => [
                            !!allClients.url_profile_cover,
                            !!allClients.whatsapp_number,
                            !!allClients.email,
                            !!allClients.simulation,
                            allClients.proposes?.length > 0
                        ]}
                        stepDescriptions={[
                            'Foto de Perfil',
                            'WhatsApp',
                            'Email',
                            'Simulação',
                            'Proposta'
                        ]}
                    />
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                    >
                        <p className="text-gray-400 text-center">
                            Você ainda não tem clientes cadastrados.
                            <br />
                            Clique em "Novo Cliente" para começar!
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Modal de Criar Cliente */}
            <CreateClientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleClientCreated}
            />
        </div>
    );
}

export default ColaboradorDashboard;

