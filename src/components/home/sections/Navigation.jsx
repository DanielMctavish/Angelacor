import { useState, useEffect } from 'react';
import { Menu, Close, KeyboardArrowDown, Help, AccountCircle, RequestQuote, Work } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import triunfoMiniLogo from '../../../medias/logos/triunfoMiniLogo.png';

function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Se rolou mais de 70px, compara com o último scroll
            if (currentScrollY > 70) {
                setIsVisible(currentScrollY < lastScrollY);
            } else {
                setIsVisible(true);
            }
            
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    useEffect(() => {
        // Fechar dropdown quando clicar fora
        const handleClickOutside = () => {
            setActiveDropdown(null);
        };

        document.addEventListener('click', handleClickOutside);
        
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleDropdown = (dropdown, e) => {
        e.stopPropagation(); // Evitar que o clique se propague
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

    const navigateTo = (route) => {
        setIsMenuOpen(false);
        setActiveDropdown(null);
        navigate(route);
    };

    // Configuração dos itens de menu
    const menuItems = [
        { 
            id: 'help', 
            title: 'Preciso de ajuda', 
            icon: <Help className="text-[#133785] mr-2" />,
            route: '/ajuda'
        },
        { 
            id: 'createAccount', 
            title: 'Como criar conta?', 
            icon: <AccountCircle className="text-[#133785] mr-2" />,
            route: '/como-criar-conta'
        },
        { 
            id: 'budget', 
            title: 'Como solicitar um orçamento?', 
            icon: <RequestQuote className="text-[#133785] mr-2" />,
            route: '/solicitar-orcamento'
        },
        { 
            id: 'workWithUs', 
            title: 'Trabalhe conosco', 
            icon: <Work className="text-[#133785] mr-2" />,
            route: '/trabalhe-conosco'
        }
    ];

    return (
        <nav className={`w-full fixed top-0 z-50 transition-transform duration-300 
            ${!isVisible ? '-translate-y-full' : 'translate-y-0'}`}>
            {/* Barra de navegação principal */}
            <div className="w-full bg-white/90 backdrop-blur-md shadow-lg">
                <div className="w-full max-w-[1200px] mx-auto flex justify-between items-center h-16 sm:h-20 px-4">
                    {/* Logo */}
                    <div className="flex items-center cursor-pointer" onClick={() => navigateTo('/')}>
                        <img 
                            src={triunfoMiniLogo} 
                            alt="Triunfo Logo" 
                            className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-full 
                                transition-transform duration-300 hover:scale-110"
                        />
                        <span className="ml-2 font-bold text-[#133785] text-lg md:text-xl hidden sm:block">Triunfo</span>
                    </div>

                    {/* Menu desktop */}
                    <div className="hidden md:flex items-center gap-6">
                        {/* Menu dropdown */}
                        <div 
                            className="relative group"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button 
                                className="flex items-center gap-1 text-[#133785] font-medium py-2 px-3 rounded-lg hover:bg-[#133785]/5 transition-colors"
                                onClick={(e) => toggleDropdown('main', e)}
                            >
                                Menu
                                <KeyboardArrowDown 
                                    className={`transform transition-transform ${activeDropdown === 'main' ? 'rotate-180' : ''}`} 
                                />
                            </button>
                            
                            {/* Dropdown content */}
                            {activeDropdown === 'main' && (
                                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                                    {menuItems.map((item) => (
                                        <button
                                            key={item.id}
                                            className="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50"
                                            onClick={() => navigateTo(item.route)}
                                        >
                                            {item.icon}
                                            <span>{item.title}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Botões de ação */}
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => navigateTo('/dashboard-client')}
                                className="text-white bg-gradient-to-r from-[#1dac69] to-[#15884f] hover:opacity-90 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg"
                            >
                                Sou Cliente
                            </button>
                            <button 
                                onClick={() => navigateTo('/login')}
                                className="text-white bg-gradient-to-r from-[#fb9445] to-[#e67f00] hover:opacity-90 py-2 px-5 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg"
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
                className={`fixed inset-x-0 bg-white shadow-lg md:hidden
                transition-all duration-300 ease-in-out overflow-hidden
                ${isMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="max-w-7xl mx-auto py-4 px-4 space-y-1">
                    {/* Itens do menu */}
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            className="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg"
                            onClick={() => navigateTo(item.route)}
                        >
                            {item.icon}
                            <span>{item.title}</span>
                        </button>
                    ))}

                    {/* Divisor */}
                    <div className="border-b border-gray-100 my-4"></div>

                    {/* Botões de ação mobile */}
                    <div className="flex flex-col gap-3 px-4">
                        <button 
                            onClick={() => navigateTo('/dashboard-client')}
                            className="w-full text-white bg-gradient-to-r from-[#1dac69] to-[#15884f] hover:opacity-90 py-3 px-4 rounded-lg font-medium transition-all duration-300"
                        >
                            Sou Cliente
                        </button>
                        <button 
                            onClick={() => navigateTo('/login')}
                            className="w-full text-white bg-gradient-to-r from-[#fb9445] to-[#e67f00] hover:opacity-90 py-3 px-4 rounded-lg font-medium transition-all duration-300"
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