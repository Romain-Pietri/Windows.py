import React, { useState } from 'react';
import Terminal from './Terminal';


const Desktop: React.FC = () => {
    const [showTerminal, setShowTerminal] = useState(false);
    const [showDoom, setShowDoom] = useState(false);

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

    return (
        <div className="desktop">
            <div className="icon" onClick={handleOpenTerminal}>Terminal</div>
            
            {showTerminal && <Terminal onClose={handleCloseTerminal} />}
            
        </div>
    );
};

export default Desktop;