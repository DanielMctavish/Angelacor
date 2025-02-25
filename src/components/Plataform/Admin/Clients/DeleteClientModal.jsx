import { motion } from 'framer-motion';
import { Warning } from '@mui/icons-material';

function DeleteClientModal({ isOpen, onClose, onConfirm, clientName }) {
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
                className="bg-[#1f1f1f] rounded-xl p-6 w-full max-w-md relative"
            >
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                        <Warning className="text-red-500 text-3xl" />
                    </div>
                    
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">Confirmar Exclusão</h2>
                        <p className="text-gray-300">
                            Tem certeza que deseja excluir o cliente <span className="text-white font-semibold">{clientName}</span>?
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                            Esta ação não pode ser desfeita.
                        </p>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 
                                rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
                                transition-colors flex items-center gap-2"
                        >
                            Excluir Cliente
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default DeleteClientModal; 