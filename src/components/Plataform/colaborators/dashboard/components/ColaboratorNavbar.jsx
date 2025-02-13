import { Person, ExitToApp, Calculate, EmojiEvents } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from '../../../../Common/Toast/Toast';
import logoAngelCor from "../../../../../medias/logos/angelcor_logo.png";
import XpLevels from '../../../Admin/Colaborators/XP/XpLevels';
import { useEffect, useState } from 'react';
import SimulatorModal from '../../../../angel_simulator/SimulatorModal';
import { Refresh, Logout } from '@mui/icons-material';

function ColaboratorNavbar({ user, xp, level }) {
    const navigate = useNavigate();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('colaboratorData');
        navigate('/');
    };

    const isGerente = user?.function === 'Gerente';

    // Cálculo do próximo nível
    const calculateNextLevel = () => {
        const baseXP = 100; // XP base para o primeiro nível
        const multiplier = 1.5; // Multiplicador de dificuldade
        return Math.floor(baseXP * Math.pow(multiplier, level - 1));
    };

    // Cálculo da porcentagem de progresso
    const calculateProgress = () => {
        const currentXp = xp || 0;
        const currentLevel = level || 1;
        
        // XP necessário para o nível atual
        const currentLevelXP = Math.floor(100 * Math.pow(1.5, currentLevel - 1));
        
        // XP necessário para o próximo nível
        const nextLevelXP = Math.floor(100 * Math.pow(1.5, currentLevel));
        
        // XP necessário para o nível anterior
        const previousLevelXP = Math.floor(100 * Math.pow(1.5, currentLevel - 2));

        // Progresso atual dentro do nível
        const levelProgress = currentXp - currentLevelXP;
        const totalLevelXP = nextLevelXP - currentLevelXP;
        
        // Calcula a porcentagem
        const percentage = (levelProgress / totalLevelXP) * 100;
        
        // Garante que o valor esteja entre 0 e 100
        return Math.min(100, Math.max(0, percentage));
    };

    return (
        <>
            <div className="w-full">
                <nav className={`w-full ${
                    isGerente 
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
                                        {isGerente && (
                                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                                Nível {level}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Lado Direito - Info XP e Botões */}
                            <div className="flex items-center gap-4">
                                {!isGerente && (
                                    <div className="flex items-center gap-2">
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm text-gray-300">Nível {level}</span>
                                            <span className="text-xs text-[#e67f00]">{xp} XP</span>
                                        </div>
                                        <EmojiEvents className="text-[#e67f00]" />
                                    </div>
                                )}

                                <button
                                    onClick={() => setShowLogoutConfirm(true)}
                                    className={`p-2 rounded-lg transition-colors ${
                                        isGerente
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
                </nav>

                {/* Barra de Progresso - Apenas para não gerentes */}
                {!isGerente && (
                    <div className="w-full bg-white/5">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="h-1 w-full bg-white/10">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${calculateProgress()}%` }}
                                    transition={{ duration: 1 }}
                                    className="h-full bg-[#e67f00]"
                                />
                            </div>
                        </div>
                    </div>
                )}
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
                        className={`${
                            isGerente 
                            ? 'bg-white' 
                            : 'bg-[#1f1f1f] border border-white/10'
                        } rounded-xl p-6 w-full max-w-sm`}
                    >
                        <h3 className={`text-xl font-bold mb-4 ${
                            isGerente ? 'text-gray-800' : 'text-white'
                        }`}>
                            Confirmar Saída
                        </h3>
                        <p className={isGerente ? 'text-gray-600' : 'text-gray-300'}>
                            Tem certeza que deseja sair?
                        </p>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    isGerente
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

            {/* Modal do Simulador */}
            <SimulatorModal 
                isOpen={isSimulatorOpen}
                onClose={() => setIsSimulatorOpen(false)}
            />
        </>
    );
}

export default ColaboratorNavbar; 