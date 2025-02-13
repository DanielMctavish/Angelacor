import { motion } from 'framer-motion';
import { Close } from '@mui/icons-material';
import SimulatorMain from './SimulatorMain';

function SimulatorModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 
                flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#f5f5f5] w-[90%] h-[96%] rounded-xl relative 
                    overflow-hidden shadow-2xl"
            >
                {/* Botão de Fechar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 rounded-full
                        bg-[#e67f00] hover:bg-[#ff8c00] text-white
                        transition-colors shadow-lg"
                >
                    <Close />
                </button>

                {/* Conteúdo do Simulador */}
                <div className="w-full h-full overflow-auto">
                    <SimulatorMain isModal={true} onClose={onClose} />
                </div>
            </motion.div>
        </motion.div>
    );
}

export default SimulatorModal; 