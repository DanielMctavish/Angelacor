import { useEffect, useState } from "react";
import ColaboratorNavbar from "./components/ColaboratorNavbar";
import ClientsSection from "./components/ClientsSection";
import { allClients, stepDescriptions } from "./data/mockData"; // você pode mover os dados mock para um arquivo separado

function ColaboradorDashboard() {
    const [user, setUser] = useState(null);
    const [currentClients, setClients] = useState([]);
    const [displayedClients, setDisplayedClients] = useState([]);
    const [displayCount, setDisplayCount] = useState(3);

    useEffect(() => {
        setClients(allClients);
        setDisplayedClients(allClients.slice(0, displayCount));
    }, []);

    const handleShowMore = () => {
        const newCount = Math.min(displayCount + 2, allClients.length);
        setDisplayCount(newCount);
        setDisplayedClients(allClients.slice(0, newCount));
    };

    const calculateProgress = (client) => {
        const steps = [
            !!client.url_profile_cover,
            !!client.whatsapp_number,
            !!client.email,
            !!client.simulation,
            client.proposes.length > 1
        ];
        return steps;
    };

    return (
        <div className="w-full h-[100vh] flex flex-col items-center justify-start p-2 
        bg-gradient-to-b from-[#133785] to-[#0a1c42] text-white overflow-y-auto">
            <ColaboratorNavbar 
                user={user}
                xp={3000}
                maxXp={9000}
                level={4}
            />

            <ClientsSection 
                displayedClients={displayedClients}
                progressSteps={calculateProgress}
                stepDescriptions={stepDescriptions}
                onShowMore={handleShowMore}
                hasMore={displayCount < allClients.length}
            />
        </div>
    );
}

export default ColaboradorDashboard;

