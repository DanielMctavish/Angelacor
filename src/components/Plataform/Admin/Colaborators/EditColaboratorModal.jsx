import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Close } from '@mui/icons-material';
import ReactQuill from 'react-quill';
import axios from 'axios';
import { toast } from '../../../Common/Toast/Toast';
import { contractTemplate } from './data/contractTemplate';

const FUNCTIONS = [
    'Operacional',
    'Gerente',
    'Coordenador',
    'Vendedor',
    'Parceiro',
    'Sub Administrador'
];

function EditColaboratorModal({ isOpen, onClose, colaborator, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const quillRef = useRef();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        function: '',
        rankPosition: 1,
        salary: '',
        experience: 0,
        cpf: '',
        rg: '',
        address: '',
        phone_number: '',
        work_contract: '',
        level: 1
    });

    // Preenche o formulário quando o colaborador é carregado
    useEffect(() => {
        if (colaborator) {
            setFormData({
                name: colaborator.name,
                email: colaborator.email,
                function: colaborator.function,
                rankPosition: colaborator.rankPosition,
                salary: colaborator.salary,
                experience: colaborator.experience,
                cpf: colaborator.cpf || '',
                rg: colaborator.rg || '',
                address: colaborator.address || '',
                phone_number: colaborator.phone_number || '',
                work_contract: colaborator.work_contract || '',
                level: colaborator.level
            });
        }
    }, [colaborator]);

    // Atualiza o contrato quando dados relevantes mudam
    useEffect(() => {
        const newContract = contractTemplate.template(formData);
        setFormData(prev => ({
            ...prev,
            work_contract: newContract
        }));
    }, [
        formData.name,
        formData.cpf,
        formData.rg,
        formData.address,
        formData.phone_number,
        formData.function,
        formData.salary
    ]);

    const handleEditorChange = (content) => {
        setFormData(prev => ({
            ...prev,
            work_contract: content
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'salary' || name === 'rankPosition' || name === 'level'
                ? Number(value)
                : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const adminData = JSON.parse(localStorage.getItem('adminToken'));
            if (!adminData?.token) {
                throw new Error('Token não encontrado');
            }

            const formattedData = {
                ...formData,
                salary: parseFloat(formData.salary),
                rankPosition: parseInt(formData.rankPosition),
                experience: parseInt(formData.experience),
                level: parseInt(formData.level)
            };

            await axios.patch(
                `${import.meta.env.VITE_API_URL}/colaborator/update?colaboratorId=${colaborator.id}`,
                formattedData,
                {
                    headers: {
                        'Authorization': `Bearer ${adminData.token}`
                    }
                }
            );

            toast.success('Colaborador atualizado com sucesso!');
            onSuccess?.();
            onClose();

        } catch (error) {
            console.error('Erro ao atualizar colaborador:', error);
            setError(error.response?.data?.message || 'Erro ao atualizar colaborador');
            toast.error(error.response?.data?.message || 'Erro ao atualizar colaborador');
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
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Editar Colaborador</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <Close />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Nome
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Função
                            </label>
                            <select
                                name="function"
                                value={formData.function}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                                required
                            >
                                <option value="">Selecione uma função</option>
                                {FUNCTIONS.map(func => (
                                    <option key={func} value={func}>{func}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Posição no Ranking
                            </label>
                            <input
                                type="number"
                                name="rankPosition"
                                value={formData.rankPosition}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                                min="1"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Salário
                            </label>
                            <input
                                type="number"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                CPF
                            </label>
                            <input
                                type="text"
                                name="cpf"
                                value={formData.cpf}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                RG
                            </label>
                            <input
                                type="text"
                                name="rg"
                                value={formData.rg}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Endereço
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Telefone
                            </label>
                            <input
                                type="text"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                                required
                            />
                        </div>
                    </div>

                    <div className="col-span-full">
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-gray-300">
                                Contrato de Trabalho
                            </label>
                        </div>
                        <div className="mt-2 bg-transparent rounded-lg">
                            <ReactQuill
                                ref={quillRef}
                                theme="snow"
                                value={formData.work_contract}
                                onChange={handleEditorChange}
                                modules={modules}
                                formats={formats}
                                className="h-[300px] mb-12"
                            />
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
                                disabled:cursor-not-allowed"
                        >
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

// Adicione as configurações do ReactQuill
const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link'],
        ['clean']
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'align',
    'link'
];

export default EditColaboratorModal; 