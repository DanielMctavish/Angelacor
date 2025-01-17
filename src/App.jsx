import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SimulatorMain from './components/angel_simulator/SimulatorMain.jsx';
import TriunfoHome from './components/home/TriunfoHome.jsx';
import AdminDashboard from './components/Plataform/Admin/AdminDashboard.jsx';
import AdminLogin from './components/Plataform/Admin/AdminLogin.jsx';
import ColaboratorLogin from './components/Plataform/colaborators/ColaboratorLogin.jsx';
import LoginSelector from './components/Plataform/LoginSelector.jsx';
import ColaboratorsArea from './components/Plataform/Admin/Colaborators/ColaboratorsArea.jsx';
import ColaboradorDashboard from './components/Plataform/colaborators/dashboard/ColaboradorDashboard.jsx';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/simulador" element={<SimulatorMain />} />
        <Route path="/plataforma" element={<AdminDashboard />} />
        <Route path="/plataforma/colaboradores" element={<ColaboratorsArea />} />
        <Route path="/login" element={<LoginSelector />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/colaborator-login" element={<ColaboratorLogin />} />
        <Route path="/" element={<TriunfoHome />} />

        {/* Componentes do Colaborador */}
        <Route path="/colaborador-dashboard" element={<ColaboradorDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
