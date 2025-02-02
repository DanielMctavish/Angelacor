import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Email, Lock } from '@mui/icons-material';
import axios from 'axios';
import { toast } from '../../Common/Toast/Toast';
import logoAngelCor from '../../../medias/logos/angelcor_logo.png';

function ColaboratorLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/colaborator/login-colaborator`,
                { email, password }
            );

            // Salva os dados do colaborador e token no localStorage
            localStorage.setItem('colaboratorData', JSON.stringify({
                user: response.data.user,
                token: response.data.token
            }));

            toast.success('Login realizado com sucesso!');
            navigate('/colaborador-dashboard');

        } catch (error) {
            console.error('Erro no login:', error);
            toast.error(
                error.response?.data?.message || 
                'Erro ao fazer login. Verifique suas credenciais.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#133785] to-[#0a1c42] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[400px] bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
            >
                <div className="flex flex-col items-center mb-8">
                    <motion.img
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        src={logoAngelCor}
                        alt="AngelCor Logo"
                        className="w-32 mb-4"
                    />
                    <h2 className="text-2xl font-bold text-white">Portal do Colaborador</h2>
                    <p className="text-gray-400 text-sm">Faça login para acessar sua área</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-300">Email</label>
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                            <Email className="text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Seu email"
                                className="bg-transparent outline-none text-white w-full"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-300">Senha</label>
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                            <Lock className="text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Sua senha"
                                className="bg-transparent outline-none text-white w-full"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`
                            w-full bg-[#e67f00] hover:bg-[#ff8c00] text-white py-3 rounded-lg
                            transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed
                            flex items-center justify-center gap-2
                        `}
                    >
                        {loading ? (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                />
                                Entrando...
                            </>
                        ) : (
                            'Entrar'
                        )}
                    </button>
                </form>

                <p className="text-center text-gray-400 text-sm mt-6">
                    Problemas para acessar?{' '}
                    <a href="#" className="text-[#e67f00] hover:underline">
                        Fale com o suporte
                    </a>
                </p>
            </motion.div>
        </div>
    );
}

export default ColaboratorLogin;