import React, {useState} from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from "./Home"; 
import Settings from "./Settings"; 

import SimulationPowerProvider from './SimulationPower';

function App() {
  const [maxWeight, setMaxWeight] = useState(999);

  return (
    <Router>
      <SimulationPowerProvider>
        <Routes>
          <Route path="/" element={<Home maxWeight={maxWeight}/>} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </SimulationPowerProvider>
    </Router>
  );
}

export default App;
