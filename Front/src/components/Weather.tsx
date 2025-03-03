import React from "react";
import LocationComponent from "./Location";
import RecupWeather from "./RecupWeather";

interface TerminalProps {
    onClose: () => void;
}

const Weather: React.FC<TerminalProps> = ({ onClose }) => {
    return (
        <div className="weather-container">
            <div className="weather-header">
                <h2>Prévisions météo</h2>
            </div>
            <div className="weather-data">
                <RecupWeather />
            </div>
            <LocationComponent />
        </div>
    );
};

export default Weather;