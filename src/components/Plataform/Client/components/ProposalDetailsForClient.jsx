import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack, Description, AttachMoney, AccountBalance, Article, DoneAll } from '@mui/icons-material';
import { toast } from '../../../Common/Toast/Toast';
import ClientNavigation from './ClientNavigation';
import { useSelector } from 'react-redux';
import { selectSelectedProposal, selectClientProposals } from '../../../../features/proposal/ProposalSlice';
import DigitalSignature from './DigitalSignature';

function ProposalDetailsForClient() {
    const { proposalId } = useParams();
    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [signatureSuccess, setSignatureSuccess] = useState(false);
    const navigate = useNavigate();
    
    // Obter a proposta selecionada e a lista de propostas do Redux
    const selectedProposal = useSelector(selectSelectedProposal);
    const clientProposals = useSelector(selectClientProposals);

    useEffect(() => {
        // Tentar usar a proposta selecionada do Redux
        if (selectedProposal && selectedProposal.id === proposalId) {
            setProposal(selectedProposal);
            setLoading(false);
            return;
        }
        
        // Se não houver proposta selecionada, procurar na lista de propostas
        if (clientProposals && clientProposals.length > 0) {
            const foundProposal = clientProposals.find(p => p.id === proposalId);
            if (foundProposal) {
                setProposal(foundProposal);
                setLoading(false);
                return;
            }
        }
        
        // Se não encontrou a proposta nem no estado selecionado nem na lista
        if (!selectedProposal || selectedProposal.id !== proposalId) {
            toast.error('Proposta não encontrada. Voltando para a lista...');
            setTimeout(() => navigate('/dashboard-client'), 2000);
        }
        
        setLoading(false);
    }, [proposalId, navigate, selectedProposal, clientProposals]);

    // Formatar data para exibição
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    // Formatar valor monetário
    const formatCurrency = (value) => {
        if (!value && value !== 0) return 'N/A';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    // Calcular valor da parcela
    const calculateInstallmentValue = () => {
        if (!proposal) return 'N/A';
        if (!proposal.contractValue || !proposal.contractInstallments) return 'N/A';
        
        const value = proposal.contractValue / proposal.contractInstallments;
        return formatCurrency(value);
    };

    // Manipular o sucesso da assinatura
    const handleSignatureSuccess = (signatureData) => {
        setProposal(prev => ({
            ...prev,
            clientSignature: signatureData
        }));
        setSignatureSuccess(true);
    };

    // Função vazia para o ClientNavigation
    const setClientInformationsStub = () => {};

    // Verificar se o contrato já foi assinado
    const isContractSigned = proposal?.clientSignature ? true : false;

    return (
        <div className="w-full min-h-[100vh] flex flex-col justify-start items-center 
        bg-gradient-to-b from-[#133785] to-[#0a1c42] gap-3">
            
            <ClientNavigation setClientInformations={setClientInformationsStub} />
            
            <section className="flex flex-col w-full bg-[#ffffff18] border-[1px] border-[#ffffff2f] p-4 
            max-w-[1200px] justify-start items-center rounded-lg gap-4 mb-4">
                
                {/* Header com botão de voltar */}
                <div className="w-full flex justify-between items-center">
                    <button 
                        onClick={() => navigate('/dashboard-client')}
                        className="flex items-center gap-2 text-white hover:text-[#e67f00] transition-colors"
                    >
                        <ArrowBack /> Voltar para propostas
                    </button>
                    
                    {!loading && proposal && (
                        <div className={`px-4 py-1 rounded-full text-sm ${proposal.isTrueContract ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {proposal.isTrueContract ? 'Contrato Aprovado' : 'Em Análise'}
                        </div>
                    )}
                </div>
                
                {loading ? (
                    <div className="w-full h-64 flex justify-center items-center">
                        <div className="w-10 h-10 border-4 border-[#e67f00] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : !proposal ? (
                    <div className="w-full h-64 flex justify-center items-center text-white">
                        Proposta não encontrada ou você não tem permissão para visualizá-la.
                    </div>
                ) : (
                    <>
                        {/* Título da proposta */}
                        <div className="w-full text-center py-4">
                            <h1 className="text-2xl font-bold text-white capitalize">{proposal.proposalType}</h1>
                            <p className="text-gray-400">{proposal.bank?.name}</p>
                        </div>
                        
                        {/* Exibição do Contrato quando aprovado e possui texto */}
                        {(proposal.isTrueContract || proposal.contractStatus === 'aprovado') && proposal.contractContent && (
                            <div className="w-full bg-white/10 p-4 rounded-lg border border-white/10 mb-4">
                                <div className="flex items-center gap-2 mb-4 text-[#e67f00]">
                                    <Article />
                                    <h2 className="text-lg font-medium">Contrato Aprovado</h2>
                                    {isContractSigned && (
                                        <div className="ml-auto px-3 py-1 bg-green-500/20 text-green-400 rounded-full flex items-center gap-1">
                                            <DoneAll />
                                            <span className="text-sm">Assinado digitalmente</span>
                                        </div>
                                    )}
                                </div>
                                <div className="bg-white p-6 rounded-lg text-black">
                                    <div 
                                        className="prose max-w-none" 
                                        dangerouslySetInnerHTML={{ __html: proposal.contractContent }}
                                    />
                                </div>
                                
                                {/* Componente de Assinatura Digital */}
                                {(proposal.isTrueContract || proposal.contractStatus === 'aprovado') && 
                                 !isContractSigned && !signatureSuccess && (
                                    <DigitalSignature 
                                        proposal={proposal} 
                                        onSignSuccess={handleSignatureSuccess} 
                                    />
                                )}
                                
                                {signatureSuccess && (
                                    <div className="mt-4 bg-green-500/20 p-4 rounded-lg">
                                        <div className="flex items-center text-green-400 mb-2">
                                            <DoneAll className="mr-2" />
                                            <h3 className="font-medium">Contrato Assinado com Sucesso!</h3>
                                        </div>
                                        <p className="text-white text-sm">
                                            Sua assinatura digital foi registrada com sucesso. O contrato está agora legalmente vinculado.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* Cards de informações */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                            {/* Card de Informações Básicas */}
                            <div className="bg-white/10 p-4 rounded-lg border border-white/10">
                                <div className="flex items-center gap-2 mb-4 text-[#e67f00]">
                                    <Description />
                                    <h2 className="text-lg font-medium">Informações Básicas</h2>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-gray-400 text-sm">Tipo:</span>
                                        <p className="text-white">{proposal.proposalType}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 text-sm">Data da Proposta:</span>
                                        <p className="text-white">{formatDate(proposal.proposalDate)}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 text-sm">Loja/Empresa:</span>
                                        <p className="text-white">{proposal.storeCompany}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 text-sm">Convênio:</span>
                                        <p className="text-white">{proposal.agreement}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Card de Informações Financeiras */}
                            <div className="bg-white/10 p-4 rounded-lg border border-white/10">
                                <div className="flex items-center gap-2 mb-4 text-[#e67f00]">
                                    <AttachMoney />
                                    <h2 className="text-lg font-medium">Informações Financeiras</h2>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-gray-400 text-sm">Valor do Contrato:</span>
                                        <p className="text-white">{formatCurrency(proposal.contractValue)}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 text-sm">Quantidade de Parcelas:</span>
                                        <p className="text-white">{proposal.contractInstallments}x</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 text-sm">Valor da Parcela:</span>
                                        <p className="text-white">{calculateInstallmentValue()}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 text-sm">Taxa de Juros:</span>
                                        <p className="text-white">{proposal.contractInterestRate}% a.m.</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Card de Status do Contrato */}
                            <div className="bg-white/10 p-4 rounded-lg border border-white/10">
                                <div className="flex items-center gap-2 mb-4 text-[#e67f00]">
                                    <AccountBalance />
                                    <h2 className="text-lg font-medium">Status do Contrato</h2>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-gray-400 text-sm">Status:</span>
                                        <p className={`${proposal.isTrueContract ? 'text-green-400' : 'text-yellow-400'} font-medium`}>
                                            {proposal.isTrueContract ? 'Contrato Aprovado' : 'Em Análise'}
                                        </p>
                                    </div>
                                    {proposal.isTrueContract && (
                                        <>
                                            <div>
                                                <span className="text-gray-400 text-sm">Parcelas Restantes:</span>
                                                <p className="text-white">{proposal.contractRemainingInstallments || 'N/A'}</p>
                                            </div>
                                            {proposal.contractStatus && (
                                                <div>
                                                    <span className="text-gray-400 text-sm">Status do Pagamento:</span>
                                                    <p className="text-white">{proposal.contractStatus}</p>
                                                </div>
                                            )}
                                            <div>
                                                <span className="text-gray-400 text-sm">Assinatura Digital:</span>
                                                <p className={`${isContractSigned ? 'text-green-400' : 'text-yellow-400'} font-medium`}>
                                                    {isContractSigned ? 'Contrato Assinado' : 'Aguardando Assinatura'}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Conteúdo da Proposta */}
                        {proposal.proposalContent && (
                            <div className="w-full bg-white/10 p-4 rounded-lg border border-white/10 mt-4">
                                <div className="flex items-center gap-2 mb-4 text-[#e67f00]">
                                    <Description />
                                    <h2 className="text-lg font-medium">Detalhes da Proposta</h2>
                                </div>
                                <p className="text-white whitespace-pre-wrap">{proposal.proposalContent}</p>
                            </div>
                        )}
                        
                        {/* Informação de Contato */}
                        <div className="w-full bg-white/10 p-4 rounded-lg border border-white/10 mt-4">
                            <div className="text-center">
                                <p className="text-gray-400 mb-2">
                                    Para mais informações sobre sua proposta, entre em contato com a nossa central de atendimento.
                                </p>
                                <p className="text-[#e67f00] font-medium">
                                    Central de Atendimento: (41) 99626-6007
                                </p>
                                <p className="text-gray-400">
                                    Email: operacional@triunfocorrespondente.com.br
                                </p>
                            </div>
                        </div>
                    </>
                )}
                
            </section>
        </div>
    );
}

export default ProposalDetailsForClient;