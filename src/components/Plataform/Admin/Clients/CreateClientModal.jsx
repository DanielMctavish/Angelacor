import { 
    Close, 
    Person, 
    Email, 
    Home, 
    Phone, 
    Badge,
    AccountBalance,
    Assignment,
    VpnKey,
    Wc,
    AttachMoney,
    CalendarMonth,
    LocationCity,
    Public,
    People,
    Lock
} from '@mui/icons-material';
import { useState } from 'react';
import axios from 'axios';

function CreateClientModal({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        cpf: '',
        phone: '',
        rg: '',
        url_profile_cover:"",
        expeditionDate: '',
        fatherName: '',
        motherName: '',
        accountNumber: '',
        matriculaBeneficio: '',
        sex: '',
        birthDate: '',
        financialIncome: '',
        naturalness: '',
        nationality: '',
        inssPassword: '',
        DDB: '',
        especieCode: '',
        clientType: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const adminData = JSON.parse(localStorage.getItem('adminToken'));
            
            const formattedData = {
                ...formData,
                expeditionDate: formData.expeditionDate ? new Date(formData.expeditionDate).toISOString() : null,
                birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : null,
                DDB: formData.DDB ? new Date(formData.DDB).toISOString() : null,
                financialIncome: formData.financialIncome ? parseFloat(formData.financialIncome) : null,
                proposals: []
            };
            
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/client/create-client`,
                formattedData,
                {
                    headers: {
                        'Authorization': `Bearer ${adminData.token}`
                    }
                }
            );

            if (response.data) {
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error('Erro detalhado: >>>>>>>>>>>>>> ', error.response);
            setError(error.response?.data?.message || 'Erro ao criar cliente');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed mt-0 w-full h-[100vh] inset-0 bg-black/70 flex items-center justify-center p-4 z-40">
            <div className="bg-[#1a1a1a] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto text-gray-100">
                <div className="sticky top-0 bg-[#133785] p-4 border-b border-gray-700 flex justify-between items-center z-40">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Person className="text-2xl" />
                        Criar Novo Cliente
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded-full transition-all"
                    >
                        <Close className="text-white" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-3 bg-red-900/30 border border-red-500/50 text-red-200 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Dados Pessoais */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <Badge />
                                Dados Pessoais
                            </h3>
                            
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Nome Completo</label>
                                <div className="relative">
                                    <Person className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Digite o nome completo"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 bg-[#272727] border border-gray-700 rounded-lg 
                                            focus:border-[#133785] outline-none text-white placeholder:text-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">E-mail</label>
                                <div className="relative">
                                    <Email className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Digite o e-mail"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 bg-[#272727] border border-gray-700 rounded-lg 
                                            focus:border-[#133785] outline-none text-white placeholder:text-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">CPF</label>
                                <div className="relative">
                                    <Badge className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="cpf"
                                        placeholder="Digite o CPF"
                                        value={formData.cpf}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 bg-[#272727] border border-gray-700 rounded-lg 
                                            focus:border-[#133785] outline-none text-white placeholder:text-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">RG</label>
                                <div className="relative">
                                    <Badge className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="rg"
                                        placeholder="Digite o RG"
                                        value={formData.rg}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 bg-[#272727] border border-gray-700 rounded-lg 
                                            focus:border-[#133785] outline-none text-white placeholder:text-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Data de Expedição</label>
                                <div className="relative">
                                    <CalendarMonth className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="date"
                                        name="expeditionDate"
                                        value={formData.expeditionDate}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 bg-[#272727] border border-gray-700 rounded-lg 
                                            focus:border-[#133785] outline-none text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Sexo</label>
                                <div className="relative">
                                    <Wc className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <select
                                        name="sex"
                                        value={formData.sex}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 bg-[#272727] border border-gray-700 rounded-lg 
                                            focus:border-[#133785] outline-none text-white"
                                    >
                                        <option value="">Selecione o Sexo</option>
                                        <option value="M">Masculino</option>
                                        <option value="F">Feminino</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Dados de Contato e Endereço */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <Home />
                                Contato e Endereço
                            </h3>
                            
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Telefone</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="phone"
                                        placeholder="Digite o telefone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 bg-[#272727] border border-gray-700 rounded-lg 
                                            focus:border-[#133785] outline-none text-white placeholder:text-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Endereço Completo</label>
                                <div className="relative">
                                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Digite o endereço completo"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 bg-[#272727] border border-gray-700 rounded-lg 
                                            focus:border-[#133785] outline-none text-white placeholder:text-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Naturalidade</label>
                                <div className="relative">
                                    <LocationCity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="naturalness"
                                        placeholder="Digite a naturalidade"
                                        value={formData.naturalness}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 bg-[#272727] border border-gray-700 rounded-lg 
                                            focus:border-[#133785] outline-none text-white placeholder:text-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Nacionalidade</label>
                                <div className="relative">
                                    <Public className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="nationality"
                                        placeholder="Digite a nacionalidade"
                                        value={formData.nationality}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 bg-[#272727] border border-gray-700 rounded-lg 
                                            focus:border-[#133785] outline-none text-white placeholder:text-gray-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dados Bancários e INSS */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <AccountBalance />
                                Dados Bancários e INSS
                            </h3>
                            
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Número da Conta</label>
                                <div className="relative">
                                    <AccountBalance className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="accountNumber"
                                        placeholder="Digite o número da conta"
                                        value={formData.accountNumber}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 bg-[#272727] border border-gray-700 rounded-lg 
                                            focus:border-[#133785] outline-none text-white placeholder:text-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Matrícula do Benefício</label>
                                <div className="relative">
                                    <Badge className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="matriculaBeneficio"
                                        placeholder="Digite a matrícula do benefício"
                                        value={formData.matriculaBeneficio}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 bg-[#272727] border border-gray-700 rounded-lg 
                                            focus:border-[#133785] outline-none text-white placeholder:text-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Senha do INSS</label>
                                <div className="relative">
                                    <VpnKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        name="inssPassword"
                                        placeholder="Digite a senha do INSS"
                                        value={formData.inssPassword}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 bg-[#272727] border border-gray-700 rounded-lg 
                                            focus:border-[#133785] outline-none text-white placeholder:text-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Código da Espécie</label>
                                <div className="relative">
                                    <Assignment className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="especieCode"
                                        placeholder="Digite o código da espécie"
                                        value={formData.especieCode}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 bg-[#272727] border border-gray-700 rounded-lg 
                                            focus:border-[#133785] outline-none text-white placeholder:text-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Tipo de Cliente</label>
                                <div className="relative">
                                    <Person className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <select
                                        name="clientType"
                                        value={formData.clientType}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 bg-[#272727] border border-gray-700 rounded-lg 
                                            focus:border-[#133785] outline-none text-white"
                                    >
                                        <option value="">Selecione o tipo</option>
                                        <option value="PENSIONISTA">Pensionista</option>
                                        <option value="APOSENTADO">Aposentado</option>
                                        <option value="SERVIDOR_FEDERAL">Servidor Federal</option>
                                        <option value="SERVIDOR_ESTADUAL">Servidor Estadual</option>
                                        <option value="SERVIDOR_MUNICIPAL">Servidor Municipal</option>
                                        <option value="FORCAS_ARMADAS">Forças Armadas</option>
                                        <option value="SIAPE">SIAPE</option>
                                        <option value="BPC_LOAS">BPC/LOAS</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Outros Dados */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <Assignment />
                                Outros Dados
                            </h3>
                            
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Nome do Pai</label>
                                <div className="relative">
                                    <Person className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="fatherName"
                                        placeholder="Digite o nome do pai"
                                        value={formData.fatherName}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 bg-[#272727] border border-gray-700 rounded-lg 
                                            focus:border-[#133785] outline-none text-white placeholder:text-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Nome da Mãe</label>
                                <div className="relative">
                                    <Person className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="motherName"
                                        placeholder="Digite o nome da mãe"
                                        value={formData.motherName}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 bg-[#272727] border border-gray-700 rounded-lg 
                                            focus:border-[#133785] outline-none text-white placeholder:text-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Renda Mensal</label>
                                <div className="relative">
                                    <AttachMoney className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="number"
                                        name="financialIncome"
                                        placeholder="Digite a renda mensal"
                                        value={formData.financialIncome}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 bg-[#272727] border border-gray-700 rounded-lg 
                                            focus:border-[#133785] outline-none text-white placeholder:text-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Data de Nascimento</label>
                                <div className="relative">
                                    <CalendarMonth className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 bg-[#272727] border border-gray-700 rounded-lg 
                                            focus:border-[#133785] outline-none text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">DDB</label>
                                <div className="relative">
                                    <CalendarMonth className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="date"
                                        name="DDB"
                                        value={formData.DDB}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 bg-[#272727] border border-gray-700 rounded-lg 
                                            focus:border-[#133785] outline-none text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Senha</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Digite a senha"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 bg-[#272727] border border-gray-700 rounded-lg 
                                            focus:border-[#133785] outline-none text-white placeholder:text-gray-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 bg-[#272727] text-white rounded-lg hover:bg-[#861717] 
                                transition-all flex items-center gap-2"
                        >
                            <Close />
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-[#133785] text-white rounded-lg hover:bg-[#0f296d]
                                disabled:opacity-50 disabled:cursor-not-allowed transition-all
                                flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Criando...
                                </>
                            ) : (
                                <>
                                    <Person />
                                    Criar Cliente
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateClientModal; 