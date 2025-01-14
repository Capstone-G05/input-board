// IMPORTS ------------------------------------------------------------------------------------------------------ 
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import machineImage from "./load-placement.jpg"; 
import "./Settings.css";

// SETTINGS -----------------------------------------------------------------------------------------------------
const Settings = ( {maxWeight} ) => {
  // CONSTANTS --------------------------------------------------------------------------------------------------
  const defaultCropFillRate = 50.0;
  const defaultPTOValue = 1000;
  const minPTO = 0;
  const maxPTO = 2000;
  const defaultWeight = 1000.0;

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
      const response = await fetch('http://192.168.100.139:8020/set-pto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify( {value: !ptoStatus} ),
      });

      const data = await response.json();
      console.log('PTO set:', data);
      //alert('PTO successfully set.');
    } catch (error) 
    {
      console.error('Error setting PTO:', error);
      alert('Failed to set PTO. Check console for details.');
    }
  };
  
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleWeightChange = (delta) => 
  {
    // Back Loaded
    if (loadPosition == 0)
    {
      setFrontWeight(frontWeight + (1/3)*delta*cropFillRate)
      setRearWeight(rearWeight + (2/3)*delta*cropFillRate)
    }
    else if (loadPosition == 2)
    {
      setFrontWeight(frontWeight + (2/3)*delta*cropFillRate)
      setRearWeight(rearWeight + (1/3)*delta*cropFillRate)
    }
    else{
      setFrontWeight(frontWeight + (1/2)*delta*cropFillRate)
      setRearWeight(rearWeight + (1/2)*delta*cropFillRate)
    }
  };

  const handleSubmitFrontWeight = async () =>
  {
    try {
      const response = await fetch('http://192.168.100.139:8020/set-front-weight', {
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
      const response = await fetch('http://192.168.100.139:8020/set-rear-weight', {
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
    setCropFillRate(cropFillRate + delta);
  }

  const handleSubmitCropFillRate = async () =>
  {
    try {
      const response = await fetch('http://192.168.100.139:8020/set-crop-fill-rate', {
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

    // Settings Icon
    <div className = "settings-container">
      <button className = "settings-button" onClick = {togglePopup}>
        <FontAwesomeIcon icon = {faCog} />
      </button>

      {/* Popup Window Opened */}
      {isOpen && (
        <div className = "popup">
          <div className = "popup-content">

            {/* Title */}
            <div className = "popup-title">Parameter Setup</div>

            {/* Top Section: Weight, PTO, Crop Fill Rate */}
            <div className = "top-section">

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
                <button
                  className = {`pto-toggle-button ${ptoStatus ? "pto-on" : "pto-off"}`}
                  onClick = {handleSubmitPTO}
                >
                  {ptoStatus ? "PTO On" : "PTO Off"}
                </button>
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

            <button className = "close-button" onClick = {togglePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
