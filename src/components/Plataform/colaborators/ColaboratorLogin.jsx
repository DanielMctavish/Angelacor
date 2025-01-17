import { Person, Lock, Login as LoginIcon, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import logoAngelCor from "../../../../public/angelcor_logo.png";

function ColaboratorLogin() {
    const navigate = useNavigate();

    return (
        <div className="w-[100%] h-[100vh] bg-gradient-to-br from-[#133785] via-[#0a1c42] to-[#1a1a1a] flex items-center justify-center p-4 overflow-hidden">
            {/* Círculos decorativos */}
            <div className="fixed top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl" />
            
            <div className="fixed bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 blur-3xl" />

            {/* Container do Login */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 w-full max-w-[400px] border border-white/20 relative z-10">
                {/* Botão Voltar */}
                <button
                    onClick={() => navigate('/login')}
                    className="absolute left-4 top-4 text-gray-400 hover:text-white flex items-center gap-1 
                        transition-colors text-sm group"
                >
                    <ArrowBack className="text-base group-hover:-translate-x-1 transition-transform" />
                    <span>Voltar</span>
                </button>

                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <img 
                        src={logoAngelCor} 
                        alt="AngelCor Logo" 
                        className="w-[200px] h-auto"
                    />
                </div>

                <h2 className="text-2xl font-bold text-white text-center mb-6">
                    Portal do Colaborador
                </h2>

                {/* Formulário */}
                <form className="space-y-4">
                    <div className="relative">
                        <Person className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Seu e-mail"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-10 py-3 text-white placeholder-gray-400 focus:border-[#e67f00] transition-colors"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="password"
                            placeholder="Sua senha"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-10 py-3 text-white placeholder-gray-400 focus:border-[#e67f00] transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#e67f00] to-[#ff8c00] hover:from-[#ff8c00] hover:to-[#e67f00] text-white py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <span>Entrar</span>
                        <LoginIcon />
                    </button>

                    <div className="text-center">
                        <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                            Esqueceu sua senha?
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ColaboratorLogin;