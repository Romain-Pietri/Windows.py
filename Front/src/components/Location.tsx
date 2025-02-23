import React, { useState, useEffect } from 'react';

const LocationComponent: React.FC = () => {
  const [location, setLocation] = useState<string>('');
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
        setLocation(data.result);
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
      <h2>Votre localisation</h2>
      <p>{location}</p>
    </div>
  );
};

export default LocationComponent;
