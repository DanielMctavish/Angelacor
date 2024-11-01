import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SimulatorMain from './components/angel_simulator/SimulatorMain.jsx';
import TriunfoHome from './components/home/TriunfoHome.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/simulador" element={<SimulatorMain />} />
        <Route path="/" element={<TriunfoHome />} />
      </Routes>
    </Router>
  );
}

export default App;
