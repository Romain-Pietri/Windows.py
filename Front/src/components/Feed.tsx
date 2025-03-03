import React, { useEffect, useState } from "react";

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
}

const Feed: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  
  useEffect(() => {
    const fetchNews = async () => {
      try {
        console.log("hello")
        const response = await fetch(
          //fetch a l'api du serveur api/news/
          `http://localhost:8000/api/news/`,
          

        );
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des actualités", error);
      }
    };
    
    
      fetchNews();
    
  }); // Ajouter apiKey ici

  return (
    <div className="feed">
      <h2>Actualités</h2>
      {articles.length === 0 ? (
        <p>Chargement des actualités...</p>
      ) : (
        <div className="news-list">
          {articles.map((article, index) => (
            <div className="news-card" key={index}>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <h3 className="news-title">{article.title}</h3>
                {article.urlToImage && (
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="news-image"
                  />
                )}
                <p className="news-description">{article.description}</p>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;
