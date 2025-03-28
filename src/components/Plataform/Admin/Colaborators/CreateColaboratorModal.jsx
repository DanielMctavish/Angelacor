import { Close, Print } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { contractTemplate } from './data/contractTemplate';

const FUNCTIONS = [
    'Operacional',
    'Gerente',
    'Coordenador',
    'Vendedor',
    'Parceiro',
    'Sub Administrador'
];

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

function CreateColaboratorModal({ isOpen, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const quillRef = useRef();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        function: '',
        rankPosition: 1,
        salary: '',
        experience: 0,
        cpf: '',
        rg: '',
        address: '',
        phone_number: '',
        work_contract: '',
        url_profile_cover: '',
        level: 1
    });

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
        formData.salary,
        formData.nationality
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

            // Formatar os dados antes de enviar
            const formattedData = {
                ...formData,
                salary: parseFloat(formData.salary), // Garantir que salary seja número
                rankPosition: parseInt(formData.rankPosition), // Garantir que rankPosition seja número
                experience: parseInt(formData.experience), // Garantir que experience seja número
                level: parseInt(formData.level), // Garantir que level seja número
            };

            await axios.post(
                `${import.meta.env.VITE_API_URL}/colaborator/create-colaborator`,
                formattedData,
                {
                    headers: {
                        'Authorization': `Bearer ${adminData.token}`
                    }
                }
            );

            onSuccess?.();
            onClose();
            // Reset do formData
            setFormData({
                name: '',
                email: '',
                password: '',
                function: '',
                rankPosition: 1,
                salary: '',
                experience: 0,
                cpf: '',
                rg: '',
                address: '',
                phone_number: '',
                work_contract: '',
                url_profile_cover: '',
                level: 1
            });

        } catch (error) {
            console.error('Erro ao criar colaborador:', error);
            setError(error.response?.data?.message || 'Erro ao criar colaborador');
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Contrato - ${formData.name}</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #000;
                            background: #fff;
                            padding: 20px;
                            max-width: 210mm; /* Tamanho A4 */
                            margin: 0 auto;
                        }
                        @media print {
                            body {
                                padding: 12mm;
                            }
                            @page {
                                margin: 12mm;
                                size: A4;
                            }
                        }
                    </style>
                </head>
                <body>
                    ${formData.work_contract}
                </body>
            </html>
        `);
        
        printWindow.document.close();
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
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#1f1f1f] rounded-xl p-6 w-[80%] max-h-[90vh] overflow-y-auto relative"
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-white"
                >
                    <Close />
                </button>

                <h2 className="text-2xl font-bold text-white mb-6">Novo Colaborador</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Nome Completo
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                                placeholder="Digite o nome completo"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                E-mail
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                                placeholder="Digite o e-mail"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Senha
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                                placeholder="Digite a senha"
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
                                    <option key={func} value={func}>
                                        {func}
                                    </option>
                                ))}
                            </select>
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
                                placeholder="Digite o salário"
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
                                placeholder="000.000.000-00"
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
                                placeholder="0000000"
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
                                placeholder="Endereço completo"
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
                                placeholder="(00) 00000-0000"
                                required
                            />
                        </div>
                    </div>

                    <div className="col-span-full">
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-gray-300">
                                Contrato de Trabalho
                            </label>
                            <button
                                type="button"
                                onClick={handlePrint}
                                className="flex items-center gap-2 px-3 py-1 bg-white/5 
                                    hover:bg-white/10 rounded-lg transition-colors text-gray-300"
                            >
                                <Print className="text-[#e67f00]" />
                                <span>Imprimir</span>
                            </button>
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

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#e67f00] hover:bg-[#ff8c00] text-white py-2 rounded-lg 
                            transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Criando...' : 'Criar Colaborador'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

export default CreateColaboratorModal; 