import React, { useState, useEffect } from 'react';


// interface WeatherResult {
//     temperature_2m: number;
//     is_day: number;
//     precipitation: number;
//     time: string;
//     daylight_duration: number;
// }

// interface ApiResponse {
//     result: WeatherResult;
// }

interface WeatherData {
    result: {
      generation_time: number;
      latitude: number;
      longitude: number;
      elevation: number;
      timezone: string;
      timezone_abbreviation: string;
      utc_offset_seconds: number;
      current: CurrentWeather;
      hourly: HourlyWeather;
    };
  }
  
  interface CurrentWeather {
    temperature_2m: number;
    time: string;
  }
  
  interface HourlyWeather {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
  }
  
    
  const AffichagePrevisionsTemp: React.FC<{ weatherData: WeatherData }> = ({ weatherData }) => {
    return (
      <div>
        <h2>Prévisions de température</h2>
        <ul>
          {weatherData.result.hourly.time.map((heure, i) => (
            <li key={i}>
              Heure: {heure} - Température: {weatherData.result.hourly.temperature_2m[i]}°C
              <WeatherIcon code={weatherData.result.hourly.weather_code[i]} isDay={false} ></WeatherIcon>
            </li>
          ))}
        </ul>
      </div>
    );
  };
//   WeatherIcon({weatherData.result.hourly.weather_code[i]})

  type WeatherProps = {
    code: number;
    isDay: boolean;
  };
  
  const WeatherIcon: React.FC<WeatherProps> = ({ code, isDay }) => {
    let description;
    let emoji;

  switch (code) {
    case 0:
      description = 'Ciel clair';
      emoji = isDay ? '☀️' : '🌙';
      break;
    case 1:
      description = 'Principalement clair';
      emoji = isDay ? '🌤️' : '🌙☁️';
      break;
    case 2:
      description = 'Partiellement nuageux';
      emoji = isDay ? '⛅️' : '🌙☁️';
      break;
    case 3:
      description = 'Couvert';
      emoji = '☁️';
      break;
    case 45:
      description = 'Brouillard';
      emoji = '🌫️';
      break;
    case 48:
      description = 'Brouillard givrant';
      emoji = '🌫️❄️';
      break;
    case 51:
      description = 'Bruine : Légère intensité';
      emoji = '🌧️';
      break;
    case 53:
      description = 'Bruine : Modérée intensité';
      emoji = '🌧️';
      break;
    case 55:
      description = 'Bruine : Forte intensité';
      emoji = '🌧️';
      break;
    case 56:
      description = 'Bruine verglaçante : Légère intensité';
      emoji = '🌧️❄️';
      break;
    case 57:
      description = 'Bruine verglaçante : Forte intensité';
      emoji = '🌧️❄️';
      break;
    case 61:
      description = 'Pluie : Faible intensité';
      emoji = '🌦️';
      break;
    case 63:
      description = 'Pluie : Modérée intensité';
      emoji = '🌦️';
      break;
    case 65:
      description = 'Pluie : Forte intensité';
      emoji = '🌧️';
      break;
    case 66:
      description = 'Pluie verglaçante : Légère intensité';
      emoji = '🌧️❄️';
      break;
    case 67:
      description = 'Pluie verglaçante : Forte intensité';
      emoji = '🌧️❄️';
      break;
    case 71:
      description = 'Chute de neige : Faible intensité';
      emoji = '🌨️';
      break;
    case 73:
      description = 'Chute de neige : Modérée intensité';
      emoji = '🌨️';
      break;
    case 75:
      description = 'Chute de neige : Forte intensité';
      emoji = '🌨️';
      break;
    case 77:
      description = 'Grains de neige';
      emoji = '🌨️';
      break;
    case 80:
      description = 'Averses de pluie : Faible intensité';
      emoji = '🌦️';
      break;
    case 81:
      description = 'Averses de pluie : Modérée intensité';
      emoji = '🌦️';
      break;
    case 82:
      description = 'Averses de pluie : Violente intensité';
      emoji = '🌧️';
      break;
    case 85:
      description = 'Averses de neige : Légères';
      emoji = '🌨️';
      break;
    case 86:
      description = 'Averses de neige : Fortes';
      emoji = '🌨️';
      break;
    case 95:
      description = 'Orage : Légère ou modérée';
      emoji = '⛈️';
      break;
    case 96:
      description = 'Orage avec grêle : Légère intensité';
      emoji = '⛈️🌨️';
      break;
    case 99:
      description = 'Orage avec grêle : Forte intensité';
      emoji = '⛈️🌨️';
      break;
    default:
      description = 'Description non disponible';
      emoji = '❓';
  }

  return <div>{emoji} {description}</div>;
  };
  
//   export default AffichagePrevisionsTemp;

const RecupWeather: React.FC = () => {

    // const [weatherData, setWeatherData] = useState<ApiResponse | null>(null);
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/open_weather2');

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Data:", data);
                setWeatherData(data);
                setLoading(false);

            } catch (e: any) {
                setError("Err catch" + e.message);
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);



    if (loading) {
        return <p>Loading weather data...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>

            {weatherData ? ( // Vérifie si weatherData est non null
                <>
                    <AffichagePrevisionsTemp weatherData={weatherData}></AffichagePrevisionsTemp>
                    {/* <h2>Current Data</h2>
                    <p>Latitude: {weatherData.result.latitude}</p>
                    <p>longitude: {weatherData.result.longitude}</p>
                    <p>temp: {weatherData.result.current.temperature_2m}</p>
                    <p>hour: {weatherData.result.current.time}</p>
                    <p>temp: {weatherData.result.hourly.temperature_2m[1]}</p> */}
                    {/* <p>daylight_duration: {weatherData.result.daylight_duration}</p> */}
                    {/* <p>Sunset: {weatherData.result.sunset}</p> */}
                </>
            ) : (
                <p>No weather data available.</p>
            )}

        </div>
    );
};

export default RecupWeather;