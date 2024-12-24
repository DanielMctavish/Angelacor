import { Visibility, Delete, Groups } from '@mui/icons-material';

function ColaboratorsList({ colaborators }) {
    return (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10">
                <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                    <Groups />
                    Lista de Colaboradores
                </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full" style={{ minWidth: '800px' }}>
                    <thead className="text-left text-gray-400 text-sm bg-[#1f1f1f2d]">
                        <tr>
                            <th className="p-4 font-medium">Nome</th>
                            <th className="p-4 font-medium">Email</th>
                            <th className="p-4 font-medium">Cargo</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {colaborators.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-8 text-gray-400">
                                    Nenhum colaborador cadastrado
                                </td>
                            </tr>
                        ) : (
                            colaborators.map(colaborator => (
                                <tr key={colaborator.id} className="border-t border-white/10">
                                    <td className="p-4">{colaborator.name}</td>
                                    <td className="p-4">{colaborator.email}</td>
                                    <td className="p-4">{colaborator.role}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs 
                                            ${colaborator.status === 'Ativo' 
                                                ? 'bg-green-500/20 text-green-500' 
                                                : 'bg-red-500/20 text-red-500'
                                            }`}>
                                            {colaborator.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                title="Ver detalhes"
                                                className="p-2 text-gray-400 hover:text-white hover:bg-[#133785] 
                                                    rounded-lg transition-all"
                                            >
                                                <Visibility fontSize="small" />
                                            </button>

                                            <button
                                                title="Excluir colaborador"
                                                className="p-2 text-gray-400 hover:text-white hover:bg-red-600 
                                                    rounded-lg transition-all"
                                            >
                                                <Delete fontSize="small" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ColaboratorsList; 