import { motion } from 'framer-motion';
import { AdminPanelSettings, Groups, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import logoAngelCor from "../../medias/logos/angelcor_logo.png";

function LoginSelector() {
    const navigate = useNavigate();

    return (
        <div className="w-full h-screen bg-gradient-to-br from-[#133785] via-[#0a1c42] to-[#1a1a1a] 
            flex items-center justify-center p-4">
            
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 text-white/70 hover:text-white 
                    flex items-center gap-2 transition-colors group"
            >
                <ArrowBack className="group-hover:-translate-x-1 transition-transform" />
                <span>Voltar para o início</span>
            </motion.button>
            
            <div className="w-full max-w-[800px] flex flex-col items-center gap-8">
                <motion.img 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    src={logoAngelCor}
                    alt="AngelCor Logo"
                    className="w-[200px] h-auto"
                />

                <motion.h1 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl md:text-3xl text-white font-bold text-center"
                >
                    Selecione sua área de acesso
                </motion.h1>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        onClick={() => navigate('/admin-login')}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 cursor-pointer
                            border border-white/20 hover:border-[#e67f00] transition-all
                            group flex flex-col items-center gap-4"
                    >
                        <div className="w-16 h-16 rounded-full bg-[#1f1f1f] group-hover:bg-[#e67f00] 
                            transition-colors flex items-center justify-center">
                            <AdminPanelSettings className="text-3xl text-white" />
                        </div>
                        <h2 className="text-xl text-white font-semibold">Administrador</h2>
                        <p className="text-gray-400 text-center text-sm">
                            Acesso ao painel administrativo e gerenciamento do sistema
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        onClick={() => navigate('/colaborator-login')}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 cursor-pointer
                            border border-white/20 hover:border-[#e67f00] transition-all
                            group flex flex-col items-center gap-4"
                    >
                        <div className="w-16 h-16 rounded-full bg-[#1f1f1f] group-hover:bg-[#e67f00] 
                            transition-colors flex items-center justify-center">
                            <Groups className="text-3xl text-white" />
                        </div>
                        <h2 className="text-xl text-white font-semibold">Colaborador</h2>
                        <p className="text-gray-400 text-center text-sm">
                            Portal do colaborador para acesso às funcionalidades específicas
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default LoginSelector; 