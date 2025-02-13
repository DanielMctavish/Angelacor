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
    CreditCard as CreditCardIcon,
    Badge,
    Public
  } from "@mui/icons-material";

function ClientInformations({ client }) {
    const formatDate = (dateString) => {
        if (!dateString) return 'Não informado';
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    return (
        <div className="bg-white/5 rounded-lg p-4 space-y-4">
            {/* Cabeçalho com Foto */}
            <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                    {client.url_profile_cover ? (
                        <img
                            src={client.url_profile_cover}
                            alt={client.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <PersonIcon className="text-gray-400 text-4xl" />
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800">{client.name}</h3>
                    <p className="text-gray-500">{client.clientType || 'Tipo não definido'}</p>
                </div>
            </div>

            {/* Grid de Informações */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Informações Pessoais */}
                <div className="space-y-2">
                    <h4 className="font-semibold text-gray-700">Informações Pessoais</h4>
                    <div className="space-y-1">
                        <p className="flex items-center gap-2 text-gray-600">
                            <Badge className="text-[#e67f00]" />
                            CPF: {client.cpf || 'Não informado'}
                        </p>
                        <p className="flex items-center gap-2 text-gray-600">
                            <Badge className="text-[#e67f00]" />
                            RG: {client.rg || 'Não informado'}
                        </p>
                        <p className="flex items-center gap-2 text-gray-600">
                            <CalendarTodayIcon className="text-[#e67f00]" />
                            Nascimento: {formatDate(client.birthDate)}
                        </p>
                        <p className="flex items-center gap-2 text-gray-600">
                            <PersonIcon className="text-[#e67f00]" />
                            Sexo: {client.sex || 'Não informado'}
                        </p>
                    </div>
                </div>

                {/* Contato */}
                <div className="space-y-2">
                    <h4 className="font-semibold text-gray-700">Contato</h4>
                    <div className="space-y-1">
                        <p className="flex items-center gap-2 text-gray-600">
                            <EmailIcon className="text-[#e67f00]" />
                            {client.email || 'Não informado'}
                        </p>
                        <p className="flex items-center gap-2 text-gray-600">
                            <PhoneIcon className="text-[#e67f00]" />
                            {client.phone || 'Não informado'}
                        </p>
                        <p className="flex items-center gap-2 text-gray-600">
                            <HomeIcon className="text-[#e67f00]" />
                            {client.address || 'Não informado'}
                        </p>
                    </div>
                </div>

                {/* Informações Adicionais */}
                <div className="space-y-2">
                    <h4 className="font-semibold text-gray-700">Informações Adicionais</h4>
                    <div className="space-y-1">
                        <p className="flex items-center gap-2 text-gray-600">
                            <Public className="text-[#e67f00]" />
                            Nacionalidade: {client.nationality || 'Não informado'}
                        </p>
                        <p className="flex items-center gap-2 text-gray-600">
                            <HomeIcon className="text-[#e67f00]" />
                            Naturalidade: {client.naturalness || 'Não informado'}
                        </p>
                        <p className="flex items-center gap-2 text-gray-600">
                            <PersonIcon className="text-[#e67f00]" />
                            Pai: {client.fatherName || 'Não informado'}
                        </p>
                        <p className="flex items-center gap-2 text-gray-600">
                            <PersonIcon className="text-[#e67f00]" />
                            Mãe: {client.motherName || 'Não informado'}
                        </p>
                    </div>
                </div>

                {/* Informações Financeiras */}
                <div className="space-y-2">
                    <h4 className="font-semibold text-gray-700">Informações Financeiras</h4>
                    <div className="space-y-1">
                        <p className="flex items-center gap-2 text-gray-600">
                            <Badge className="text-[#e67f00]" />
                            Matrícula: {client.matriculaBeneficio || 'Não informado'}
                        </p>
                        <p className="flex items-center gap-2 text-gray-600">
                            <Badge className="text-[#e67f00]" />
                            Espécie: {client.especieCode || 'Não informado'}
                        </p>
                        <p className="flex items-center gap-2 text-gray-600">
                            <AccountBalanceIcon className="text-[#e67f00]" />
                            Renda: {client.financialIncome ? 
                                `R$ ${client.financialIncome.toFixed(2)}` : 
                                'Não informado'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClientInformations;