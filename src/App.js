import React, {useState} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home"; 
import Settings from "./Settings"; 

function App() {
  const [maxWeight, setMaxWeight] = useState(999); // Default value

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home maxWeight={maxWeight}/>} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
