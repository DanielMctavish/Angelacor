import { Close } from '@mui/icons-material';
import { motion } from 'framer-motion';

function CreateColaboratorModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#1f1f1f] rounded-xl p-6 w-full max-w-[500px] relative"
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-white"
                >
                    <Close />
                </button>

                <h2 className="text-2xl font-bold text-white mb-6">Novo Colaborador</h2>

                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Nome Completo
                        </label>
                        <input
                            type="text"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                            placeholder="Digite o nome completo"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            E-mail
                        </label>
                        <input
                            type="email"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                            placeholder="Digite o e-mail"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Telefone
                        </label>
                        <input
                            type="tel"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                            placeholder="Digite o telefone"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Cargo
                        </label>
                        <input
                            type="text"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                            placeholder="Digite o cargo"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-[#e67f00] hover:bg-[#ff8c00] text-white py-2 rounded-lg 
                            transition-colors font-medium"
                        >
                            Criar Colaborador
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

export default CreateColaboratorModal; 