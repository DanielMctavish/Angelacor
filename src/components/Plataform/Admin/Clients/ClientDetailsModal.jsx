import { Close, Person, Email, Phone, Home, Badge, AccountBalance } from '@mui/icons-material';

function ClientDetailsModal({ isOpen, onClose, client }) {
    if (!isOpen || !client) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-[#1a1a1a] rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto text-gray-100">
                <div className="sticky top-0 bg-[#133785] p-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Person className="text-2xl" />
                        Detalhes do Cliente
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded-full transition-all"
                    >
                        <Close className="text-white" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Dados Pessoais */}
                    <div className="space-y-4 bg-[#31313187] p-2 rounded-[6px]">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <Badge />
                            Dados Pessoais
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span className="text-sm text-gray-400">Nome</span>
                                <p className="text-white font-medium">{client.name}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm text-gray-400">CPF</span>
                                <p className="text-white font-medium">{client.cpf}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm text-gray-400">RG</span>
                                <p className="text-white font-medium">{client.rg}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm text-gray-400">Data de Expedição</span>
                                <p className="text-white font-medium">
                                    {new Date(client.expeditionDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm text-gray-400">Data de Nascimento</span>
                                <p className="text-white font-medium">
                                    {new Date(client.birthDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm text-gray-400">Sexo</span>
                                <p className="text-white font-medium">
                                    {client.sex === 'M' ? 'Masculino' : 'Feminino'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contato e Endereço */}
                    <div className="space-y-4 bg-[#31313187] p-2 rounded-[6px]">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <Home />
                            Contato e Endereço
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span className="text-sm text-gray-400">E-mail</span>
                                <p className="text-white font-medium">{client.email}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm text-gray-400">Telefone</span>
                                <p className="text-white font-medium">{client.phone}</p>
                            </div>
                            <div className="space-y-1 col-span-2">
                                <span className="text-sm text-gray-400">Endereço</span>
                                <p className="text-white font-medium">{client.address}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm text-gray-400">Naturalidade</span>
                                <p className="text-white font-medium">{client.naturalness}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm text-gray-400">Nacionalidade</span>
                                <p className="text-white font-medium">{client.nationality}</p>
                            </div>
                        </div>
                    </div>

                    {/* Dados Bancários e INSS */}
                    <div className="space-y-4 bg-[#31313187] p-2 rounded-[6px]">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <AccountBalance />
                            Dados Bancários e INSS
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span className="text-sm text-gray-400">Número da Conta</span>
                                <p className="text-white font-medium">{client.accountNumber}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm text-gray-400">Matrícula do Benefício</span>
                                <p className="text-white font-medium">{client.matriculaBeneficio}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm text-gray-400">Código da Espécie</span>
                                <p className="text-white font-medium">{client.especieCode}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm text-gray-400">Tipo de Cliente</span>
                                <p className="text-white font-medium">{client.clientType}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm text-gray-400">DDB</span>
                                <p className="text-white font-medium">
                                    {new Date(client.DDB).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm text-gray-400">Renda Mensal</span>
                                <p className="text-white font-medium">
                                    {new Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    }).format(client.financialIncome)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Filiação */}
                    <div className="space-y-4 bg-[#31313187] p-2 rounded-[6px]">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <Person />
                            Filiação
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span className="text-sm text-gray-400">Nome do Pai</span>
                                <p className="text-white font-medium">{client.fatherName}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm text-gray-400">Nome da Mãe</span>
                                <p className="text-white font-medium">{client.motherName}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClientDetailsModal; 