import { Close, Person, Description, AccountBalance, Calculate, Chat, WhatsApp } from '@mui/icons-material';
import { motion } from 'framer-motion';
import ProposalChatAdm from '../Proposals/ProposalChatAdm';
import { useState } from 'react';
import axios from 'axios';
import { toast } from '../../../Common/Toast/Toast';
import SimulationsModal from '../Proposals/SimulationsModal';

function ClientDetailsModal({ isOpen, onClose, client }) {
    const [selectedProposalForChat, setSelectedProposalForChat] = useState(null);
    const [selectedSimulations, setSelectedSimulations] = useState(null);

    if (!isOpen || !client) return null;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    // Função para atualizar a proposta
    const handleProposalUpdate = async (proposalId) => {
        try {
            const adminData = JSON.parse(localStorage.getItem('adminToken'));
            
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/proposal/find?proposalId=${proposalId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${adminData.token}`
                    }
                }
            );

            if (response.data) {
                // Atualizar a proposta na lista
                const updatedClient = {
                    ...client,
                    proposals: client.proposals.map(p => 
                        p.id === proposalId ? response.data : p
                    )
                };
                // Atualizar a proposta selecionada
                setSelectedProposalForChat(response.data);
            }
        } catch (error) {
            console.error('Erro ao atualizar proposta:', error);
            toast.error('Erro ao atualizar proposta');
        }
    };

    const handleWhatsAppClick = (phone, proposalType, bankName) => {
        const message = encodeURIComponent(
            `Olá ${client.name}, tudo bem? Vim conversar sobre sua proposta de ${proposalType} no ${bankName}.`
        );
        
        // Formatar o número de telefone (remover caracteres não numéricos)
        const formattedPhone = phone.replace(/\D/g, '');
        
        // Abrir WhatsApp em nova aba
        window.open(`https://wa.me/55${formattedPhone}?text=${message}`, '_blank');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0a1f4d] backdrop-blur-sm z-50 p-[30px]"
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-br from-[#ffffff] to-[#e4e4e4] rounded-xl w-full h-full flex flex-col shadow-2xl"
            >
                {/* Header */}
                <div className="p-8 border-b border-white/10 bg-[#133785]">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            {client.url_profile_cover ? (
                                <img 
                                    src={client.url_profile_cover} 
                                    alt={client.name} 
                                    className="w-16 h-16 rounded-full object-cover border-2 border-[#e67f00]"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-[#e67f00]/20 flex items-center justify-center border-2 border-[#e67f00]">
                                    <Person className="text-[#e67f00] text-3xl" />
                                </div>
                            )}
                            <div>
                                <h2 className="text-2xl font-bold text-white">{client.name}</h2>
                                <p className="text-[#a9f1ff]">Cliente desde {formatDate(client.createdAt)}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-white/70 hover:text-white hover:bg-[#e67f00] rounded-lg transition-all"
                        >
                            <Close />
                        </button>
                    </div>
                </div>

                {/* Conteúdo Principal com Scroll */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
                    {/* Informações do Cliente */}
                    <div className="bg-[#133785] backdrop-blur-sm 
                    rounded-lg p-6 border border-white/10 hover:border-[#e67f00]/50 
                    transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-[#e67f00] flex items-center gap-2">
                                <Person className="text-[#e67f00]" />
                                Informações do Cliente
                            </h3>
                            <button
                                onClick={() => handleWhatsAppClick(
                                    client.phone,
                                    'seus contratos', // Mensagem mais genérica
                                    'Angel Cor'
                                )}
                                className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors px-3 py-2 rounded-lg hover:bg-green-400/10"
                            >
                                <WhatsApp />
                                <span>Conversar no WhatsApp</span>
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div>
                                <span className="text-[#a9f1ff] block text-sm">Email</span>
                                <span className="text-white">{client.email}</span>
                            </div>
                            <div>
                                <span className="text-[#a9f1ff] block text-sm">Telefone</span>
                                <span className="text-white">{client.phone}</span>
                            </div>
                            <div>
                                <span className="text-[#a9f1ff] block text-sm">CPF</span>
                                <span className="text-white">{client.cpf}</span>
                            </div>
                            <div>
                                <span className="text-[#a9f1ff] block text-sm">Benefício</span>
                                <span className="text-white">{client.matriculaBeneficio || 'Não informado'}</span>
                            </div>
                            <div>
                                <span className="text-[#a9f1ff] block text-sm">Responsável</span>
                                <span className="text-white">{client.colaborator?.name || 'Não atribuído'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Lista de Propostas */}
                    <div className="bg-[#133785]  backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-[#e67f00]/50 transition-colors">
                        <h3 className="text-lg font-semibold text-[#e67f00] mb-4 flex items-center gap-2">
                            <Description className="text-[#e67f00]" /> 
                            Propostas ({client.proposals?.length || 0})
                        </h3>
                        
                        {client.proposals?.length > 0 ? (
                            <div className="space-y-4">
                                {client.proposals.map((proposal, index) => (
                                    <div key={index} className="bg-[#133785]/30 p-4 rounded-lg border border-white/10 hover:border-[#e67f00]/50 transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <AccountBalance className="text-[#e67f00]" />
                                                <div>
                                                    <h4 className="text-white font-medium">{proposal.bank?.name}</h4>
                                                    <p className="text-sm text-gray-400">{proposal.proposalType}</p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs ${
                                                proposal.isTrueContract
                                                    ? 'bg-green-500/20 text-green-500'
                                                    : 'bg-yellow-500/20 text-yellow-500'
                                            }`}>
                                                {proposal.isTrueContract ? 'Contrato' : 'Em análise'}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-400 block">Valor</span>
                                                <span className="text-green-400">{formatCurrency(proposal.contractValue)}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 block">Parcelas</span>
                                                <span className="text-white">{proposal.contractInstallments}x</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 block">Taxa</span>
                                                <span className="text-white">{proposal.contractInterestRate}% a.m.</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 block">Data</span>
                                                <span className="text-white">{formatDate(proposal.proposalDate)}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 mt-4 text-sm">
                                            <button
                                                onClick={() => setSelectedSimulations(proposal.currentSimulations)}
                                                className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
                                            >
                                                <Calculate className="text-sm" />
                                                <span>{proposal.currentSimulations?.length || 0} simulações</span>
                                            </button>
                                            <button
                                                onClick={() => setSelectedProposalForChat(proposal)}
                                                className="flex items-center gap-1 text-orange-400 hover:text-orange-300 transition-colors"
                                            >
                                                <Chat className="text-sm" />
                                                <span>{proposal.observations?.length || 0} mensagens</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-[#a9f1ff]">
                                Nenhuma proposta encontrada
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            <ProposalChatAdm
                isOpen={!!selectedProposalForChat}
                onClose={() => setSelectedProposalForChat(null)}
                proposal={selectedProposalForChat}
                onMessageSent={() => selectedProposalForChat && handleProposalUpdate(selectedProposalForChat.id)}
            />

            <SimulationsModal
                isOpen={!!selectedSimulations}
                onClose={() => setSelectedSimulations(null)}
                simulations={selectedSimulations || []}
            />
        </motion.div>
    );
}

export default ClientDetailsModal; 