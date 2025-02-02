import { useEffect, useState } from 'react';
import { Close as CloseIcon, AddCircle, DeleteForever } from "@mui/icons-material";
import SimulationModal from './SimulationModal';
import ClientInformations from './ClientInformations';
import NewContractLine from './NewContractLine';

function ClientDetailsModal({ client, onClose }) {
  const [changeFees, setChangeFees] = useState(null) //only exist to change values state
  const [currentContract, setCurrentContract] = useState(false);
  const [expandedContract, setExpandedContract] = useState(null);
  const [newContractLine, setNewContractLine] = useState(false)

  const calculateInstallmentValues = (contract) => {
    const valorBase = contract.value / contract.installments;

    let installments = Array(contract.installments).fill(valorBase);

    installments[0] = valorBase * (1 + contract.fees_percentage);

    for (let i = 1; i < contract.installments; i++) {
      installments[i] = installments[i - 1] * (1 + contract.fees_percentage);
    }

    return installments;
  };

  const calculateTotalWithFees = (installments) => {
    return installments.reduce((sum, value) => sum + value, 0);
  };

  const calculateRemainingValue = (contract) => {
    const installments = calculateInstallmentValues(contract);
    const totalWithFees = calculateTotalWithFees(installments);
    const installmentValue = totalWithFees / contract.installments;
    return installmentValue * (contract.installments - contract.installments_paid);
  };

  const handleStartSimulation = (contract) => {
    setCurrentContract(contract)
    console.log('Simulação iniciada -> ', contract);
  };

  // const handleToggleInstallments = (contractIndex) => {
  //   if (expandedContract === contractIndex) {
  //     setExpandedContract(null);
  //   } else {
  //     setExpandedContract(contractIndex);
  //   }
  // };

  // const InstallmentsList = ({ installments, installmentsPaid }) => {

  //   return (
  //     <div className="bg-white shadow-xl rounded-lg p-4 mt-2 
  //     border border-gray-200 min-w-[250px] max-h-[400px] overflow-y-auto">
  //       <h4 className="text-lg font-semibold mb-3 text-[#333333] border-b pb-2">
  //         Detalhamento das Parcelas
  //       </h4>
  //       {installments.map((value, index) => (
  //         <div 
  //           key={index}
  //           className={`p-3 mb-2 rounded-md transition-colors ${
  //             index < installmentsPaid 
  //               ? 'bg-gray-100 text-gray-500' 
  //               : 'bg-white text-gray-800 hover:bg-gray-50'
  //           }`}
  //         >
  //           <div className="flex justify-between items-center">
  //             <span className="font-medium">Parcela {(index + 1).toString().padStart(2, '0')}</span>
  //             <span className="font-semibold text-right">
  //               R$ {value.toFixed(2)}
  //             </span>
  //           </div>
  //           {index < installmentsPaid && (
  //             <span className="text-sm text-gray-500 mt-1 block">
  //               ✓ Parcela paga
  //             </span>
  //           )}
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };


  const calcularSaldoDevedorVP = (parcela, taxa, prazoRestante) => {
    const saldoDevedor = parcela * ((1 - Math.pow(1 + taxa, -prazoRestante)) / taxa);
    return saldoDevedor;
  };


  useEffect(() => {
    console.log('currentContract -> ', currentContract);
  }, [currentContract, changeFees])

  if (currentContract) return (
    <SimulationModal contract={currentContract} setCurrentContract={setCurrentContract} />
  )

  const handleCreateNewContractLine = () => {
    setNewContractLine(!newContractLine)
  }

  const handleDeleteForever = ({ contract }) => {
    client.contract.find(c)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[95%] md:max-w-[70%] 
      h-[90vh] md:h-[70vh] overflow-y-auto relative transition-all duration-300 ease-out origin-top">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10"
          onClick={onClose}
        >
          <CloseIcon />
        </button>

        <div className="p-4 md:p-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-[#333333] bebas-neue-regular">
            Detalhes do Cliente
          </h2>

          <ClientInformations client={client} />

          <div className='flex w-full justify-between items-center mt-6'>
            <h3 className="text-xl md:text-2xl font-bold text-[#333333] bebas-neue-regular">Contratos</h3>
            <span onClick={handleCreateNewContractLine}
              className='text-[#1a911e] cursor-pointer hover:text-[#2dab32]'>
              <AddCircle />
            </span>
          </div>

          {newContractLine && (
            <NewContractLine
              client={client}
              setChangeFees={setChangeFees}
              setNewContractLine={setNewContractLine}
              newContractLine={newContractLine}
            />
          )}

          {/* Tabela responsiva */}
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-[#e67f00] text-white">
                <tr>
                  <th className="py-2 px-3 text-left text-sm">Banco</th>
                  <th className="py-2 px-3 text-left text-sm">Prazos</th>
                  <th className="py-2 px-3 text-left text-sm">Parcela</th>
                  <th className="py-2 px-3 text-left text-sm">Saldo Devedor</th>
                  <th className="py-2 px-3 text-left text-sm">Juros</th>
                  <th className="py-2 px-3 text-left text-sm">Ação</th>
                </tr>
              </thead>
              <tbody>
                {client.contracts.map((contract, index) => {
                  const installments = calculateInstallmentValues(contract);
                  const totalWithFees = calculateTotalWithFees(installments);
                  const remainingValue = calculateRemainingValue(contract);
                  const installmentValue = totalWithFees / contract.installments;

                  return (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-2 px-3 text-sm">{contract.bank}</td>
                      <td className="py-2 px-3 text-sm">
                        <div className="flex flex-col md:flex-row gap-1 md:gap-2 items-start md:items-center">
                          <input
                            type="text"
                            placeholder={`${contract.installments_paid}`}
                            className='w-16 text-center p-1 border rounded'
                            onChange={(e) => contract.installments_paid = parseFloat(e.target.value)}
                          />
                          <span>de</span>
                          <input
                            type="text"
                            placeholder={`${contract.installments}`}
                            className='w-16 text-center p-1 border rounded'
                            onChange={(e) => contract.installments = parseFloat(e.target.value)}
                          />
                        </div>
                      </td>
                      <td className="py-2 px-3 text-sm">
                        R${contract.value_installment.toFixed(2)}
                      </td>
                      <td className="py-2 px-3 text-sm">
                        R$ {calcularSaldoDevedorVP(contract.value_installment, contract.fees_percentage, contract.installments - contract.installments_paid).toFixed(2)}
                      </td>
                      <td className="py-2 px-3 text-sm">
                        <input
                          type="text"
                          className='w-20 p-1 border rounded'
                          placeholder='taxa'
                          onChange={(e) => {
                            setChangeFees(Math.random(e.target.value, 12))
                            contract.fees_percentage = parseFloat(e.target.value / 100)
                          }}
                        />
                      </td>
                      <td className="py-2 px-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStartSimulation(contract)}
                            className="bg-blue-500 text-white
                            rounded-md hover:bg-blue-600 transition duration-300"
                          >
                            Criar Proposta
                          </button>
                          <button className='text-[#e11414] bg-[#fcfcfc] 
                          rounded-full p-1 hover:text-[#f84343] min-w-[40px] min-h-[40px]'>
                            <DeleteForever sx={{fontSize:'20px'}}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientDetailsModal;