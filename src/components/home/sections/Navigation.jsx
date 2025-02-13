import { useState } from 'react';
import { Menu, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import triunfoMiniLogo from '../../../medias/logos/triunfoMiniLogo.png';

function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="w-full flex flex-col bg-[#ffffff] relative z-20 text-white">
            {/* Barra principal */}
            <div className="w-full flex justify-between items-center h-[100px] px-4 md:px-8 shadow-lg shadow-[#1e1e1e17]">
                <div className="flex items-center">
                    <img 
                        src={triunfoMiniLogo} 
                        alt="Triunfo Logo" 
                        className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] object-contain rounded-full"
                    />
                </div>

                {/* Menu desktop */}
                <div className="hidden md:flex gap-8 text-[#133785] justify-center items-center">
                    <a href="#home" className="hover:text-[#5c90ff] transition-colors">Início</a>
                    <a href="#sobre" className="hover:text-[#5c90ff] transition-colors">Sobre</a>
                    <a href="#servicos" className="hover:text-[#5c90ff] transition-colors">Serviços</a>
                    <a href="#contato" className="hover:text-[#5c90ff] transition-colors">Contato</a>
                    <button onClick={() => navigate('/dashboard-client')} 
                    className="text-[#ffffff] bg-[#1dac69] rounded-full p-2
                    transition-colors">sou cliente</button>
                    <button onClick={() => navigate('/plataforma')} className="text-[#ffffff] bg-[#5c90ff] rounded-full p-2
                    transition-colors">Plataforma</button>
                </div>

                {/* Botão do menu mobile */}
                <button
                    className="md:hidden text-[#1e1e1e] p-2 hover:bg-[#ffd2f1] rounded-full transition-colors"
                    onClick={toggleMenu}
                >
                    {isMenuOpen ? (
                        <Close className="h-8 w-8" />
                    ) : (
                        <Menu className="h-8 w-8" />
                    )}
                </button>
            </div>

            {/* Menu mobile */}
            <div
                className={`absolute top-[100px] left-0 w-full bg-white shadow-lg md:hidden
                transition-all duration-300 ease-in-out overflow-hidden
                ${isMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="flex flex-col p-4 gap-4">
                    <a
                        href="#home"
                        className="text-[#1e1e1e] hover:text-[#fe96d4] transition-colors py-3 px-4 rounded-full hover:bg-[#fff4fa]"
                        onClick={toggleMenu}
                    >
                        Início
                    </a>
                    <a
                        href="#sobre"
                        className="text-[#1e1e1e] hover:text-[#fe96d4] transition-colors py-3 px-4 rounded-full hover:bg-[#fff4fa]"
                        onClick={toggleMenu}
                    >
                        Sobre
                    </a>
                    <a
                        href="#servicos"
                        className="text-[#1e1e1e] hover:text-[#fe96d4] transition-colors py-3 px-4 rounded-full hover:bg-[#fff4fa]"
                        onClick={toggleMenu}
                    >
                        Serviços
                    </a>
                    <a
                        href="#contato"
                        className="text-[#1e1e1e] hover:text-[#fe96d4] transition-colors py-3 px-4 rounded-full hover:bg-[#fff4fa]"
                        onClick={toggleMenu}
                    >
                        Contato
                    </a>
                </div>
            </div>
        </nav>
    );
}

export default Navigation; 