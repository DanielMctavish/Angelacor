import { Add, Search } from '@mui/icons-material';
import AdminNavbar from './Navigation/AdminNavbar';

function AdminDashboard() {
    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-[#133785] to-[#0a1c42] text-white">
            <AdminNavbar />

            {/* Main Content */}
            <main className="w-full max-w-[1200px] mx-auto p-4 space-y-6">
                {/* Actions Bar */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <button className="flex items-center gap-2 bg-[#1f1f1f] hover:bg-[#e67f00] 
                        px-4 py-2 rounded-lg transition-all">
                        <Add />
                        Criar Novo Cliente
                    </button>

                    <div className="w-full md:w-auto flex items-center gap-2 bg-white/5 
                        border border-white/10 rounded-lg px-3 py-2">
                        <Search className="text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Buscar cliente..." 
                            className="bg-transparent outline-none text-sm w-full md:w-[300px]"
                        />
                    </div>
                </div>

                {/* Dashboard Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <h3 className="text-lg font-semibold mb-2">Total de Clientes</h3>
                        <p className="text-3xl font-bold text-[#e67f00]">0</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <h3 className="text-lg font-semibold mb-2">Clientes Com Propostas</h3>
                        <p className="text-3xl font-bold text-green-500">0</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <h3 className="text-lg font-semibold mb-2">Clientes Sem Propostas</h3>
                        <p className="text-3xl font-bold text-red-500">0</p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                    <div className="p-4 border-b border-white/10">
                        <h2 className="text-xl font-semibold">Lista de Clientes</h2>
                    </div>
                    
                    <div className="p-4">
                        <table className="w-full">
                            <thead className="text-left text-gray-400 text-sm">
                                <tr>
                                    <th className="pb-4">Nome</th>
                                    <th className="pb-4">Email</th>
                                    <th className="pb-4">Status</th>
                                    <th className="pb-4">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan="4" className="text-center py-8 text-gray-400">
                                        Nenhum cliente cadastrado
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default AdminDashboard;