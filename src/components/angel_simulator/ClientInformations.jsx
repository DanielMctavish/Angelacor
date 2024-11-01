import {
    Person as PersonIcon,
    Email as EmailIcon,
    Home as HomeIcon,
    Phone as PhoneIcon,
    CalendarToday as CalendarTodayIcon,
    AccountBalance as AccountBalanceIcon,
    Work as WorkIcon,
    Flag as FlagIcon,
    Lock as LockIcon,
    CreditCard as CreditCardIcon
  } from "@mui/icons-material";

function ClientInformations({ client }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {/* Informações Pessoais */}
            <div className="col-span-1 md:col-span-2 bg-gray-50 p-3 rounded-lg">
                <h3 className="text-lg font-semibold text-[#e67f00] mb-3">Informações Pessoais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center bg-white p-3 rounded-md shadow-sm">
                        <PersonIcon className="mr-2 text-[#e67f00]" />
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Nome</span>
                            <span className="font-medium">{client.name}</span>
                        </div>
                    </div>
                    <div className="flex items-center bg-white p-3 rounded-md shadow-sm">
                        <CreditCardIcon className="mr-2 text-[#e67f00]" />
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">CPF</span>
                            <span className="font-medium">{client.cpf}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Informações de Contato */}
            <div className="col-span-1 bg-gray-50 p-3 rounded-lg">
                <h3 className="text-lg font-semibold text-[#e67f00] mb-3">Contato</h3>
                <div className="space-y-2">
                    <div className="flex items-center bg-white p-3 rounded-md shadow-sm">
                        <EmailIcon className="mr-2 text-[#e67f00]" />
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Email</span>
                            <span className="font-medium">{client.email}</span>
                        </div>
                    </div>
                    <div className="flex items-center bg-white p-3 rounded-md shadow-sm">
                        <PhoneIcon className="mr-2 text-[#e67f00]" />
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Telefone</span>
                            <span className="font-medium">{client.phone}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Informações Bancárias */}
            <div className="col-span-1 bg-gray-50 p-3 rounded-lg">
                <h3 className="text-lg font-semibold text-[#e67f00] mb-3">Dados Bancários</h3>
                <div className="space-y-2">
                    <div className="flex items-center bg-white p-3 rounded-md shadow-sm">
                        <AccountBalanceIcon className="mr-2 text-[#e67f00]" />
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Banco</span>
                            <span className="font-medium">{client.bank}</span>
                        </div>
                    </div>
                    <div className="flex items-center bg-white p-3 rounded-md shadow-sm">
                        <AccountBalanceIcon className="mr-2 text-[#e67f00]" />
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Agência / Conta</span>
                            <span className="font-medium">{client.agency} / {client.accountNumber}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClientInformations;