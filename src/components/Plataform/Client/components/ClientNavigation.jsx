import axios from "axios"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExitToApp, Person } from "@mui/icons-material";

function ClientNavigation({setClientInformations = () => {}}) {
    const [currentClient, setCurrentClient] = useState({ name: "usuário" })
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        getClientInformations()
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("clientToken")
        navigate("/")
    }

    const getClientInformations = async () => {
        setIsLoading(true)
        const currentClientStorage = JSON.parse(localStorage.getItem("clientToken"))

        if (!currentClientStorage) {
            navigate("/client-login")
            return
        }

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/client/find-by-email?email=${currentClientStorage.client.email}`, 
                {
                    headers: {
                        Authorization: `Bearer ${currentClientStorage.token}`
                    }
                }
            )
            
            setCurrentClient(response.data)
            
            if (typeof setClientInformations === 'function') {
                setClientInformations(response.data)
            }
        } catch (error) {
            console.log("erro ao tentar buscar cliente... ", error)
            localStorage.removeItem("clientToken")
            navigate("/client-login")
        } finally {
            setIsLoading(false)
        }
    }

    // Pegar somente o primeiro nome do cliente
    const getFirstName = (fullName) => {
        if (!fullName) return "Usuário";
        return fullName.split(' ')[0];
    }

    return (
        <div className="w-full h-auto min-h-[60px] sm:h-[9vh] bg-[#133785] sm:bg-[#53be831f] flex justify-center items-center 
        border-b-[1px] border-[#ffffff2f] shadow-sm">

            <div className="flex w-full max-w-[1200px] justify-between items-center text-white px-3 sm:px-4 py-2 sm:py-0">
                <div className="flex items-center">
                    <div className="hidden sm:flex w-8 h-8 bg-white/10 rounded-full mr-2 items-center justify-center">
                        <Person className="text-white/70" />
                    </div>
                    {isLoading ? (
                        <div className="h-6 w-24 bg-white/10 animate-pulse rounded"></div>
                    ) : (
                        <div className="flex flex-col sm:flex-row sm:items-center">
                            <span className="text-sm sm:text-base text-white/80 sm:mr-1">Bem-vindo,</span>
                            <span className="font-bold text-base sm:text-lg">
                                {window.innerWidth < 400 
                                    ? getFirstName(currentClient.name) 
                                    : currentClient.name}
                            </span>
                        </div>
                    )}
                </div>

                <button 
                    onClick={handleLogout} 
                    className="bg-[#e67f00] hover:bg-[#ff8c00] transition-colors px-3 py-1.5 rounded-lg 
                    text-white text-sm flex items-center gap-1 shadow-lg"
                >
                    <ExitToApp className="text-sm" />
                    <span className="hidden xs:inline">Sair</span>
                </button>
            </div>

        </div>
    )
}

export default ClientNavigation;