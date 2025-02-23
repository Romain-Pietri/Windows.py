import React, { useState } from 'react';
import Terminal from './Terminal';
import DoomComponent from './DoomComponent';
import Weather from './Weather';
import Window from './Window';

const Desktop: React.FC = () => {
    const [showTerminal, setShowTerminal] = useState(false);
    const [showDoom, setShowDoom] = useState(false);
    const [showWeather, setShowWeather] = useState(false);

    const handleOpenTerminal = () => {
        setShowTerminal(true);
    };

    const handleCloseTerminal = () => {
        setShowTerminal(false);
    };

    const handleOpenDoom = () => {
        setShowDoom(true);
    };

    const handleCloseDoom = () => {
        setShowDoom(false);
    };

    const handleOpenWeather = () => {
        setShowWeather(true);
    };

    const handleCloseWeather = () => {
        setShowWeather(false);
    };

    return (
        <div className="desktop">
            <div className="icon" onClick={handleOpenTerminal}>Terminal</div>
            <div className="icon" onClick={handleOpenDoom}>Doom</div>
            <div className="icon" onClick={handleOpenWeather}>Weather</div>
            {showTerminal && (
                <Window title="Terminal" onClose={handleCloseTerminal} width={800} height={600}>
                    <Terminal onClose={handleCloseTerminal} />
                </Window>
            )}
            {showDoom && (
                <Window title="DOOM" onClose={handleCloseDoom} width={1024} height={880}>
                    <DoomComponent />
                </Window>
            )}
            {showWeather && (
                <Window title="Weather" onClose={handleCloseWeather} width={800} height={600}>
                    <Weather onClose={handleCloseWeather}/>
                </Window>
            )}
        </div>
    );
};

export default Desktop;