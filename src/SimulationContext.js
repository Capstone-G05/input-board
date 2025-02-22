import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const SimulationPower = createContext();

const SimulationPower = ({ children }) => {
  const [canStartSimulation, setCanStartSimulation] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const navigate = useNavigate();

  // Function to fetch the condition from the API
  const fetchCondition = async () => {
    try {
      const response = await fetch('/api/check-condition');
      const data = await response.json();
      setCanStartSimulation(data.isReady);

      // If condition becomes false, redirect to Home
      if (!data.isReady) {
        navigate('/'); // Assuming "/" is your Home route
      }
    } catch (error) {
      console.error('Error fetching condition:', error);
    }
  };

  // Start polling when the component mounts
  useEffect(() => {
    fetchCondition(); // Initial check on load
    const intervalId = setInterval(() => {
      fetchCondition();
    }, 5000); // Poll every 5 seconds

    setIsPolling(true);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [navigate]);

  return (
    <SimulationPower.Provider value={{ canStartSimulation, isPolling }}>
      {children}
    </SimulationPower.Provider>
  );
};

export default SimulationPower;
