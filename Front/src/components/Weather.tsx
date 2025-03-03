import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import LocationComponent from "./Location";
import RecupWeather from "./RecupWeather";

interface TerminalProps {
    onClose: () => void;
}

const Weather: React.FC<TerminalProps> = ({ onClose }) => {
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch(
                    "https://my.meteoblue.com/packages/current_sunmoon?apikey=qmdoYCl7DMcXxQIg&lat=48.8584&lon=2.2945&format=json"
                );
                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des données météo.");
                }
                const data = await response.json();
                setWeather(data);
            } catch (err) {
                setError("Erreur lors de la récupération des données météo.");
            }
        };

        fetchWeather();
    }, []);

    

    return (
        <div className="weather-container">
            <div className="weather-header">
                <h2>Prévisions météo</h2>
            </div>
            {error && <p className="weather-error">{error}</p>}
            {weather ? (
                <div className="weather-data">
                    
                    <RecupWeather></RecupWeather>
                </div>
            ) : (
                <p>Chargement des données...</p>
            )}
            <LocationComponent></LocationComponent>
        </div>
    );
};

export default Weather;