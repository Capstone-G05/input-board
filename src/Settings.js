// IMPORTS ------------------------------------------------------------------------------------------------------ 
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import "./Settings.css";

// SETTINGS -----------------------------------------------------------------------------------------------------
const Settings = () => {
  const [isOpen, setIsOpen] = useState(false);

  // OPEN/CLOSE WINDOW LOGIC ------------------------------------------------------------------------------------
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="settings-container">
      {/* Settings Icon Styling*/}
      <button className="settings-button" onClick={togglePopup}>
        <FontAwesomeIcon icon={faCog} />
      </button>

      {/* Popup Window Styling*/}
      {isOpen && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={togglePopup}>
              &times;
            </span>
            <h3>Settings</h3>
            <p>Settings will go here when implemented.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
