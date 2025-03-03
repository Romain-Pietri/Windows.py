import React, { useState, useEffect } from "react";

const WidgetDate: React.FC = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000); // Mise à jour de l'heure toutes les secondes

    return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  const toggleCalendar = async () => {
    setShowCalendar(!showCalendar);
  };

  return (
    <div className="widget-container">
      <div className="date-widget" onClick={toggleCalendar}>
        <h2>{formatDate(dateTime)}</h2>
        <p>{formatTime(dateTime)}</p>
      </div>
      {showCalendar && (
        <div className="calendar-container">
          <table className="calendar-table">
            {/* Votre logique pour afficher le calendrier ici */}
          </table>
          <ul className="event-list">
            {/* Votre logique pour afficher les événements ici */}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WidgetDate;
