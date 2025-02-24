// IMPORTS ------------------------------------------------------------------------------------------------------ 

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";

import "./Settings.css";
import FullscreenToggle from "./FullscreenToggle";

import machineImage from "./load-placement.jpg";
import elmersLogo from "./elmers.jpg";

// SETTINGS -----------------------------------------------------------------------------------------------------

function Settings() {

    // Environment Variables
    const host = process.env.REACT_APP_HOST || "localhost";
    const port = process.env.REACT_APP_PORT || 8000;

    // Navigation
    const navigate = useNavigate();
    const location = useLocation();

    /* Navigate back to the main page */
    const handleBack = () => {
        navigate("/");
    };

    // CONSTANTS --------------------------------------------------------------------------------------------------

    const pollingInterval = 300;

    // From main page stats
    const {maxWeight = 100000, machineType = "Haulmaster"} = location.state || {};

    // TODO: fetch from API
    const cropFillRateValues = [1, 5, 10, 25, 50, 100, 250, 500, 1000, 5000, 10000];
    const defaultPTOValue = 1000;
    const minPTO = 0;
    const maxPTO = 2000;
    const defaultWeight = maxWeight / 2;

    // DEFAULT SETTINGS ------------------------------------------------------------------------------------------

    // TODO: fetch from API
    const [loadPosition, setLoadPosition] = useState(1);
    const [ptoRPM, setPtoRPM] = useState(defaultPTOValue);
    const [ptoStatus, setPtoStatus] = useState(false);
    const [frontWeight, setFrontWeight] = useState(defaultWeight / 2);
    const [rearWeight, setRearWeight] = useState(defaultWeight / 2);
    const [cropFillRate, setCropFillRate] = useState(cropFillRateValues[6]);

    // FUNCTIONS -------------------------------------------------------------------------------------------------

    // Initialization
    useEffect(() => {
        handleSubmitCropFillRate();
        handleSubmitFrontWeight();
        handleSubmitRearWeight();
        handleSubmitPTO();
        handleSubmitMachine();
    }, []); // run once on 'mount'

    /* Poll the values of front/rear weight from the API server */
    useEffect(() => {
        const fetchWeights = async () => {
            try {
                const frontResponse = await fetch(`http://${host}:${port}/weight-front`);
                const rearResponse = await fetch(`http://${host}:${port}/weight-rear`);
                if (frontResponse.ok && rearResponse.ok) {
                    setFrontWeight(await frontResponse.json());
                    setRearWeight(await rearResponse.json());
                } else {
                    console.error("Failed to fetch weights");
                }
            } catch (error) {
                console.error(`Error fetching weights: ${error}`);
            }
        };
        const interval = setInterval(fetchWeights, pollingInterval);
        return () => clearInterval(interval);
    }, []);


    /* Generic handler for submitting POSTing data to the API server */
    const handleSubmit = async (route, value) => {
        try {
            const startTime = performance.now();
            const response = await fetch(`http://${host}:${port}/${route}?value=${value}`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
            });
            const data = await response.json();
            const endTime = performance.now();
            console.log(`${route}: ${data} (took ${Math.round(endTime - startTime)}ms)`);
        } catch (error) {
            console.error(`${route}: ${error}`);
        }
    }

    /* Updated API with current machine type */
    const handleSubmitMachine = () => {
        handleSubmit("machine-type", machineType).then(() => {
            // alert(`Machine Type: ${machineType}`);
        })
    };

    /* Update API with current front weight */
    const handleSubmitFrontWeight = () => {
        handleSubmit("weight-front", frontWeight).then(() => {
            // alert(`Front Weight: ${frontWeight}`);
        })
    };

    /* Update API with current rear weight */
    const handleSubmitRearWeight = () => {
        handleSubmit("weight-rear", rearWeight).then(() => {
            // alert(`Rear Weight: ${rearWeight}`);
        })
    };

    /* Update API with current crop fill rate */
    const handleSubmitCropFillRate = () => {
        handleSubmit("crop-fill-rate", cropFillRate).then(() => {
            // alert(`Crop Fill Rate: ${cropFillRate}`);
        })
    };

    /* Update API with current PTO speed */
    const handleSubmitPTO = () => {
        handleSubmit("pto-speed", ptoStatus ? ptoRPM : 0).then(() => {
            // alert(`PTO (${ptoStatus}): ${ptoRPM}`);
        })
    };

    /* Observer for 'frontWeight' */
    useEffect(() => {
        handleSubmitFrontWeight();
    }, [frontWeight]);

    /* Observer for 'rearWeight' */
    useEffect(() => {
        handleSubmitRearWeight();
    }, [rearWeight]);

    /* Observer for 'cropFillRate' */
    useEffect(() => {
        handleSubmitCropFillRate();
    }, [cropFillRate]);

    /* Observer for 'ptoRPM' */
    useEffect(() => {
        handleSubmitPTO();
    }, [ptoRPM]);

    /* Observer for 'ptoStatus' */
    useEffect(() => {
        handleSubmitPTO();
    }, [ptoStatus]);

    /* onClick handler for PTO speed slider */
    const handlePtoRpmChange = (event) => {
        setPtoRPM(event.target.value);
    };

    /* onClick handler for PTO status button */
    const handlePtoStatusChange = () => {
        setPtoStatus((prevStatus) => !prevStatus);
    };

    /* onClick handler for load position slider */
    const handleLoadPositionChange = (event) => {
        setLoadPosition(Number(event.target.value));
    };

    /* onClick handler for weight +/- buttons */
    const handleWeightChange = (delta) => {
        const maxAllowedWeight = maxWeight / 2;
        const minAllowedWeight = 0;
        let frontDelta, rearDelta; // allows modification of values
        switch (loadPosition) {
            case 0: // rear
                frontDelta = (1 / 3) * delta * cropFillRate;
                rearDelta = (2 / 3) * delta * cropFillRate;
                break;
            case 1: // middle
                frontDelta = (1 / 2) * delta * cropFillRate;
                rearDelta = (1 / 2) * delta * cropFillRate;
                break;
            case 2: // front
                frontDelta = (2 / 3) * delta * cropFillRate;
                rearDelta = (1 / 3) * delta * cropFillRate;
                break;
            default:
                console.warn(`Unhandled load position '${loadPosition}'`);
                return;
        }
        // minAllowedWeight < newWeight < maxAllowedWeight
        setFrontWeight((prevFrontWeight) => {
            const newFrontWeight = prevFrontWeight + frontDelta;
            return Math.round(Math.min(Math.max(newFrontWeight, minAllowedWeight), maxAllowedWeight));
        });
        setRearWeight((prevRearWeight) => {
            const newRearWeight = prevRearWeight + rearDelta;
            return Math.round(Math.min(Math.max(newRearWeight, minAllowedWeight), maxAllowedWeight));
        });
    };

    /* onClick handler for crop fill rate +/- buttons */
    const handleCropFillRateChange = (delta) => {
        setCropFillRate((prevRate) => {
            const currentIndex = cropFillRateValues.indexOf(prevRate);
            // Increment or decrement the index
            let newIndex = currentIndex + delta;
            // Ensure the new index is within bounds
            if (newIndex < 0) newIndex = 0;
            if (newIndex >= cropFillRateValues.length) newIndex = cropFillRateValues.length - 1;
            return cropFillRateValues[newIndex];
        });
    }

    /* onClick handler for quick load button */
    const handleQuickLoad = () => {
        setFrontWeight(maxWeight / 2)
        setRearWeight(maxWeight / 2);
    };

    /* onClick handler for crop fill reset button */
    const handleReset = () => {
        setCropFillRate(cropFillRateValues[6]);
    };

    // PAGE LAYOUT ----------------------------------------------------------------------------------------------
    return (
        <div className="Settings">

            {/* Header */}
            <header className="header">
                <div className="header-content">

                    {/* Back Button */}
                    <div className="header-left">
                        <button className="back-button" onClick={handleBack}>
                            ←
                        </button>
                    </div>

                    {/* Elmers Logo Styling */}
                    <img src={elmersLogo} alt="Elmer's Manufacturing Logo" className="title-image"/>

                    {/* Full Screen Toggle */}
                    <div className="header-right">
                        <FullscreenToggle/>
                    </div>
                </div>

                {/* Divider Styling */}
                <div className="divider"></div>
            </header>

            {/* Main Page Content */}
            <div className="page-content">

                {/* Left Section: Weight, PTO, Crop Fill Rate */}
                <div className="left-section">

                    {/* Weight */}
                    <div className="weight-section">
                        <div className="title">Weight</div>
                        <div className="buttons">
                            <button onClick={() => handleWeightChange(-1)}>-</button>
                            <div className="weight-value">{frontWeight + rearWeight} kg</div>
                            <button onClick={() => handleWeightChange(1)}>+</button>
                        </div>
                        <button className="quick-load-button" onClick={handleQuickLoad}>
                            Quick Load
                        </button>
                    </div>

                    {/* PTO */}
                    <div className="pto-section">
                        <div className="title">PTO</div>
                        <div className="pto-value">{ptoRPM} RPM</div>
                        <input
                            type="range"
                            min={minPTO}
                            max={maxPTO}
                            value={ptoRPM}
                            onChange={handlePtoRpmChange}
                            className="pto-slider"
                        />
                        <div className="pto-button-wrapper">
                            <button
                                className={`pto-toggle-button ${ptoStatus ? "pto-on" : "pto-off"}`}
                                onClick={handlePtoStatusChange}
                            >
                                {ptoStatus ? "ON" : "OFF"}
                            </button>
                        </div>
                    </div>

                    {/* Crop Fill Rate */}
                    <div className="crop-fill-rate-section">
                        <div className="title">Crop Fill Rate</div>
                        <div className="buttons">
                            <button onClick={() => handleCropFillRateChange(-1)}>-</button>
                            <div className="crop-fill-value">{cropFillRate} kg</div>
                            <button onClick={() => handleCropFillRateChange(1)}>+</button>
                        </div>
                        <button className="reset-button" onClick={handleReset}>
                            Reset
                        </button>
                    </div>
                </div>

                {/* Right Section */}
                <div className="right-section">

                    {/* Load Position */}
                    <div className="load-position-section">
                        <div className="title">Load Position</div>
                        <input
                            type="range"
                            min="0"
                            max="2"
                            step="1"
                            value={loadPosition}
                            onChange={handleLoadPositionChange}
                            className="load-position-slider"
                        />
                    </div>

                    {/* Machine Image */}
                    <div className="machine-image-container">
                        <img src={machineImage} alt="Machine" className="machine-image"/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
