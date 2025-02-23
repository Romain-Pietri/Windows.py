import React, { useState, useEffect } from 'react';
import axios from 'axios';

const IpAddressComponent: React.FC = () => {
  const [ipAddress, setIpAddress] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await axios.get('https://api.ipify.org?format=json');
        setIpAddress(response.data.ip);
      } catch (err: unknown) {
        // Vérifiez le type d'erreur
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data.message || 'Erreur lors de la récupération de l\'IP');
        } else if (err instanceof Error) {
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

export default IpAddressComponent;
