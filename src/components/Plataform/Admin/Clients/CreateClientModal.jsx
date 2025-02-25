import { motion } from 'framer-motion';
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

// Componente para o campo de input reutilizável
const InputField = ({ label, icon: Icon, required, ...props }) => (
    <div className="space-y-2">
        <label className="text-sm text-gray-400 flex items-center gap-1">
            {label}
            {required && <span className="text-[#e67f00]">*</span>}
        </label>
        <div className="relative">
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
                {...props}
                className={`w-full pl-10 pr-4 py-2 bg-[#272727] border border-gray-700 rounded-lg 
                    focus:border-[#133785] outline-none text-white placeholder:text-gray-500
                    ${required ? 'border-[#e67f00]/20' : 'border-gray-700'}`}
            />
        </div>
    </div>
);

// Componente para o select reutilizável
const SelectField = ({ label, icon: Icon, options, ...props }) => (
    <div className="space-y-2">
        <label className="text-sm text-gray-400">{label}</label>
        <div className="relative">
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
                {...props}
                className="w-full pl-10 pr-4 py-2 bg-[#272727] border border-gray-700 rounded-lg 
                    focus:border-[#133785] outline-none text-white"
            >
                <option value="">{`Selecione ${label.toLowerCase()}`}</option>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    </div>
);

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
                rg: formData.rg || null,
                fatherName: formData.fatherName || null,
                motherName: formData.motherName || null,
                accountNumber: formData.accountNumber || null,
                matriculaBeneficio: formData.matriculaBeneficio || null,
                sex: formData.sex || null,
                naturalness: formData.naturalness || null,
                nationality: formData.nationality || null,
                inssPassword: formData.inssPassword || null,
                especieCode: formData.especieCode || null,
                clientType: formData.clientType || null,
                address: formData.address || null
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
            console.error('Erro ao criar cliente:', error);
            setError(error.response?.data?.message || 'Erro ao criar cliente');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed mt-0 w-full h-[100vh] inset-0 bg-black/70 flex items-center justify-center p-4 z-40">
            <div className="bg-[#1a1a1a] rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto text-gray-100">
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

                <div className="p-6">
                    <div className="mb-6 bg-[#e67f00]/10 border border-[#e67f00]/20 p-4 rounded-lg">
                        <p className="text-sm text-gray-300">
                            Os campos marcados com <span className="text-[#e67f00]">*</span> são obrigatórios.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-900/30 border border-red-500/50 text-red-200 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Dados Pessoais */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2 flex items-center gap-2">
                                <Badge />
                                Dados Pessoais
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <InputField
                                    label="Nome Completo"
                                    icon={Person}
                                    required
                                    type="text"
                                    name="name"
                                    placeholder="Digite o nome completo"
                                    value={formData.name}
                                    onChange={handleChange}
                                />

                                <InputField
                                    label="CPF"
                                    icon={Badge}
                                    required
                                    type="text"
                                    name="cpf"
                                    placeholder="Digite o CPF"
                                    value={formData.cpf}
                                    onChange={handleChange}
                                />

                                <InputField
                                    label="RG"
                                    icon={Badge}
                                    type="text"
                                    name="rg"
                                    placeholder="Digite o RG"
                                    value={formData.rg}
                                    onChange={handleChange}
                                />

                                <InputField
                                    label="Data de Expedição"
                                    icon={CalendarMonth}
                                    type="date"
                                    name="expeditionDate"
                                    value={formData.expeditionDate}
                                    onChange={handleChange}
                                />

                                <SelectField
                                    label="Sexo"
                                    icon={Wc}
                                    name="sex"
                                    value={formData.sex}
                                    onChange={handleChange}
                                    options={[
                                        { value: 'M', label: 'Masculino' },
                                        { value: 'F', label: 'Feminino' }
                                    ]}
                                />

                                <InputField
                                    label="Data de Nascimento"
                                    icon={CalendarMonth}
                                    type="date"
                                    name="birthDate"
                                    value={formData.birthDate}
                                    onChange={handleChange}
                                />

                                <InputField
                                    label="Nome do Pai"
                                    icon={Person}
                                    type="text"
                                    name="fatherName"
                                    placeholder="Digite o nome do pai"
                                    value={formData.fatherName}
                                    onChange={handleChange}
                                />

                                <InputField
                                    label="Nome da Mãe"
                                    icon={Person}
                                    type="text"
                                    name="motherName"
                                    placeholder="Digite o nome da mãe"
                                    value={formData.motherName}
                                    onChange={handleChange}
                                />
                            </div>
                        </section>

                        {/* Contato */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2 flex items-center gap-2">
                                <Phone />
                                Contato
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <InputField
                                    label="E-mail"
                                    icon={Email}
                                    required
                                    type="email"
                                    name="email"
                                    placeholder="Digite o e-mail"
                                    value={formData.email}
                                    onChange={handleChange}
                                />

                                <InputField
                                    label="Telefone"
                                    icon={Phone}
                                    required
                                    type="text"
                                    name="phone"
                                    placeholder="Digite o telefone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />

                                <InputField
                                    label="Endereço"
                                    icon={Home}
                                    type="text"
                                    name="address"
                                    placeholder="Digite o endereço"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                        </section>

                        {/* Dados Bancários e INSS */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2 flex items-center gap-2">
                                <AccountBalance />
                                Dados Bancários e INSS
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <InputField
                                    label="Número da Conta"
                                    icon={AccountBalance}
                                    type="text"
                                    name="accountNumber"
                                    placeholder="Digite o número da conta"
                                    value={formData.accountNumber}
                                    onChange={handleChange}
                                />

                                <InputField
                                    label="Matrícula do Benefício"
                                    icon={Badge}
                                    type="text"
                                    name="matriculaBeneficio"
                                    placeholder="Digite a matrícula"
                                    value={formData.matriculaBeneficio}
                                    onChange={handleChange}
                                />

                                <InputField
                                    label="Senha do INSS"
                                    icon={VpnKey}
                                    type="password"
                                    name="inssPassword"
                                    placeholder="Digite a senha do INSS"
                                    value={formData.inssPassword}
                                    onChange={handleChange}
                                />

                                <InputField
                                    label="Código da Espécie"
                                    icon={Assignment}
                                    type="text"
                                    name="especieCode"
                                    placeholder="Digite o código"
                                    value={formData.especieCode}
                                    onChange={handleChange}
                                />

                                <SelectField
                                    label="Tipo de Cliente"
                                    icon={Person}
                                    name="clientType"
                                    value={formData.clientType}
                                    onChange={handleChange}
                                    options={[
                                        { value: 'PENSIONISTA', label: 'Pensionista' },
                                        { value: 'APOSENTADO', label: 'Aposentado' },
                                        { value: 'SERVIDOR_FEDERAL', label: 'Servidor Federal' },
                                        { value: 'SERVIDOR_ESTADUAL', label: 'Servidor Estadual' },
                                        { value: 'SERVIDOR_MUNICIPAL', label: 'Servidor Municipal' },
                                        { value: 'FORCAS_ARMADAS', label: 'Forças Armadas' },
                                        { value: 'SIAPE', label: 'SIAPE' },
                                        { value: 'BPC_LOAS', label: 'BPC/LOAS' }
                                    ]}
                                />

                                <InputField
                                    label="DDB"
                                    icon={CalendarMonth}
                                    type="date"
                                    name="DDB"
                                    value={formData.DDB}
                                    onChange={handleChange}
                                />
                            </div>
                        </section>

                        {/* Outros Dados */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2 flex items-center gap-2">
                                <Assignment />
                                Outros Dados
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <InputField
                                    label="Naturalidade"
                                    icon={LocationCity}
                                    type="text"
                                    name="naturalness"
                                    placeholder="Digite a naturalidade"
                                    value={formData.naturalness}
                                    onChange={handleChange}
                                />

                                <InputField
                                    label="Nacionalidade"
                                    icon={Public}
                                    type="text"
                                    name="nationality"
                                    placeholder="Digite a nacionalidade"
                                    value={formData.nationality}
                                    onChange={handleChange}
                                />

                                <InputField
                                    label="Renda Mensal"
                                    icon={AttachMoney}
                                    type="number"
                                    name="financialIncome"
                                    placeholder="Digite a renda mensal"
                                    value={formData.financialIncome}
                                    onChange={handleChange}
                                />

                                <InputField
                                    label="Senha de Acesso"
                                    icon={Lock}
                                    required
                                    type="password"
                                    name="password"
                                    placeholder="Digite a senha"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </section>

                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-700">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 
                                    rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-[#e67f00] text-white rounded-lg hover:bg-[#ff8c00] 
                                    transition-colors flex items-center gap-2"
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
        </div>
    );
}

export default CreateClientModal; 