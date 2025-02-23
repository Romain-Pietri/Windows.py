import React, { useState, useEffect } from 'react';


// interface Metadata {
//     modelrun_updatetime_utc: string;
//     name: string;
//     height: number;
//     timezone_abbrevation: string;
//     latitude: number;
//     modelrun_utc: string;
//     longitude: number;
//     utc_timeoffset: number;
//     generation_time_ms: number;
// }

// interface Units {
//     temperature: string;
//     time: string;
//     windspeed: string;
// }

// interface DataCurrent {
//     time: string;
//     isobserveddata: number;
//     metarid: string | null; // Peut être une chaîne ou null
//     isdaylight: number;
//     windspeed: number;
//     zenithangle: number;
//     pictocode_detailed: number;
//     pictocode: number;
//     temperature: number;
// }

// interface DataDay {
//     time: string[];
//     moonrise: string[];
//     moonset: string[];
//     moonphaseangle: number[];
//     sunset: string[];
//     moonilluminatedfraction: number[];
//     moonphasename: string[];
//     moonphasetransittime: string[];
//     sunrise: string[];
//     moonage: number[];
// }

// interface WeatherData {
//     metadata: Metadata;
//     units: Units;
//     data_current: DataCurrent;
//     data_day: DataDay;
// }


// interface UnitsTest {
//     temperature: string;
//     time: string;
//     windspeed: string;
// }

interface Metadata {
    modelrun_updatetime_utc: string;
    name: string;
    height: number;
    timezone_abbrevation: string;
    latitude: number;
    modelrun_utc: string;
    longitude: number;
    utc_timeoffset: number;
    generation_time_ms: number;
}

interface WeatherDataResult {
    result: Metadata;
}

const RecupWeather: React.FC = () => {
    // const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    // const [weatherData, setWeatherData] = useState<UnitsTest | null>(null);
    const [weatherData, setWeatherData] = useState<WeatherDataResult | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/weather');

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                // const data: WeatherData = await response.json();
                // const data: UnitsTest = {
                //     "temperature": "C",
                //     "time": "YYYY-MM-DD hh:mm",
                //     "windspeed": "ms-1"
                // }
                const data: WeatherDataResult = await response.json();
                // setWeatherData(JSON.parse(data.result));
                setWeatherData(data);
                console.log("data : " + data.result);
                weatherData ? console.log("height : " + weatherData.result.height) : console.log("no data")
                setLoading(false);
            } catch (e: any) {
                setError(e.message);
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
                    <h2>Current Data</h2>
                    <p>Height: {weatherData.result.height}</p>
                    <p>Latitude: {weatherData.result.latitude}</p>
                </>
            ) : (
                <p>No weather data available.</p>
            )}

        </div>
    );
};

export default RecupWeather;