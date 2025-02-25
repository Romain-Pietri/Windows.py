import React, { useState } from 'react';
import '../styles/Maigret.css'; // Importer le fichier CSS

const Maigret: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [results, setResults] = useState<string[][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8000/api/get_user/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: username }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setResults(data.result);
      console.log(data.result);
    } catch (err) {
      setError('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="maigret-container">
      
      <div className="window-content">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
onKeyPress={handleKeyPress}
          placeholder="Enter Username"
className="username-input"
        />
        <button className="Search" onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="results-container">
          <table>
            <thead>
              <tr>  
                <th>Site</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, index) => (
                <tr key={index}>
                    <td>{row[1]}</td>
                  
                  <td>
                    <a href={row[3]} target="_blank" rel="noopener noreferrer">
                      {row[3]}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Maigret;