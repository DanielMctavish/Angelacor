import axios from 'axios';
import { Lock, ArrowBack } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function ClientLogin() {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async () => {
        setError('');

        if (!loginEmail || !loginPassword) {
            setError('Por favor, preencha todos os campos');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/client/login`, {
                email: loginEmail,
                password: loginPassword
            });

            if (response.data) {
                setLoginSuccess(true);
                localStorage.setItem("clientToken", JSON.stringify(response.data));

                setTimeout(() => {
                    navigate("/dashboard-client");
                }, 1000);
            }

        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        setError('E-mail ou senha incorretos');
                        break;
                    case 404:
                        setError('Usuário não encontrado');
                        break;
                    case 500:
                        setError('Erro no servidor. Tente novamente mais tarde');
                        break;
                    default:
                        setError('Ocorreu um erro ao fazer login');
                }
            } else {
                setError('Erro de conexão. Verifique sua internet');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-screen bg-gradient-to-b from-[#133785] to-[#0a1c42] text-white 
            flex items-center justify-center relative overflow-hidden">

            <AnimatePresence>
                {loginSuccess ? (
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        className="absolute inset-0 bg-[#133785]/90 backdrop-blur-sm flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ y: 20 }}
                            animate={{ y: 0 }}
                            className="text-center"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                                className="text-6xl mb-4"
                            >
                                ✨
                            </motion.div>
                            <h2 className="text-2xl font-bold mb-2">Bem-vindo!</h2>
                            <p className="text-gray-200">Login realizado com sucesso</p>
                        </motion.div>
                    </motion.div>
                ) : null}
            </AnimatePresence>

            <section className="w-full max-w-[400px] flex flex-col items-center 
                bg-white/10 backdrop-blur-sm rounded-2xl p-8 gap-6 
                shadow-lg border border-white/20 relative">

                {/* Botão Voltar */}
                <button
                    onClick={() => navigate('/')}
                    className="absolute left-4 top-4 text-gray-400 hover:text-white flex items-center gap-1 
                        transition-colors text-sm group"
                >
                    <ArrowBack className="text-base group-hover:-translate-x-1 transition-transform" />
                    <span>Voltar</span>
                </button>

                <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-[#26d67e] 
                        flex items-center justify-center mb-2">
                        <Lock className="text-3xl" />
                    </div>
                    <span className="text-sm text-gray-300 uppercase tracking-wider">
                    Acesse seus contratos aqui
                    </span>
                    <h1 className="text-2xl font-bold">
                        Bem vindo!
                    </h1>
                </div>

                <div className="w-full flex flex-col gap-4">
                    {/* Mensagem de erro */}
                    {error && (
                        <div className="w-full p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-100 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <input
                        onChange={(e) => setLoginEmail(e.target.value)}
                        type="email"
                        placeholder="E-mail"
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10
                            focus:border-[#26d67e] outline-none transition-all
                            placeholder:text-gray-400"
                    />
                    <input
                        onChange={(e) => setLoginPassword(e.target.value)}
                        type="password"
                        placeholder="Senha"
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10
                            focus:border-[#26d67e] outline-none transition-all
                            placeholder:text-gray-400"
                    />
                </div>

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full bg-[#1a1a1a] hover:bg-[#26d67e] text-white 
                        py-3 rounded-lg font-semibold transition-all
                        hover:shadow-lg hover:shadow-[#26d67e]/20"
                >
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>

            </section>
        </div>
    );
}

export default ClientLogin;