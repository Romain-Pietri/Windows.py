import React, { useState, useEffect } from 'react';

interface TimestampProps {
    timestamp: string;
    dateBool: boolean;
    timeBool: boolean;
}

const Timestamp: React.FC<TimestampProps> = ({ timestamp, dateBool, timeBool }) => {
    const date = new Date(parseInt(timestamp, 10) * 1000);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hours}:${minutes}`;

    if (dateBool && timeBool) {
        return <span>{formattedDate} - {formattedTime}</span>;
    } else if (dateBool) {
        return <span>{formattedDate}</span>;
    } else if (timeBool) {
        return <span>{formattedTime}</span>;
    } else {
        return <span></span>;
    }
};

interface WeatherData {
    result: {
        generation_time: number;
        latitude: number;
        longitude: number;
        city: string;
        elevation: number;
        timezone: string;
        timezone_abbreviation: string;
        utc_offset_seconds: number;
        current: CurrentWeather;
        hourly: HourlyWeather;
        daily: DailyWeather;
    };
}

interface CurrentWeather {
    temperature_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    time: string;
}

interface HourlyWeather {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
    wind_speed_10m: number[];
}

interface DailyWeather {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
}

const AffichagePrevisionsTemp: React.FC<{ weatherData: WeatherData }> = ({ weatherData }) => {
    return (
        <div>
            <h2>Météo actuelle à {weatherData.result.city}</h2>
            <Timestamp timestamp={weatherData.result.current.time} dateBool={false} timeBool={true} />
            <p>Température: {weatherData.result.current.temperature_2m}°C</p>
            <WeatherIcon code={weatherData.result.current.weather_code} isDay={true} />
            <p>Vitesse du vent: {weatherData.result.current.wind_speed_10m} km/h</p>

            <h2>Prévisions pour la journée du <Timestamp timestamp={weatherData.result.hourly.time[0]} dateBool={true} timeBool={false} /></h2>
            <ul>
                {weatherData.result.hourly.time.slice(0, 24).map((heure, i) => (
                    <li key={i}>
                        Heure: <Timestamp timestamp={heure} dateBool={false} timeBool={true} /> - Température: {weatherData.result.hourly.temperature_2m[i]}°C
                        - Précipitation : {weatherData.result.hourly.precipitation_probability[i]}%
                        <WeatherIcon code={weatherData.result.hourly.weather_code[i]} isDay={false} />
                    </li>
                ))}
            </ul>

            <h2>Prévisions pour la semaine</h2>
            <ul>
                {weatherData.result.daily.time.map((heure, i) => (
                    <li key={i}>
                        Jour: <Timestamp timestamp={heure} dateBool={true} timeBool={false} /> -
                        T° min: {weatherData.result.daily.temperature_2m_min[i]}°C -
                        T° max: {weatherData.result.daily.temperature_2m_max[i]}°C -
                        <WeatherIcon code={weatherData.result.daily.weather_code[i]} isDay={false} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

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

    return <span className="weather-icon">{emoji} {description}</span>;
};

const RecupWeather: React.FC = () => {
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
            {weatherData ? (
                <AffichagePrevisionsTemp weatherData={weatherData} />
            ) : (
                <p>No weather data available.</p>
            )}
        </div>
    );
};

export default RecupWeather;