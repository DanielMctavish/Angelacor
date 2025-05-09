import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Close, Calculate, Delete, LightMode, DarkMode } from '@mui/icons-material';

function SimulatorModal({ isOpen, onClose }) {
    const [saldoDevedorDisplay, setSaldoDevedorDisplay] = useState('');
    const [valorTotalDisplay, setValorTotalDisplay] = useState('');
    const [economiaTotalDisplay, setEconomiaTotalDisplay] = useState('');
    const [savedSimulations, setSavedSimulations] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [showInstructions, setShowInstructions] = useState(true);
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
        if (!margem || !novaTaxa || !novoPrazo) return 0;
        
        // Se não tiver saldo devedor atual, considera 0
        const saldoDevedorBase = saldoDevedorAtual || 0;
        
        // Calcula o novo saldo devedor apenas com a margem
        const novoSaldoDevedor = calcularSaldoDevedorVP(margem, novaTaxa / 100, novoPrazo);
        const diferenca = novoSaldoDevedor - saldoDevedorBase;
        const valorIOF = diferenca * (6.5 / 100);

        return diferenca - valorIOF;
    };

    // Calcula o valor do contrato bruto com IOF
    const calcContratoBruto = () => {
        const margem = parseFloat(newSimulation.margem) || 0;
        const novaTaxa = parseFloat(newSimulation.novaTaxa) || 0;
        const novoPrazo = parseInt(newSimulation.novoPrazo) || 0;

        // Usa o saldo devedor calculado se disponível, senão usa 0
        const saldoDevedorAtual = saldoDevedorDisplay ? parseFloat(saldoDevedorDisplay) : 0;

        const valorIof = calcularValorComIOF(
            0, // parcela base não é mais necessária
            margem,
            novaTaxa,
            novoPrazo,
            saldoDevedorAtual
        );

        setResultBruto(valorIof.toFixed(2));
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

    // Função para salvar uma simulação
    const saveSimulation = (type) => {
        const baseSimulation = {
            id: Date.now(),
            type: type, // 'basic' ou 'iof' ou 'complete'
            timestamp: new Date().toISOString(),
        };

        if (type === 'basic' || type === 'complete') {
            baseSimulation.basicData = {
                parcela: simulationData.parcela,
                taxa: simulationData.taxa,
                prazoRestante: simulationData.prazoRestante,
                saldoDevedor: saldoDevedorDisplay,
                valorTotal: valorTotalDisplay,
                economiaTotal: economiaTotalDisplay
            };
        }

        if (type === 'iof' || type === 'complete') {
            baseSimulation.iofData = {
                margem: newSimulation.margem,
                novaTaxa: newSimulation.novaTaxa,
                novoPrazo: newSimulation.novoPrazo,
                resultadoBruto: resultBruto
            };
        }

        setSavedSimulations(prev => [...prev, baseSimulation]);
        alert('Simulação salva com sucesso!');
    };

    // Função para deletar uma simulação
    const deleteSimulation = (id) => {
        setSavedSimulations(prev => prev.filter(sim => sim.id !== id));
    };

    if (!isOpen) return null;

    const modalBaseClass = isDarkMode 
        ? "bg-[#1f1f1f] text-white" 
        : "bg-white text-gray-900";

    const cardBaseClass = isDarkMode 
        ? "bg-white/5 border-white/10" 
        : "bg-gray-50 border-gray-200";

    const labelClass = isDarkMode 
        ? "text-gray-400" 
        : "text-gray-700";

    const valueClass = isDarkMode 
        ? "text-white" 
        : "text-gray-900";

    const descriptionClass = isDarkMode 
        ? "text-gray-400" 
        : "text-gray-600";

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`${modalBaseClass} w-full h-full overflow-y-auto flex flex-col`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50">
                    <div className="flex items-center gap-2">
                        <Calculate className={isDarkMode ? "text-[#e67f00]" : "text-orange-600"} />
                        <h2 className={`text-xl font-semibold ${valueClass}`}>Simulador Angelcor</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`p-2 rounded-lg transition-colors ${
                                isDarkMode 
                                    ? "hover:bg-white/10 text-gray-400 hover:text-white" 
                                    : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                            }`}
                        >
                            {isDarkMode ? <LightMode /> : <DarkMode />}
                        </button>
                        <div className={`h-6 w-px mx-2 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-lg transition-colors ${
                                isDarkMode 
                                    ? "hover:bg-white/10 text-gray-400 hover:text-white" 
                                    : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                            }`}
                        >
                            <Close />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 overflow-hidden">
                    <div className={`w-[50%] p-6 space-y-6 overflow-y-auto`}>
                        {/* Instruções */}
                        {showInstructions && (
                            <div className={`${isDarkMode ? "bg-indigo-900/30" : "bg-indigo-50"} p-4 rounded-lg relative`}>
                                <button
                                    onClick={() => setShowInstructions(false)}
                                    className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${
                                        isDarkMode 
                                            ? "hover:bg-white/10 text-gray-400 hover:text-white" 
                                            : "hover:bg-gray-200 text-gray-700 hover:text-gray-900"
                                    }`}
                                >
                                    <Close className="w-4 h-4" />
                                </button>
                                <h4 className={`${isDarkMode ? "text-indigo-300" : "text-indigo-800"} font-medium mb-2`}>
                                    Como realizar a simulação:
                                </h4>
                                <ol className={`list-decimal pl-5 space-y-1 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                    <li>Preencha os dados do contrato atual (parcela, taxa, prazo)</li>
                                    <li>Confirme o saldo devedor calculado automaticamente</li>
                                    <li>Para simular com IOF, preencha os novos parâmetros e clique em "Calcular com IOF"</li>
                                    <li className={isDarkMode ? "text-amber-300/80" : "text-amber-700"}>
                                        Este simulador é uma calculadora independente e não salva os dados em nenhuma proposta
                                    </li>
                                </ol>
                            </div>
                        )}

                        {/* Área de Cálculo Sem IOF */}
                        <div className={`${cardBaseClass} border p-4 rounded-lg space-y-4`}>
                            <div className="flex items-center justify-between">
                                <h4 className={`text-sm font-medium ${labelClass}`}>
                                    Simulação Básica
                                </h4>
                                <button
                                    onClick={() => saveSimulation('basic')}
                                    className={`px-3 py-1 rounded text-sm transition-colors ${
                                        isDarkMode 
                                            ? "bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400" 
                                            : "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
                                    }`}
                                >
                                    Salvar Simulação Básica
                                </button>
                            </div>

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

                        {/* Área de Cálculo Com IOF - Agora independente */}
                        <div className={`${cardBaseClass} border p-4 rounded-lg space-y-4`}>
                            <div className="flex items-center justify-between">
                                <h4 className={`text-sm font-medium ${labelClass}`}>
                                    Simulação com IOF
                                </h4>
                                <button
                                    onClick={() => saveSimulation('iof')}
                                    className={`px-3 py-1 rounded text-sm transition-colors ${
                                        isDarkMode 
                                            ? "bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400" 
                                            : "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
                                    }`}
                                >
                                    Salvar Simulação IOF
                                </button>
                            </div>

                            <div className={`text-xs ${descriptionClass} italic mb-2`}>
                                <p>O IOF é calculado sobre a diferença entre o novo contrato e o saldo devedor atual, aplicando uma taxa de 6,5%.</p>
                            </div>

                            <div className={`${isDarkMode ? "bg-[#1a1a1a]" : "bg-white"} p-4 rounded-lg space-y-4`}>
                                <div className="text-center bg-red-700 p-3 rounded-lg">
                                    <span className={`text-xs ${isDarkMode ? "text-gray-200" : "text-gray-100"} block mb-1`}>
                                        Valor com IOF
                                    </span>
                                    <span className="text-white font-medium text-lg">
                                        {resultBruto ? Number(resultBruto).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'N/A'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={`text-sm ${labelClass} block mb-1`}>
                                            Prazo Desejado
                                        </label>
                                        <input
                                            type="number"
                                            name="novoPrazo"
                                            value={newSimulation.novoPrazo}
                                            onChange={handleNewSimulationChange}
                                            className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                                                isDarkMode 
                                                    ? "bg-white/5 border-white/10 text-white" 
                                                    : "bg-white border-gray-200 text-gray-800"
                                            }`}
                                            placeholder="Número inteiro"
                                        />
                                    </div>
                                    <div>
                                        <label className={`text-sm ${labelClass} block mb-1`}>
                                            Nova Taxa
                                        </label>
                                        <input
                                            type="number"
                                            name="novaTaxa"
                                            value={newSimulation.novaTaxa}
                                            onChange={handleNewSimulationChange}
                                            className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                                                isDarkMode 
                                                    ? "bg-white/5 border-white/10 text-white" 
                                                    : "bg-white border-gray-200 text-gray-800"
                                            }`}
                                            placeholder="Porcentagem"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className={`text-sm ${labelClass} block mb-1`}>
                                            Margem Disponível
                                        </label>
                                        <input
                                            type="number"
                                            name="margem"
                                            value={newSimulation.margem}
                                            onChange={handleNewSimulationChange}
                                            className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                                                isDarkMode 
                                                    ? "bg-white/5 border-white/10 text-white" 
                                                    : "bg-white border-gray-200 text-gray-800"
                                            }`}
                                            placeholder="Valor disponível"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        className={`flex-1 p-2 rounded-lg transition-colors ${
                                            isDarkMode 
                                                ? "bg-white hover:bg-gray-100 text-zinc-600" 
                                                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                        }`}
                                        onClick={calcContratoBruto}
                                    >
                                        Calcular com IOF
                                    </button>
                                    <button
                                        className={`flex-1 p-2 rounded-lg transition-colors ${
                                            isDarkMode 
                                                ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                                                : "bg-indigo-500 hover:bg-indigo-600 text-white"
                                        }`}
                                        onClick={() => saveSimulation('complete')}
                                    >
                                        Salvar Simulação Completa
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Área de simulações salvas */}
                    <div className={`w-[50%] p-6 ${isDarkMode ? "border-l border-white/10" : "border-l border-gray-200"} overflow-y-auto`}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Calculate className={isDarkMode ? "text-[#e67f00]" : "text-orange-600"} />
                                <h2 className={`text-xl font-semibold ${valueClass}`}>Simulações salvas</h2>
                            </div>
                        </div>

                        {/* Lista de simulações */}
                        <div className="space-y-4">
                            {savedSimulations.map((sim) => (
                                <div key={sim.id} className={`${cardBaseClass} border p-4 rounded-lg relative group`}>
                                    <button
                                        onClick={() => deleteSimulation(sim.id)}
                                        className={`absolute top-2 right-2 p-1 rounded-full transition-colors opacity-0 group-hover:opacity-100 ${
                                            isDarkMode 
                                                ? "hover:bg-red-500/20 text-red-500" 
                                                : "hover:bg-red-100 text-red-600"
                                        }`}
                                    >
                                        <Delete className="w-5 h-5" />
                                    </button>

                                    <div className="mb-3">
                                        <span className={`text-xs px-2 py-1 rounded ${
                                            sim.type === 'basic' 
                                                ? 'bg-blue-500/20 text-blue-400' 
                                                : sim.type === 'iof' 
                                                    ? 'bg-amber-500/20 text-amber-400'
                                                    : 'bg-green-500/20 text-green-400'
                                        }`}>
                                            {sim.type === 'basic' ? 'Simulação Básica' : sim.type === 'iof' ? 'Simulação IOF' : 'Simulação Completa'}
                                        </span>
                                    </div>
                                    
                                    {sim.basicData && (
                                        <div className="mb-4">
                                            <h3 className={`text-sm font-medium ${labelClass} mb-2`}>
                                                Simulação Básica
                                            </h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <span className={`text-xs ${labelClass} block`}>
                                                        Parcela
                                                    </span>
                                                    <p className="font-medium">
                                                        {Number(sim.basicData.parcela).toLocaleString('pt-BR', {
                                                            style: 'currency',
                                                            currency: 'BRL'
                                                        })}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className={`text-xs ${labelClass} block`}>
                                                        Taxa
                                                    </span>
                                                    <p className="font-medium">{sim.basicData.taxa}%</p>
                                                </div>
                                                <div>
                                                    <span className={`text-xs ${labelClass} block`}>
                                                        Prazo
                                                    </span>
                                                    <p className="font-medium">{sim.basicData.prazoRestante} meses</p>
                                                </div>
                                                <div>
                                                    <span className={`text-xs ${labelClass} block`}>
                                                        Saldo Devedor
                                                    </span>
                                                    <p className={`font-medium ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                                                        {Number(sim.basicData.saldoDevedor).toLocaleString('pt-BR', {
                                                            style: 'currency',
                                                            currency: 'BRL'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {sim.iofData && (
                                        <div className={`${sim.basicData ? 'pt-4 border-t border-gray-700/50' : ''}`}>
                                            <h3 className={`text-sm font-medium ${labelClass} mb-2`}>
                                                Simulação IOF
                                            </h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <span className={`text-xs ${labelClass} block`}>
                                                        Nova Taxa
                                                    </span>
                                                    <p className="font-medium">{sim.iofData.novaTaxa}%</p>
                                                </div>
                                                <div>
                                                    <span className={`text-xs ${labelClass} block`}>
                                                        Novo Prazo
                                                    </span>
                                                    <p className="font-medium">{sim.iofData.novoPrazo} meses</p>
                                                </div>
                                                <div>
                                                    <span className={`text-xs ${labelClass} block`}>
                                                        Margem
                                                    </span>
                                                    <p className="font-medium">
                                                        {Number(sim.iofData.margem).toLocaleString('pt-BR', {
                                                            style: 'currency',
                                                            currency: 'BRL'
                                                        })}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className={`text-xs ${labelClass} block`}>
                                                        Valor com IOF
                                                    </span>
                                                    <p className={`font-medium ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
                                                        {Number(sim.iofData.resultadoBruto).toLocaleString('pt-BR', {
                                                            style: 'currency',
                                                            currency: 'BRL'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {savedSimulations.length === 0 && (
                                <div className={`text-center py-8 ${descriptionClass}`}>
                                    <p>Nenhuma simulação salva ainda</p>
                                    <p className="text-sm mt-2">As simulações salvas aparecerão aqui</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default SimulatorModal; 