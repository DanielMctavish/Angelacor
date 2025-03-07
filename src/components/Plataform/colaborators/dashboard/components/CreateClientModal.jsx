import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from '../../../../Common/Toast/Toast';
import Close from '@mui/icons-material/Close';
import DadosPessoais from './NewClient/DadosPessoais';
import DadosContato from './NewClient/DadosContato';
import DadosBeneficio from './NewClient/DadosBeneficio';
import SenhaAcesso from './NewClient/SenhaAcesso';
import XpSystem from '../../../XP/XpLevels';

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
        cpf: '',
        phone: '',
        password: '',
        // Campos opcionais
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
        nationality: '',
        inssPassword: '',
        DDB: '',
        especieCode: '',
        clientType: '',
        address: ''
    });

    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpa o erro do campo quando ele é alterado
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validação dos campos obrigatórios
        if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
        if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
        if (!formData.cpf.trim()) newErrors.cpf = 'CPF é obrigatório';
        if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
        if (!formData.password.trim()) newErrors.password = 'Senha é obrigatória';

        // Validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        // Validação de CPF
        if (formData.cpf) {
            const cpfLimpo = formData.cpf.replace(/\D/g, '');
            if (!validateCPF(cpfLimpo)) {
                newErrors.cpf = 'CPF inválido';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setError('');
        setLoading(true);

        try {
            const colaboratorData = JSON.parse(localStorage.getItem('colaboratorData'));
            console.log("Dados do colaborador:", colaboratorData); // Debug

            // Formata os dados conforme a interface IClient
            const formattedData = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                cpf: formData.cpf.trim(),
                phone: formData.phone.trim(),
                password: formData.password,
                // Campos opcionais
                address: formData.address?.trim() || null,
                rg: formData.rg?.trim() || null,
                expeditionDate: formData.expeditionDate ? new Date(formData.expeditionDate).toISOString() : null,
                fatherName: formData.fatherName?.trim() || null,
                motherName: formData.motherName?.trim() || null,
                accountNumber: formData.accountNumber?.trim() || null,
                matriculaBeneficio: formData.matriculaBeneficio?.trim() || null,
                sex: formData.sex?.trim() || null,
                birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : null,
                financialIncome: formData.financialIncome ? parseFloat(formData.financialIncome) : null,
                naturalness: formData.naturalness?.trim() || null,
                nationality: formData.nationality?.trim() || null,
                inssPassword: formData.inssPassword?.trim() || null,
                DDB: formData.DDB ? new Date(formData.DDB).toISOString() : null,
                especieCode: formData.especieCode?.trim() || null,
                clientType: formData.clientType?.trim() || null,
                colaboratorId: colaboratorData.user.id
            };

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/client/create-client`,
                formattedData,
                {
                    headers: {
                        'Authorization': `Bearer ${colaboratorData.token}`
                    }
                }
            );

            if (response.data) {
                // Dar XP ao colaborador após criar cliente com sucesso
                try {
                    const xpAmount = 1200; // XP por criar cliente
                    console.log("Tentando dar XP:", { 
                        colaboradorId: colaboratorData.user.id, 
                        xpAmount 
                    }); // Debug

                    const xpResponse = await XpSystem.GiveColaboratorXp(colaboratorData.user.id, xpAmount);
                    console.log("Resposta do XP:", xpResponse); // Debug
                    
                    // Pega as informações do novo nível
                    const levelInfo = XpSystem.getCurrentLevel(response.data.colaborator.experience + xpAmount);
                    console.log("Informações do nível:", levelInfo); // Debug
                    
                    // Verifica se subiu de nível
                    if (levelInfo.level > response.data.colaborator.level) {
                        toast.success(
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-lg font-bold">🎉 Level Up! 🎉</span>
                                <span>Você evoluiu para o nível {levelInfo.level}!</span>
                            </div>
                        );
                    }

                    // Atualiza o estado do usuário no localStorage
                    const updatedColaboratorData = {
                        ...colaboratorData,
                        user: {
                            ...colaboratorData.user,
                            experience: response.data.colaborator.experience + xpAmount
                        }
                    };
                    localStorage.setItem('colaboratorData', JSON.stringify(updatedColaboratorData));

                } catch (xpError) {
                    console.error('Erro detalhado ao dar XP:', xpError.response?.data || xpError); // Debug melhorado
                }

                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error('Erro ao criar cliente:', error.response?.data || error);
            setError(error.response?.data?.message || 'Erro ao criar cliente');
        } finally {
            setLoading(false);
        }
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
                className="bg-[#1f1f1f] rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-2 text-gray-400 hover:text-white 
                        hover:bg-white/10 rounded-lg transition-all"
                >
                    <Close />
                </button>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <DadosPessoais formData={formData} handleChange={handleChange} errors={errors} />
                    <DadosContato formData={formData} handleChange={handleChange} errors={errors} />
                    <DadosBeneficio formData={formData} handleChange={handleChange} errors={errors} />
                    <SenhaAcesso formData={formData} handleChange={handleChange} errors={errors} />

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 
                                rounded-lg transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-[#e67f00] text-white rounded-lg hover:bg-[#ff8c00] 
                                transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Criando...
                                </>
                            ) : (
                                'Cadastrar Cliente'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

export default CreateClientModal;