import axios from "axios"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



function ClientNavigation() {
    const [currentClient, setCurrentClient] = useState({ name: "usuário" })
    const navigate = useNavigate()

    useEffect(() => {
        getClientInformations()
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("clientToken")
        navigate("/")
    }

    const getClientInformations = async () => {
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
            
            console.log("observando resposta do login do cliente -> ", response.data)
            setCurrentClient(response.data)

        } catch (error) {
            console.log("erro ao tentar buscar cliente... ", error)
            localStorage.removeItem("clientToken")
        }
    }

    return (
        <div className="w-full h-[9vh] bg-[#53be831f] flex justify-center items-center 
        border-b-[1px] border-[#ffffff2f]">

            <div className="flex w-full max-w-[1200px] justify-between items-center text-white">
                <span className="font-bold">Bem vindo(a), {currentClient.name} </span>
                <button onClick={handleLogout} 
                className="bg-[#53be83] p-1 w-[100px] rounded-lg shadow-2xl shadow-[#0f0f0fde]">
                    sair
                </button>
            </div>

        </div>
    )
}


export default ClientNavigation;