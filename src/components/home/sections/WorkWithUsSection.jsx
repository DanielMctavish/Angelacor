import React, { useState } from 'react';
import { Work, ArrowBack, BusinessCenter, Group, School, ExpandMore, WhatsApp, Email, Phone } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function WorkWithUsSection() {
  const navigate = useNavigate();
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    mensagem: '',
    curriculo: null
  });

  const jobPositions = [
    {
      title: 'Consultor de Empréstimos',
      department: 'Comercial',
      location: 'São Paulo - SP',
      type: 'Presencial',
      description: 'Atendimento a clientes interessados em empréstimos, análise de perfil e propostas, negociação de taxas e condições.'
    },
    {
      title: 'Analista de Crédito',
      department: 'Crédito',
      location: 'Rio de Janeiro - RJ',
      type: 'Híbrido',
      description: 'Análise de documentação, verificação de risco de crédito, avaliação de garantias e elaboração de relatórios de crédito.'
    },
    {
      title: 'Desenvolvedor Front-end',
      department: 'Tecnologia',
      location: 'São Paulo - SP',
      type: 'Remoto',
      description: 'Desenvolvimento e manutenção de interfaces web, implementação de APIs, otimização de performance e experiência do usuário.'
    },
    {
      title: 'Assistente Administrativo',
      department: 'Administrativo',
      location: 'Belo Horizonte - MG',
      type: 'Presencial',
      description: 'Suporte administrativo, controle de documentação, atendimento telefônico e organização de agenda.'
    }
  ];

  const benefits = [
    'Plano de saúde e odontológico',
    'Vale-refeição e vale-alimentação',
    'Seguro de vida',
    'Bônus por resultados',
    'Auxílio educação',
    'Horário flexível',
    'Programa de desenvolvimento interno',
    'Plano de carreira'
  ];

  const faqItems = [
    {
      question: 'Como funciona o processo seletivo?',
      answer: 'Nosso processo seletivo é composto por análise de currículo, teste técnico, entrevista com RH e entrevista com o gestor da área. Todo o processo é conduzido com agilidade e transparência.'
    },
    {
      question: 'Vocês oferecem oportunidades para pessoas sem experiência?',
      answer: 'Sim, temos programas de estágio e trainee para estudantes e recém-formados, além de posições júnior em várias áreas que não exigem experiência prévia.'
    },
    {
      question: 'É possível trabalhar remotamente?',
      answer: 'Algumas posições permitem trabalho totalmente remoto, enquanto outras funcionam em sistema híbrido. Isso varia de acordo com a função e as necessidades do cargo.'
    },
    {
      question: 'Como saber se meu perfil é adequado para a empresa?',
      answer: 'Valorizamos profissionais comprometidos, que buscam constante aprendizado e possuem boa capacidade de comunicação. Se você se identifica com nossos valores de transparência, inovação e foco no cliente, provavelmente será um bom fit para nossa equipe.'
    }
  ];

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      curriculo: e.target.files[0]
    });
  };

  const createWhatsAppMessage = () => {
    return encodeURIComponent("Olá, gostaria de enviar meu currículo para oportunidades de trabalho na empresa.");
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
            <Work className="text-[#e67f00] text-4xl" />
            <h1 className="text-3xl md:text-4xl font-bold text-[#133785]">Trabalhe Conosco</h1>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl">
            Junte-se à nossa equipe e faça parte de uma empresa que está revolucionando o mercado de empréstimos e financiamentos.
          </p>
        </div>

        {/* Por que trabalhar conosco */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#133785] mb-6">Por que trabalhar conosco?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-4 bg-[#f0f4f9] rounded-full">
                  <BusinessCenter className="text-[#133785] text-3xl" />
                </div>
                <h3 className="text-xl font-semibold text-[#133785] mb-2">Ambiente Dinâmico</h3>
                <p className="text-gray-600">
                  Um espaço de trabalho estimulante, com desafios constantes e oportunidades de crescimento profissional.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-4 bg-[#f0f4f9] rounded-full">
                  <Group className="text-[#133785] text-3xl" />
                </div>
                <h3 className="text-xl font-semibold text-[#133785] mb-2">Cultura Colaborativa</h3>
                <p className="text-gray-600">
                  Valorizamos o trabalho em equipe, a troca de conhecimentos e a colaboração entre diferentes áreas.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-4 bg-[#f0f4f9] rounded-full">
                  <School className="text-[#133785] text-3xl" />
                </div>
                <h3 className="text-xl font-semibold text-[#133785] mb-2">Desenvolvimento Contínuo</h3>
                <p className="text-gray-600">
                  Oferecemos programas de desenvolvimento profissional, com oportunidades de aprendizado e crescimento.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contate a equipe operacional */}
        <div className="mb-16 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-[#133785] p-6 text-white">
            <h2 className="text-2xl font-bold">Entre em contato com nossa equipe</h2>
            <p className="mt-2 opacity-90">
              Para enviar seu currículo ou obter mais informações sobre oportunidades, entre em contato diretamente com nossa equipe operacional.
            </p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <a 
                href={`https://wa.me/5541996266007?text=${createWhatsAppMessage()}`}
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
            
            <p className="text-center text-gray-600 mb-6">
              Nosso time de recrutamento analisará seu currículo e entrará em contato caso seu perfil se adeque às nossas oportunidades atuais.
            </p>
            
            <div className="flex justify-center">
              <a 
                href={`https://wa.me/5541996266007?text=${createWhatsAppMessage()}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white py-3 px-8 rounded-full hover:bg-[#1da851] transition-colors text-lg font-medium flex items-center gap-2"
              >
                <WhatsApp />
                Enviar Currículo via WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Benefícios */}
        <div className="mb-16 bg-[#133785] rounded-xl p-8 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Nossos Benefícios</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#e67f00] rounded-full"></div>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-[#133785] mb-6">Perguntas Frequentes</h2>
          
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button 
                  className="w-full flex justify-between items-center p-4 bg-[#f7f9fc] hover:bg-[#edf1f7] transition-colors text-left"
                  onClick={() => toggleAccordion(index)}
                >
                  <span className="font-medium text-[#133785]">{item.question}</span>
                  <ExpandMore 
                    className={`text-[#133785] transition-transform ${activeAccordion === index ? 'rotate-180' : ''}`} 
                  />
                </button>
                {activeAccordion === index && (
                  <div className="p-4 bg-white border-t border-gray-200">
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-[#fb9445] to-[#e67f00] rounded-xl p-8 shadow-lg text-white">
          <h2 className="text-2xl font-bold mb-4">Faça parte da nossa equipe!</h2>
          <p className="mb-6 text-lg max-w-2xl mx-auto">
            Envie seu currículo para nosso banco de talentos e entraremos em contato quando surgir uma oportunidade adequada ao seu perfil.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href={`https://wa.me/5541996266007?text=${createWhatsAppMessage()}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-[#e67f00] py-3 px-8 rounded-full hover:bg-[#f0f0f0] transition-colors text-lg font-medium flex items-center justify-center gap-2"
            >
              <WhatsApp className="text-[#25D366]" />
              Enviar via WhatsApp
            </a>
            
            <a 
              href="mailto:operacional@triunfocorrespondente.com.br?subject=Currículo%20para%20oportunidades&body=Olá,%20gostaria%20de%20enviar%20meu%20currículo%20para%20oportunidades%20de%20trabalho%20na%20empresa."
              className="bg-white text-[#e67f00] py-3 px-8 rounded-full hover:bg-[#f0f0f0] transition-colors text-lg font-medium flex items-center justify-center gap-2"
            >
              <Email className="text-[#ea4335]" />
              Enviar via Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkWithUsSection; 