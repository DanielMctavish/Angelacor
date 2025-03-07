import { Person, Visibility, Edit, Block, Delete, Description } from '@mui/icons-material';
import { motion } from 'framer-motion';

function ClientsListAdmin({ clients, onOpenDetails, onEdit, onBlock, onDelete }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-white/10">
                        <th className="py-3 px-4">Cliente</th>
                        <th className="py-3 px-4">Contato</th>
                        <th className="py-3 px-4">Responsável</th>
                        <th className="py-3 px-4">Propostas</th>
                        <th className="py-3 px-4">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client) => (
                        <tr key={client.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                            {/* Cliente */}
                            <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                    {client.url_profile_cover ? (
                                        <img 
                                            src={client.url_profile_cover} 
                                            alt={client.name} 
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                                            <Person className="text-gray-400" />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-white font-medium">{client.name}</h3>
                                        <p className="text-gray-400 text-sm">{client.cpf}</p>
                                    </div>
                                </div>
                            </td>

                            {/* Contato */}
                            <td className="py-3 px-4">
                                <div className="space-y-1">
                                    <p className="text-[#a9f1ff]">{client.email}</p>
                                    <p className="text-gray-400">{client.phone}</p>
                                </div>
                            </td>

                            {/* Responsável */}
                            <td className="py-3 px-4">
                                {client.colaborator ? (
                                    <div className="flex items-center gap-2">
                                        {client.colaborator.url_profile_cover ? (
                                            <img
                                                src={client.colaborator.url_profile_cover}
                                                alt={client.colaborator.name}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                                                <Person className="text-gray-400 text-sm" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-white text-sm">{client.colaborator.name}</p>
                                            <p className="text-gray-400 text-xs">{client.colaborator.function}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-gray-400">Não atribuído</span>
                                )}
                            </td>

                            {/* Propostas */}
                            <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                    <Description className="text-[#e67f00]" />
                                    <span className="text-white">
                                        {client.proposals?.length || 0} {client.proposals?.length === 1 ? 'proposta' : 'propostas'}
                                    </span>
                                </div>
                            </td>

                            {/* Ações */}
                            <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        title="Ver detalhes"
                                        onClick={() => onOpenDetails(client)}
                                        className="p-2 text-gray-400 hover:text-white hover:bg-[#133785] 
                                            rounded-lg transition-all"
                                    >
                                        <Visibility fontSize="small" />
                                    </button>

                                    <button
                                        title="Editar cliente"
                                        onClick={() => onEdit(client)}
                                        className="p-2 text-gray-400 hover:text-white hover:bg-[#e67f00] 
                                            rounded-lg transition-all"
                                    >
                                        <Edit fontSize="small" />
                                    </button>

                                    <button
                                        title="Bloquear cliente"
                                        onClick={() => onBlock(client)}
                                        className="p-2 text-gray-400 hover:text-white hover:bg-yellow-600 
                                            rounded-lg transition-all"
                                    >
                                        <Block fontSize="small" />
                                    </button>

                                    <button
                                        title="Excluir cliente"
                                        onClick={() => onDelete(client)}
                                        className="p-2 text-gray-400 hover:text-white hover:bg-red-600 
                                            rounded-lg transition-all"
                                    >
                                        <Delete fontSize="small" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ClientsListAdmin; 