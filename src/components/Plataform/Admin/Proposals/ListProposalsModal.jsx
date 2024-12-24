import { Close, Assignment, AccountBalance, Business, Handshake } from '@mui/icons-material';

function ListProposalsModal({ isOpen, onClose, client }) {
    if (!isOpen || !client) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-[#1a1a1a] rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto text-gray-100">
                <div className="sticky top-0 bg-[#133785] p-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Assignment className="text-2xl" />
                        Propostas de {client.name}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded-full transition-all"
                    >
                        <Close className="text-white" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {client.proposals.map((proposal, index) => (
                        <div 
                            key={proposal.id} 
                            className="bg-[#31313187] p-4 rounded-lg border border-gray-700/50 space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-400">Proposta #{index + 1}</span>
                                <span className="text-xs bg-[#133785] px-3 py-1 rounded-full">
                                    {proposal.proposalType}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <span className="text-sm text-gray-400 flex items-center gap-2">
                                        <AccountBalance className="text-sm" />
                                        Banco
                                    </span>
                                    <p className="text-white">{proposal.bank?.name || 'N/A'}</p>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-sm text-gray-400 flex items-center gap-2">
                                        <Business className="text-sm" />
                                        Empresa/Loja
                                    </span>
                                    <p className="text-white">{proposal.storeCompany}</p>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-sm text-gray-400 flex items-center gap-2">
                                        <Handshake className="text-sm" />
                                        Convênio
                                    </span>
                                    <p className="text-white">{proposal.agreement}</p>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-sm text-gray-400">Data da Proposta</span>
                                    <p className="text-white">
                                        {new Date(proposal.proposalDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ListProposalsModal; 