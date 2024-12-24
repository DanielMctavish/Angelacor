import { Close, Assignment, AccountBalance, Business, Handshake } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import axios from 'axios';

function CreateProposalModal({ isOpen, onClose, selectedClient }) {
    const [formData, setFormData] = useState({
        proposalType: '',
        proposalDate: new Date().toISOString().split('T')[0],
        storeCompany: '',
        agreement: '',
        bankId: '',
        clientId: selectedClient?.id || ''
    });

    const [banks, setBanks] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchBanks();
        }
    }, [isOpen]);

    useEffect(() => {
        if (selectedClient) {
            setFormData(prev => ({
                ...prev,
                clientId: selectedClient.id
            }));
        }
    }, [selectedClient]);

    const fetchBanks = async () => {
        try {
            const adminData = JSON.parse(localStorage.getItem('adminToken'));
            
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/bank/list`, {
                headers: {
                    'Authorization': `Bearer ${adminData.token}`
                }
            });

            if (response.data) {
                setBanks(response.data);
            }
        } catch (error) {
            console.error('Erro ao buscar bancos:', error);
            setError('Erro ao carregar lista de bancos');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.proposalType || !formData.bankId || !formData.agreement) {
            setError('Por favor, preencha todos os campos obrigatórios');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const adminData = JSON.parse(localStorage.getItem('adminToken'));
            
            console.log('Dados enviados:', {
                ...formData,
                proposalDate: new Date(formData.proposalDate).toISOString()
            });

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/proposal/create-proposal`,
                {
                    ...formData,
                    proposalDate: new Date(formData.proposalDate).toISOString()
                },
                {
                    headers: {
                        'Authorization': `Bearer ${adminData.token}`
                    }
                }
            );

            if (response.data) {
                setFormData({
                    proposalType: '',
                    proposalDate: new Date().toISOString().split('T')[0],
                    storeCompany: '',
                    agreement: '',
                    bankId: '',
                    clientId: selectedClient?.id || ''
                });
                
                onClose();
            }
        } catch (error) {
            console.error('Erro completo:', error);
            setError(error.response?.data?.message || 'Erro ao criar proposta');
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
                        <Assignment className="text-2xl" />
                        Nova Proposta
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
                            <label className="text-sm text-gray-400">Tipo de Proposta</label>
                            <div className="relative">
                                <Assignment className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select
                                    name="proposalType"
                                    value={formData.proposalType}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 bg-[#272727] border border-gray-700 rounded-lg 
                                        focus:border-[#133785] outline-none text-white"
                                >
                                    <option value="">Selecione o tipo</option>
                                    <option value="EMPRÉSTIMO CONSIGNADO">Empréstimo Consignado</option>
                                    <option value="CARTÃO CONSIGNADO">Cartão Consignado</option>
                                    <option value="REFINANCIAMENTO">Refinanciamento</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Data da Proposta</label>
                            <div className="relative">
                                <Assignment className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="date"
                                    name="proposalDate"
                                    value={formData.proposalDate}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 bg-[#272727] border border-gray-700 rounded-lg 
                                        focus:border-[#133785] outline-none text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Banco</label>
                            <div className="relative">
                                <AccountBalance className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select
                                    name="bankId"
                                    value={formData.bankId}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 bg-[#272727] border border-gray-700 rounded-lg 
                                        focus:border-[#133785] outline-none text-white"
                                >
                                    <option value="">Selecione o banco</option>
                                    {banks.map(bank => (
                                        <option key={bank.id} value={bank.id}>
                                            {bank.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Empresa/Loja</label>
                            <div className="relative">
                                <Business className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="storeCompany"
                                    placeholder="Digite o nome da empresa/loja"
                                    value={formData.storeCompany}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 bg-[#272727] border border-gray-700 rounded-lg 
                                        focus:border-[#133785] outline-none text-white placeholder:text-gray-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Convênio</label>
                            <div className="relative">
                                <Handshake className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select
                                    name="agreement"
                                    value={formData.agreement}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 bg-[#272727] border border-gray-700 rounded-lg 
                                        focus:border-[#133785] outline-none text-white"
                                >
                                    <option value="">Selecione o convênio</option>
                                    <option value="INSS">INSS</option>
                                    <option value="SIAPE">SIAPE</option>
                                    <option value="FORÇAS ARMADAS">Forças Armadas</option>
                                </select>
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
                                    <Assignment />
                                    Criar Proposta
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateProposalModal;