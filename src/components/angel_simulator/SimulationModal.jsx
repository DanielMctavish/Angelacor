import { Close } from "@mui/icons-material";
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
    const valorBase = contract.value_installment / contract.installments;
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
    <div className="flex flex-col gap-6 w-full h-[80vh] justify-center items-center
    bg-[#ededed] text-[#242424] p-6 relative overflow-y-auto">

      <div onClick={() => setCurrentContract(false)} className="absolute top-2 right-2 cursor-pointer">
        <Close />
      </div>

       <span>em desenvolvimento</span>
    </div>
  );
}

export default SimulationModal;