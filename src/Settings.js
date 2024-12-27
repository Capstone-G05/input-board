// IMPORTS ------------------------------------------------------------------------------------------------------ 
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import machineImage from "./load-placement.jpg"; 
import "./Settings.css";

// SETTINGS -----------------------------------------------------------------------------------------------------
const Settings = () => {

  // CONSTANTS --------------------------------------------------------------------------------------------------
  const maxWeight = 2000.0;
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
  const [frontWeight, setFrontWeight] = useState(defaultWeight / 2);
  const [rearWeight, setRearWeight] = useState(defaultWeight / 2); 
  const [cropFillRate, setCropFillRate] = useState(defaultCropFillRate); 

  // FUNCTIONS -------------------------------------------------------------------------------------------------
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleWeightChange = (delta) => {
    const newRearWeight = rearWeight + delta * cropFillRate/2;
    const newFrontWeight = frontWeight + delta * cropFillRate/2;
    if (newRearWeight <= maxWeight && newRearWeight >= 0 && newFrontWeight <= maxWeight && newFrontWeight >= 0) 
    {
      setRearWeight(newRearWeight);
      setFrontWeight(newFrontWeight);
    }
  };

  const handleQuickLoad = () => {
    const quickLoadWeight = maxWeight / 2; 
    setRearWeight(quickLoadWeight);
    setFrontWeight(quickLoadWeight);
  };

  const handlePtoChange = (event) => {
    setPtoRPM(event.target.value);
  };

  const handlePtoToggle = () => {
    setPtoStatus(!ptoStatus);
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
                  <div className = "value">{frontWeight + rearWeight} kg</div>
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
                  onClick = {handlePtoToggle}
                >
                  {ptoStatus ? "PTO On" : "PTO Off"}
                </button>
              </div>

              {/* Crop Fill Rate */}
              <div className = "crop-fill-rate-section">
                <div className = "title">Crop Fill Rate</div>
                <div className = "buttons">
                  <button onClick = {() => setCropFillRate((prev) => Math.max(prev - 1, 0))}>-</button>
                  <div className = "value">{cropFillRate} kg</div>
                  <button onClick = {() => setCropFillRate((prev) => Math.min(prev + 1, 100))}>+</button>
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
