import React, { useEffect, useState } from 'react';

function NewProposal({ contract, setListaNovasParcelas, setNovoValorTotalJuros }) {
    const [newJuros, setNewJuros] = useState(0);
    const [numParcelas, setNumParcelas] = useState(0);
    const [valorParcela, setValorParcela] = useState(0);
    const [valorParcelaMensal, setValorParcelaMensal] = useState(0);

    const [novoValorCliente, setNovoValorCliente] = useState(0);
    const [valorRestante, setValorRestante] = useState(0);
    const [valorTotalJuros, setValorTotalJuros] = useState(0);

    const [projecaoLucro, setProjecaoLucro] = useState({
        seisMeses: 0,
        umAno: 0,
        doisAnos: 0,
        cincoAnos: 0
    });

    // Função para formatar valores em Real
    const formatarMoeda = (valor) => {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    useEffect(() => {
        if (contract) {
            const valorBase = contract.value / contract.installments;
            let listaParcelas = [valorBase * 1 + newJuros];

            for (let i = 0; i < contract.installments; i++) {
                let lastParcela = listaParcelas[i];
                listaParcelas.push(lastParcela * (1 + contract.fees_percentage));
            }

            listaParcelas.shift();

            const totalComJuros = listaParcelas.reduce((acc, curr) => acc + curr, 0);
            const valorParcela = totalComJuros / contract.installments;
            const valorRestante = valorParcela * (contract.installments - contract.installments_paid);

            setValorRestante(valorRestante);
        }
    }, [contract])

    useEffect(() => {
        if (!valorParcela || !numParcelas) return;

        const valorCliente = valorParcela * numParcelas;
        setNovoValorCliente(valorCliente);

        let listaParcelas = Array(numParcelas).fill(valorParcela);
        listaParcelas[0] = valorParcela * (1 + newJuros);
        for (let i = 1; i < numParcelas; i++) {
            listaParcelas[i] = listaParcelas[i - 1] * (1 + newJuros);
        }

        const totalComJuros = listaParcelas.reduce((acc, curr) => acc + curr, 0);
        const parcelaMensal = totalComJuros / numParcelas;

        setValorTotalJuros(totalComJuros);
        setNovoValorTotalJuros(totalComJuros);
        setListaNovasParcelas(listaParcelas);
        setValorParcelaMensal(parcelaMensal);

    }, [newJuros, numParcelas, valorParcela])

    useEffect(() => {
        if (valorTotalJuros && valorRestante) {
            const lucroMensal = (valorTotalJuros - valorRestante) / numParcelas;
            
            setProjecaoLucro({
                seisMeses: lucroMensal * 6,
                umAno: lucroMensal * 12,
                doisAnos: lucroMensal * 24,
                cincoAnos: lucroMensal * 60
            });
        }
    }, [valorTotalJuros, valorRestante, numParcelas]);

    return (
        <section className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Nova Proposta</h3>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="block text-sm text-gray-600 mb-2">Novo Juros (%)</label>
                    <input
                        onChange={(e) => setNewJuros(parseFloat(e.target.value) / 100)}
                        type="text"
                        className="p-2 border rounded w-full"
                        step="0.01"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-2">Número de Parcelas</label>
                    <input
                        onChange={(e) => setNumParcelas(parseFloat(e.target.value))}
                        type="text"
                        className="p-2 border rounded w-full"
                        min="1"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-2">Valor da Parcela Desejado</label>
                    <input
                        onChange={(e) => setValorParcela(parseFloat(e.target.value))}
                        type="text"
                        className="p-2 border rounded w-full"
                        step="0.01"
                    />
                </div>
            </div>

            {/* Resumo dos valores */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm text-gray-600">Valor a ser Quitado</p>
                        <p className="font-bold text-red-500">-{formatarMoeda(valorRestante)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Valor do Cliente</p>
                        <p className="font-bold text-green-600">{formatarMoeda(novoValorCliente)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Valor Total com Juros</p>
                        <p className="font-bold text-blue-600">{formatarMoeda(valorTotalJuros)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Valor da Parcela Mensal</p>
                        <p className="font-bold text-purple-600">{formatarMoeda(valorParcelaMensal)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Lucro Total</p>
                        <p className="font-bold text-blue-600">{formatarMoeda(valorTotalJuros - valorRestante)}</p>
                    </div>
                </div>
            </div>

            {/* Projeção de Lucro */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-3">Projeção de Lucro</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-white rounded-md shadow-sm">
                        <p className="text-sm text-gray-600">Em 6 meses</p>
                        <p className="font-bold text-green-600">{formatarMoeda(projecaoLucro.seisMeses)}</p>
                    </div>
                    <div className="p-3 bg-white rounded-md shadow-sm">
                        <p className="text-sm text-gray-600">Em 1 ano</p>
                        <p className="font-bold text-green-600">{formatarMoeda(projecaoLucro.umAno)}</p>
                    </div>
                    <div className="p-3 bg-white rounded-md shadow-sm">
                        <p className="text-sm text-gray-600">Em 2 anos</p>
                        <p className="font-bold text-green-600">{formatarMoeda(projecaoLucro.doisAnos)}</p>
                    </div>
                    <div className="p-3 bg-white rounded-md shadow-sm">
                        <p className="text-sm text-gray-600">Em 5 anos</p>
                        <p className="font-bold text-green-600">{formatarMoeda(projecaoLucro.cincoAnos)}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default NewProposal; 