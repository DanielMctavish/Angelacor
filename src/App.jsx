import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SimulatorMain from './components/angel_simulator/SimulatorMain.jsx';
import TriunfoHome from './components/home/TriunfoHome.jsx';
import AdminDashboard from './components/Plataform/Admin/AdminDashboard.jsx';
import AdminLogin from './components/Plataform/Admin/AdminLogin.jsx';
import ColaboratorLogin from './components/Plataform/colaborators/ColaboratorLogin.jsx';
import LoginSelector from './components/Plataform/LoginSelector.jsx';
import ColaboratorsArea from './components/Plataform/Admin/Colaborators/ColaboratorsArea.jsx';
import ColaboradorDashboard from './components/Plataform/colaborators/dashboard/ColaboradorDashboard.jsx';
import DashboardClient from './components/Plataform/Client/DashboardClient.jsx';
import ClientLogin from './components/Plataform/Client/components/ClientLogin.jsx';
import ToastContainer from './components/Common/Toast/Toast';

// Componente de rota protegida
const ProtectedRoute = ({ children }) => {
    const colaboratorData = localStorage.getItem('colaboratorData');
    if (!colaboratorData) {
        return <Navigate to="/login" />;
    }
    return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/simulador" element={
          <ProtectedRoute>
            <SimulatorMain />
          </ProtectedRoute>
        } />
        <Route path="/plataforma" element={<AdminDashboard />} />
        <Route path="/plataforma/colaboradores" element={<ColaboratorsArea />} />
        <Route path="/login" element={<LoginSelector />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/" element={<TriunfoHome />} />

        {/* Componentes do Colaborador */}
        <Route path="/colaborator-login" element={<ColaboratorLogin />} />
        <Route path="/colaborador-dashboard" element={<ColaboradorDashboard />} />

        {/* Componentes do Cliente */}

        <Route path="/dashboard-client" element={<DashboardClient/>}/>
        <Route path="/client-login" element={<ClientLogin/>}/>

      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
