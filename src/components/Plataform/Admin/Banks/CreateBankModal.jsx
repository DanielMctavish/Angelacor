import { Close, AccountBalance } from '@mui/icons-material';
import { useState } from 'react';
import axios from 'axios';

function CreateBankModal({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        bankCode: '',
        accountNumber: '',
        agency: ''
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
            
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/bank/create-bank`,
                formData,
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
            console.error('Erro detalhado:', error.response?.data);
            setError(error.response?.data?.message || 'Erro ao criar banco');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-[#1a1a1a] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto text-gray-100">
                <div className="sticky top-0 bg-[#133785] p-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <AccountBalance className="text-2xl" />
                        Criar Novo Banco
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

                    <div className="space-y-4 bg-[#31313187] p-4 rounded-[6px]">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Nome do Banco</label>
                            <div className="relative">
                                <AccountBalance className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Digite o nome do banco"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 bg-[#272727] border border-gray-700 rounded-lg 
                                        focus:border-[#133785] outline-none text-white placeholder:text-gray-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Código do Banco</label>
                            <div className="relative">
                                <AccountBalance className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="bankCode"
                                    placeholder="Digite o código do banco"
                                    value={formData.bankCode}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 bg-[#272727] border border-gray-700 rounded-lg 
                                        focus:border-[#133785] outline-none text-white placeholder:text-gray-500"
                                />
                            </div>
                        </div>

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
                            <label className="text-sm text-gray-400">Agência</label>
                            <div className="relative">
                                <AccountBalance className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="agency"
                                    placeholder="Digite a agência"
                                    value={formData.agency}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 bg-[#272727] border border-gray-700 rounded-lg 
                                        focus:border-[#133785] outline-none text-white placeholder:text-gray-500"
                                />
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
                                    <AccountBalance />
                                    Criar Banco
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateBankModal; 