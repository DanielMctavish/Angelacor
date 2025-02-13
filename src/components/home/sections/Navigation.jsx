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
        <nav className="w-full fixed top-0 z-50">
            {/* Barra de navegação principal */}
            <div className="w-full bg-white/80 backdrop-blur-md shadow-lg">
                <div className="max-w-7xl mx-auto flex justify-between items-center h-20 px-4 md:px-8">
                    {/* Logo */}
                    <div className="flex items-center">
                        <img 
                            src={triunfoMiniLogo} 
                            alt="Triunfo Logo" 
                            className="w-12 h-12 md:w-14 md:h-14 object-contain rounded-full 
                                transition-transform duration-300 hover:scale-105"
                        />
                    </div>

                    {/* Menu desktop */}
                    <div className="hidden md:flex items-center gap-8">
                  

                        {/* Botões de ação */}
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => navigate('/dashboard-client')}
                                className="btn-client text-[#fb9445]"
                            >
                                Sou Cliente
                            </button>
                            <button 
                                onClick={() => navigate('/plataforma')}
                                className="btn-platform text-[#133785]"
                            >
                                Plataforma
                            </button>
                        </div>
                    </div>

                    {/* Botão do menu mobile */}
                    <button
                        className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
                        onClick={toggleMenu}
                    >
                        {isMenuOpen ? (
                            <Close className="h-6 w-6 text-[#133785]" />
                        ) : (
                            <Menu className="h-6 w-6 text-[#133785]" />
                        )}
                    </button>
                </div>
            </div>

            {/* Menu mobile */}
            <div
                className={`fixed inset-x-0 bg-white/95 backdrop-blur-md shadow-lg md:hidden
                transition-all duration-300 ease-in-out
                ${isMenuOpen ? 'top-20 opacity-100' : '-top-full opacity-0'}`}
            >
                <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
                    {/* Links de navegação mobile */}
                    <div className="flex flex-col gap-4">
                        <a href="#home" className="mobile-nav-link" onClick={toggleMenu}>Início</a>
                        <a href="#sobre" className="mobile-nav-link" onClick={toggleMenu}>Sobre</a>
                        <a href="#servicos" className="mobile-nav-link" onClick={toggleMenu}>Serviços</a>
                        <a href="#contato" className="mobile-nav-link" onClick={toggleMenu}>Contato</a>
                    </div>

                    {/* Botões de ação mobile */}
                    <div className="flex flex-col gap-3 pt-4">
                        <button 
                            onClick={() => navigate('/dashboard-client')}
                            className="btn-client-mobile"
                        >
                            Sou Cliente
                        </button>
                        <button 
                            onClick={() => navigate('/plataforma')}
                            className="btn-platform-mobile"
                        >
                            Plataforma
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

// Adicione estes estilos ao seu arquivo CSS global ou use uma tag style
const styles = `
    .nav-link {
        position: relative;
        padding: 0.5rem;
        transition: color 0.3s;
    }

    .nav-link::after {
        content: '';
        position: absolute;
        width: 0;
        height: 2px;
        bottom: 0;
        left: 50%;
        background-color: #5c90ff;
        transition: all 0.3s;
    }

    .nav-link:hover {
        color: #5c90ff;
    }

    .nav-link:hover::after {
        width: 100%;
        left: 0;
    }

    .btn-client {
        padding: 0.5rem 1.25rem;
        background-color: #1dac69;
        color: white;
        border-radius: 9999px;
        font-medium;
        transition: all 0.3s;
        hover:bg-[#15884f];
        hover:shadow-lg;
    }

    .btn-platform {
        padding: 0.5rem 1.25rem;
        background-color: #5c90ff;
        color: white;
        border-radius: 9999px;
        font-medium;
        transition: all 0.3s;
        hover:bg-[#4070dd];
        hover:shadow-lg;
    }

    .mobile-nav-link {
        display: block;
        padding: 0.75rem 1rem;
        color: #133785;
        font-medium;
        border-radius: 0.5rem;
        transition: all 0.3s;
        hover:bg-[#f8fafc];
        hover:text-[#5c90ff];
    }

    .btn-client-mobile,
    .btn-platform-mobile {
        width: 100%;
        padding: 0.75rem;
        text-align: center;
        border-radius: 0.5rem;
        font-medium;
        transition: all 0.3s;
    }

    .btn-client-mobile {
        background-color: #1dac69;
        color: white;
        hover:bg-[#15884f];
    }

    .btn-platform-mobile {
        background-color: #5c90ff;
        color: white;
        hover:bg-[#4070dd];
    }
`;

export default Navigation; 