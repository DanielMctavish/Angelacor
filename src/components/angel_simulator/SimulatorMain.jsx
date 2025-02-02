import React, { useState, useEffect } from 'react';
import { clientModel } from '../../tempData/maindata';
import PersonIcon from '@mui/icons-material/Person';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ClientDetailsModal from './ClientDetailsModal';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';

function SimulatorMain() {
  const [selectedClient, setSelectedClient] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const calculateTotalLoans = (client) => {
    return client.contracts.reduce((total, contract) => total + contract.value, 0);
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

  const selectedClientData = clientModel.find(client => client.id === parseInt(selectedClient));

  // Função para gerar string de estrelas
  const getStarsString = (numStars) => {
    const fullStar = '★'; // Estrela preenchida
    const emptyStar = '☆'; // Estrela vazia
    return (fullStar.repeat(numStars) + emptyStar.repeat(5 - numStars));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5f5f5] p-8">
      {/* Botão Voltar */}
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

      <img src="/angelcor_logo.png" alt="Logo" className="absolute top-4 left-4 w-16 h-16" />
      <h1 className="text-5xl font-light text-[#333333] mb-8 flex items-center bebas-neue-regular">
        <PersonIcon className="mr-4 text-[#e67f00]" fontSize="large" />
        Simulador de Aplicação
      </h1>
      
      <div className="w-full max-w-md relative">
        <select 
          className="w-full p-3 pr-10 border border-gray-300 rounded-lg 
          shadow-sm focus:outline-none focus:ring-2 focus:ring-[#e67f00] focus:border-[#e67f00] 
          appearance-none bg-white text-gray-700 fira-sans-condensed-regular"
          value={selectedClient}
          onChange={handleChange}
        >
          <option value="">Selecione um cliente</option>
          {clientModel.map((client) => {
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

      {selectedClient && (
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
      )}

      {showModal && selectedClientData && (
        <ClientDetailsModal client={selectedClientData} onClose={toggleModal} />
      )}
    </div>
  );
}

export default SimulatorMain;