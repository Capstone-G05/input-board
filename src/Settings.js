// IMPORTS ------------------------------------------------------------------------------------------------------ 
import React, { useState, useEffect } from "react";
import machineImage from "./load-placement.jpg"; 
import "./Settings.css";

// SETTINGS -----------------------------------------------------------------------------------------------------
const Settings = ( {maxWeight} ) => {
  // CONSTANTS --------------------------------------------------------------------------------------------------
  const defaultCropFillRate = 50.0;
  const defaultPTOValue = 1000;
  const minPTO = 0;
  const maxPTO = 2000;
  const defaultWeight = maxWeight/2;

  // DEFAULT SETTINGS ------------------------------------------------------------------------------------------
  const [isOpen, setIsOpen] = useState(false);
  const [loadPosition, setLoadPosition] = useState(1);
  const [ptoRPM, setPtoRPM] = useState(defaultPTOValue); 
  const [ptoStatus, setPtoStatus] = useState(false); 
  const [frontWeight, setFrontWeight] = useState(defaultWeight/2);
  const [rearWeight, setRearWeight] = useState(defaultWeight/2);
  const [cropFillRate, setCropFillRate] = useState(defaultCropFillRate); 

  // FUNCTIONS -------------------------------------------------------------------------------------------------
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
  
  const togglePopup = () => {
    setIsOpen(!isOpen);
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
  

  const handleSubmitFrontWeight = async () =>
  {
    try {
      const response = await fetch('http://10.42.0.1:8000/weight-front', {
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
      const response = await fetch('http://10.42.0.1:8000/weight-rear', {
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
      const newRate = prevRate + delta;
      
      // Prevent negative rate otherwise return rate
      if (newRate < 0) return 0; 
      return newRate;
    });
  }

  const handleSubmitCropFillRate = async () =>
  {
    try {
      const response = await fetch('http://10.42.0.1:8000/crop-fill-rate', {
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

  const handleQuickLoad = () => {
    setFrontWeight(maxWeight/2)
    setRearWeight(maxWeight/2);
  };

  const handlePtoChange = (event) => {
    setPtoRPM(event.target.value);
  };

  const handleReset = () => {
    setCropFillRate(defaultCropFillRate);
  };

  const handleLoadPositionChange = (event) => {
    setLoadPosition(Number(event.target.value));
  };

  const getLoadPositionLabel = () => {
    switch (loadPosition) {
      case 0:
        return "Back";
      case 1:
        return "Middle";
      case 2:
        return "Front";
      default:
        return "";
    }
  };

  // PAGE LAYOUT ----------------------------------------------------------------------------------------------
  return (
    <div className = "settings-container">
      {/* Start Simulation Button */}
      <button className="start-simulation-button" onClick={togglePopup}>
        Start Simulation
      </button>

      {/* Popup Window Opened */}
      {isOpen && (
        
        <div className = "popup">
          
          {/* Title */}
          <div className = "popup-title">Parameter Setup</div>

          {/* Divider Styling */}
          <div className = "divider"></div>

          <div className = "popup-content">

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
                    {ptoStatus ? "PTO On" : "PTO Off"}
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
                  value = {loadPosition}
                  onChange = {handleLoadPositionChange}
                  className = "load-position-slider"
                />
                <div className = "load-position-label">{getLoadPositionLabel()}</div>
              </div>

              {/* Arrows and Machine Image */}
              <div className = "arrow-container">
                <button className = {`arrow-button front-arrow ${loadPosition === 0 ? "visible" : "invisible"}`}>▼</button>
                <button className = {`arrow-button middle-arrow ${loadPosition === 1 ? "visible" : "invisible"}`}>▼</button>
                <button className = {`arrow-button back-arrow ${loadPosition === 2 ? "visible" : "invisible"}`}>▼</button>
              </div>

              <div className = "machine-image-container">
                <img src = {machineImage} alt = "Machine" className = "machine-image" />
              </div>

              {/* Close Button */}
              <button className="close-button" onClick={togglePopup}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
