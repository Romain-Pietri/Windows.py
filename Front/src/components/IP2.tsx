import React, { useState, useEffect } from 'react';

const IpAddressComponent2: React.FC = () => {
  const [ipAddress, setIpAddress] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/ip/');
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        setIpAddress(data.result);
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

    fetchIpAddress();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div>
      <h2>Votre adresse IP publique</h2>
      <p>{ipAddress}</p>
    </div>
  );
};

export default IpAddressComponent2;
