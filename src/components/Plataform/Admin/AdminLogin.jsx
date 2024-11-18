import { Lock } from '@mui/icons-material';

function AdminLogin() {
    return (
        <div className="w-full h-screen bg-gradient-to-b from-[#133785] to-[#0a1c42] text-white 
            flex flex-col justify-center items-center px-4">

            <section className="w-full max-w-[400px] flex flex-col items-center 
                bg-white/10 backdrop-blur-sm rounded-2xl p-8 gap-6 
                shadow-lg border border-white/20">
                
                <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-[#1f1f1f] 
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
                    <input 
                        type="email" 
                        placeholder="E-mail" 
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10
                            focus:border-[#e67f00] outline-none transition-all
                            placeholder:text-gray-400"
                    />
                    <input 
                        type="password" 
                        placeholder="Senha" 
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10
                            focus:border-[#e67f00] outline-none transition-all
                            placeholder:text-gray-400"
                    />
                </div>

                <button className="w-full bg-[#1a1a1a] hover:bg-[#ff8c00] text-white 
                    py-3 rounded-lg font-semibold transition-all
                    hover:shadow-lg hover:shadow-[#e67f00]/20">
                    Entrar
                </button>

                <span className="text-sm text-gray-400 text-center">
                    Este é um ambiente seguro e restrito apenas para administradores autorizados.
                </span>
            </section>

        </div>
    )
}

export default AdminLogin;