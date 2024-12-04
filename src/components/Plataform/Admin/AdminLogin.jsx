import axios from 'axios';
import { Lock } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async () => {
        setError('');
        
        if (!loginEmail || !loginPassword) {
            setError('Por favor, preencha todos os campos');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/admin/login`, {
                email: loginEmail,
                password: loginPassword
            });

            if (response.data) {
                localStorage.setItem("adminToken", JSON.stringify(response.data));
                navigate("/plataforma");
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
            flex flex-col justify-center items-center px-4">

            <section className="w-full max-w-[400px] flex flex-col items-center 
                bg-white/10 backdrop-blur-sm rounded-2xl p-8 gap-6 
                shadow-lg border border-white/20">

                <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-[#e67f00] 
                        flex items-center justify-center mb-2">
                        <Lock className="text-3xl" />
                    </div>
                    <span className="text-sm text-gray-300 uppercase tracking-wider">
                        Área restrita
                    </span>
                    <h1 className="text-2xl font-bold">
                        Painel Administrativo
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
                            focus:border-[#e67f00] outline-none transition-all
                            placeholder:text-gray-400"
                    />
                    <input
                        onChange={(e) => setLoginPassword(e.target.value)}
                        type="password"
                        placeholder="Senha"
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10
                            focus:border-[#e67f00] outline-none transition-all
                            placeholder:text-gray-400"
                    />
                </div>

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full bg-[#1a1a1a] hover:bg-[#ff8c00] text-white 
                        py-3 rounded-lg font-semibold transition-all
                        hover:shadow-lg hover:shadow-[#e67f00]/20"
                >
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>

                <span className="text-sm text-gray-400 text-center">
                    Este é um ambiente seguro e restrito apenas para administradores autorizados.
                </span>
            </section>
        </div>
    );
}

export default AdminLogin;