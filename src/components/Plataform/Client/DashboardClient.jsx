import { Search } from "@mui/icons-material"
import ClientNavigation from "./components/ClientNavigation"


function DashboardClient() {


    return (
        <div className="w-full h-[100vh] flex flex-col justify-start items-center 
        bg-gradient-to-b from-[#133785] to-[#0a1c42] gap-3">

            <ClientNavigation />

            <section className="flex flex-col h-[88vh] w-full bg-[#ffffff18] border-[1px] border-[#ffffff2f] p-3 
            max-w-[1200px] justify-start items-center rounded-lg gap-3">

                <span className="font-bold text-white w-full text-left text-[22px]">Suas propostas</span>
                <div className="w-full flex items-center gap-2 bg-white/5 
                        border border-white/10 rounded-lg px-3 py-3 md:py-2">
                    <Search className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar propostas..."
                        className="bg-transparent outline-none text-sm w-full text-white"
                    />
                </div>

                {/* .............................. Sessão Principal .................................*/}
                <div className="overflow-x-auto w-full">
                        <table className="w-full" style={{ minWidth: '800px' }}>
                            <thead className="text-left text-gray-400 text-sm bg-[#1f1f1f2d]">
                                <tr>
                                    <th className="p-4 font-medium">Tipo</th>
                                    <th className="p-4 font-medium">Loja</th>
                                    <th className="p-4 font-medium">Convênio</th>
                                    <th className="p-4 font-medium">Banco</th>
                                    <th className="p-4 font-medium">Criada em</th>
                                </tr>
                            </thead>
                            {/* <tbody>
                                {clients.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-8 text-gray-400">
                                            Nenhum cliente cadastrado
                                        </td>
                                    </tr>
                                ) : (
                                    clients.map(client => (
                                        <tr key={client.id} className="border-t border-white/10">
                                            <td className="p-4">{client.name}</td>
                                            <td className="p-4">{client.email}</td>
                                            <td className="p-4">
                                                {client.proposals && client.proposals.length > 0 ? (
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-green-500 flex items-center gap-1">
                                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                            Com proposta
                                                        </span>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedClient(client);
                                                                setIsListProposalsModalOpen(true);
                                                            }}
                                                            className="text-xs text-gray-400 hover:text-white transition-all text-left"
                                                        >
                                                            {client.proposals.length} {client.proposals.length === 1 ? 'proposta' : 'propostas'}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1">
                                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                        <span className="text-red-500">Sem proposta</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        title="Ver detalhes"
                                                        onClick={() => handleOpenDetails(client)}
                                                        className="p-2 text-gray-400 hover:text-white hover:bg-[#133785] 
                                                            rounded-lg transition-all"
                                                    >
                                                        <Visibility fontSize="small" />
                                                    </button>

                                                    <button
                                                        title="Criar proposta"
                                                        onClick={() => {
                                                            setSelectedClient(client);
                                                            setIsCreateProposalModalOpen(true);
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-white hover:bg-[#e67f00] 
                                                            rounded-lg transition-all"
                                                    >
                                                        <Assignment fontSize="small" />
                                                    </button>

                                                    <button
                                                        title="Excluir cliente"
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
                            </tbody> */}
                        </table>
                    </div>

            </section>

        </div>
    )

}


export default DashboardClient