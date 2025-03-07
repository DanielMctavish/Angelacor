import { EmojiEvents } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logoAngelCor from "../../../../../medias/logos/angelcor_logo.png";
import XpSystem from '../../../XP/XpLevels';
import { useEffect, useState } from 'react';
import { Logout } from '@mui/icons-material';

function ColaboratorNavbar({ user }) {
    const navigate = useNavigate();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [levelInfo, setLevelInfo] = useState(null);

    useEffect(() => {
        const info = XpSystem.getCurrentLevel(user.experience);
        setLevelInfo(info);
    }, [user?.experience]);

    const handleLogout = () => {
        localStorage.removeItem('colaboratorData');
        navigate('/');
    };

    const isGerente = user?.function === 'Gerente';

    // Cálculo da porcentagem de progresso usando o XpSystem
    const calculateProgress = () => {
        if (!levelInfo) return 0;

        // Pega o XP atual e o XP necessário para o próximo nível
        const { currentXp, nextLevelXp, level } = levelInfo;

        // Pega o XP necessário para o nível atual
        const currentLevelXp = XpSystem.levels[`level${level}`];

        // Calcula quanto XP já foi obtido neste nível
        const xpInCurrentLevel = currentXp - currentLevelXp;

        // Calcula quanto XP é necessário para passar de nível
        const xpNeededForNextLevel = nextLevelXp - currentLevelXp;

        // Calcula a porcentagem
        const progress = (xpInCurrentLevel / xpNeededForNextLevel) * 100;

        return Math.min(100, Math.max(0, progress));
    };

    return (
        <>
            <div className="w-full">
                <nav className={`w-full relative ${isGerente
                    ? 'bg-white shadow-lg'
                    : 'bg-white/10 backdrop-blur-sm border-b border-white/10'
                    }`}>
                    <div className="max-w-7xl mx-auto px-4 py-3">
                        <div className="flex items-center justify-between">
                            {/* Lado Esquerdo - Logo e Nome */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={logoAngelCor}
                                    alt="AngelCor Logo"
                                    className="h-8 w-auto"
                                />
                                <div className="flex flex-col">
                                    <span className={`font-medium ${isGerente ? 'text-gray-800' : 'text-white'}`}>
                                        {user?.name}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm ${isGerente ? 'text-gray-500' : 'text-gray-300'}`}>
                                            {user?.function}
                                        </span>
                                        {levelInfo && (
                                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                                Nível {levelInfo.level}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Lado Direito - Info XP e Botões */}
                            <div className="flex items-center gap-4">
                                {!isGerente && levelInfo && (
                                    <div className="flex items-center gap-2">
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm text-gray-300">Nível {levelInfo.level}</span>
                                            <span className="text-xs text-[#e67f00]">{levelInfo.currentXp} XP</span>
                                            <span className="text-xs text-gray-400">
                                                Próximo nível: {levelInfo.xpNeeded} XP
                                            </span>
                                        </div>
                                        <EmojiEvents className="text-[#e67f00]" />
                                    </div>
                                )}

                                <button
                                    onClick={() => setShowLogoutConfirm(true)}
                                    className={`p-2 rounded-lg transition-colors ${isGerente
                                        ? 'text-gray-600 hover:bg-gray-100'
                                        : 'text-gray-300 hover:bg-white/5'
                                        }`}
                                    title="Sair"
                                >
                                    <Logout />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Barra de Progresso - Agora dentro do nav e ocupando toda a largura */}
                    {!isGerente && levelInfo && (
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${calculateProgress()}%` }}
                                transition={{ duration: 1 }}
                                className="h-full bg-[#e67f00] origin-left"
                            />
                        </div>
                    )}
                </nav>
            </div>

            {/* Modal de Confirmação de Logout */}
            {showLogoutConfirm && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 
                        flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className={`${isGerente
                            ? 'bg-white'
                            : 'bg-[#1f1f1f] border border-white/10'
                            } rounded-xl p-6 w-full max-w-sm`}
                    >
                        <h3 className={`text-xl font-bold mb-4 ${isGerente ? 'text-gray-800' : 'text-white'
                            }`}>
                            Confirmar Saída
                        </h3>
                        <p className={isGerente ? 'text-gray-600' : 'text-gray-300'}>
                            Tem certeza que deseja sair?
                        </p>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className={`px-4 py-2 rounded-lg transition-colors ${isGerente
                                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    : 'bg-white/5 hover:bg-white/10 text-white'
                                    }`}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 
                                    text-white rounded-lg transition-colors"
                            >
                                Sair
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

        </>
    );
}

export default ColaboratorNavbar; 