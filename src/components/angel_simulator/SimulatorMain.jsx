import React, { useState, useEffect } from 'react';
import {
  Person as PersonIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ArrowBack
} from '@mui/icons-material';
import ClientDetailsModal from './ClientDetailsModal';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from '../Common/Toast/Toast';
import SelectedClients from './selectedClients/SelectedClients';

function SimulatorMain({ isModal = false, onClose }) {
  const [selectedClient, setSelectedClient] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const colaboratorData = JSON.parse(localStorage.getItem('colaboratorData'));
      if (!colaboratorData?.token) {
        toast.error('Sessão expirada');
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/client/find-all?colaboratorId=${colaboratorData.user.id}`,
        {
          headers: {
            'Authorization': `Bearer ${colaboratorData.token}`
          }
        }
      );

      setClients(response.data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      toast.error('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalLoans = (client) => {
    return client.contracts?.reduce((total, contract) => total + contract.value, 0) || 0;
  };

  const calculateStars = (totalLoans) => {
    if (totalLoans >= 500000) return 5;
    if (totalLoans >= 400000) return 4;
    if (totalLoans >= 300000) return 3;
    if (totalLoans >= 200000) return 2;
    return 1;
  };

  // Função para renderizar as estrelas
  const renderStars = (numStars) => {
    return (
      <span className="ml-2">
        {[...Array(5)].map((_, index) => (
          index < numStars ?
            <StarIcon key={index} className="text-yellow-400 text-sm" /> :
            <StarBorderIcon key={index} className="text-gray-300 text-sm" />
        ))}
      </span>
    );
  };

  const handleChange = (event) => {
    setSelectedClient(event.target.value);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setShowModal(false);
    }
  };

  useEffect(() => {
    if (showModal) {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showModal]);

  const selectedClientData = clients.find(client => client.id === selectedClient);

  // Função para gerar string de estrelas
  const getStarsString = (numStars) => {
    const fullStar = '★'; // Estrela preenchida
    const emptyStar = '☆'; // Estrela vazia
    return (fullStar.repeat(numStars) + emptyStar.repeat(5 - numStars));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5f5f5] p-8">
      {/* Remover botão de voltar se estiver em modal */}
      {!isModal && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/colaborador-dashboard')}
          className="absolute top-4 left-24 flex items-center gap-2 px-4 py-2 
                        bg-[#e67f00] hover:bg-[#ff8c00] text-white rounded-lg 
                        transition-colors shadow-md"
        >
          <ArrowBack fontSize="small" />
          Voltar ao Dashboard
        </motion.button>
      )}

      <img src="/angelcor_logo.png" alt="Logo" className="absolute top-4 left-4 w-16 h-16" />
      <h1 className="text-5xl font-light text-[#333333] mb-8 flex items-center bebas-neue-regular">
        <PersonIcon className="mr-4 text-[#e67f00]" fontSize="large" />
        Simulador de Aplicação
      </h1>

      {loading ? (
        <div className="text-center text-gray-600">
          Carregando clientes...
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>Nenhum cliente cadastrado.</p>
          <p className="mt-2">Adicione clientes para usar o simulador.</p>
        </div>
      ) : (
        <div className="w-full max-w-md relative">
          <select
            className="w-full p-3 pr-10 border border-gray-300 rounded-lg 
                        shadow-sm focus:outline-none focus:ring-2 focus:ring-[#e67f00] focus:border-[#e67f00] 
                        appearance-none bg-white text-gray-700 fira-sans-condensed-regular"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
          >
            <option value="">Selecione um cliente</option>
            {clients.map((client) => {
              const totalLoans = calculateTotalLoans(client);
              const stars = calculateStars(totalLoans);
              const isVIP = totalLoans >= 500000;

              return (
                <option
                  key={client.id}
                  value={client.id}
                  className={`p-2 ${isVIP ? 'bg-gradient-to-r from-amber-100 to-yellow-100 font-bold' : ''}`}
                >
                  {client.name} - CPF: {client.cpf} {getStarsString(stars)}
                </option>
              );
            })}
          </select>
          <ArrowDropDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      )}

      {selectedClient && selectedClientData && (
        <SelectedClients
            selectedClientData={selectedClientData}
            calculateTotalLoans={calculateTotalLoans}
            calculateStars={calculateStars}
            renderStars={renderStars}
            toggleModal={toggleModal} 
        />
      )}

      {showModal && selectedClientData && (
        <ClientDetailsModal client={selectedClientData} onClose={toggleModal} />
      )}
    </div>
  );
}

export default SimulatorMain;