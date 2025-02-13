import { Close as CloseIcon } from "@mui/icons-material";
import ClientInformations from './ClientInformations';

function ClientDetailsModal({ client, onClose }) {
    // Mantida a função importante de cálculo do saldo devedor VP
    const calcularSaldoDevedorVP = (parcela, taxa, prazoRestante) => {
        if (!parcela || !taxa || !prazoRestante) return 0;
        const saldoDevedor = parcela * ((1 - Math.pow(1 + taxa, -prazoRestante)) / taxa);
        return saldoDevedor;
    };

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
                </div>
            </div>
        </div>
    );
}

export default ClientDetailsModal;