import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Close, Calculate, History } from '@mui/icons-material';
import axios from 'axios';
import { toast } from '../../../Common/Toast/Toast';

function SimulationCalculator({ proposal, onSimulationSaved }) {
    const [saldoDevedorDisplay, setSaldoDevedorDisplay] = useState('');
    const [valorTotalDisplay, setValorTotalDisplay] = useState('');
    const [economiaTotalDisplay, setEconomiaTotalDisplay] = useState('');
    const [seguroValue, setSeguroValue] = useState('');
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
    const [showSimulations, setShowSimulations] = useState(false);

    // Atualiza o estado com dados da proposta quando o componente é montado ou a proposta muda
    useEffect(() => {
        if (proposal) {
            const parcelaAtual = (proposal.contractValue / proposal.contractInstallments).toFixed(2);
            setSimulationData({
                parcela: parcelaAtual,
                taxa: proposal.contractInterestRate?.toString() || '',
                prazoRestante: proposal.contractRemainingInstallments?.toString() || ''
            });
        }
    }, [proposal]);

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

    // Função dedicada para calcular valor com IOF
    const calcularValorComIOF = (parcelaBase, margem, novaTaxa, novoPrazo, saldoDevedorAtual) => {
        if (!parcelaBase || !novaTaxa || !novoPrazo || !saldoDevedorAtual) return 0;
        // Margem pode ser zero, então só verificamos se é um número válido
        if (isNaN(margem)) return 0;
        
        // Calcula o valor do saldo devedor com novos parâmetros
        const novoSaldoDevedor = calcularSaldoDevedorVP(parcelaBase + margem, novaTaxa, novoPrazo);
        
        // Calcula a diferença entre o novo saldo e o saldo atual
        const diferenca = novoSaldoDevedor - saldoDevedorAtual;
        
        // Aplica a taxa de IOF sobre a diferença
        const valorIOF = diferenca * (6.5 / 100);
        
        // Retorna o valor líquido após descontar o IOF
        return diferenca - valorIOF;
    };

    // Calcula o valor do contrato bruto com IOF
    const calcContratoBruto = () => {
        const parcelaBase = parseFloat(simulationData.parcela) || 0;
        const margem = parseFloat(newSimulation.margem);
        const novaTaxa = parseFloat(newSimulation.novaTaxa) / 100 || 0;
        const novoPrazo = parseInt(newSimulation.novoPrazo) || 0;

        const saldoDevedorAtual = calcularSaldoDevedorVP(
            parseFloat(simulationData.parcela), 
            (parseFloat(simulationData.taxa) / 100), 
            parseInt(simulationData.prazoRestante)
        );
        
        const valorIof = calcularValorComIOF(
            parcelaBase, 
            margem, 
            novaTaxa, 
            novoPrazo, 
            saldoDevedorAtual
        );
        
        setResultBruto(valorIof);
    };

    // Handle changes nos campos de simulação
    const handleSimulationChange = (e) => {
        const { name, value } = e.target;
        
        // Se for o campo de seguro, valida se é um número válido
        if (name === 'seguro') {
            // Remove caracteres não numéricos (exceto ponto)
            const normalizedValue = value.replace(/[^\d.]/g, '');
            
            // Garante que só há um ponto decimal
            const parts = normalizedValue.split('.');
            const finalValue = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : normalizedValue;
            
            setSeguroValue(finalValue);
            return;
        }

        // Se for o campo de taxa, normaliza o valor para usar ponto como separador decimal
        if (name === 'taxa') {
            // Substitui vírgula por ponto e remove caracteres não numéricos (exceto ponto)
            const normalizedValue = value.replace(',', '.').replace(/[^\d.]/g, '');
            
            // Garante que só há um ponto decimal
            const parts = normalizedValue.split('.');
            const finalValue = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : normalizedValue;
            
            setSimulationData(prev => ({ ...prev, [name]: finalValue }));
            return;
        }

        // Para outros campos, mantém o comportamento original
        setSimulationData(prev => ({ ...prev, [name]: value }));
    };

    // Handle changes nos campos de nova simulação
    const handleNewSimulationChange = (e) => {
        const { name, value } = e.target;
        
        // Se for o campo de taxa, normaliza o valor para usar ponto como separador decimal
        if (name === 'novaTaxa') {
            // Substitui vírgula por ponto e remove caracteres não numéricos (exceto ponto)
            const normalizedValue = value.replace(',', '.').replace(/[^\d.]/g, '');
            
            // Garante que só há um ponto decimal
            const parts = normalizedValue.split('.');
            const finalValue = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : normalizedValue;
            
            setNewSimulation(prev => ({ ...prev, [name]: finalValue }));
            return;
        }

        // Para o campo margem, mantém a validação existente
        if (name === 'margem' && value !== '' && isNaN(parseFloat(value))) {
            return;
        }
        
        setNewSimulation(prev => ({ ...prev, [name]: value }));
    };

    // Função para salvar a simulação no servidor
    const handleSaveSimulation = async () => {
        if (!proposal?.id) {
            toast.error('ID da proposta não disponível');
            return;
        }

        // Validação dos campos de simulação
        if (!simulationData.parcela || !simulationData.taxa || !simulationData.prazoRestante) {
            toast.warning('Preencha todos os campos da simulação básica');
            return;
        }

        // Se tem dados de IOF parciais, alerta o usuário
        if ((newSimulation.margem !== '' || newSimulation.novaTaxa || newSimulation.novoPrazo) && 
            (newSimulation.margem === '' || !newSimulation.novaTaxa || !newSimulation.novoPrazo)) {
            toast.warning('Preencha todos os campos da simulação com IOF ou deixe todos vazios');
            return;
        }

        try {
            const saldoDevedor = calcularSaldoDevedorVP(
                parseFloat(simulationData.parcela),
                parseFloat(simulationData.taxa) / 100,
                parseInt(simulationData.prazoRestante)
            );

            // Calcular o valor com IOF se não estiver calculado ainda
            let valorIOF = resultBruto;
            if (!valorIOF && newSimulation.margem !== '' && newSimulation.novaTaxa && newSimulation.novoPrazo) {
                const parcelaBase = parseFloat(simulationData.parcela) || 0;
                const margem = parseFloat(newSimulation.margem);
                const novaTaxa = parseFloat(newSimulation.novaTaxa) / 100 || 0;
                const novoPrazo = parseInt(newSimulation.novoPrazo) || 0;

                valorIOF = calcularValorComIOF(
                    parcelaBase,
                    margem,
                    novaTaxa,
                    novoPrazo,
                    saldoDevedor
                );
            }

            // Adicionar dados completos de simulação, incluindo IOF
            const simulationResult = {
                ...simulationData,
                saldoDevedor,
                date: new Date().toISOString(),
                // Adicionar dados do cálculo com IOF
                iofCalculation: {
                    margem: newSimulation.margem || '',
                    novaTaxa: newSimulation.novaTaxa || '',
                    novoPrazo: newSimulation.novoPrazo || '',
                    valorComIOF: valorIOF || null
                }
            };

            const colaboratorData = JSON.parse(localStorage.getItem('colaboratorData'));
            
            if (!colaboratorData || !colaboratorData.token) {
                toast.error('Dados de autenticação não encontrados');
                return;
            }

            const updatedSimulations = [...(proposal.currentSimulations || []), simulationResult];

            await axios.patch(
                `${import.meta.env.VITE_API_URL}/proposal/update?proposalId=${proposal.id}`,
                { currentSimulations: updatedSimulations },
                { headers: { 'Authorization': `Bearer ${colaboratorData.token}` } }
            );

            toast.success('Simulação salva com sucesso!');
            
            // Notificar o componente pai que a simulação foi salva
            if (onSimulationSaved) {
                onSimulationSaved(updatedSimulations);
            }
            
            // Opcional: limpar os campos após salvar
            // setSimulationData({ parcela: '', taxa: '', prazoRestante: '' });
        } catch (error) {
            console.error('Erro ao salvar simulação:', error);
            toast.error('Erro ao salvar simulação. Verifique sua conexão e tente novamente.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white/5 p-4 rounded-lg space-y-4">
                <div className="flex items-center gap-2 text-gray-400">
                    <Calculate />
                    <h3 className="text-lg font-medium">Simulação de Refinanciamento</h3>
                </div>

                {/* Instruções */}
                <div className="bg-indigo-900/30 p-4 rounded-lg mb-4">
                    <h4 className="text-indigo-300 font-medium mb-2">Como realizar a simulação:</h4>
                    <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-300">
                        <li>Preencha os dados do contrato atual (parcela, taxa, prazo)</li>
                        <li>Confirme o saldo devedor calculado automaticamente</li>
                        <li>Para simular com IOF, preencha os novos parâmetros e clique em "Calcular com IOF"</li>
                        <li>Clique em "Simular e Salvar" para registrar a simulação na proposta</li>
                    </ol>
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
                                    {parseFloat(valorTotalDisplay - (parseFloat(seguroValue) || 0)).toLocaleString('pt-BR', {
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
                    <div className="text-xs text-gray-400 italic mb-2">
                        <p>O IOF é calculado sobre a diferença entre o novo contrato e o saldo devedor atual, aplicando uma taxa de 6,5%.</p>
                    </div>
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

                {/* Campo de Seguro */}
                <div className="bg-white/5 p-4 rounded-lg space-y-4 mt-4">
                    <h4 className="text-sm font-medium text-gray-400">Valor do Seguro</h4>
                    <div className="text-xs text-gray-400 italic mb-2">
                        <p>O valor do seguro será deduzido do valor total da simulação.</p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 block mb-1">Valor do Seguro</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                            <input
                                type="text"
                                name="seguro"
                                value={seguroValue}
                                onChange={handleSimulationChange}
                                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                                placeholder="0,00"
                            />
                        </div>
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
                        className="fixed right-0 top-0 h-full w-96 bg-[#1f1f1f] shadow-xl overflow-y-auto z-50"
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
                                {proposal?.currentSimulations?.sort((a, b) => new Date(b.date) - new Date(a.date)).map((sim, index) => (
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
                                            
                                            {/* Exibir dados de simulação com IOF se disponíveis */}
                                            {sim.iofCalculation && sim.iofCalculation.valorComIOF && (
                                                <div className="col-span-2 mt-2 border-t border-white/10 pt-2">
                                                    <div className="text-yellow-400 font-medium mb-1">Simulação com IOF:</div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div>
                                                            <span className="text-gray-400 text-xs">Valor com IOF: </span>
                                                            <span className="text-red-400">
                                                                {parseFloat(sim.iofCalculation.valorComIOF).toLocaleString('pt-BR', {
                                                                    style: 'currency',
                                                                    currency: 'BRL'
                                                                })}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-400 text-xs">Margem: </span>
                                                            <span className="text-white">
                                                                {parseFloat(sim.iofCalculation.margem).toLocaleString('pt-BR', {
                                                                    style: 'currency',
                                                                    currency: 'BRL'
                                                                })}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-400 text-xs">Nova Taxa: </span>
                                                            <span className="text-white">{sim.iofCalculation.novaTaxa}% a.m.</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-400 text-xs">Novo Prazo: </span>
                                                            <span className="text-white">{sim.iofCalculation.novoPrazo} meses</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-2">
                                            {new Date(sim.date).toLocaleString('pt-BR')}
                                        </div>
                                    </div>
                                ))}
                                
                                {(!proposal?.currentSimulations || proposal.currentSimulations.length === 0) && (
                                    <div className="text-center py-8 text-gray-400">
                                        Nenhuma simulação salva ainda
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default SimulationCalculator; 