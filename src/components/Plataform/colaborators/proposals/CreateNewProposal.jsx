import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Close, Person, AccountBalance, Description } from '@mui/icons-material';
import axios from 'axios';
import { toast } from '../../../Common/Toast/Toast';
import XpLevels from '../../XP/XpLevels';

function CreateNewProposal({ isOpen, onClose, onSuccess }) {
    const [clients, setClients] = useState([]);
    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        clientId: '',
        bankId: '',
        proposalType: '',
        storeCompany: '',
        agreement: '',
        proposalContent: '',
        isTrueContract: false
    });

    useEffect(() => {
        if (isOpen) {
            loadClients();
            loadBanks();
        }
    }, [isOpen]);

    const loadClients = async () => {
        try {
            const colaboratorData = JSON.parse(localStorage.getItem('colaboratorData'));
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/client/find-all?colaboratorId=${colaboratorData.user.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${colaboratorData.token}`
                    }
                }
            );
            setClients(response.data);
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            toast.error('Erro ao carregar clientes');
        }
    };

    const loadBanks = async () => {
        try {
            const colaboratorData = JSON.parse(localStorage.getItem('colaboratorData'));
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/bank/list`,
                {
                    headers: {
                        'Authorization': `Bearer ${colaboratorData.token}`
                    }
                }
            );
            setBanks(response.data);
        } catch (error) {
            console.error('Erro ao carregar bancos:', error);
            toast.error('Erro ao carregar bancos');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const colaboratorData = JSON.parse(localStorage.getItem('colaboratorData'));
            
            const proposalData = {
                ...formData,
                colaboratorId: colaboratorData.user.id,
                proposalDate: new Date().toISOString(),
                isTrueContract: false
            };

            // Criar proposta
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/proposal/create-proposal`,
                proposalData,
                {
                    headers: {
                        'Authorization': `Bearer ${colaboratorData.token}`
                    }
                }
            );

            // Atualizar XP do colaborador (+1200 XP)
            const newXp = (colaboratorData.user.experience || 0) + 1200;
            
            // Calcular novo level
            let newLevel = 1;
            Object.entries(XpLevels).forEach(([levelKey, xpRequired]) => {
                if (newXp >= xpRequired) {
                    newLevel = parseInt(levelKey.replace('level', ''));
                }
            });

            // Atualizar colaborador no backend
            await axios.patch(
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

            // Atualizar dados no localStorage
            localStorage.setItem('colaboratorData', JSON.stringify({
                ...colaboratorData,
                user: {
                    ...colaboratorData.user,
                    experience: newXp,
                    level: newLevel
                }
            }));

            toast.success('Proposta criada com sucesso!');

            // Mostrar mensagem de XP ganho
            toast.success(
                <div className="flex flex-col items-center gap-1">
                    <span>+1200 XP</span>
                    <span className="text-sm">Proposta criada!</span>
                </div>
            );

            // Mostrar mensagem de level up se necessário
            if (newLevel > colaboratorData.user.level) {
                toast.success(
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-lg font-bold">🎉 Level Up! 🎉</span>
                        <span>Você evoluiu para o nível {newLevel}!</span>
                    </div>
                );
            }

            onSuccess(response.data);
            onClose();
        } catch (error) {
            console.error('Erro ao criar proposta:', error);
            toast.error(error.response?.data?.message || 'Erro ao criar proposta');
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
                className="bg-[#1f1f1f] rounded-xl p-6 w-full max-w-2xl"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Nova Proposta</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <Close />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Seleção de Cliente */}
                    <div>
                        <label className="text-sm text-gray-400 block mb-2">
                            Selecione o Cliente
                        </label>
                        <div className="relative">
                            <Person className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select
                                value={formData.clientId}
                                onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
                                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                                required
                            >
                                <option value="">Selecione um cliente</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>
                                        {client.name} - CPF: {client.cpf}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Seleção de Banco */}
                    <div>
                        <label className="text-sm text-gray-400 block mb-2">
                            Selecione o Banco
                        </label>
                        <div className="relative">
                            <AccountBalance className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select
                                value={formData.bankId}
                                onChange={(e) => setFormData(prev => ({ ...prev, bankId: e.target.value }))}
                                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                                required
                            >
                                <option value="">Selecione um banco</option>
                                {banks.map(bank => (
                                    <option key={bank.id} value={bank.id}>
                                        {bank.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Tipo de Proposta */}
                    <div>
                        <label className="text-sm text-gray-400 block mb-2">
                            Tipo de Proposta
                        </label>
                        <input
                            type="text"
                            value={formData.proposalType}
                            onChange={(e) => setFormData(prev => ({ ...prev, proposalType: e.target.value }))}
                            className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white"
                            placeholder="Ex: Empréstimo Consignado"
                            required
                        />
                    </div>

                    {/* Empresa/Loja */}
                    <div>
                        <label className="text-sm text-gray-400 block mb-2">
                            Empresa/Loja
                        </label>
                        <input
                            type="text"
                            value={formData.storeCompany}
                            onChange={(e) => setFormData(prev => ({ ...prev, storeCompany: e.target.value }))}
                            className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white"
                            placeholder="Nome da empresa ou loja"
                            required
                        />
                    </div>

                    {/* Convênio */}
                    <div>
                        <label className="text-sm text-gray-400 block mb-2">
                            Convênio
                        </label>
                        <input
                            type="text"
                            value={formData.agreement}
                            onChange={(e) => setFormData(prev => ({ ...prev, agreement: e.target.value }))}
                            className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white"
                            placeholder="Número ou nome do convênio"
                            required
                        />
                    </div>

                    {/* Conteúdo da Proposta */}
                    <div>
                        <label className="text-sm text-gray-400 block mb-2">
                            Conteúdo da Proposta
                        </label>
                        <textarea
                            value={formData.proposalContent}
                            onChange={(e) => setFormData(prev => ({ ...prev, proposalContent: e.target.value }))}
                            className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white h-32"
                            placeholder="Detalhes da proposta..."
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-[#e67f00] hover:bg-[#ff8c00] rounded-lg 
                                transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Criando...' : 'Criar Proposta'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

export default CreateNewProposal;