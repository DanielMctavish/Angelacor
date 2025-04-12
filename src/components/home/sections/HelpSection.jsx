import React from 'react';
import { Help, Phone, Email, Chat, ArrowBack, WhatsApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function HelpSection() {
  const navigate = useNavigate();

  const helpOptions = [
    {
      icon: <WhatsApp className="text-[#25D366] text-3xl" />,
      title: 'WhatsApp',
      description: 'Envie mensagens diretamente para nossa equipe de atendimento.',
      action: '(41) 99626-6007',
      actionType: 'whatsapp',
      actionLink: 'https://wa.me/5541996266007?text=Olá,%20preciso%20de%20ajuda%20com%20'
    },
    {
      icon: <Phone className="text-[#133785] text-3xl" />,
      title: 'Atendimento por Telefone',
      description: 'Converse diretamente com nossos atendentes para resolver suas dúvidas.',
      action: '(41) 99626-6007',
      actionType: 'phone',
      actionLink: 'tel:+5541996266007'
    },
    {
      icon: <Email className="text-[#ea4335] text-3xl" />,
      title: 'Contato por Email',
      description: 'Envie sua dúvida para nosso email de atendimento.',
      action: 'operacional@triunfocorrespondente.com.br',
      actionType: 'email',
      actionLink: 'mailto:operacional@triunfocorrespondente.com.br?subject=Ajuda%20com%20'
    }
  ];

  const faqItems = [
    {
      question: 'Como faço para simular meu empréstimo?',
      answer: 'Você pode usar nossa calculadora online ou entrar em contato com um de nossos consultores para uma simulação personalizada.'
    },
    {
      question: 'Quanto tempo demora para o dinheiro cair na conta?',
      answer: 'Após a aprovação do seu empréstimo, o valor é depositado em até 24 horas úteis, dependendo do seu banco.'
    },
    {
      question: 'Quais documentos são necessários?',
      answer: 'Geralmente solicitamos RG, CPF, comprovante de residência e comprovante de renda atualizados.'
    },
    {
      question: 'Preciso ter conta em banco específico?',
      answer: 'Não, trabalhamos com todos os bancos. Você receberá o valor na conta de sua preferência.'
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#f5f7fa] to-white pt-24 pb-16">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Cabeçalho */}
        <div className="mb-10">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center text-[#133785] hover:text-[#e67f00] transition-colors mb-6"
          >
            <ArrowBack className="mr-1" /> Voltar para home
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <Help className="text-[#e67f00] text-4xl" />
            <h1 className="text-3xl md:text-4xl font-bold text-[#133785]">Preciso de Ajuda</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Estamos aqui para ajudar você com qualquer dúvida ou problema que possa ter.
          </p>
        </div>

        {/* Opções de Ajuda */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {helpOptions.map((option, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className="flex flex-col items-center text-center h-full">
                <div className={`mb-4 p-3 rounded-full ${
                  option.actionType === 'whatsapp' ? 'bg-[#25D366]/10' :
                  option.actionType === 'email' ? 'bg-[#ea4335]/10' : 'bg-[#f0f4f9]'
                }`}>
                  {option.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#133785] mb-2">{option.title}</h3>
                <p className="text-gray-600 mb-4">{option.description}</p>
                
                {option.actionType === 'whatsapp' ? (
                  <a 
                    href={option.actionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto bg-[#25D366] text-white py-2 px-6 rounded-full hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <WhatsApp /> Conversar agora
                  </a>
                ) : option.actionType === 'email' ? (
                  <a 
                    href={option.actionLink}
                    className="mt-auto font-medium text-[#ea4335] hover:underline"
                  >
                    {option.action}
                  </a>
                ) : option.actionType === 'phone' ? (
                  <a 
                    href={option.actionLink}
                    className="mt-auto font-medium text-[#133785] hover:underline"
                  >
                    {option.action}
                  </a>
                ) : (
                  <span className="mt-auto font-medium text-[#e67f00]">{option.action}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Contato direto */}
        <div className="bg-white rounded-xl p-6 mb-12 shadow-lg border-l-4 border-[#133785]">
          <h2 className="text-xl font-bold text-[#133785] mb-4">Contato Direto</h2>
          <p className="text-gray-600 mb-4">
            Nossa equipe está disponível de segunda a sexta-feira, das 9h às 18h, para atender você pelos seguintes canais:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <WhatsApp className="text-[#25D366]" />
              <span className="font-medium">WhatsApp:</span>
              <a href="https://wa.me/5541996266007" target="_blank" rel="noopener noreferrer" className="text-[#133785] hover:underline">
                (41) 99626-6007
              </a>
            </div>
            
            <div className="flex items-center gap-2">
              <Phone className="text-[#133785]" />
              <span className="font-medium">Telefone:</span>
              <a href="tel:+5541996266007" className="text-[#133785] hover:underline">
                (41) 99626-6007
              </a>
            </div>
            
            <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
              <Email className="text-[#ea4335]" />
              <span className="font-medium">E-mail:</span>
              <a href="mailto:operacional@triunfocorrespondente.com.br" className="text-[#133785] hover:underline">
                operacional@triunfocorrespondente.com.br
              </a>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-[#133785] mb-6">Perguntas Frequentes</h2>
          
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="border-b border-gray-100 pb-4">
                <h3 className="text-lg font-medium text-[#133785] mb-2">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpSection; 