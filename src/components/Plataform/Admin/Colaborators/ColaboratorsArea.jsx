import { Add, Search, Groups } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import AdminNavbar from '../Navigation/AdminNavbar';
import logoAngelCor from "../../../../medias/logos/angelcor_logo.png";
import RankingSection from './RankingSection';
import ColaboratorsList from './ColaboratorsList';
import CreateColaboratorModal from './CreateColaboratorModal';
import XpLevels from './XP/XpLevels';
import { toast } from '../../../Common/Toast/Toast';
import ToastContainer from '../../../Common/Toast/Toast';

function ColaboratorsArea() {
    const [colaborators, setColaborators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchColaborators = async () => {
        try {
            const adminData = JSON.parse(localStorage.getItem('adminToken'));
            if (!adminData?.token) {
                throw new Error('Token não encontrado');
            }

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/colaborator/list`,
                {
                    headers: {
                        'Authorization': `Bearer ${adminData.token}`
                    }
                }
            );

            setColaborators(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Erro ao buscar colaboradores:', error);
            setError('Erro ao carregar colaboradores');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchColaborators();
    }, []);

    const handleCreateSuccess = () => {
        fetchColaborators();
        setIsModalOpen(false);
    };

    const handleDeleteColaborator = async (colaborator) => {
        try {
            const adminData = JSON.parse(localStorage.getItem('adminToken'));
            if (!adminData?.token) {
                throw new Error('Token não encontrado');
            }

            // Se o colaborador tiver foto de perfil, deleta primeiro
            if (colaborator.url_profile_cover) {
                await axios.delete(
                    `${import.meta.env.VITE_API_URL}/colaborator/delete-profile?colaboratorId=${colaborator.id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${adminData.token}`
                        },
                        data: {
                            url: colaborator.url_profile_cover
                        }
                    }
                );
            }

            // Depois deleta o colaborador
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/colaborator/delete?colaboratorId=${colaborator.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${adminData.token}`
                    }
                }
            );

            // Atualiza a lista após deletar
            fetchColaborators();

        } catch (error) {
            console.error('Erro ao deletar colaborador:', error);
            setError('Erro ao deletar colaborador');
        }
    };

    const handleGiveXp = async (colaborator) => {
        try {
            const adminData = JSON.parse(localStorage.getItem('adminToken'));
            if (!adminData?.token) {
                throw new Error('Token não encontrado');
            }

            // Calcula o novo XP (incremento de 100 por vez)
            const newXp = (colaborator.experience || 0) + 100;
            
            // Calcula o novo level baseado no XP
            let newLevel = 1;
            Object.entries(XpLevels).forEach(([level, xpRequired]) => {
                if (newXp >= xpRequired) {
                    newLevel = parseInt(level.replace('level', ''));
                }
            });

            // Verifica se subiu de nível
            if (newLevel > (colaborator.level || 1)) {
                toast.success(
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-lg font-bold">🎉 Level Up! 🎉</span>
                        <span>{colaborator.name} evoluiu para o nível {newLevel}!</span>
                    </div>,
                    {
                        duration: 4000,
                        style: {
                            background: '#1f1f1f',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.1)'
                        },
                        icon: '⭐'
                    }
                );
            }

            // Atualiza o colaborador com novo XP e level
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/colaborator/update?colaboratorId=${colaborator.id}`,
                {
                    // ...colaborator, //que absurdo...
                    experience: newXp,
                    level: newLevel
                },
                {
                    headers: {
                        'Authorization': `Bearer ${adminData.token}`
                    }
                }
            );

            // Atualiza a lista
            fetchColaborators();

        } catch (error) {
            console.error('Erro ao atualizar XP:', error);
            setError('Erro ao atualizar XP');
            toast.error('Erro ao atualizar XP do colaborador');
        }
    };

    const filteredColaborators = colaborators.filter(colab => 
        colab.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        colab.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        colab.function?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const topColaborators = [...colaborators]
        .sort((a, b) => (b.proposals?.length || 0) - (a.proposals?.length || 0))
        .slice(0, 6);

    // Verifica se há algum colaborador com propostas
    const hasAnyProposals = topColaborators.some(colab => colab.proposals?.length > 0);

    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-[#133785] to-[#0a1c42] text-white">
            {/* Modal */}
            <CreateColaboratorModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            {/* Navbar com animação de cima para baixo */}
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <AdminNavbar logo={logoAngelCor} area="Colaboradores"/>
            </motion.div>

            <main className="w-full max-w-[1200px] mx-auto p-4 space-y-6">
                {/* Actions Bar com fade in */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center"
                >
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full md:w-auto flex items-center justify-center gap-2 
                        bg-[#1f1f1f] hover:bg-[#e67f00] px-4 py-3 md:py-2 
                        rounded-lg transition-all text-base"
                    >
                        <Add />
                        Novo Colaborador
                    </button>

                    <div className="w-full md:w-auto flex items-center gap-2 bg-white/5 
                        border border-white/10 rounded-lg px-3 py-3 md:py-2">
                        <Search className="text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar colaborador..."
                            className="bg-transparent outline-none text-sm w-full md:w-[300px] text-white"
                        />
                    </div>
                </motion.div>

                {/* Dashboard Cards com animação sequencial */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10"
                    >
                        <h3 className="text-sm md:text-lg font-semibold mb-2">Total de Colaboradores</h3>
                        <p className="text-2xl md:text-3xl font-bold text-[#e67f00]">{colaborators.length}</p>
                    </motion.div>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10"
                    >
                        <h3 className="text-sm md:text-lg font-semibold mb-2">Colaboradores Ativos</h3>
                        <p className="text-2xl md:text-3xl font-bold text-green-500">
                            {colaborators.filter(colab => colab.status === 'Ativo').length}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10"
                    >
                        <h3 className="text-sm md:text-lg font-semibold mb-2">Colaboradores Inativos</h3>
                        <p className="text-2xl md:text-3xl font-bold text-red-500">
                            {colaborators.filter(colab => colab.status === 'Inativo').length}
                        </p>
                    </motion.div>
                </motion.div>

                {/* Ranking Section deslizando da direita */}
                <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.0 }}
                >
                    <RankingSection 
                        topColaborators={topColaborators}
                        hasAnyProposals={hasAnyProposals}
                    />
                </motion.div>

                {/* Lista de Colaboradores deslizando da esquerda */}
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.2 }}
                >
                    <ColaboratorsList 
                        colaborators={filteredColaborators}
                        loading={loading}
                        error={error}
                        onRefresh={fetchColaborators}
                        onDelete={handleDeleteColaborator}
                        onGiveXp={handleGiveXp}
                        xpLevels={XpLevels}
                    />
                </motion.div>
            </main>
            <ToastContainer />
        </div>
    );
}

export default ColaboratorsArea;