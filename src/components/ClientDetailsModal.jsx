import { useEffect, useState } from 'react';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarTodayIcon,
  AccountBalance as AccountBalanceIcon,
  Work as WorkIcon,
  Flag as FlagIcon,
  Lock as LockIcon,
  Close as CloseIcon,
  CreditCard as CreditCardIcon
} from "@mui/icons-material";
import SimulationModal from './SimulationModal';

function ClientDetailsModal({ client, onClose }) {
  const [currentContract, setCurrentContract] = useState(false);
  const [expandedContract, setExpandedContract] = useState(null);

  const calculateInstallmentValues = (contract) => {
    const valorBase = contract.value / contract.installments;
    
    let installments = Array(contract.installments).fill(valorBase);
    
    installments[0] = valorBase * (1 + contract.fees_percentage);
    
    for (let i = 1; i < contract.installments; i++) {
      installments[i] = installments[i-1] * (1 + contract.fees_percentage);
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

  const handleToggleInstallments = (contractIndex) => {
    if (expandedContract === contractIndex) {
      setExpandedContract(null);
    } else {
      setExpandedContract(contractIndex);
    }
  };

  const InstallmentsList = ({ installments, installmentsPaid }) => {
    return (
      <div className="bg-white shadow-xl rounded-lg p-4 mt-2 
      border border-gray-200 min-w-[250px] max-h-[400px] overflow-y-auto">
        <h4 className="text-lg font-semibold mb-3 text-[#333333] border-b pb-2">
          Detalhamento das Parcelas
        </h4>
        {installments.map((value, index) => (
          <div 
            key={index}
            className={`p-3 mb-2 rounded-md transition-colors ${
              index < installmentsPaid 
                ? 'bg-gray-100 text-gray-500' 
                : 'bg-white text-gray-800 hover:bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">Parcela {(index + 1).toString().padStart(2, '0')}</span>
              <span className="font-semibold text-right">
                R$ {value.toFixed(2)}
              </span>
            </div>
            {index < installmentsPaid && (
              <span className="text-sm text-gray-500 mt-1 block">
                ✓ Parcela paga
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    console.log('currentContract -> ', currentContract);
  }, [currentContract])

  if (currentContract) return (
    <SimulationModal contract={currentContract} setCurrentContract={setCurrentContract} />
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[70%] h-[70vh] 
      overflow-y-auto relative transition-all duration-300 ease-out origin-top">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-6 text-[#333333] bebas-neue-regular">Detalhes do Cliente</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center hover:bg-gray-100 p-2 
            rounded fira-sans-condensed-regular"><PersonIcon className="mr-2 text-[#e67f00]" />
              <span className="font-semibold">Nome:</span> {client.name}</div>
            <div className="flex items-center hover:bg-gray-100 p-2 
            rounded fira-sans-condensed-regular"><EmailIcon className="mr-2 text-[#e67f00]" />
              <span className="font-semibold">Email:</span> {client.email}</div>
            <div className="flex items-center hover:bg-gray-100 p-2 
            rounded fira-sans-condensed-regular"><HomeIcon className="mr-2 text-[#e67f00]" />
              <span className="font-semibold">Endereço:</span> {client.address}</div>
            <div className="flex items-center hover:bg-gray-100 p-2 
            rounded fira-sans-condensed-regular"><HomeIcon className="mr-2 text-[#e67f00]" />
              <span className="font-semibold">Cidade:</span> {client.city}</div>
            <div className="flex items-center hover:bg-gray-100 p-2 
            rounded fira-sans-condensed-regular"><HomeIcon className="mr-2 text-[#e67f00]" />
              <span className="font-semibold">Estado:</span> {client.state}</div>
            <div className="flex items-center hover:bg-gray-100 p-2 
            rounded fira-sans-condensed-regular"><HomeIcon className="mr-2 text-[#e67f00]" />
              <span className="font-semibold">CEP:</span> {client.zip}</div>
            <div className="flex items-center hover:bg-gray-100 p-2 
            rounded fira-sans-condensed-regular"><CreditCardIcon className="mr-2 text-[#e67f00]" />
              <span className="font-semibold">CPF:</span> {client.cpf}</div>
            <div className="flex items-center hover:bg-gray-100 p-2 
            rounded fira-sans-condensed-regular"><PhoneIcon className="mr-2 text-[#e67f00]" />
              <span className="font-semibold">Telefone:</span> {client.phone}</div>
            <div className="flex items-center hover:bg-gray-100 p-2 
            rounded fira-sans-condensed-regular"><PersonIcon className="mr-2 text-[#e67f00]" />
              <span className="font-semibold">Nome do Pai:</span> {client.fatherName}</div>
            <div className="flex items-center hover:bg-gray-100 p-2 
            rounded fira-sans-condensed-regular"><PersonIcon className="mr-2 text-[#e67f00]" />
              <span className="font-semibold">Nome da Mãe:</span> {client.motherName}</div>
            <div className="flex items-center hover:bg-gray-100 p-2 
            rounded fira-sans-condensed-regular"><AccountBalanceIcon className="mr-2 text-[#e67f00]" />
              <span className="font-semibold">Tipo de Conta:</span> {client.accountType}</div>
            <div className="flex items-center hover:bg-gray-100 p-2 
            rounded fira-sans-condensed-regular"><AccountBalanceIcon className="mr-2 text-[#e67f00]" />
              <span className="font-semibold">Número da Conta:</span> {client.accountNumber}</div>
            <div className="flex items-center hover:bg-gray-100 p-2 
            rounded fira-sans-condensed-regular"><AccountBalanceIcon className="mr-2 text-[#e67f00]" />
              <span className="font-semibold">Agência:</span> {client.agency}</div>
            <div className="flex items-center hover:bg-gray-100 p-2 
            rounded fira-sans-condensed-regular"><AccountBalanceIcon className="mr-2 text-[#e67f00]" />
              <span className="font-semibold">Banco:</span> {client.bank}</div>
            <div className="flex items-center hover:bg-gray-100 p-2 
            rounded fira-sans-condensed-regular"><WorkIcon className="mr-2 text-[#e67f00]" />
              <span className="font-semibold">Salário:</span> R$ {client.wage}</div>
            <div className="flex items-center hover:bg-gray-100 p-2 
            rounded fira-sans-condensed-regular"><FlagIcon className="mr-2 text-[#e67f00]" />
              <span className="font-semibold">Nacionalidade:</span> {client.nationality}</div>
            <div className="flex items-center hover:bg-gray-100 p-2 
            rounded fira-sans-condensed-regular"><LockIcon className="mr-2 text-[#e67f00]" />
              <span className="font-semibold">Senha INSS:</span> {client.inss_password}</div>
            <div className="flex items-center hover:bg-gray-100 p-2 
            rounded fira-sans-condensed-regular"><CalendarTodayIcon className="mr-2 text-[#e67f00]" />
              <span className="font-semibold">Data DDB:</span> {client.DDB_date}</div>
          </div>

          <h3 className="text-2xl font-bold mb-4 text-[#333333] bebas-neue-regular">Contratos</h3>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-[#e67f00] text-white">
              <tr>
                <th className="py-2 px-4">Banco</th>
                <th className="py-2 px-4">Valor Total</th>
                <th className="py-2 px-4">Valor com Juros</th>
                <th className="py-2 px-4">Parcelas</th>
                <th className="py-2 px-4">Parcelas Pagas</th>
                <th className="py-2 px-4">Valor Parcela</th>
                <th className="py-2 px-4">Saldo devedor</th>
                <th className="py-2 px-4">Juros (%)</th>
                <th className="py-2 px-4">Ação</th>
              </tr>
            </thead>
            <tbody>
              {client.contracts.map((contract, index) => {
                const installments = calculateInstallmentValues(contract);
                const totalWithFees = calculateTotalWithFees(installments);
                const remainingValue = calculateRemainingValue(contract);
                const installmentValue = totalWithFees / contract.installments;

                return (
                  <tr key={index} className={`
                    text-center border-b border-gray-200 hover:bg-gray-100
                    transition-all duration-300 ease-out
                    ${expandedContract === index ? 'h-[400px]' : 'h-[40px]'}
                  `}>
                    <td className="py-2 px-4">{contract.bank}</td>
                    <td className="py-2 px-4">R$ {contract.value.toFixed(2)}</td>
                    <td className="py-2 px-4">R$ {totalWithFees.toFixed(2)}</td>
                    <td className="py-2 px-4 relative w-24">
                      <button 
                        onClick={() => handleToggleInstallments(index)}
                        className="hover:bg-gray-200 px-2 py-1 rounded-md transition-colors w-full"
                      >
                        {contract.installments}
                      </button>
                      <div className={`
                        transition-all duration-300 ease-out
                        overflow-hidden relative w-[250px] ml-[-100px]
                        ${expandedContract === index 
                          ? 'opacity-100 max-h-[400px] visibility-visible' 
                          : 'opacity-0 max-h-0 visibility-hidden'
                        }
                      `}>
                        <InstallmentsList 
                          installments={installments}
                          installmentsPaid={contract.installments_paid}
                        />
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      {contract.installments_paid} de {contract.installments}
                    </td>
                    <td className="py-2 px-4">R$ {installmentValue.toFixed(2)}</td>
                    <td className="py-2 px-4">R$ {remainingValue.toFixed(2)}</td>
                    <td className="py-2 px-4">{(contract.fees_percentage * 100).toFixed(2)}%</td>
                    <td className="py-2 px-4">
                      <button 
                        onClick={() => handleStartSimulation(contract)} 
                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-300"
                      >
                        Simular
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ClientDetailsModal;


// 315, 330,75, 347,28, 364,64, 382,87 -> 
