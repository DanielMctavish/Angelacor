import React, { useState } from 'react';
import { AccountCircle, ArrowBack, Check, PersonOutline, Work, KeyboardArrowDown, ArrowDownward, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function CreateAccountSection() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('client'); // 'client' ou 'collaborator'

  const clientSteps = [
    {
      title: 'Entre em contato com nossa equipe',
      description: 'Você pode ligar para nosso número de atendimento ou enviar um e-mail solicitando informações.',
      image: 'https://via.placeholder.com/500x300?text=Contato+Inicial'
    },
    {
      title: 'Solicite um orçamento para nova proposta',
      description: 'Informe seus dados e necessidades para que possamos preparar uma proposta personalizada.',
      image: 'https://via.placeholder.com/500x300?text=Solicitar+Orçamento'
    },
    {
      title: 'Receba suas credenciais',
      description: 'Um dos nossos colaboradores criará sua conta e enviará as credenciais de acesso por e-mail.',
      image: 'https://via.placeholder.com/500x300?text=Receber+Credenciais'
    },
    {
      title: 'Acesse a área "Sou Cliente"',
      description: 'No menu superior do site, clique no botão "Sou Cliente" para acessar a área de login.',
      image: 'https://via.placeholder.com/500x300?text=Área+Cliente'
    },
    {
      title: 'Digite seu email e senha',
      description: 'Insira as credenciais fornecidas para acessar sua conta pessoal.',
      image: 'https://via.placeholder.com/500x300?text=Login'
    },
    {
      title: 'Acompanhe suas propostas',
      description: 'Visualize e acompanhe em tempo real o andamento de todas as suas propostas.',
      image: 'https://via.placeholder.com/500x300?text=Acompanhar+Propostas'
    },
    {
      title: 'Suporte técnico',
      description: 'Em caso de dúvidas ou problemas, entre em contato com nosso suporte técnico.',
      image: 'https://via.placeholder.com/500x300?text=Suporte+Técnico'
    }
  ];

  const collaboratorSteps = [
    {
      title: 'Entre em contato com seu gerente',
      description: 'Solicite ao seu gerente a criação de uma conta para acesso à plataforma.',
      image: 'https://via.placeholder.com/500x300?text=Contato+Gerente'
    },
    {
      title: 'Aguarde a criação da sua conta',
      description: 'Seu gerente irá solicitar ao setor de TI a criação da sua conta com as permissões adequadas.',
      image: 'https://via.placeholder.com/500x300?text=Criação+Conta'
    },
    {
      title: 'Receba suas credenciais',
      description: 'Você receberá um e-mail com seu login e senha temporária para primeiro acesso.',
      image: 'https://via.placeholder.com/500x300?text=Credenciais+Acesso'
    },
    {
      title: 'Acesse a área "Plataforma"',
      description: 'No menu superior do site, clique no botão "Plataforma" para acessar a tela de seleção.',
      image: 'https://via.placeholder.com/500x300?text=Área+Plataforma'
    },
    {
      title: 'Selecione "Colaborador"',
      description: 'Na tela de seleção, clique na opção "Colaborador" para acessar a área de login específica.',
      image: 'https://via.placeholder.com/500x300?text=Seleção+Colaborador'
    },
    {
      title: 'Digite seu email e senha',
      description: 'Insira as credenciais fornecidas para acessar sua área de trabalho.',
      image: 'https://via.placeholder.com/500x300?text=Login+Colaborador'
    },
    {
      title: 'Configure seu perfil',
      description: 'No primeiro acesso, altere sua senha temporária e configure suas preferências de perfil.',
      image: 'https://via.placeholder.com/500x300?text=Configuração+Perfil'
    }
  ];

  const benefits = [
    'Acompanhamento em tempo real das suas propostas',
    'Histórico completo de todas as suas transações',
    'Atendimento personalizado e prioritário',
    'Notificações automáticas sobre o andamento do seu processo',
    'Acesso a promoções e condições especiais'
  ];

  // Função para renderizar a seta entre passos
  const renderArrow = (index, stepsLength) => {
    if (index < stepsLength - 1) {
      return (
        <div className="flex justify-center my-4 relative">
          <div className="hidden md:block absolute left-1/4 transform -translate-y-1/2 w-1/2 border-b-2 border-dashed border-[#133785]/50"></div>
          <div className={`w-12 h-12 rounded-full ${activeTab === 'client' ? 'bg-[#133785]' : 'bg-[#e67f00]'} 
            flex items-center justify-center z-10 shadow-md animate-pulse`}>
            <KeyboardArrowDown className="text-white text-3xl" />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#f5f7fa] to-white pt-24 pb-16">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Cabeçalho */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center text-[#133785] hover:text-[#e67f00] transition-colors mb-6"
          >
            <ArrowBack className="mr-1" /> Voltar para home
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <AccountCircle className="text-[#e67f00] text-4xl" />
            <h1 className="text-3xl md:text-4xl font-bold text-[#133785]">Como Criar Conta?</h1>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl">
            Entenda o processo de criação de conta na nossa plataforma. Selecione abaixo o tipo de conta que deseja criar.
          </p>
        </div>

        {/* Tabs de seleção */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button 
            onClick={() => setActiveTab('client')}
            className={`flex-1 py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-all 
              ${activeTab === 'client' 
                ? 'bg-[#133785] text-white shadow-lg' 
                : 'bg-white text-[#133785] border border-gray-200 hover:border-[#133785]'}`}
          >
            <PersonOutline className="text-2xl" />
            <span className="font-medium text-lg">Sou Cliente</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('collaborator')}
            className={`flex-1 py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-all 
              ${activeTab === 'collaborator' 
                ? 'bg-[#e67f00] text-white shadow-lg' 
                : 'bg-white text-[#133785] border border-gray-200 hover:border-[#e67f00]'}`}
          >
            <Work className="text-2xl" />
            <span className="font-medium text-lg">Sou Colaborador</span>
          </button>
        </div>

        {/* Visualização em Fluxograma */}
        <div className="mb-10">
          <div className={`p-3 rounded-lg ${activeTab === 'client' ? 'bg-[#133785]/10' : 'bg-[#e67f00]/10'}`}>
            <h2 className={`text-xl font-bold ${activeTab === 'client' ? 'text-[#133785]' : 'text-[#e67f00]'} mb-3`}>
              Visão Geral do Processo
            </h2>
            <div className="flex flex-wrap justify-center gap-2 md:gap-0 py-4">
              {(activeTab === 'client' ? clientSteps : collaboratorSteps).map((step, index, array) => (
                <React.Fragment key={`flow-${index}`}>
                  <div className="flex flex-col items-center mx-1">
                    <div className={`w-14 h-14 rounded-full ${activeTab === 'client' ? 'bg-[#133785]' : 'bg-[#e67f00]'} 
                      flex items-center justify-center text-white font-bold text-xl shadow-md`}>
                      {index + 1}
                    </div>
                    <p className="text-xs mt-2 text-center max-w-[80px] text-gray-700 font-medium">
                      {step.title.split(' ').slice(0, 2).join(' ')}...
                    </p>
                  </div>
                  
                  {index < array.length - 1 && (
                    <div className="hidden md:flex items-center">
                      <ArrowForward className={`${activeTab === 'client' ? 'text-[#133785]' : 'text-[#e67f00]'} mx-1`} />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Passo a passo - Cliente */}
        {activeTab === 'client' && (
          <div>
            <div className="bg-[#133785]/10 border border-[#133785]/20 rounded-xl p-6 mb-12">
              <h2 className="text-xl font-bold text-[#133785] mb-3">Processo para Clientes</h2>
              <p className="text-gray-600">
                O processo de criação de conta para clientes é realizado por nossos colaboradores.
                Veja abaixo o passo a passo para ter acesso à sua conta.
              </p>
            </div>
            
            <div className="relative">
              {/* Linha vertical conectora */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#133785] to-[#e67f00] 
                transform -translate-x-1/2 rounded-full"></div>
              
              {clientSteps.map((step, index) => (
                <React.Fragment key={index}>
                  <div className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center relative z-10`}>
                    {/* Marcador numerado */}
                    <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 z-20">
                      <div className="w-12 h-12 rounded-full bg-[#133785] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {index + 1}
                      </div>
                    </div>
                    
                    <div className="w-full md:w-1/2 bg-white rounded-xl p-6 shadow-lg">
                      <div className="md:hidden w-12 h-12 rounded-full bg-[#133785] flex items-center justify-center text-white font-bold text-xl shadow-lg mb-4">
                        {index + 1}
                      </div>
                      
                      <h2 className="text-2xl font-bold text-[#133785] mb-3">{step.title}</h2>
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      
                      {index === 0 && (
                        <div className="flex flex-col sm:flex-row gap-3">
                          <a 
                            href="https://wa.me/5541996266007?text=Olá,%20gostaria%20de%20solicitar%20um%20orçamento%20para%20uma%20proposta." 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-[#25D366] text-white py-3 px-6 rounded-full hover:bg-[#1da851] transition-colors text-lg font-medium flex items-center justify-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                              <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                            </svg>
                            Solicitar via WhatsApp
                          </a>
                          <button 
                            onClick={() => navigate('/solicitar-orcamento')} 
                            className="bg-gradient-to-r from-[#fb9445] to-[#e67f00] text-white py-3 px-6 rounded-full hover:opacity-90 transition-opacity text-lg font-medium"
                          >
                            Solicitar pelo Site
                          </button>
                        </div>
                      )}
                      
                      {index === 0 && (
                        <div className="mt-4 text-sm text-gray-600 flex flex-col gap-1">
                          <p className="font-medium">Contatos diretos:</p>
                          <p>📱 (41) 99626-6007</p>
                          <p>📧 operacional@triunfocorrespondente.com.br</p>
                        </div>
                      )}
                    </div>
                    
                  
                  </div>
                  
                  {/* Seta conectora entre os passos */}
                  {index < clientSteps.length - 1 && (
                    <div className="flex justify-center my-10">
                      <div className="w-12 h-12 rounded-full bg-[#133785]/20 flex items-center justify-center z-10">
                        <KeyboardArrowDown className="text-[#133785] text-3xl" />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Passo a passo - Colaborador */}
        {activeTab === 'collaborator' && (
          <div>
            <div className="bg-[#e67f00]/10 border border-[#e67f00]/20 rounded-xl p-6 mb-12">
              <h2 className="text-xl font-bold text-[#e67f00] mb-3">Processo para Colaboradores</h2>
              <p className="text-gray-600">
                O processo de criação de conta para colaboradores inicia-se com uma solicitação ao seu gerente.
                Veja abaixo o passo a passo para ter acesso à sua conta de colaborador.
              </p>
            </div>
            
            <div className="relative">
              {/* Linha vertical conectora */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#e67f00] to-[#133785] 
                transform -translate-x-1/2 rounded-full"></div>
              
              {collaboratorSteps.map((step, index) => (
                <React.Fragment key={index}>
                  <div className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center relative z-10`}>
                    {/* Marcador numerado */}
                    <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 z-20">
                      <div className="w-12 h-12 rounded-full bg-[#e67f00] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {index + 1}
                      </div>
                    </div>
                    
                    <div className="w-full md:w-1/2 bg-white rounded-xl p-6 shadow-lg">
                      <div className="md:hidden w-12 h-12 rounded-full bg-[#e67f00] flex items-center justify-center text-white font-bold text-xl shadow-lg mb-4">
                        {index + 1}
                      </div>
                      
                      <h2 className="text-2xl font-bold text-[#133785] mb-3">{step.title}</h2>
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      
                      {index === 3 && (
                        <button onClick={() => navigate('/login')} className="bg-gradient-to-r from-[#133785] to-[#0c2359] text-white py-3 px-8 rounded-full hover:opacity-90 transition-opacity text-lg font-medium">
                          Acessar Plataforma
                        </button>
                      )}
                    </div>
                    
                   
                  </div>
                  
                  {/* Seta conectora entre os passos */}
                  {index < collaboratorSteps.length - 1 && (
                    <div className="flex justify-center my-10">
                      <div className="w-12 h-12 rounded-full bg-[#e67f00]/20 flex items-center justify-center z-10">
                        <KeyboardArrowDown className="text-[#e67f00] text-3xl" />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Benefícios - Apenas para cliente */}
        {activeTab === 'client' && (
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mt-16">
            <h2 className="text-2xl font-bold text-[#133785] mb-6">Benefícios de ter uma conta</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-1 bg-[#e6f0ff] rounded-full flex-shrink-0 mt-0.5">
                    <Check className="text-[#133785]" />
                  </div>
                  <p className="text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <button onClick={() => navigate('/ajuda')} className="bg-gradient-to-r from-[#fb9445] to-[#e67f00] text-white py-3 px-8 rounded-full hover:opacity-90 transition-opacity text-lg font-medium">
                Preciso de Ajuda
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateAccountSection; 