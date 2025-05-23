// IMPORTS ------------------------------------------------------------------------------------------------------

import React, {useState, useEffect, useContext} from 'react';
import {useNavigate} from "react-router-dom";

import "./Home.css";
import FullscreenToggle from "./FullscreenToggle";

import haulmasterImage from "./haulmaster.jpg";
import wolverineImage from "./wolverine.png";
import elmersLogo from "./elmers.jpg";

import SimulationPowerProvider, {SimulationPower} from './SimulationPower';

// HOME ---------------------------------------------------------------------------------------------------------

function Home() {

    // Environment Variables
    const host = process.env.REACT_APP_HOST || "localhost";
    const port = process.env.REACT_APP_PORT || 8000;

    const navigate = useNavigate();

    const { simulationPower } = useContext(SimulationPower);

    // DEFAULT STATE INITIALIZATION ------------------------------------------------------------------------------

    const [machineType, setSelectedMachine] = useState("Haulmaster");
    const [machineSize, setSelectedSize] = useState("2000");

    // MACHINE DEFINITIONS ---------------------------------------------------------------------------------------

    const machines = {
        Haulmaster: {
            sizes: ['1100', '2000'],
            image: haulmasterImage,
            maxWeight: {'1100': 30000, '2000': 55000},
            specifications: {
                '1100': [
                    {label: 'Width', value: '12\' 2"'},
                    {label: 'Overall Length', value: '32\' 3"'},
                    {label: 'Tank Length', value: '22\' 8"'},
                    {label: 'Loading Side Height', value: '10\' 2"'},
                    {label: 'Transport Height', value: '11\' 4"'},
                    {label: 'Auger Max Height', value: '14\' 9"'},
                    {label: 'Auger Max Reach', value: '9\''},
                    {label: 'Ground Clearance (Standard Undercarriage)', value: '1\' 6"'},
                    {label: 'Empty Weight w/ Large Tracks', value: '30,500 lbs'},
                    {label: 'Empty Weight w/ 36" Transfer Tracks', value: '28,600 lbs'},
                    {label: 'Empty Weight w/ Tires & Wheels (1250 Tires)', value: '22,100 lbs'},
                    {label: 'Empty Weight w/ Row Crop Tandem (520 Tires)', value: '24,900 lbs'},
                    {label: 'Empty Weight w/ Steerable Inline Tandem', value: '26,400 lbs'},
                    {label: 'Tongue Weight', value: '4,000 lbs'},
                    {label: 'Unloading Auger', value: '22"'},
                    {label: 'Horizontal Auger', value: '22"'},
                    {label: 'Hydraulic Remotes', value: '4'},
                    {label: 'Required Tractor HP (KW)', value: '225(170)'},
                    {label: 'IF 1250/50R32 CFO', value: 'Standard'},
                    {label: 'CAT 4 Hitch', value: 'Standard'},
                ],
                '2000': [
                    {label: 'Width', value: '14\'"'},
                    {label: 'Overall Length', value: '38\''},
                    {label: 'Tank Length', value: '28\' 3"'},
                    {label: 'Loading Side Height', value: '11\' 4"'},
                    {label: 'Transport Height', value: '12\' 9"'},
                    {label: 'Auger Max Height', value: '16\' 4"'},
                    {label: 'Auger Max Reach', value: '9\' 8"'},
                    {label: 'Ground Clearance (Standard Undercarriage)', value: '1\' 3"'},
                    {label: 'Empty Weight w/ Large Tracks', value: '34,400 lbs'},
                    {label: 'Empty Weight w/ Steerable Inline Tandem', value: '33,600 lbs'},
                    {label: 'Tongue Weight', value: '4,400 lbs'},
                    {label: 'Unloading Auger', value: '24"'},
                    {label: 'Horizontal Auger', value: '22"'},
                    {label: 'Hydraulic Remotes', value: '4'},
                    {label: 'Required Tractor HP (KW)', value: '400(300)'},
                    {label: 'LT378 Large Track (36" x 170")', value: 'Standard'},
                    {label: '5-Points Scale', value: 'Standard'},
                    {label: 'CAT 4 Hitch', value: 'Standard'},
                ],
            },
        },
        Wolverine: {
            sizes: ['1500'],
            image: wolverineImage,
            maxWeight: {'1500': 2000},
            specifications: {
                '1500': [
                    {label: 'Max Load', value: '12 tons'},
                    {label: 'Engine', value: 'Turbo Diesel'},
                    {label: 'Weight', value: '4,800 kg'},
                    {label: 'Capacity', value: '1,200 lbs'},
                    {label: 'Power', value: '140 HP'},
                ],
            },
        },
    };

    // MACHINE SWAP -----------------------------------------------------------------------------------------------

    const nextMachine = () => {
        return; // remove this if multiple machines intended to be implemented
        const machineNames = Object.keys(machines);
        const currentIndex = machineNames.indexOf(machineType);
        const nextIndex = (currentIndex + 1) % machineNames.length;
        setSelectedMachine(machineNames[nextIndex]);
        setSelectedSize(machines[machineNames[nextIndex]].sizes[0]);
    };

    const prevMachine = () => {
        return; // remove this if multiple machines intended to be implemented
        const machineNames = Object.keys(machines);
        const currentIndex = machineNames.indexOf(machineType);
        const prevIndex = (currentIndex - 1 + machineNames.length) % machineNames.length;
        setSelectedMachine(machineNames[prevIndex]);
        setSelectedSize(machines[machineNames[prevIndex]].sizes[0]);
    };

    const handleSubmitMachineSwap = async () => {
        try {
            const response = await fetch(`http://${host}:${port}/machine-type`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({"value": machineType})
            });
            const data = await response.json();
            console.log(`machine-type: ${data["MACHINE_TYPE"]}`);
        } catch (error) {
            console.error(`machine-type: ${error}`);
        }
    };

    /* Observer for 'machineType' */
    useEffect(() => {
        handleSubmitMachineSwap().then(() => {
            // alert(`Machine Type: ${machineType}`);
        })
    }, [machineType]);

    // SIZE SWAP --------------------------------------------------------------------------------------------------

    const nextSize = () => {
        return; // TODO: remove this if multiple sizes intended to be implemented
        const availableSizes = machines[machineType].sizes;
        const currentIndex = availableSizes.indexOf(machineSize);
        const nextIndex = (currentIndex + 1) % availableSizes.length;
        setSelectedSize(availableSizes[nextIndex]);
    };

    const prevSize = () => {
        return; // TODO: remove this if multiple sizes intended to be implemented
        const availableSizes = machines[machineType].sizes;
        const currentIndex = availableSizes.indexOf(machineSize);
        const prevIndex = (currentIndex - 1 + availableSizes.length) % availableSizes.length;
        setSelectedSize(availableSizes[prevIndex]);
    };

    const maxWeight = machines[machineType]?.maxWeight[machineSize] || 0;

    // PAGE LAYOUT ------------------------------------------------------------------------------------------------

    return (
        <div className="Home">

            {/* Header */}
            <header className="header">
                <div className="header-content">
                    {/* Elmers Logo Styling */}
                    <img src={elmersLogo} alt="Elmer's Manufacturing Logo" className="title-image"/>

                    {/*Full Screen Toggling */}
                    <div className="header-right">
                        <FullscreenToggle/>
                    </div>
                </div>

                {/* Divider Styling */}
                <div className="divider"></div>
            </header>

            {/* Machine Selection Styling */}
            <div className="machine-carousel">
                <button className="type-arrow-button left-arrow" onClick={prevMachine}>&larr;</button>
                <span className="machine-name">{machineType}</span>
                <button className="type-arrow-button" onClick={nextMachine}>&rarr;</button>
            </div>

            {/* Size Selection Styling */}
            <div className="size-carousel">
                <button className="size-arrow-button left-arrow" onClick={prevSize}>&larr;</button>
                <span className="size-name">{machineSize}</span>
                <button className="size-arrow-button" onClick={nextSize}>&rarr;</button>
            </div>

            {/* Bottom Section */}
            <div className="bottom-container">

                {/* Image & Start Button */}
                <div className="image-button-container">
                    <div className="image-container">
                        <img
                            className = "image-size"
                            src={machines[machineType].image}
                            alt={machineType}
                        />
                    </div>

                    <div className="button-container">
                        <button
                            className = {`start-simulation-button ${simulationPower ? "active" : "inactive"}`}
                            onClick={() => navigate("/settings", {state: {maxWeight}})}
                            disabled = {!simulationPower}>
                            Start Simulation
                        </button>
                    </div>
                </div>

                {/* Specifications */}
                <div className="specifications-panel">
                    <h3>Specifications</h3>
                    <ul>
                        {machines[machineType].specifications[machineSize].map((spec, index) => (
                            <li key={index}>
                                <span className="spec-label">{spec.label}:</span>
                                <span className="spec-value">{spec.value}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Home;
