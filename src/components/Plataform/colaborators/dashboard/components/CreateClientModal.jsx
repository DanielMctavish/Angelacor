import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Close, Person, Email, Badge, CalendarMonth, Home, LocationCity, Public,
    AccountBalance, VpnKey, AttachMoney
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from '../../../../Common/Toast/Toast';
import XpLevels from '../../../Admin/Colaborators/XP/XpLevels';

const clientTypes = ['APOSENTADO', 'PENSIONISTA', 'SERVIDOR'];

// Componente Label que mostra o asterisco se o campo for obrigatório
const Label = ({ text, required }) => (
    <label className="text-sm text-gray-400 block mb-1">
        {text} {required && <span className="text-red-500">*</span>}
    </label>
);

// Função para validar CPF
const validateCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]/g, ''); // Remove caracteres não numéricos

    if (cpf.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(9))) return false;

    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(10))) return false;

    return true;
};

// Função para formatar CPF
const formatCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// Função para validar RG
const validateRG = (rg) => {
    rg = rg.replace(/[^\d]/g, '');
    return rg.length >= 7 && rg.length <= 9; // RGs normalmente têm entre 7 e 9 dígitos
};

// Função para formatar RG
const formatRG = (rg) => {
    rg = rg.replace(/[^\d]/g, '');
    if (rg.length <= 8) {
        return rg.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3');
    }
    return rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
};

