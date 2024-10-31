import { useState } from "react";

function NewContractLine({ client, setChangeFees, setNewContractLine, newContractLine }) {
    const [bank, setBank] = useState(null)
    const [feesValue, setFeesValue] = useState(0)

    const handleAddNewContractLine = () => {
        const listContract = client.contracts
        listContract.push({
            bank: bank,
            dueDate: "15/02/2024",
            status: "Pago",
            value_installment: feesValue,
            fees_percentage: 0,
            installments: 0,
            installments_paid: 0
        })

        setChangeFees(Math.random(feesValue, 10))
        setNewContractLine(!newContractLine)
    }

    return (
        <div className='flex flex-col md:flex-row gap-3 w-full p-4 bg-gray-50 rounded-lg'>
            <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Banco</label>
                <input 
                    type="text" 
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-[#e67f00] focus:border-[#e67f00]"
                    onChange={(e) => setBank(e.target.value)}
                    placeholder="Nome do banco" 
                />
            </div>

            <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Valor da Parcela</label>
                <input 
                    type="text" 
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-[#e67f00] focus:border-[#e67f00]"
                    placeholder="R$ 0,00"
                    onChange={(e) => setFeesValue(parseFloat(e.target.value))} 
                />
            </div>

            <button
                onClick={handleAddNewContractLine}
                className="w-full md:w-auto mt-4 md:mt-6 bg-[#ff910a] text-white px-6 py-3 
                rounded-md hover:bg-[#ffa83f] transition duration-300 font-medium"
            >
                Criar Contrato
            </button>
        </div>
    )
}

export default NewContractLine;