import { motion } from 'framer-motion';
import { Warning } from '@mui/icons-material';

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, itemName }) {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-[#1f1f1f] rounded-xl p-6 max-w-md w-full"
            >
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                        <Warning className="text-red-500 text-3xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                        Confirmar Exclusão
                    </h3>
                    <p className="text-gray-400 mb-6">
                        Tem certeza que deseja excluir esta {itemName}? Esta ação não pode ser desfeita.
                    </p>
                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 
                                rounded-lg transition-colors text-white"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 
                                rounded-lg transition-colors text-white"
                        >
                            Excluir
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default DeleteConfirmationModal; 