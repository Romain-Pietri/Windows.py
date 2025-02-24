import React, { useState, useEffect } from 'react';

interface Coord {
  latitude: number;
  longitude: number;
}

interface LocResponse {
  result: Coord;
}

const LocationComponent: React.FC = () => {
  const [location, setLocation] = useState<LocResponse| null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/location/');
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("DataLoc:", data);
        console.log("DataLocLat:", data.result.latitude);
        console.log("DataLocLon:", data.result.longitude);
        setLocation(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Une erreur inconnue est survenue.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div>

        {location ? ( // Vérifie si weatherData est non null
              <>
                  <h2>Votre localisation</h2>
                  <p>Latitude : {location.result.latitude}</p>
                  <p>Longitude : {location.result.longitude}</p>
              </>
          ) : (
              <p>No location data available.</p>
          )}
      
    </div>
  );
};

export default LocationComponent;
