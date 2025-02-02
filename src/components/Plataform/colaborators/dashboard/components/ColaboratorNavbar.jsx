import { Person, ExitToApp, Calculate } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from '../../../../Common/Toast/Toast';
import logoAngelCor from "../../../../../medias/logos/angelcor_logo.png";
import XpLevels from '../../../Admin/Colaborators/XP/XpLevels';

function ColaboratorNavbar({ user, xp, level }) {
    const navigate = useNavigate();

    const calculateNextLevel = () => {
        const currentXp = xp || 0;
        let nextLevelXp = null;
        let currentLevelXp = 0;

        // Encontra o próximo nível baseado no XP atual
        Object.entries(XpLevels).forEach(([levelKey, xpRequired]) => {
            if (currentXp < xpRequired && !nextLevelXp) {
                nextLevelXp = xpRequired;
            }
            if (currentXp >= xpRequired) {
                currentLevelXp = xpRequired;
            }
        });

        // Se já estiver no nível máximo
        if (!nextLevelXp) {
            return {
                progress: 100,
                nextLevelXp: currentLevelXp,
                currentLevelXp
            };
        }

        const progress = ((currentXp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
        return {
            progress: Math.min(100, Math.max(0, progress)),
            nextLevelXp,
            currentLevelXp
        };
    };

    const { progress, nextLevelXp, currentLevelXp } = calculateNextLevel();

    const handleLogout = () => {
        localStorage.removeItem('colaboratorData');
        navigate('/login');
        toast.success('Logout realizado com sucesso!');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="w-full bg-white/10 backdrop-blur-sm border-b border-white/10 mb-6 relative rounded-lg"
        >
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    
                    <div className="flex items-center gap-6">
                        
                        <div className="flex items-center gap-4">
                            {/* Foto de Perfil */}
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#e67f00]">
                                    {user?.url_profile_cover ? (
                                        <img
                                            src={user.url_profile_cover}
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-[#1f1f1f] flex items-center justify-center">
                                            <Person className="text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-[#e67f00] text-white text-xs 
                                    font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                    {level}
                                </div>
                            </div>

                            {/* Nome e Função */}
                            <div>
                                <h2 className="font-semibold">{user?.name}</h2>
                                <p className="text-sm text-gray-400">{user?.function}</p>
                            </div>
                        </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex items-center gap-3">
                        {/* Botão do Simulador */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/simulador')}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg
                                bg-[#e67f00] hover:bg-[#ff8c00] transition-colors text-sm"
                        >
                            <Calculate fontSize="small" />
                            <span className="hidden md:inline">Simulador</span>
                        </motion.button>

                        {/* Botão de Logout */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg
                                bg-white/5 hover:bg-white/10 transition-colors text-sm"
                        >
                            <ExitToApp fontSize="small" />
                            <span className="hidden md:inline">Sair</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Barra de Progresso Simplificada */}
            <div className="absolute bottom-0 left-0 w-full h-1">
                <div className="relative w-full h-full bg-[#1f1f1f]">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-[#e67f00] to-[#ff8c00]"
                    />
                    
                    {/* Números de XP */}
                    <div className="absolute -top-5 w-full px-4 flex justify-between text-[10px] text-gray-400">
                        <span>{xp}</span>
                        <span>{nextLevelXp}</span>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}

export default ColaboratorNavbar; 