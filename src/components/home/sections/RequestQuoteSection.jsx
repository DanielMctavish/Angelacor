import React, { useState } from 'react';
import { RequestQuote, ArrowBack, CheckCircle, Timer, Assignment, Calculate, WhatsApp, Email, Phone } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function RequestQuoteSection() {
  const navigate = useNavigate();
  const [loanValue, setLoanValue] = useState(10000);
  const [loanTerm, setLoanTerm] = useState(36);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const steps = [
    {
      icon: <Assignment className="text-white text-3xl" />,
      title: 'Preencha o Formulário',
      description: 'Forneça suas informações básicas e detalhes sobre o valor e prazo desejados.',
      color: '#133785'
    },
    {
      icon: <Timer className="text-white text-3xl" />,
      title: 'Aguarde a Análise',
      description: 'Nossa equipe irá analisar seus dados e preparar propostas personalizadas para você.',
      color: '#1d4e9e'
    },
    {
      icon: <CheckCircle className="text-white text-3xl" />,
      title: 'Receba Propostas',
      description: 'Você receberá propostas detalhadas sobre condições, taxas e valores para escolher a melhor opção.',
      color: '#e67f00'
    }
  ];

  const handleLoanValueChange = (e) => {
    setLoanValue(parseInt(e.target.value));
  };

  const handleLoanTermChange = (e) => {
    setLoanTerm(parseInt(e.target.value));
  };

  // Função para calcular mensalidade (simulação simplificada)
  const calculateMonthlyPayment = () => {
    const annualRate = 0.17; // Taxa anual de 17%
    const monthlyRate = annualRate / 12;
    
    const monthlyPayment = 
      (loanValue * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / 
      (Math.pow(1 + monthlyRate, loanTerm) - 1);
    
    return monthlyPayment.toFixed(2);
  };

  // Função para criar o texto da mensagem para o WhatsApp
  const getWhatsAppMessage = () => {
    const formattedValue = loanValue.toLocaleString('pt-BR');
    return `Olá, gostaria de solicitar um orçamento para um empréstimo de R$ ${formattedValue} em ${loanTerm} meses. Minha simulação resultou em parcelas de aproximadamente R$ ${calculateMonthlyPayment()}.`;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#f5f7fa] to-white pt-24 pb-16">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Cabeçalho */}
        <div className="mb-12">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center text-[#133785] hover:text-[#e67f00] transition-colors mb-6"
          >
            <ArrowBack className="mr-1" /> Voltar para home
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <RequestQuote className="text-[#e67f00] text-4xl" />
            <h1 className="text-3xl md:text-4xl font-bold text-[#133785]">Como Solicitar um Orçamento?</h1>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl">
            Solicitar um orçamento em nossa plataforma é simples e rápido. Siga os passos abaixo para receber propostas personalizadas.
          </p>
        </div>

        {/* Contato Direto */}
        <div className="bg-white rounded-xl p-6 mb-12 shadow-lg border-l-4 border-[#25D366]">
          <h2 className="text-xl font-bold text-[#133785] mb-4">Contato Direto</h2>
          <p className="text-gray-600 mb-4">
            Você pode solicitar seu orçamento diretamente pelos nossos canais de contato:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a 
              href="https://wa.me/5541996266007?text=Olá,%20gostaria%20de%20solicitar%20um%20orçamento%20para%20uma%20proposta."
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-colors"
            >
              <div className="bg-[#25D366] p-2 rounded-full">
                <WhatsApp className="text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-800">WhatsApp</p>
                <p className="text-gray-600">(41) 99626-6007</p>
              </div>
            </a>
            
            <a 
              href="mailto:operacional@triunfocorrespondente.com.br"
              className="flex items-center gap-3 p-4 rounded-lg bg-[#ea4335]/10 hover:bg-[#ea4335]/20 transition-colors"
            >
              <div className="bg-[#ea4335] p-2 rounded-full">
                <Email className="text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Email</p>
                <p className="text-gray-600 text-sm">operacional@triunfocorrespondente.com.br</p>
              </div>
            </a>
            
            <a 
              href="tel:+5541996266007"
              className="flex items-center gap-3 p-4 rounded-lg bg-[#4285F4]/10 hover:bg-[#4285F4]/20 transition-colors"
            >
              <div className="bg-[#4285F4] p-2 rounded-full">
                <Phone className="text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Telefone</p>
                <p className="text-gray-600">(41) 99626-6007</p>
              </div>
            </a>
          </div>
        </div>

        {/* Processo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div 
                className="rounded-xl p-6 text-center shadow-lg h-full flex flex-col items-center"
                style={{ backgroundColor: 'white', borderTop: `5px solid ${step.color}` }}
              >
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: step.color }}
                >
                  {step.icon}
                </div>
                
                <span 
                  className="absolute top-6 right-4 text-lg font-bold rounded-full w-8 h-8 flex items-center justify-center"
                  style={{ backgroundColor: step.color, color: 'white' }}
                >
                  {index + 1}
                </span>
                
                <h3 className="text-xl font-bold text-[#133785] mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 transform translate-x-0 -translate-y-1/2 z-10">
                  <div className="w-6 h-6 rotate-45 border-t border-r border-gray-200 bg-white"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Simulador */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-16">
          <div className="bg-[#133785] p-6 text-white">
            <div className="flex items-center gap-3">
              <Calculate className="text-3xl" />
              <h2 className="text-2xl font-bold">Simule seu Empréstimo</h2>
            </div>
            <p className="mt-2 opacity-90">
              Faça uma simulação rápida para ter uma ideia dos valores e condições.
            </p>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Valor do Empréstimo</label>
                  <div className="mb-2">
                    <span className="text-[#133785] text-2xl font-bold">R$ {loanValue.toLocaleString('pt-BR')}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1000" 
                    max="100000" 
                    step="1000" 
                    value={loanValue}
                    onChange={handleLoanValueChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>R$ 1.000</span>
                    <span>R$ 100.000</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Prazo (meses)</label>
                  <div className="mb-2">
                    <span className="text-[#133785] text-2xl font-bold">{loanTerm} meses</span>
                  </div>
                  <input 
                    type="range" 
                    min="6" 
                    max="72" 
                    step="6" 
                    value={loanTerm}
                    onChange={handleLoanTermChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>6 meses</span>
                    <span>72 meses</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#f0f4f9] p-6 rounded-lg flex flex-col">
                <h3 className="text-xl font-bold text-[#133785] mb-4">Resultado da Simulação</h3>
                
                <div className="mb-4">
                  <span className="text-gray-600">Valor solicitado:</span>
                  <span className="block text-xl font-semibold text-[#133785]">
                    R$ {loanValue.toLocaleString('pt-BR')}
                  </span>
                </div>
                
                <div className="mb-4">
                  <span className="text-gray-600">Prazo:</span>
                  <span className="block text-xl font-semibold text-[#133785]">
                    {loanTerm} meses
                  </span>
                </div>
                
                <div className="mb-6">
                  <span className="text-gray-600">Parcela estimada:</span>
                  <span className="block text-2xl font-bold text-[#e67f00]">
                    R$ {calculateMonthlyPayment()}
                  </span>
                  <span className="text-xs text-gray-500">*Valor aproximado, sujeito a alterações após análise.</span>
                </div>
                
                <a 
                  href={`https://wa.me/5541996266007?text=${encodeURIComponent(getWhatsAppMessage())}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-auto bg-[#25D366] text-white py-3 px-6 rounded-full hover:bg-[#1da851] transition-colors text-lg font-medium flex items-center justify-center gap-2"
                >
                  <WhatsApp />
                  Enviar Simulação via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-[#133785] rounded-xl p-8 shadow-lg text-white">
          <h2 className="text-2xl font-bold mb-4">Pronto para solicitar seu orçamento?</h2>
          <p className="mb-6 text-lg opacity-90 max-w-2xl mx-auto">
            Nossos consultores estão prontos para te ajudar a encontrar as melhores condições para o seu empréstimo.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="https://wa.me/5541996266007?text=Olá,%20gostaria%20de%20solicitar%20um%20orçamento%20para%20uma%20proposta."
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white py-3 px-8 rounded-full hover:bg-[#1da851] transition-colors text-lg font-medium flex items-center justify-center gap-2"
            >
              <WhatsApp />
              Solicitar via WhatsApp
            </a>
            <button className="bg-gradient-to-r from-[#fb9445] to-[#e67f00] text-white py-3 px-8 rounded-full hover:opacity-90 transition-opacity text-lg font-medium">
              Preencher Formulário
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestQuoteSection; 