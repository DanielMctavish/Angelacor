import { EmojiEvents, WorkspacePremium } from '@mui/icons-material';
import { motion } from 'framer-motion';
import './RankingSection.css';

function RankingSection({ topColaborators }) {
    return (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden relative">
            {/* Fundo com gradiente e partículas */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#ff6b0030] to-[#ffd70020] overflow-hidden">
                {/* Container das partículas */}
                <div className="particles-container">
                    {[...Array(20)].map((_, i) => (
                        <div 
                            key={i} 
                            className={`particle particle-${i + 1}`}
                            style={{
                                '--delay': `${Math.random() * 4}s`,
                                '--position': `${Math.random() * 100}%`,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Conteúdo original */}
            <div className="relative z-10">
                <div className="p-4 border-b border-white/10">
                    <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                        <EmojiEvents className="text-[#FFD700]" />
                        Top Colaboradores
                    </h2>
                </div>

                <div className="p-6">
                    <div className="flex flex-wrap justify-center items-end gap-4 md:gap-8">
                        {/* 2º Lugar */}
                        {topColaborators[1] && (
                            <motion.div
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ 
                                    delay: 2.4,
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 20
                                }}
                                className="flex flex-col items-center gap-2"
                            >
                                <div className="relative">
                                    <motion.div
                                        initial={{ rotate: -180, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        transition={{ delay: 2.6, duration: 0.5 }}
                                        className="absolute -top-3 left-1/2 -translate-x-1/2"
                                    >
                                        <WorkspacePremium className="text-[#C0C0C0] text-3xl" />
                                    </motion.div>
                                    <img 
                                        src={topColaborators[1].avatar}
                                        alt={topColaborators[1].name}
                                        className="w-24 h-24 rounded-full border-4 border-[#C0C0C0] object-cover"
                                    />
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 1.6 }}
                                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 
                                            bg-[#C0C0C0] text-black text-sm font-bold rounded-full w-8 h-8 
                                            flex items-center justify-center"
                                    >
                                        2
                                    </motion.div>
                                </div>
                                <div className="text-center mt-4">
                                    <h3 className="font-semibold">{topColaborators[1].name}</h3>
                                    <p className="text-sm text-gray-400">Nível {topColaborators[1].level}</p>
                                    <p className="text-sm text-[#C0C0C0]">{topColaborators[1].proposalsCount} propostas</p>
                                </div>
                            </motion.div>
                        )}

                        {/* 1º Lugar */}
                        {topColaborators[0] && (
                            <motion.div
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ 
                                    delay: 2.2,
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 20
                                }}
                                whileHover={{ scale: 1.05 }}
                                className="flex flex-col items-center gap-2 -mt-8"
                            >
                                <div className="relative first-place">
                                    <motion.div
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 2.5, duration: 0.5 }}
                                        className="absolute -top-5 left-1/2 -translate-x-1/2"
                                    >
                                        <EmojiEvents className="text-[#FFD700] text-4xl trophy-icon" />
                                    </motion.div>
                                    <motion.img 
                                        initial={{ rotate: 360, scale: 0 }}
                                        animate={{ rotate: 0, scale: 1 }}
                                        transition={{ duration: 0.7 }}
                                        src={topColaborators[0].avatar}
                                        alt={topColaborators[0].name}
                                        className="w-32 h-32 rounded-full border-4 border-[#FFD700] object-cover
                                            shadow-lg shadow-[#FFD700]/20"
                                    />
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 
                                            bg-[#FFD700] text-black text-lg font-bold rounded-full w-10 h-10 
                                            flex items-center justify-center z-10"
                                    >
                                        1
                                    </motion.div>
                                </div>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.6 }}
                                    className="text-center mt-4"
                                >
                                    <h3 className="font-semibold text-lg">{topColaborators[0].name}</h3>
                                    <p className="text-sm text-gray-400">Nível {topColaborators[0].level}</p>
                                    <p className="text-[#FFD700]">{topColaborators[0].proposalsCount} propostas</p>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* 3º Lugar */}
                        {topColaborators[2] && (
                            <motion.div
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ 
                                    delay: 2.6,
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 20
                                }}
                                className="flex flex-col items-center gap-2"
                            >
                                <div className="relative">
                                    <motion.div
                                        initial={{ rotate: 180, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        transition={{ delay: 2.8, duration: 0.5 }}
                                        className="absolute -top-3 left-1/2 -translate-x-1/2"
                                    >
                                        <WorkspacePremium className="text-[#CD7F32] text-3xl" />
                                    </motion.div>
                                    <img 
                                        src={topColaborators[2].avatar}
                                        alt={topColaborators[2].name}
                                        className="w-24 h-24 rounded-full border-4 border-[#CD7F32] object-cover"
                                    />
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 1.8 }}
                                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 
                                            bg-[#CD7F32] text-black text-sm font-bold rounded-full w-8 h-8 
                                            flex items-center justify-center"
                                    >
                                        3
                                    </motion.div>
                                </div>
                                <div className="text-center mt-4">
                                    <h3 className="font-semibold">{topColaborators[2].name}</h3>
                                    <p className="text-sm text-gray-400">Nível {topColaborators[2].level}</p>
                                    <p className="text-sm text-[#CD7F32]">{topColaborators[2].proposalsCount} propostas</p>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Top 4-6 */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {topColaborators.slice(3, 6).map((colab, index) => (
                            <div key={colab.id} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                                <div className="relative">
                                    <img 
                                        src={colab.avatar}
                                        alt={colab.name}
                                        className="w-16 h-16 rounded-full border-2 border-white/20 object-cover"
                                    />
                                    <div className="absolute -bottom-1 -right-1 
                                        bg-white/10 text-white text-xs font-bold rounded-full w-6 h-6 
                                        flex items-center justify-center">
                                        {index + 4}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-medium text-sm">{colab.name}</h3>
                                    <p className="text-xs text-gray-400">Nível {colab.level}</p>
                                    <p className="text-xs text-gray-400">{colab.proposalsCount} propostas</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RankingSection; 