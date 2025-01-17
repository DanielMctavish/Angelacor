import { Person, CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";
import { motion } from 'framer-motion';
import ProgressTooltip from "./ProgressTooltip";
import './styles/ClientCard.css';

function ClientCard({ client, progressSteps, stepDescriptions }) {
    const isCompleted = progressSteps.every(step => step === true);

    // Função para gerar propriedades aleatórias para cada partícula
    const generateParticleProps = () => ({
        '--delay': `${Math.random() * 2}s`,
        '--position': `${Math.random() * 100}%`,
        '--duration': `${1 + Math.random() * 2}s`,
        '--wind': `${-1 + Math.random() * 2}`, // Movimento lateral aleatório
    });

    return (
        <motion.div 
            className={`w-full bg-[#1f1f1f] rounded-lg shadow-sm 
                border border-white/10 flex justify-between items-center p-3 text-white
                hover:bg-[#272727] transition-colors relative ${isCompleted ? 'completed-card' : ''}`}
            animate={isCompleted ? {
                boxShadow: ['0 0 10px #ff6b0020', '0 0 20px #ff6b0040', '0 0 10px #ff6b0020'],
            } : {}}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        >
            {/* Efeito de partículas para cards completos */}
            {isCompleted && (
                <div className="particles-container">
                    {[...Array(30)].map((_, i) => ( // Aumentei para 30 partículas
                        <div 
                            key={i} 
                            className="particle"
                            style={generateParticleProps()}
                        />
                    ))}
                </div>
            )}

            {/* Conteúdo do card */}
            <div className="flex items-center gap-3 relative z-10">
                {client.url_profile_cover ? (
                    <motion.img
                        src={client.url_profile_cover}
                        alt=""
                        className="w-[60px] h-[60px] rounded-full object-cover"
                        animate={isCompleted ? {
                            border: ['2px solid #ff6b00', '2px solid #ffd700', '2px solid #ff6b00'],
                        } : {}}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ) : (
                    <div className="w-[60px] h-[60px] bg-[#343434] rounded-full 
                        flex items-center justify-center">
                        <Person className="text-gray-400 text-2xl" />
                    </div>
                )}
                <div className="flex flex-col">
                    <span className="font-medium">{client.name}</span>
                    <div className="flex gap-1">
                        {progressSteps.map((step, idx) => (
                            <div key={idx} className="text-lg relative group">
                                {step ? (
                                    <motion.div
                                        animate={isCompleted ? {
                                            scale: [1, 1.2, 1],
                                            rotate: [0, 10, -10, 0],
                                        } : {}}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: idx * 0.2
                                        }}
                                    >
                                        <CheckCircle className="text-[#e67f00]" />
                                    </motion.div>
                                ) : (
                                    <RadioButtonUnchecked className="text-gray-600" />
                                )}
                                <ProgressTooltip 
                                    description={stepDescriptions[idx].text}
                                    xp={stepDescriptions[idx].xp}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="text-sm text-gray-400 relative z-10">
                {progressSteps.filter(Boolean).length}/5 completo
            </div>
        </motion.div>
    );
}

export default ClientCard; 