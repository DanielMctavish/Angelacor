import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from '../../../../Common/Toast/Toast';
import Close from '@mui/icons-material/Close';
import DadosPessoais from './NewClient/DadosPessoais';
import DadosContato from './NewClient/DadosContato';
import DadosBeneficio from './NewClient/DadosBeneficio';
import SenhaAcesso from './NewClient/SenhaAcesso';

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
    for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(9))) return false;

    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
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

        if (name === 'cpf') {
            formattedValue = formatCPF(value);
            if (!validateCPF(formattedValue)) {
                error = 'CPF inválido';
            }
        } else if (name === 'rg') {
            formattedValue = formatRG(value);
            if (!validateRG(formattedValue)) {
                error = 'RG inválido';
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
                    <DadosPessoais formData={formData} handleChange={handleChange} errors={errors} />
                    <DadosContato formData={formData} handleChange={handleChange} />
                    <DadosBeneficio formData={formData} handleChange={handleChange} />
                    <SenhaAcesso formData={formData} handleChange={handleChange} />

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded-lg bg-[#e67f00] hover:bg-[#ff8c00] transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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