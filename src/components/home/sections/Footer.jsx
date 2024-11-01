import { WhatsApp, Instagram, Facebook, AttachMoney } from '@mui/icons-material';

function Footer() {
    return (
        <footer className="w-full py-8 md:py-16 bg-[#133785] text-white">
            <div className="w-full max-w-[1200px] mx-auto px-4 flex flex-col items-center">
                <h1 className="text-2xl md:text-3xl font-bold text-center">Triunfo Home</h1>
                <span className="text-center max-w-[600px] text-sm md:text-base mt-4">
                    A Triunfo respeita a sua privacidade e a sua segurança. 
                    Para saber mais, entre em contato conosco.
                </span>
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-8 items-center">
                    <button className="w-full md:w-auto border-2 border-white px-4 md:px-6 py-2 rounded-full 
                    hover:bg-white hover:text-[#133785] transition-colors flex items-center justify-center gap-2">
                        <WhatsApp /> Fale Conosco
                    </button>
                    <button className="w-full md:w-auto bg-white text-[#133785] px-4 md:px-6 py-2 rounded-full 
                    hover:bg-transparent hover:text-white hover:border-2 hover:border-white transition-colors 
                    flex items-center justify-center gap-2">
                        <AttachMoney /> Simular Agora
                    </button>
                </div>
                <div className="flex gap-6 md:gap-8 mt-8">
                    <a href="#" className="hover:opacity-80 text-white">
                        <Instagram sx={{ fontSize: 30 }} />
                    </a>
                    <a href="#" className="hover:opacity-80 text-white">
                        <Facebook sx={{ fontSize: 30 }} />
                    </a>
                    <a href="#" className="hover:opacity-80 text-white">
                        <WhatsApp sx={{ fontSize: 30 }} />
                    </a>
                </div>
                <div className="mt-8 text-center text-sm">
                    <p>© 2024 Triunfo Home. Todos os direitos reservados.</p>
                    <p className="mt-2">
                        Av. Exemplo, 1234 - São Paulo, SP • contato@triunfohome.com.br
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer; 