// IMPORTS ------------------------------------------------------------------------------------------------------ 
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "./Settings.css";
import FullscreenToggle from "./FullscreenToggle";

import machineImage from "./load-placement.jpg"; 
import elmersLogo from './elmers.jpg';

// SETTINGS -----------------------------------------------------------------------------------------------------
function Settings() {

  // Navigation
  const navigate = useNavigate(); 
  const location = useLocation();

  const handleBack = () => {
    navigate('/'); 
  };

  // Pulling from Home.js
  const { maxWeight, machineType } = location.state;

  // CONSTANTS --------------------------------------------------------------------------------------------------
  const cropFillRateValues = [1,5,10,25,50,100,250,500,1000,5000,10000];
  const defaultPTOValue = 1000;
  const minPTO = 0;
  const maxPTO = 2000;
  const defaultWeight = maxWeight/2;

  // DEFAULT SETTINGS ------------------------------------------------------------------------------------------
  const [loadPosition, setLoadPosition] = useState(1);
  const [ptoRPM, setPtoRPM] = useState(defaultPTOValue); 
  const [ptoStatus, setPtoStatus] = useState(true); 
  const [frontWeight, setFrontWeight] = useState(defaultWeight/2);
  const [rearWeight, setRearWeight] = useState(defaultWeight/2);
  const [cropFillRate, setCropFillRate] = useState(cropFillRateValues[6]); 

  // FUNCTIONS -------------------------------------------------------------------------------------------------

  // Initialization
  useEffect(() => {
    handleSubmitCropFillRate();
    handleSubmitFrontWeight();
    handleSubmitRearWeight();
    handleSubmitPTO();
    handleSubmitMachine();
  }, []);

  // From Home.js
  const handleSubmitMachine = async () =>
  {
      try {
      const response = await fetch('http://10.42.0.1:8000/set-machine-type', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify( {value: machineType} ),
      });

      const data = await response.json();
      // -> console.log('Machine Type set:', data);
      //alert('Machine Type successfully set.');
      } catch (error) 
      {
      // -> console.error('Error setting Machine Type:', error);
      // -> alert('Failed to set Machine Type. Check console for details.');
      }
  };

  const handleWeightChange = (delta) => 
  {
    //const startTime = performance.now(); <- timing

    // Maximum weight for each side
    const maxAllowedWeight = maxWeight / 2; 
    
    // Allows us to modify their values within the rear/front functions
    let frontDelta, rearDelta;
  
    // Back loaded
    if (loadPosition === 0) 
    {
      frontDelta = (1 / 3) * delta * cropFillRate;
      rearDelta = (2 / 3) * delta * cropFillRate;
    } 
    // Front loaded
    else if (loadPosition === 2) 
    {
      frontDelta = (2 / 3) * delta * cropFillRate;
      rearDelta = (1 / 3) * delta * cropFillRate;
    } 
    else 
    // Middle
    {
      frontDelta = (1 / 2) * delta * cropFillRate;
      rearDelta = (1 / 2) * delta * cropFillRate;
    }
  
    // Apply constraints to prevent exceeding max weight or going below 0
    setFrontWeight((prevFrontWeight) => 
    {
      const newFrontWeight = prevFrontWeight + frontDelta;
      return Math.min(Math.max(newFrontWeight, 0), maxAllowedWeight);
    });
  
    setRearWeight((prevRearWeight) => 
    {
      const newRearWeight = prevRearWeight + rearDelta;
      return Math.min(Math.max(newRearWeight, 0), maxAllowedWeight);
    });

    /* Timing
    const endTime = performance.now(); 
    const elapsedTime = endTime - startTime; 
  
    console.log(`Weight change took: ${elapsedTime.toFixed(2)} ms`);
    */
  };

  const handleQuickLoad = () => {
    setFrontWeight(maxWeight/2)
    setRearWeight(maxWeight/2);
  };
  
  const handleSubmitFrontWeight = async () =>
  {
    try {
      const response = await fetch('http://10.42.0.1:8000/set-front-weight', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify( {value: frontWeight} ),
      });

      const data = await response.json();
      // -> console.log('Front Weight set:', data);
      //alert('Front Weight successfully set.');
    } catch (error) 
    {
      // -> console.error('Error setting Front Weight:', error);
      // -> alert('Failed to set Front Weight. Check console for details.');
    }
  };

  const handleSubmitRearWeight = async () =>
  {
    try {
      const response = await fetch('http://10.42.0.1:8000/set-rear-weight', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify( {value: rearWeight} ),
      });

      const data = await response.json();
      // -> console.log('Rear Weight set:', data);
      //alert('Rear Weight successfully set.');
    } catch (error) 
    {
      // -> console.error('Error setting Rear Weight:', error);
      // -> alert('Failed to set Rear Weight. Check console for details.');
    }
  };

  useEffect(() => {
    //console.log("Weight Updated: ", weight);
    handleSubmitFrontWeight();
  }, [frontWeight]);

  useEffect(() => {
    //console.log("Weight Updated: ", weight);
    handleSubmitRearWeight();
  }, [rearWeight]);

  const handleCropFillRateChange = (delta) => 
  {
    setCropFillRate((prevRate) => 
    {
      const currentIndex = cropFillRateValues.indexOf(prevRate);

      // Increment or decrement the index
      let newIndex = currentIndex + delta;

      // Ensure the new index is within bounds
      if (newIndex < 0) newIndex = 0;
      if (newIndex >= cropFillRateValues.length) newIndex = cropFillRateValues.length - 1;

      return cropFillRateValues[newIndex];
    });
  }

  const handleSubmitCropFillRate = async () =>
  {
    try {
      const response = await fetch('http://10.42.0.1:8000/set-crop-fill-rate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify( {value: cropFillRate} ),
      });

      const data = await response.json();
      // -> console.log('Crop Fill Rate set:', data);
      //alert('Crop Fill Rate successfully set.');
    } catch (error) 
    {
      // -> console.error('Error setting Crop Fill Rate:', error);
      // -> alert('Failed to set Crop Fill Rate. Check console for details.');
    }
  };

  useEffect(() => {
    //console.log("Crop Fill Rate Updated: ", cropFillRate);
    handleSubmitCropFillRate();
  }, [cropFillRate]);

  const handlePtoChange = (event) => {
    setPtoRPM(event.target.value);
  };

  const handleSubmitPTO = async () => 
  {
    setPtoStatus(!ptoStatus)

    try {
      const response = await fetch('http://10.42.0.1:8000/set-pto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify( {value: !ptoStatus} ),
      });

      const data = await response.json();
      //console.log('PTO set:', data);
      //alert('PTO successfully set.');
    } catch (error) 
    {
      //console.error('Error setting PTO:', error);
      //alert('Failed to set PTO. Check console for details.');
    }
  };

  const handleReset = () => {
    setCropFillRate(cropFillRateValues[6]);
  };

  const handleLoadPositionChange = (event) => {
    setLoadPosition(Number(event.target.value));
  };

  // PAGE LAYOUT ----------------------------------------------------------------------------------------------
  return (
    <div className = "Settings">
        
      {/* Header */}
      <header className="header">
        <div className = "header-content">

          {/* Back Button */}
          <div className = "header-left">
            <button className="back-button" onClick={handleBack}>
              ←
            </button>
          </div>

          {/* Elmers Logo Styling */}
          <img src = {elmersLogo} alt = "Elmer's Manufacturing Logo" className = "title-image" />

          {/* Full Screen Toggle */}
          <div className = "header-right">
            <FullscreenToggle />
          </div>
        </div>

        {/* Divider Styling */}
        <div className = "divider"></div>
      </header>

      {/* Main Page Content */}
      <div className = "page-content">

        {/* Left Section: Weight, PTO, Crop Fill Rate */}
        <div className = "left-section">

          {/* Weight */}
          <div className = "weight-section">
            <div className = "title">Weight</div>
            <div className = "buttons">
              <button onClick={() => handleWeightChange(-1)}>-</button>
              <div className = "weight-value">{frontWeight + rearWeight} kg</div>
              <button onClick = {() => handleWeightChange(1)}>+</button>
            </div>
            <button className = "quick-load-button" onClick = {handleQuickLoad}>
              Quick Load
            </button>
          </div>

          {/* PTO */}
          <div className = "pto-section">
            <div className = "title">PTO</div>
            <div className = "pto-value">{ptoRPM} RPM</div>
            <input
              type="range"
              min = {minPTO}
              max = {maxPTO}
              value = {ptoRPM}
              onChange = {handlePtoChange}
              className = "pto-slider"
            />
            <div className = "pto-button-wrapper">
              <button
                className = {`pto-toggle-button ${ptoStatus ? "pto-on" : "pto-off"}`}
                onClick = {handleSubmitPTO}
              >
                {ptoStatus ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* Crop Fill Rate */}
          <div className = "crop-fill-rate-section">
            <div className = "title">Crop Fill Rate</div>
            <div className = "buttons">
              <button onClick = {() => handleCropFillRateChange(-1)}>-</button>
              <div className = "crop-fill-value">{cropFillRate} kg</div>
              <button onClick = {() => handleCropFillRateChange(1)}>+</button>
            </div>
            <button className = "reset-button" onClick = {handleReset}>
              Reset
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className = "right-section">

          {/* Load Position */}
          <div className = "load-position-section">
            <div className = "title">Load Position</div>
            <input
              type = "range"
              min = "0"
              max = "2"
              step = "1"
              value = {loadPosition}
              onChange = {handleLoadPositionChange}
              className = "load-position-slider"
            />
          </div>

          {/* Machine Image */}
          <div className = "machine-image-container">
            <img src = {machineImage} alt = "Machine" className = "machine-image" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
