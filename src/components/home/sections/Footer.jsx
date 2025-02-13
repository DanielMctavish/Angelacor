import { WhatsApp, AttachMoney } from '@mui/icons-material';
import Privacy from './Privacy';

function Footer() {
    return (
        <footer className="w-full py-8 md:py-16 bg-[#133785] text-white">
            <div className="w-full max-w-[1200px] mx-auto px-4 flex flex-col items-center">
                <h1 className="text-2xl md:text-3xl font-bold text-center">TRIUNFO CORRESPONDENTE BANCÁRIO</h1>
                <span className="text-center max-w-[600px] text-sm md:text-base mt-4">
                    A Triunfo respeita a sua privacidade e a sua segurança. 
                    Para saber mais, entre em contato conosco.
                </span>
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-8 items-center">
                    <a 
                        href="https://wa.me/5541996266007" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full md:w-auto border-2 border-white px-4 md:px-6 py-2 rounded-full 
                        hover:bg-white hover:text-[#133785] transition-colors flex items-center justify-center gap-2"
                    >
                        <WhatsApp /> Fale Conosco
                    </a>
                    <button className="w-full md:w-auto bg-white text-[#133785] px-4 md:px-6 py-2 rounded-full 
                    hover:bg-transparent hover:text-white hover:border-2 hover:border-white transition-colors 
                    flex items-center justify-center gap-2">
                        <AttachMoney /> Simular Agora
                    </button>
                </div>
                <div className="mt-8 text-center text-sm space-y-2">
                    <p>© 2024 Triunfo Correspondente Bancário. Todos os direitos reservados.</p>
                    <p>CNPJ: 14.837.075/0001-36</p>
                    <p>Rua Antônio Alves Correia, 100 - Centro</p>
                    <p>
                        <a href="tel:+5541996266007" className="hover:text-[#e67f00] transition-colors">
                            (41) 99626-6007
                        </a>
                        {' • '}
                        <a href="mailto:operacional@triunfocorrespondente.com.br" className="hover:text-[#e67f00] transition-colors">
                            operacional@triunfocorrespondente.com.br
                        </a>
                    </p>
                    <div className="mt-4">
                        <Privacy />
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer; 