import { Logout, Person } from '@mui/icons-material';

function AdminNavbar() {
    return (
        <nav className="w-full bg-white/10 backdrop-blur-sm border-b border-white/10 px-4 py-3">
            <div className="w-full max-w-[1200px] mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">Painel Angelacor</h1>
                
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#1f1f1f] 
                            flex items-center justify-center">
                            <Person />
                        </div>
                        <span className="text-sm text-gray-300">Admin</span>
                    </div>
                    
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                        <Logout />
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default AdminNavbar; 