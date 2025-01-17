import { Add, KeyboardDoubleArrowDown } from "@mui/icons-material";
import ClientCard from "./ClientCard";

function ClientsSection({ displayedClients, progressSteps, stepDescriptions, onShowMore, hasMore }) {
    return (
        <section className="w-full bg-white/10 backdrop-blur-sm mt-[1.4vh] rounded-xl gap-2 p-2
        flex flex-col justify-start items-center relative border border-white/10">
            <div className="w-full h-[7vh] p-2 flex justify-between items-center">
                <h1 className="text-xl font-semibold">Seus Clientes</h1>
                <button className="bg-[#1f1f1f] hover:bg-[#e67f00] p-2 px-4 rounded-lg 
                    text-white transition-colors">
                    <Add /> Criar cliente
                </button>
            </div>

            <div className="w-full flex flex-col p-2 gap-2 pb-12">
                {displayedClients.map((client, index) => (
                    <ClientCard 
                        key={index}
                        client={client}
                        progressSteps={progressSteps(client)}
                        stepDescriptions={stepDescriptions}
                    />
                ))}
            </div>

            {hasMore && (
                <button
                    onClick={onShowMore}
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 
                    flex items-center gap-1 text-gray-400 hover:text-[#e67f00] 
                    transition-colors py-2 px-4 rounded-lg group"
                >
                    <span>Ver mais</span>
                    <KeyboardDoubleArrowDown className="group-hover:translate-y-1 transition-transform" />
                </button>
            )}
        </section>
    );
}

export default ClientsSection; 