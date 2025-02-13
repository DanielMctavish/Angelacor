import { CreditCard as CreditCardIcon } from '@mui/icons-material';

function SelectedClients({ selectedClientData, calculateTotalLoans, calculateStars, renderStars, toggleModal }){
    if (!selectedClientData) return null; // Proteção extra

    return(
        <div className={`mt-8 p-6 rounded-lg shadow-md max-w-md w-full relative
            ${calculateTotalLoans(selectedClientData) >= 500000 
                ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200' 
                : 'bg-white'}`
        }>
            <h2 className="text-2xl font-semibold text-[#333333] mb-4 flex items-center bebas-neue-regular">
                <CreditCardIcon className="mr-2 text-[#e67f00]" />
                Cliente Selecionado {renderStars(calculateStars(calculateTotalLoans(selectedClientData)))}
            </h2>
            <p className="text-lg text-gray-700 fira-sans-condensed-regular">
                {selectedClientData.name}
            </p>
            <p className="text-md text-gray-600 mt-2 fira-sans-condensed-regular">
                CPF: {selectedClientData.cpf}
            </p>
            <p className="text-md text-gray-600 mt-2 fira-sans-condensed-regular">
                Total em Empréstimos: {calculateTotalLoans(selectedClientData).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })}
            </p>
            <button 
                className='absolute bottom-2 right-2 bg-[#e67f00] text-white p-2 rounded-md hover:bg-[#cc6e00] transition duration-300'
                onClick={toggleModal}
            >
                Detalhes
            </button>
        </div>
    );
}

export default SelectedClients;