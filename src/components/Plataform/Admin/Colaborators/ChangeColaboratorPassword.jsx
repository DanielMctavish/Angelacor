import { useState } from 'react';
import { motion } from 'framer-motion';
import { Close, Lock } from '@mui/icons-material';

function ChangeColaboratorPassword({ isOpen, onClose, colaborator, onSuccess }) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validações
        if (!password || !confirmPassword) {
            setError('Por favor, preencha todos os campos');
            return;
        }

        if (password !== confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        if (password.length < 6) {
            setError('A senha deve ter no mínimo 6 caracteres');
            return;
        }

        try {
            setLoading(true);
            // Aqui você implementará a lógica para alterar a senha
            // const response = await api.put(`/colaborators/${colaborator.id}/password`, { password });
            
            onSuccess?.();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao alterar senha');
        } finally {
            setLoading(false);
        }
    };

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
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-2 text-gray-400 hover:text-white 
                        hover:bg-white/10 rounded-lg transition-all"
                >
                    <Close />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-[#e67f00]/10 flex items-center justify-center">
                        <Lock className="text-[#e67f00]" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Alterar Senha</h2>
                        <p className="text-sm text-gray-400">
                            {colaborator?.name || 'Colaborador'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                            Nova Senha
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white 
                                focus:outline-none focus:border-[#e67f00] transition-colors"
                            placeholder="Digite a nova senha"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                            Confirmar Senha
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white 
                                focus:outline-none focus:border-[#e67f00] transition-colors"
                            placeholder="Confirme a nova senha"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 
                                rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-[#e67f00] text-white rounded-lg hover:bg-[#ff8c00] 
                                transition-colors disabled:opacity-50 disabled:cursor-not-allowed 
                                flex items-center gap-2"
                        >
                            {loading ? 'Alterando...' : 'Alterar Senha'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

export default ChangeColaboratorPassword; 