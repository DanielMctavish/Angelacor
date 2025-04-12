import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TriunfoHome from './components/home/TriunfoHome.jsx';
import AdminDashboard from './components/Plataform/Admin/AdminDashboard.jsx';
import AdminLogin from './components/Plataform/Admin/AdminLogin.jsx';
import ColaboratorLogin from './components/Plataform/colaborators/ColaboratorLogin.jsx';
import LoginSelector from './components/Plataform/LoginSelector.jsx';
import ColaboratorsArea from './components/Plataform/Admin/Colaborators/ColaboratorsArea.jsx';
import ColaboradorDashboard from './components/Plataform/colaborators/dashboard/ColaboradorDashboard.jsx';
import DashboardClient from './components/Plataform/Client/DashboardClient.jsx';
import ClientLogin from './components/Plataform/Client/components/ClientLogin.jsx';
import ProposalDetailsForClient from './components/Plataform/Client/components/ProposalDetailsForClient.jsx';
import ToastContainer from './components/Common/Toast/Toast';
import HelpSection from './components/home/sections/HelpSection.jsx';
import CreateAccountSection from './components/home/sections/CreateAccountSection.jsx';
import RequestQuoteSection from './components/home/sections/RequestQuoteSection.jsx';
import WorkWithUsSection from './components/home/sections/WorkWithUsSection.jsx';
import AdminAnalytics from './components/Plataform/Admin/AdminAnalytics.jsx';


// Componente de rota protegida
const ProtectedRoute = ({ children }) => {
    const colaboratorData = localStorage.getItem('colaboratorData');
    if (!colaboratorData) {
        return <Navigate to="/login" />;
    }
    return children;
};

// Componente de rota protegida para cliente
const ClientProtectedRoute = ({ children }) => {
    const clientData = localStorage.getItem('clientToken');
    if (!clientData) {
        return <Navigate to="/client-login" />;
    }
    return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/plataforma" element={<AdminDashboard />} />
        <Route path="/plataforma/colaboradores" element={<ColaboratorsArea />} />
        <Route path="/plataforma/analytics" element={<AdminAnalytics />} />
        <Route path="/login" element={<LoginSelector />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/" element={<TriunfoHome />} />
        <Route path="/colaborator-login" element={<ColaboratorLogin />} />
        <Route path="/colaborador-dashboard" element={<ColaboradorDashboard />} />
        
        {/* Rotas de cliente */}
        <Route path="/dashboard-client" element={<DashboardClient/>}/>
        <Route path="/client/dashboard" element={
          <ClientProtectedRoute>
            <DashboardClient/>
          </ClientProtectedRoute>
        }/>
        <Route path="/client/proposal/:proposalId" element={
          <ClientProtectedRoute>
            <ProposalDetailsForClient/>
          </ClientProtectedRoute>
        }/>
        <Route path="/client-login" element={<ClientLogin/>}/>
        
        {/* Novas rotas do menu */}
        <Route path="/ajuda" element={<HelpSection />} />
        <Route path="/como-criar-conta" element={<CreateAccountSection />} />
        <Route path="/solicitar-orcamento" element={<RequestQuoteSection />} />
        <Route path="/trabalhe-conosco" element={<WorkWithUsSection />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
