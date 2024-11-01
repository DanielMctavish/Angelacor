import { useEffect, useState } from 'react';

function Thermometer({ valorRestante, novoValorTotalJuros }) {
  const [cobertura, setCobertura] = useState(0);

  useEffect(() => {
    if (valorRestante && novoValorTotalJuros) {
      const porcentagemCobertura = (novoValorTotalJuros / valorRestante) * 100;
      setCobertura(porcentagemCobertura);
    }
  }, [valorRestante, novoValorTotalJuros]);

  return (
    <div className="mb-6">
      <h4 className="font-semibold mb-2">Cobertura da Dívida</h4>
      <div className="bg-gray-200 h-4 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${
            cobertura < 100 ? 'bg-red-500' :
            cobertura < 110 ? 'bg-yellow-500' :
            'bg-green-500'
          }`}
          style={{ width: `${Math.min(cobertura, 100)}%` }}
        />
      </div>
      <div className="flex justify-between text-sm mt-1">
        <span className={cobertura < 100 ? 'text-red-500 font-semibold' : 'text-gray-500'}>
          Insuficiente
        </span>
        <span className={cobertura >= 100 && cobertura < 110 ? 'text-yellow-500 font-semibold' : 'text-gray-500'}>
          Cobre a Dívida
        </span>
        <span className={cobertura >= 110 ? 'text-green-500 font-semibold' : 'text-gray-500'}>
          Margem Confortável
        </span>
      </div>
      <p className="text-sm mt-2">
        Cobertura da dívida: <span className={`font-semibold ${
          cobertura < 100 ? 'text-red-500' :
          cobertura < 110 ? 'text-yellow-500' :
          'text-green-500'
        }`}>{cobertura.toFixed(2)}%</span>
      </p>
    </div>
  );
}

export default Thermometer; 