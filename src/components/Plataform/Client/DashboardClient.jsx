import { Search } from "@mui/icons-material"
import ClientNavigation from "./components/ClientNavigation"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useDispatch } from "react-redux"
import { setClientProposals, setSelectedProposal } from "../../../features/proposal/ProposalSlice"

function DashboardClient() {
    const [clientInformations, setClientInformations] = useState(null)
    const [filteredProposals, setFilteredProposals] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        console.log("observando dados do cliente -> ", clientInformations)
        
        // Atualizar o Redux store com as propostas do cliente
        if (clientInformations?.proposals) {
            dispatch(setClientProposals(clientInformations.proposals))
        }
        
        // Filtrar propostas quando os dados do cliente ou o termo de busca mudar
        if (clientInformations?.proposals) {
            if (searchTerm.trim() === "") {
                setFilteredProposals(clientInformations.proposals)
            } else {
                const term = searchTerm.toLowerCase()
                const filtered = clientInformations.proposals.filter(proposal => 
                    proposal.proposalType.toLowerCase().includes(term) ||
                    proposal.storeCompany.toLowerCase().includes(term) ||
                    proposal.agreement.toLowerCase().includes(term) ||
                    proposal.bank?.name.toLowerCase().includes(term)
                )
                setFilteredProposals(filtered)
            }
        }
    }, [clientInformations, searchTerm, dispatch])

    const handleProposalClick = (proposalId) => {
        // Encontrar a proposta completa
        const selectedProposal = clientInformations.proposals.find(p => p.id === proposalId);
        
        // Salvar no Redux
        if (selectedProposal) {
            dispatch(setSelectedProposal(selectedProposal));
        }
        
        navigate(`/client/proposal/${proposalId}`);
    }

    // Formatar data para exibição
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('pt-BR')
    }

    // Formatar valor para exibição
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    return (
        <div className="w-full min-h-[100vh] flex flex-col justify-start items-center 
        bg-gradient-to-b from-[#133785] to-[#0a1c42] gap-2 sm:gap-3">

            <ClientNavigation setClientInformations={setClientInformations} />

            <section className="flex flex-col min-h-[90vh] sm:h-[88vh] w-full bg-[#ffffff18] border-[1px] border-[#ffffff2f] p-3 sm:p-4 
            max-w-[1200px] justify-start items-center rounded-lg gap-2 sm:gap-4 pb-6">

                <span className="font-bold text-white w-full text-left text-lg sm:text-2xl my-1 sm:my-2">Suas propostas</span>
                <div className="w-full flex items-center gap-2 bg-white/5 
                        border border-white/10 rounded-lg px-3 py-2.5 md:py-2">
                    <Search className="text-gray-400 text-xl" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar propostas..."
                        className="bg-transparent outline-none text-sm w-full text-white placeholder-gray-400"
                    />
                </div>

                {/* Grid de Cards de Propostas */}
                <div className="w-full flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-1 sm:p-2 pb-4">
                    {!clientInformations?.proposals || filteredProposals.length === 0 ? (
                        <div className="col-span-full flex flex-col justify-center items-center text-gray-400 h-40 text-center p-4">
                            {!clientInformations?.proposals ? (
                                <>
                                    <div className="w-8 h-8 border-3 border-[#e67f00] border-t-transparent rounded-full animate-spin mb-3"></div>
                                    <p>Carregando propostas...</p>
                                </>
                            ) : (
                                <>
                                    <p className="mb-2">Nenhuma proposta encontrada.</p>
                                    <p className="text-sm opacity-80">Tente outro termo de busca ou verifique com seu gerente.</p>
                                </>
                            )}
                        </div>
                    ) : (
                        filteredProposals.map(proposal => (
                            <motion.div
                                key={proposal.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleProposalClick(proposal.id)}
                                className="bg-white/10 hover:bg-white/15 rounded-xl p-3 sm:p-4 cursor-pointer transition-all border border-white/10 hover:border-white/20 shadow-sm hover:shadow-md"
                            >
                                <div className="flex justify-between items-start mb-2 sm:mb-3">
                                    <div>
                                        <h3 className="text-white font-medium capitalize text-base sm:text-lg">{proposal.proposalType}</h3>
                                        <p className="text-xs sm:text-sm text-gray-400">{proposal.bank?.name || "Banco não especificado"}</p>
                                    </div>
                                    <div className={`px-2 sm:px-3 py-1 rounded-full text-xs ${proposal.isTrueContract ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        {proposal.isTrueContract ? 'Contrato' : 'Em análise'}
                                    </div>
                                </div>
                                
                                <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 text-xs sm:text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Loja:</span>
                                        <span className="text-white font-light">{proposal.storeCompany}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Convênio:</span>
                                        <span className="text-white font-light">{proposal.agreement}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Valor:</span>
                                        <span className="text-white font-medium">{formatCurrency(proposal.contractValue)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Parcelas:</span>
                                        <span className="text-white font-light">{proposal.contractInstallments}x</span>
                                    </div>
                                </div>
                                
                                <div className="text-right text-xs text-gray-400 border-t border-white/10 pt-2">
                                    <span className="bg-white/5 px-2 py-1 rounded-md inline-block">
                                        {formatDate(proposal.proposalDate)}
                                    </span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
                
                {/* Mensagem de rodapé para dispositivos móveis */}
                <div className="text-center text-xs text-gray-400 mt-auto pt-2 block sm:hidden w-full">
                    <p>Toque em uma proposta para ver detalhes</p>
                </div>
            </section>

        </div>
    )
}

export default DashboardClient