function CreateClientModal({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        cpf: '',
        phone: '',
        rg: '',
        expeditionDate: '',
        fatherName: '',
        motherName: '',
        accountNumber: '',
        matriculaBeneficio: '',
        sex: '',
        birthDate: '',
        financialIncome: '',
        naturalness: '',
        nationality: 'Brasileira',
        url_profile_cover: "",
        inssPassword: '',
        DDB: '',
        especieCode: '',
        clientType: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Valida CPF e RG antes de enviar
        if (!validateCPF(formData.cpf)) {
            setErrors(prev => ({ ...prev, cpf: 'CPF inválido' }));
            toast.error('Por favor, insira um CPF válido');
            return;
        }

        if (formData.rg && !validateRG(formData.rg)) {
            setErrors(prev => ({ ...prev, rg: 'RG inválido' }));
            toast.error('Por favor, insira um RG válido');
            return;
        }

        setLoading(true);

        try {
            const colaboratorData = JSON.parse(localStorage.getItem('colaboratorData'));
            if (!colaboratorData?.token) {
                throw new Error('Token não encontrado');
            }

            // Formata as datas para o padrão ISO com horário
            const formattedData = {
                ...formData,
                colaboratorId: colaboratorData.user.id,
                expeditionDate: formData.expeditionDate ? new Date(formData.expeditionDate + 'T00:00:00.000Z').toISOString() : null,
                birthDate: formData.birthDate ? new Date(formData.birthDate + 'T00:00:00.000Z').toISOString() : null,
                DDB: formData.DDB ? new Date(formData.DDB + 'T00:00:00.000Z').toISOString() : null,
                financialIncome: formData.financialIncome ? parseFloat(formData.financialIncome) : 0,
                url_profile_cover: '',
                proposals: []
            };

            // Cria o cliente
            const clientResponse = await axios.post(
                `${import.meta.env.VITE_API_URL}/client/create-client`,
                formattedData,
                {
                    headers: {
                        'Authorization': `Bearer ${colaboratorData.token}`
                    }
                }
            );

            // Atualiza o XP do colaborador (+2000 XP por cliente criado)
            const newXp = (colaboratorData.user.experience || 0) + 2000;

            // Calcula o novo level baseado no XP
            let newLevel = 1;
            Object.entries(XpLevels).forEach(([levelKey, xpRequired]) => {
                if (newXp >= xpRequired) {
                    newLevel = parseInt(levelKey.replace('level', ''));
                }
            });

            // Atualiza o XP e level no backend
            const xpResponse = await axios.patch(
                `${import.meta.env.VITE_API_URL}/colaborator/update?colaboratorId=${colaboratorData.user.id}`,
                {
                    ...colaboratorData.user,
                    experience: newXp,
                    level: newLevel
                },
                {
                    headers: {
                        'Authorization': `Bearer ${colaboratorData.token}`
                    }
                }
            );

            // Atualiza os dados do colaborador no localStorage
            localStorage.setItem('colaboratorData', JSON.stringify({
                ...colaboratorData,
                user: {
                    ...colaboratorData.user,
                    experience: newXp,
                    level: newLevel
                }
            }));

            toast.success('Cliente criado com sucesso!');

            // Mostra mensagem de level up se necessário
            if (newLevel > colaboratorData.user.level) {
                toast.success(
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-lg font-bold">🎉 Level Up! 🎉</span>
                        <span>Você evoluiu para o nível {newLevel}!</span>
                    </div>
                );
            }

            onSuccess(clientResponse.data);
            onClose();

        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            toast.error(error.response?.data?.message || 'Erro ao criar cliente');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;
        let error = null;

        // Validações específicas
        if (name === 'cpf') {
            formattedValue = formatCPF(value);
            if (formattedValue.length === 14) { // CPF completo
                if (!validateCPF(formattedValue)) {
                    error = 'CPF inválido';
                }
            }
        } else if (name === 'rg') {
            formattedValue = formatRG(value);
            if (formattedValue.length >= 9) { // RG completo
                if (!validateRG(formattedValue)) {
                    error = 'RG inválido';
                }
            }
        }

        // Atualiza os erros
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));

        // Atualiza o formData
        setFormData(prev => ({
            ...prev,
            [name]: formattedValue
        }));
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-[#1f1f1f] rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Novo Cliente</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <Close />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Dados Pessoais */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#e67f00] border-b border-white/10 pb-2">
                            Dados Pessoais
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <Label text="Nome Completo" required={true} />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Nome Completo"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                                    required
                                />
                            </div>

                            <div>
                                <Label text="CPF" required={true} />
                                <div className="relative">
                                    <Badge className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="cpf"
                                        placeholder="Digite o CPF"
                                        value={formData.cpf}
                                        onChange={handleChange}
                                        maxLength={14}
                                        className={`w-full pl-10 pr-4 py-2 bg-[#272727] border rounded-lg 
                      outline-none text-white placeholder:text-gray-500
                      ${errors.cpf ? 'border-red-500' : 'border-gray-700 focus:border-[#133785]'}`}
                                        required
                                    />
                                    {errors.cpf && (
                                        <span className="text-xs text-red-500 mt-1">{errors.cpf}</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label text="RG" required={false} />
                                <div className="relative">
                                    <Badge className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="rg"
                                        placeholder="Digite o RG (opcional)"
                                        value={formData.rg}
                                        onChange={handleChange}
                                        maxLength={12}
                                        className={`w-full pl-10 pr-4 py-2 bg-[#272727] border rounded-lg 
                      outline-none text-white placeholder:text-gray-500
                      ${errors.rg ? 'border-red-500' : 'border-gray-700 focus:border-[#133785]'}`}
                                    />
                                    {errors.rg && (
                                        <span className="text-xs text-red-500 mt-1">{errors.rg}</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label text="Data de Expedição do RG" required={false} />
                                <div className="relative">
                                    <CalendarMonth className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="date"
                                        name="expeditionDate"
                                        value={formData.expeditionDate}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 
                      rounded-lg text-white focus:border-[#133785] outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label text="Data de Nascimento" required={false} />
                                <div className="relative">
                                    <CalendarMonth className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 
                      rounded-lg text-white focus:border-[#133785] outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label text="Sexo" required={false} />
                                <select
                                    name="sex"
                                    value={formData.sex}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                                >
                                    <option value="">Selecione o sexo</option>
                                    <option value="M">Masculino</option>
                                    <option value="F">Feminino</option>
                                </select>
                            </div>

                            <div>
                                <Label text="Nome do Pai" required={false} />
                                <input
                                    type="text"
                                    name="fatherName"
                                    placeholder="Nome do Pai (opcional)"
                                    value={formData.fatherName}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                                />
                            </div>

                            <div>
                                <Label text="Nome da Mãe" required={false} />
                                <input
                                    type="text"
                                    name="motherName"
                                    placeholder="Nome da Mãe (opcional)"
                                    value={formData.motherName}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                                />
                            </div>

                            <div>
                                <Label text="Naturalidade" required={false} />
                                <input
                                    type="text"
                                    name="naturalness"
                                    placeholder="Naturalidade (opcional)"
                                    value={formData.naturalness}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dados de Contato */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#e67f00] border-b border-white/10 pb-2">
                            Dados de Contato
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label text="Email" required={true} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                                    required
                                />
                            </div>

                            <div>
                                <Label text="Telefone" required={true} />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Telefone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Label text="Endereço Completo" required={false} />
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="Endereço Completo (opcional)"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dados do Benefício */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#e67f00] border-b border-white/10 pb-2">
                            Dados do Benefício
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <Label text="Tipo de Cliente" required={false} />
                                <select
                                    name="clientType"
                                    value={formData.clientType}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                                >
                                    <option value="">Selecione o tipo</option>
                                    {clientTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <Label text="Matrícula do Benefício" required={false} />
                                <input
                                    type="text"
                                    name="matriculaBeneficio"
                                    placeholder="Matrícula do Benefício (opcional)"
                                    value={formData.matriculaBeneficio}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                                />
                            </div>

                            <div>
                                <Label text="Código da Espécie" required={false} />
                                <input
                                    type="text"
                                    name="especieCode"
                                    placeholder="Código da Espécie (opcional)"
                                    value={formData.especieCode}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                                />
                            </div>

                            <div>
                                <Label text="Renda Mensal" required={false} />
                                <input
                                    type="number"
                                    name="financialIncome"
                                    placeholder="Renda Mensal (opcional)"
                                    value={formData.financialIncome}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                                />
                            </div>

                            <div>
                                <Label text="Número da Conta" required={false} />
                                <input
                                    type="text"
                                    name="accountNumber"
                                    placeholder="Número da Conta (opcional)"
                                    value={formData.accountNumber}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                                />
                            </div>

                            <div>
                                <Label text="Senha do INSS" required={false} />
                                <input
                                    type="password"
                                    name="inssPassword"
                                    placeholder="Senha do INSS (opcional)"
                                    value={formData.inssPassword}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                                />
                            </div>

                            <div>
                                <Label text="Data de Início do Benefício | DDB" required={false} />
                                <div className="relative">
                                    <CalendarMonth className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="date"
                                        name="DDB"
                                        value={formData.DDB}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 
                      rounded-lg text-white focus:border-[#133785] outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Senha de Acesso */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#e67f00] border-b border-white/10 pb-2">
                            Senha de Acesso
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label text="Senha" required={true} />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Senha"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 
                transition-colors text-white"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded-lg bg-[#e67f00] hover:bg-[#ff8c00] 
                transition-colors text-white disabled:opacity-50 
                disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? 'Criando...' : 'Criar Cliente'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

export default CreateClientModal;
