import { Close } from "@mui/icons-material";
import Thermometer from "./Simulation/Thermometer";
import NewProposal from "./Simulation/NewProposal";
import InstallmentsList from "./Simulation/InstallmentsList";
import { useEffect, useState } from "react";

function SimulationModal({ contract, setCurrentContract }) {
  const [valorTotalComJuros, setValorTotalComJuros] = useState(0);
  const [valorParcela, setValorParcela] = useState(0);
  const [valorRestante, setValorRestante] = useState(0);
  const [listaNovasParcelas, setListaNovasParcelas] = useState([]);
  const [novoValorTotalJuros, setNovoValorTotalJuros] = useState(0);

  useEffect(() => {
    calculateCurrentContract()
  }, [])

  const calculateCurrentContract = () => {
    const valorBase = contract.value / contract.installments;
    let listaParcelas = [valorBase];
    
    for (let i = 0; i < contract.installments; i++) {
      let lastParcela = listaParcelas[i];
      listaParcelas.push(lastParcela * (1 + contract.fees_percentage));
    }
    
    listaParcelas.shift();
    
    const totalComJuros = listaParcelas.reduce((acc, curr) => acc + curr, 0);
    const valorParcela = totalComJuros / contract.installments;
    const valorRestante = valorParcela * (contract.installments - contract.installments_paid);

    setValorTotalComJuros(totalComJuros);
    setValorParcela(valorParcela);
    setValorRestante(valorRestante);
  }

  return (
    <div className="flex flex-col gap-6 w-full h-[80vh] bg-[#ededed] text-[#242424] p-6 relative overflow-y-auto">
      <div onClick={() => setCurrentContract(false)} className="absolute top-2 right-2 cursor-pointer">
        <Close />
      </div>

      <h2 className="text-2xl font-bold">Simulação de Refinanciamento</h2>

      {/* Contrato Atual */}
      <section className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Contrato Atual</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">Banco</p>
            <p className="font-semibold">{contract.bank}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">Valor Inicial</p>
            <p className="font-semibold">R$ {contract.value.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">Valor Total com Juros</p>
            <p className="font-semibold">R$ {valorTotalComJuros.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">Parcelas Pagas</p>
            <p className="font-semibold">{contract.installments_paid} de {contract.installments}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">Juros Atual</p>
            <p className="font-semibold">{(contract.fees_percentage * 100).toFixed(2)}%</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">Valor da Parcela Atual</p>
            <p className="font-semibold">R$ {valorParcela.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-md col-span-2">
            <p className="text-sm text-gray-600">Valor Restante a ser Quitado</p>
            <p className="font-bold text-red-500">-R$ {valorRestante.toFixed(2)}</p>
          </div>
        </div>
      </section>

      <NewProposal 
        contract={contract} 
        setListaNovasParcelas={setListaNovasParcelas}
        setNovoValorTotalJuros={setNovoValorTotalJuros}
      />
      <Thermometer 
        valorRestante={valorRestante} 
        novoValorTotalJuros={novoValorTotalJuros} 
      />
      <InstallmentsList 
        listaParcelas={listaNovasParcelas}
      />

      <button className="bg-[#242424] text-white p-3 rounded-md hover:bg-[#363636] transition-colors">
        Gerar Proposta
      </button>
    </div>
  );
}

export default SimulationModal;