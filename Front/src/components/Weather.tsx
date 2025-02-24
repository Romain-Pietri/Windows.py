import React, { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import IpAddressComponent2 from "./IP2";
import LocationComponent from "./Location";
import RecupWeather from "./RecupWeather";

interface TerminalProps {
    onClose: () => void;
}


const Weather: React.FC<TerminalProps> = ({ onClose }) => {
    // const [weather, setWeather] = useState<WeatherData | null>(null);
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState<string | null>(null);
    // const [userIp, setUserIp] = useState<string | null>(null);
    // const [input, setInput] = useState('');
    // const [output, setOutput] = useState<string[]>(['Bienvenue dans le terminal. Tapez une commande et appuyez sur Entrée.']);
    // const [directory, setDirectory] = useState('/');
    // const [userIp, setUserIp] = useState<string | null>(null);
    // const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
    // const [ip, setIp] = useState< string | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
          try {
            const response = await axios.get(
              "https://my.meteoblue.com/packages/current_sunmoon?apikey=qmdoYCl7DMcXxQIg&lat=48.8584&lon=2.2945&format=json"
            );
            setWeather(response.data);
          } catch (err) {
            setError("Erreur lors de la récupération des données météo.");
          }
        };

       
        fetchWeather();

    }, []);

 
    const enregistrerFichier = () => {
        const blob = new Blob([JSON.stringify(weather)], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'fichier.txt');
    };

    return (
        <div>
          <h2>Prévisions météo</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {weather ? (
            <div>
            <button onClick={enregistrerFichier}>Enregistrer le fichier</button>
            {/* <p>{weather.data_day.moonrise[0]}</p>
            <p>{weather.data_day.moonrise[1]}</p>
            <p>{weather.data_day.moonrise[2]}</p> */}
            <RecupWeather></RecupWeather>
          </div>
          ) : (
            <p>Chargement des données...</p>
          )}
            
            <IpAddressComponent2></IpAddressComponent2>
            <LocationComponent></LocationComponent>
          
        </div>
    );
};

export default Weather;