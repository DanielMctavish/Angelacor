import { useState } from 'react';
import { motion } from 'framer-motion';
import { Close, Person, Description, CheckCircle, Cancel } from '@mui/icons-material';
import axios from 'axios';
import { toast } from '../../../../Common/Toast/Toast';

function AnalyzeProposalModal({ isOpen, onClose, proposal, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [decision, setDecision] = useState(null);
    const [observations, setObservations] = useState('');

    if (!isOpen || !proposal) return null;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const handleAnalyze = async (approved) => {
        setLoading(true);
        try {
            const colaboratorData = JSON.parse(localStorage.getItem('colaboratorData'));
            
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/proposal/update?proposalId=${proposal.id}`,
                {
                    isTrueContract: approved,
                    managerObservations: observations,
                    analyzedAt: new Date()
                },
                {
                    headers: {
                        'Authorization': `Bearer ${colaboratorData.token}`
                    }
                }
            );

            toast.success(`Proposta ${approved ? 'aprovada' : 'reprovada'} com sucesso!`);
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Erro ao analisar proposta:', error);
            toast.error('Erro ao analisar proposta');
        } finally {
            setLoading(false);
        }
    };

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
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-white">Análise de Proposta</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                    >
                        <Close />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Informações do Cliente */}
                    <div className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-[#e67f00] mb-4">Cliente</h3>
                        <div className="flex items-center gap-4">
                            {proposal.client?.url_profile_cover ? (
                                <img
                                    src={proposal.client.url_profile_cover}
                                    alt={proposal.client.name}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center">
                                    <Person className="text-gray-400 text-3xl" />
                                </div>
                            )}
                            <div>
                                <h4 className="text-white font-medium">{proposal.client?.name}</h4>
                                <p className="text-gray-400">{proposal.client?.cpf}</p>
                            </div>
                        </div>
                    </div>

                    {/* Detalhes da Proposta */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/5 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-[#e67f00] mb-4">Detalhes da Proposta</h3>
                            <div className="space-y-2">
                                <p className="text-gray-300">
                                    <span className="text-gray-400">Banco:</span> {proposal.bank?.name}
                                </p>
                                <p className="text-gray-300">
                                    <span className="text-gray-400">Tipo:</span> {proposal.proposalType}
                                </p>
                                <p className="text-gray-300">
                                    <span className="text-gray-400">Data:</span> {formatDate(proposal.proposalDate)}
                                </p>
                                <p className="text-gray-300">
                                    <span className="text-gray-400">Valor:</span> {formatCurrency(proposal.value)}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-[#e67f00] mb-4">Responsável</h3>
                            <div className="flex items-center gap-4">
                                {proposal.Colaborator?.url_profile_cover ? (
                                    <img
                                        src={proposal.Colaborator.url_profile_cover}
                                        alt={proposal.Colaborator.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center">
                                        <Person className="text-gray-400 text-3xl" />
                                    </div>
                                )}
                                <div>
                                    <h4 className="text-white font-medium">{proposal.Colaborator?.name}</h4>
                                    <p className="text-gray-400">{proposal.Colaborator?.function}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Área de Análise */}
                    <div className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-[#e67f00] mb-4">Análise</h3>
                        <div className="space-y-4">
                            <textarea
                                value={observations}
                                onChange={(e) => setObservations(e.target.value)}
                                placeholder="Observações sobre a proposta..."
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white resize-none h-32"
                            />
                            
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => handleAnalyze(false)}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 
                                        text-red-500 rounded-lg transition-colors"
                                >
                                    <Cancel />
                                    Reprovar
                                </button>
                                <button
                                    onClick={() => handleAnalyze(true)}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 
                                        text-green-500 rounded-lg transition-colors"
                                >
                                    <CheckCircle />
                                    Aprovar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default AnalyzeProposalModal; 