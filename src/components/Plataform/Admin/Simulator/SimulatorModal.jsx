import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Close, Calculate } from '@mui/icons-material';

function SimulatorModal({ isOpen, onClose }) {
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
        if (isNaN(margem)) return 0;
        
        const novoSaldoDevedor = calcularSaldoDevedorVP(parcelaBase + margem, novaTaxa, novoPrazo);
        const diferenca = novoSaldoDevedor - saldoDevedorAtual;
        const valorIOF = diferenca * (6.5 / 100);
        
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#1f1f1f] rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Calculate className="text-[#e67f00]" />
                            <h2 className="text-xl font-semibold text-white">Simulador de Refinanciamento</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <Close className="text-gray-400 hover:text-white" />
                        </button>
                    </div>

                    {/* Instruções */}
                    <div className="bg-indigo-900/30 p-4 rounded-lg">
                        <h4 className="text-indigo-300 font-medium mb-2">Como realizar a simulação:</h4>
                        <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-300">
                            <li>Preencha os dados do contrato atual (parcela, taxa, prazo)</li>
                            <li>Confirme o saldo devedor calculado automaticamente</li>
                            <li>Para simular com IOF, preencha os novos parâmetros e clique em "Calcular com IOF"</li>
                            <li className="text-amber-300/80">Este simulador é uma calculadora independente e não salva os dados em nenhuma proposta</li>
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
                    <div className="bg-white/5 p-4 rounded-lg space-y-4">
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
                </div>
            </motion.div>
        </div>
    );
}

export default SimulatorModal; 