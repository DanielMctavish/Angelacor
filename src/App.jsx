import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SimulatorMain from './components/SimulatorMain';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SimulatorMain />} />
      </Routes>
    </Router>
  );
}

export default App;
