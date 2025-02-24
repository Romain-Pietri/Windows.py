import React, { useState } from 'react';
import Terminal from './Terminal';
import DoomComponent from './DoomComponent';
import Window from './Window';
import Feed from "./Feed";

const Desktop: React.FC = () => {
    const [showTerminal, setShowTerminal] = useState(false);
    const [showDoom, setShowDoom] = useState(false);
    const [showFeed, setShowFeed] = useState(false);

    const handleOpenTerminal = () => setShowTerminal(true);
    const handleCloseTerminal = () => setShowTerminal(false);
    
    const handleOpenDoom = () => setShowDoom(true);
    const handleCloseDoom = () => setShowDoom(false);

    const handleOpenFeed = () => setShowFeed(true);
    const handleCloseFeed = () => setShowFeed(false);

    return (
        <div className="desktop">
            <div className="icon" onClick={handleOpenTerminal}>Terminal</div>
            <div className="icon" onClick={handleOpenDoom}>Doom</div>
            <div className="icon" onClick={handleOpenFeed}>Flux d'actualités</div>

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
            {showFeed && (
                <Window title="Flux d'actualités" onClose={handleCloseFeed} width={800} height={600}>
                    <Feed />
                </Window>
            )}
        </div>
    );
};

export default Desktop;
