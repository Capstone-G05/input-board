// IMPORTS ------------------------------------------------------------------------------------------------------ 
import React, { useState } from 'react';
import './App.css';
import haulmasterImage from './haulmaster.png'; 
import wolverineImage from './wolverine.png'; 
import elmersLogo from './elmers.jpg'; 

// APP ---------------------------------------------------------------------------------------------------------
function App() {

  // STATE INITIALIZATION --------------------------------------------------------------------------------------
  const [selectedMachine, setSelectedMachine] = useState('Haulmaster');
  const [selectedSize, setSelectedSize] = useState('1300');

  // MACHINE DEFINITIONS ---------------------------------------------------------------------------------------
  const machines = {
    Haulmaster: {
      sizes: ['1300', '2000'],
      image: haulmasterImage,
      specifications: [
        { label: 'Width', value: '12\' 2”' },
        { label: 'Overall Length', value: '32\' 3”' },
        { label: 'Tank Length', value: '22\' 8”' },
        { label: 'Loading Side Height', value: '10\' 2"' },
        { label: 'Transport Height', value: '11\' 4”' },
        { label: 'Auger Max Height', value: '14\' 9”' },
        { label: 'Auger Max Reach', value: '9\'' },
        { label: 'Ground Clearance (Standard Undercarriage)', value: '1\' 6”' },
        { label: 'Empty Weight w/ Large Tracks', value: '30,500 lbs' },
        { label: 'Empty Weight w/ 36" Transfer Tracks', value: '28,600 lbs' },
        { label: 'Empty Weight w/ Tires & Wheels (1250 Tires)', value: '22,100 lbs' },
        { label: 'Empty Weight w/ Row Crop Tandem (520 Tires)', value: '24,900 lbs' },
        { label: 'Empty Weight w/ Steerable Inlinie Tandem', value: '26,400 lbs' },
        { label: 'Tongue Weight', value: '4,000 lbs' },
        { label: 'Unloading Auger', value: '22”' },
        { label: 'Horizontal Auger', value: '22"' },
        { label: 'Hydraulic Remotes', value: '4' },
        { label: 'Required Tractor HP (KW)', value: '225(170)' },
        { label: 'IF 1250/50R32 CFO', value: 'Standard' },
        { label: 'CAT 4 Hitch', value: 'Standard' },
      ],
    },
    Wolverine: {
      sizes: ['1500'],
      image: wolverineImage,
      specifications: [
        { label: 'Max Load', value: '12 tons' },
        { label: 'Engine', value: 'Turbo Diesel' },
        { label: 'Weight', value: '4,800 kg' },
        { label: 'Capacity', value: '1,200 lbs' },
        { label: 'Power', value: '140 HP' },
      ],
    },
  };

  // MACHINE SWAP -----------------------------------------------------------------------------------------------
  const handleMachineChange = (machine) => {
    setSelectedMachine(machine);
    setSelectedSize(machines[machine].sizes[0]);
  };

  const nextMachine = () => {
    const machineNames = Object.keys(machines);
    const currentIndex = machineNames.indexOf(selectedMachine);
    const nextIndex = (currentIndex + 1) % machineNames.length;
    setSelectedMachine(machineNames[nextIndex]);
    setSelectedSize(machines[machineNames[nextIndex]].sizes[0]);
  };

  const prevMachine = () => {
    const machineNames = Object.keys(machines);
    const currentIndex = machineNames.indexOf(selectedMachine);
    const prevIndex = (currentIndex - 1 + machineNames.length) % machineNames.length;
    setSelectedMachine(machineNames[prevIndex]);
    setSelectedSize(machines[machineNames[prevIndex]].sizes[0]);
  };

  // SIZE SWAP --------------------------------------------------------------------------------------------------
  const nextSize = () => {
    const availableSizes = machines[selectedMachine].sizes;
    const currentIndex = availableSizes.indexOf(selectedSize);
    const nextIndex = (currentIndex + 1) % availableSizes.length;
    setSelectedSize(availableSizes[nextIndex]);
  };

  const prevSize = () => {
    const availableSizes = machines[selectedMachine].sizes;
    const currentIndex = availableSizes.indexOf(selectedSize);
    const prevIndex = (currentIndex - 1 + availableSizes.length) % availableSizes.length;
    setSelectedSize(availableSizes[prevIndex]);
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Elmers Logo Styling */}
        <img src={elmersLogo} alt="Elmer's Manufacturing Logo" className="title-image" />
        
        {/* Divider Styling */}
        <div className="divider"></div>

        {/* Machine Selection Styling */}
        <div className="machine-carousel">
          <button className="arrow-button" onClick={prevMachine}>←</button>
          <span className="machine-name">{selectedMachine}</span>
          <button className="arrow-button" onClick={nextMachine}>→</button>
        </div>

        {/* Size Selection Styling */}
        <div className="size-carousel">
          <button className="arrow-button" onClick={prevSize}>←</button>
          <span className="size-name">{selectedSize}</span>
          <button className="arrow-button" onClick={nextSize}>→</button>
        </div>

        {/* Display Image and Specifications Styling */}
        <div className="carousel-content">
          <div className="image-container">
            <img
              className="image-size"
              src={machines[selectedMachine].image}
              alt={selectedMachine}
            />
          </div>
          <div className="specifications-panel">
            <h3>Specifications</h3>
            <ul>
              {machines[selectedMachine].specifications.map((spec, index) => (
                <li key={index}>
                  <span className="spec-label">{spec.label}:</span> 
                  <span className="spec-value">{spec.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
