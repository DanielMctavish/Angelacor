import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Close, Person, AccountBalance, Description, AttachMoney, Calculate, Send, History } from '@mui/icons-material';
import axios from 'axios';
import { toast } from '../../../Common/Toast/Toast';

function ProposalDetails({ isOpen, onClose, proposal: initialProposal, onMessageSent }) {
    const [proposal, setProposal] = useState(initialProposal);
    const [saldoDevedorDisplay, setSaldoDevedorDisplay] = useState('');
    const [valorTotalDisplay, setValorTotalDisplay] = useState('');
    const [economiaTotalDisplay, setEconomiaTotalDisplay] = useState('');
    const [simulationData, setSimulationData] = useState({
        parcela: '',
        taxa: '',
        prazoRestante: ''
    });
    const [newSimulation, setNewSimulation] = useState({
        margem: '',
        novaTaxa: '',
        novoPrazo: ''
    });
    const [resultBruto, setResultBruto] = useState('');
    const [observations, setObservations] = useState([]);
    const [newObservation, setNewObservation] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);
    const [showSimulations, setShowSimulations] = useState(false);

    // Atualiza o estado local quando a prop muda
    useEffect(() => {
        setProposal(initialProposal);
        if (initialProposal) {
            const parcelaAtual = (initialProposal.contractValue / initialProposal.contractInstallments).toFixed(2);
            setSimulationData({
                parcela: parcelaAtual,
                taxa: initialProposal.contractInterestRate?.toString() || '',
                prazoRestante: initialProposal.contractRemainingInstallments?.toString() || ''
            });
        }
        if (initialProposal?.observations) {
            const uniqueObservations = initialProposal.observations.filter(
                (obs, index, self) => index === self.findIndex((o) => o.createdAt === obs.createdAt)
            );
            setObservations(uniqueObservations);
        }
    }, [initialProposal]);

    // Calcula o resultado da simulação em tempo real quando simulationData muda
    useEffect(() => {
        const parcela = parseFloat(simulationData.parcela) || 0;
        const taxa = parseFloat(simulationData.taxa) / 100 || 0;
        const prazoRestante = parseInt(simulationData.prazoRestante) || 0;

        if (parcela && taxa && prazoRestante) {
            const saldoDevedor = calcularSaldoDevedorVP(parcela, taxa, prazoRestante);
            const valorTotal = parcela * prazoRestante;
            const economiaTotal = valorTotal - saldoDevedor;

            setSaldoDevedorDisplay(saldoDevedor.toFixed(2));
            setValorTotalDisplay(valorTotal.toFixed(2));
            setEconomiaTotalDisplay(economiaTotal.toFixed(2));
        } else {
            setSaldoDevedorDisplay('');
            setValorTotalDisplay('');
            setEconomiaTotalDisplay('');
        }
    }, [simulationData]);

    // Função para calcular o saldo devedor
    const calcularSaldoDevedorVP = (parcela, taxa, prazoRestante) => {
        if (!parcela || !taxa || !prazoRestante) return 0;
        return parcela * ((1 - Math.pow(1 + taxa, -prazoRestante)) / taxa);
    };

    const calcContratoBruto = () => {
        const parcelaBase = parseFloat(simulationData.parcela) || 0;
        const margem = parseFloat(newSimulation.margem) || 0;
        const novaTaxa = parseFloat(newSimulation.novaTaxa) / 100 || 0;
        const novoPrazo = parseInt(newSimulation.novoPrazo) || 0;

        const result = calcularSaldoDevedorVP(parcelaBase + margem, novaTaxa, novoPrazo);
        
        const currentSaldoDevedor = calcularSaldoDevedorVP(simulationData.parcela, (simulationData.taxa / 100), simulationData.prazoRestante)
        const IOF = (result - currentSaldoDevedor) * (6.5 / 100)
        
        setResultBruto((result - currentSaldoDevedor) - IOF);
    };

    // Handle changes nos campos de simulação
    const handleSimulationChange = (e) => {
        const { name, value } = e.target;
        setSimulationData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle changes nos campos de nova simulação
    const handleNewSimulationChange = (e) => {
        const { name, value } = e.target;
        setNewSimulation((prev) => ({ ...prev, [name]: value }));
    };

    // Função para salvar a simulação
    const handleSaveSimulation = async () => {
        try {
            const saldoDevedor = calcularSaldoDevedorVP(
                parseFloat(simulationData.parcela),
                parseFloat(simulationData.taxa) / 100,
                parseInt(simulationData.prazoRestante)
            );

            const simulationResult = {
                ...simulationData,
                saldoDevedor,
                date: new Date().toISOString()
            };

            const colaboratorData = JSON.parse(localStorage.getItem('colaboratorData'));
            const updatedSimulations = [...(proposal.currentSimulations || []), simulationResult];

            await axios.patch(
                `${import.meta.env.VITE_API_URL}/proposal/update?proposalId=${proposal.id}`,
                { currentSimulations: updatedSimulations },
                { headers: { 'Authorization': `Bearer ${colaboratorData.token}` } }
            );

            setProposal((prev) => ({ ...prev, currentSimulations: updatedSimulations }));
            toast.success('Simulação salva com sucesso!');
            setSimulationData({ parcela: '', taxa: '', prazoRestante: '' });
        } catch (error) {
            console.error('Erro ao salvar simulação:', error);
            toast.error('Erro ao salvar simulação');
        }
    };

    // Função para adicionar observação
    const handleAddObservation = async () => {
        if (!newObservation.trim() || sendingMessage) return;
        setSendingMessage(true);
        try {
            const colaboratorData = JSON.parse(localStorage.getItem('colaboratorData'));
            const newObservationData = {
                observation: newObservation.trim(),
                colaboratorId: colaboratorData.user.id
            };

            await axios.patch(
                `${import.meta.env.VITE_API_URL}/proposal/update?proposalId=${proposal.id}`,
                { observations: [newObservationData] },
                { headers: { 'Authorization': `Bearer ${colaboratorData.token}` } }
            );

            const observationWithMetadata = {
                ...newObservationData,
                colaborator: colaboratorData.user,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            setObservations((prev) => [...prev, observationWithMetadata]);
            setNewObservation('');
            toast.success('Mensagem enviada!');
            onMessageSent?.();
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            toast.error('Erro ao enviar mensagem');
        } finally {
            setSendingMessage(false);
        }
    };

    // Formata o tempo relativo
    const formatRelativeTime = (date) => {
        const now = new Date();
        const diff = now - new Date(date);
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'agora mesmo';
        if (minutes < 60) return `há ${minutes} minutos`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `há ${hours} horas`;
        const days = Math.floor(hours / 24);
        if (days === 1) return 'há 1 dia';
        if (days < 7) return `há ${days} dias`;
        return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
    };

    if (!isOpen || !proposal) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 p-5"
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-[#1f1f1f] rounded-xl p-6 w-full h-full overflow-y-auto flex flex-col"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Detalhes da Proposta</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <Close />
                    </button>
                </div>

                <div className="flex gap-6 flex-1">
                    {/* Área 1: Informações da Proposta */}
                    <div className="w-1/2 space-y-6">
                        {/* Informações do Cliente */}
                        <div className="bg-white/5 p-4 rounded-lg space-y-3">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Person />
                                <h3 className="text-lg font-medium">Dados do Cliente</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-gray-400 text-sm">Nome:</span>
                                    <p className="text-white">{proposal.Client?.name}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-sm">CPF:</span>
                                    <p className="text-white">{proposal.Client?.cpf}</p>
                                </div>
                            </div>
                        </div>

                        {/* Informações da Proposta */}
                        <div className="bg-white/5 p-4 rounded-lg space-y-3">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Description />
                                <h3 className="text-lg font-medium">Dados da Proposta</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-gray-400 text-sm">Tipo:</span>
                                    <p className="text-white">{proposal.proposalType}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-sm">Data:</span>
                                    <p className="text-white">
                                        {new Date(proposal.proposalDate).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-sm">Empresa/Loja:</span>
                                    <p className="text-white">{proposal.storeCompany}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-sm">Convênio:</span>
                                    <p className="text-white">{proposal.agreement}</p>
                                </div>
                            </div>
                        </div>

                        {/* Informações Financeiras */}
                        <div className="bg-white/5 p-4 rounded-lg space-y-3">
                            <div className="flex items-center gap-2 text-gray-400">
                                <AttachMoney />
                                <h3 className="text-lg font-medium">Dados Financeiros</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-gray-400 text-sm">Valor do Contrato:</span>
                                    <p className="text-white">
                                        {parseFloat(proposal.contractValue).toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-sm">Parcelas:</span>
                                    <p className="text-white">{proposal.contractInstallments}x</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-sm">Taxa de Juros:</span>
                                    <p className="text-white">{proposal.contractInterestRate}% a.m.</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-sm">Parcelas Restantes:</span>
                                    <p className="text-white">{proposal.contractRemainingInstallments || 'N/A'}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-sm">Valor da Parcela:</span>
                                    <p className="text-green-400 font-medium">
                                        {(proposal.contractValue / proposal.contractInstallments).toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-sm">Status:</span>
                                    <p className={`${proposal.isTrueContract ? 'text-green-400' : 'text-yellow-400'}`}>
                                        {proposal.isTrueContract ? 'Contrato' : 'Em análise'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Conteúdo da Proposta */}
                        {proposal.proposalContent && (
                            <div className="bg-white/5 p-4 rounded-lg space-y-3">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Description />
                                    <h3 className="text-lg font-medium">Conteúdo da Proposta</h3>
                                </div>
                                <p className="text-white whitespace-pre-wrap">{proposal.proposalContent}</p>
                            </div>
                        )}
                    </div>

                    {/* Área 2: Simulação */}
                    <div className="w-1/2 space-y-6">
                        <div className="bg-white/5 p-4 rounded-lg space-y-4">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Calculate />
                                <h3 className="text-lg font-medium">Simulação de Refinanciamento</h3>
                            </div>

                            {/* Área de Cálculo Sem IOF */}
                            <div className="bg-white/5 p-4 rounded-lg space-y-4">
                                <h4 className="text-sm font-medium text-gray-400">Cálculo de Saldo Devedor</h4>
                                {/* Display do Resultado em Tempo Real */}
                                {(saldoDevedorDisplay || valorTotalDisplay || economiaTotalDisplay) && (
                                    <div className="grid grid-cols-3 gap-4 p-4 bg-white/5 rounded-lg">
                                        <div className="text-center">
                                            <span className="text-xs text-gray-400 block mb-1">Valor Total</span>
                                            <span className="text-white font-medium">
                                                {parseFloat(valorTotalDisplay).toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL'
                                                })}
                                            </span>
                                        </div>
                                        <div className="text-center">
                                            <span className="text-xs text-gray-400 block mb-1">Saldo Devedor</span>
                                            <span className="text-green-400 font-medium">
                                                {parseFloat(saldoDevedorDisplay).toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL'
                                                })}
                                            </span>
                                        </div>
                                        <div className="text-center">
                                            <span className="text-xs text-gray-400 block mb-1">Economia</span>
                                            <span className="text-yellow-400 font-medium">
                                                {parseFloat(economiaTotalDisplay).toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-1">Valor da Parcela</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                                            <input
                                                type="text"
                                                name="parcela"
                                                value={simulationData.parcela}
                                                onChange={handleSimulationChange}
                                                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                                                placeholder="0,00"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-1">Taxa de Juros (% a.m.)</label>
                                        <input
                                            type="text"
                                            name="taxa"
                                            value={simulationData.taxa}
                                            onChange={handleSimulationChange}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                                            placeholder="0,00"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-1">Prazo Restante</label>
                                        <input
                                            type="number"
                                            name="prazoRestante"
                                            value={simulationData.prazoRestante}
                                            onChange={handleSimulationChange}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                                            placeholder="Número de parcelas"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Área de Cálculo Com IOF */}
                            <div className="bg-white/5 p-4 rounded-lg space-y-4 mt-4">
                                <h4 className="text-sm font-medium text-gray-400">Simulação com IOF</h4>
                                <div className="bg-[#1a1a1a] p-4 rounded-lg space-y-4">
                                    <div className="text-center bg-red-700 p-3 rounded-lg">
                                        <span className="text-xs text-gray-200 block mb-1">Valor com IOF</span>
                                        <span className="text-white font-medium text-lg">
                                            {resultBruto ? parseFloat(resultBruto).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-gray-400 block mb-1">Prazo Atual</label>
                                            <input
                                                type="number"
                                                name="novoPrazo"
                                                value={newSimulation.novoPrazo}
                                                onChange={handleNewSimulationChange}
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                                                placeholder="Número inteiro"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-400 block mb-1">Taxa de Juros (atual)</label>
                                            <input
                                                type="number"
                                                name="novaTaxa"
                                                value={newSimulation.novaTaxa}
                                                onChange={handleNewSimulationChange}
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                                                placeholder="Porcentagem"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-sm text-gray-400 block mb-1">Margem do Cliente</label>
                                            <input
                                                type="number"
                                                name="margem"
                                                value={newSimulation.margem}
                                                onChange={handleNewSimulationChange}
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                                                placeholder="Contábil"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        className="w-full p-2 bg-white hover:bg-gray-100 text-zinc-600 rounded-lg transition-colors"
                                        onClick={calcContratoBruto}
                                    >
                                        Calcular com IOF
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleSaveSimulation}
                                disabled={!simulationData.parcela || !simulationData.taxa || !simulationData.prazoRestante}
                                className="w-full px-4 py-2 bg-[#e67f00] hover:bg-[#ff8c00] rounded-lg transition-colors text-white mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Simular e Salvar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Botão Flutuante para Simulações Anteriores */}
                <button
                    onClick={() => setShowSimulations(true)}
                    className="fixed right-8 bottom-8 p-4 bg-[#e67f00] hover:bg-[#ff8c00] rounded-full shadow-lg transition-colors text-white"
                >
                    <History />
                </button>

                {/* Aside de Simulações Anteriores */}
                <AnimatePresence>
                    {showSimulations && (
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 20 }}
                            className="fixed right-0 top-0 h-full w-96 bg-[#1f1f1f] shadow-xl overflow-y-auto"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-medium text-[#e67f00]">Simulações Anteriores</h3>
                                    <button
                                        onClick={() => setShowSimulations(false)}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Close />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {proposal.currentSimulations?.sort((a, b) => new Date(b.date) - new Date(a.date)).map((sim, index) => (
                                        <div key={index} className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <span className="text-gray-400">Parcela: </span>
                                                    <span className="text-white">
                                                        {parseFloat(sim.parcela).toLocaleString('pt-BR', {
                                                            style: 'currency',
                                                            currency: 'BRL'
                                                        })}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">Saldo Devedor: </span>
                                                    <span className="text-green-400">
                                                        {parseFloat(sim.saldoDevedor).toLocaleString('pt-BR', {
                                                            style: 'currency',
                                                            currency: 'BRL'
                                                        })}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">Taxa: </span>
                                                    <span className="text-white">{sim.taxa}% a.m.</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">Prazo: </span>
                                                    <span className="text-white">{sim.prazoRestante} meses</span>
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-2">
                                                {new Date(sim.date).toLocaleString('pt-BR')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Seção de Observações/Chat */}
                <div className="bg-white/5 rounded-lg p-6 mt-8">
                    <h3 className="text-lg font-semibold text-[#e67f00] mb-4">Observações</h3>

                    {/* Lista de Observações */}
                    <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                        {observations.map((obs, index) => (
                            <div key={index} className="bg-white/5 p-4 rounded-lg">
                                <div className="flex items-start gap-3">
                                    {obs.colaborator?.url_profile_cover ? (
                                        <img
                                            src={obs.colaborator.url_profile_cover}
                                            alt={obs.colaborator.name}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                                            <Person className="text-gray-400 text-sm" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-white text-sm font-medium">
                                                    {obs.colaborator?.name}
                                                </span>
                                                <span className="text-gray-400 text-xs ml-2">
                                                    {obs.colaborator?.function}
                                                </span>
                                            </div>
                                            <span className="text-gray-400 text-xs">
                                                {formatRelativeTime(obs.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 mt-1 text-sm">
                                            {obs.observation}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input para Nova Observação */}
                    <div className="flex gap-2 bg-white/5 rounded-lg p-2">
                        <input
                            type="text"
                            value={newObservation}
                            onChange={(e) => setNewObservation(e.target.value)}
                            placeholder="Digite uma mensagem..."
                            className="flex-1 bg-transparent border-none outline-none text-white text-sm"
                            disabled={sendingMessage}
                        />
                        <button
                            onClick={handleAddObservation}
                            disabled={!newObservation.trim() || sendingMessage}
                            className="p-2 bg-[#e67f00] hover:bg-[#ff8c00] rounded-lg transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed min-w-[40px] h-[40px] flex items-center justify-center"
                        >
                            {sendingMessage ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Send className="text-xl" />
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default ProposalDetails;