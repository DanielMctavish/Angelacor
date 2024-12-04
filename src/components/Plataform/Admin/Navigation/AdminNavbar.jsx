import { Logout, Person } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminNavbar({ logo, area }) {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const adminDataString = localStorage.getItem('adminToken');

            // Verifica se existe algum dado
            if (!adminDataString) {
                handleLogout();
                return;
            }

            // Tenta fazer o parse e valida a estrutura dos dados
            const adminData = JSON.parse(adminDataString);
            if (adminData && typeof adminData === 'object' && adminData.user) {
                setUserData(adminData.user);
            } else {
                handleLogout();
            }
        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
            handleLogout();
        }
    }, []);

    const handleLogout = () => {
        try {
            localStorage.removeItem('adminToken');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        } finally {
            navigate('/login');
        }
    };

    // Se não houver dados do usuário, não renderiza o navbar
    if (!userData) {
        return null;
    }

    return (
        <nav className="w-full bg-white/10 backdrop-blur-sm border-b border-white/10 px-4 py-3">
            <div className="w-full max-w-[1200px] mx-auto flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center">
                <div className='flex justify-center md:justify-start items-center gap-2 w-full md:w-auto'>
                    <img src={logo} alt="Logo Angelacor" className="w-[50px] md:w-[60px] object-cover" />
                    <span className="text-[16px] md:text-[18px] font-semibold">{area}</span>
                </div>

                <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 
                    bg-[#1f1f1f]/50 md:bg-transparent p-3 md:p-0 rounded-lg">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#1f1f1f] 
                            flex items-center justify-center">
                            <Person />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold">
                                {userData?.name || 'Admin'}
                            </span>
                            <span className="text-xs text-gray-300 hidden md:block">
                                {userData?.email || ''}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="p-2 hover:bg-white/10 rounded-lg transition-all"
                        title="Sair"
                    >
                        <Logout />
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default AdminNavbar; 