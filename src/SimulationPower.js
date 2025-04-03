import React, {createContext, useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

export const SimulationPower = createContext();

const SimulationPowerProvider = ({ children }) => {
  const [simulationPower, setSimulationPower] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const navigate = useNavigate();

  // Environment Variables
  const host = process.env.REACT_APP_HOST || "localhost";
  const port = process.env.REACT_APP_PORT || 8000;

  // Fetch simulation-power from API server
  const fetchSimulationPower = async () => {
    try {
      const response = await fetch(`http://${host}:${port}/online`);
      const data = await response.json();

      console.log(data)
      setSimulationPower(data["ONLINE"]);

      // No sim power -> return to Home
      if (!data["ONLINE"]) {
        navigate('/');
      }
      
    } catch (error) {
      console.error('Error fetching condition:', error);
    }
  };

  // Start polling when the component mounts
  useEffect(() => {
    fetchSimulationPower(); 
    const intervalId = setInterval(() => {
      fetchSimulationPower();
    }, 5000); 

    setIsPolling(true);

    return () => clearInterval(intervalId); 
  }, []);

  return (
    <SimulationPower.Provider value={{ simulationPower, isPolling }}>
      {children}
    </SimulationPower.Provider>
  );
};

export default SimulationPowerProvider;
