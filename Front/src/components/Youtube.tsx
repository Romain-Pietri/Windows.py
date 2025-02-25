import React, { useState, useRef, useEffect } from 'react';
import '../styles/Youtube.css'; // Importer le fichier CSS

const Youtube: React.FC = () => {
  const [query, setQuery] = useState('');
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleFocus = () => {
      if (iframeRef.current) {
        iframeRef.current.focus();
      }
    };

    window.addEventListener('click', handleFocus);

    return () => {
      window.removeEventListener('click', handleFocus);
    };
  }, []);

  const handleSearch = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/search_youtube/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setVideoIds(data.video_ids);
    } catch (error) {
      console.error('Error searching YouTube:', error);
    }
  };

  return (
    <div className="youtube-container">
      <div className="youtube-search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search YouTube"
          className="youtube-input"
        />
        <button onClick={handleSearch} className="youtube-button">Search</button>
      </div>
      <div className="youtube-results">
        {videoIds.length === 0 ? (
          <p className="youtube-placeholder">Veuillez effectuer une recherche pour afficher les vidéos.</p>
        ) : (
          videoIds.map((videoId) => (
            <div key={videoId} className="youtube-video">
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${videoId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="YouTube Video Player"
              ></iframe>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Youtube;