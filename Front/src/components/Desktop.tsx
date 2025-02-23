import React, { useState } from 'react';
import Terminal from './Terminal';
import DoomComponent from './DoomComponent';
import Window from './Window';
import FileSystem from './FileSystem';
const Desktop: React.FC = () => {
    const [showTerminal, setShowTerminal] = useState(false);
    const [showDoom, setShowDoom] = useState(false);
    const [showFileSystem, setShowFileSystem] = useState(false);

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

    const handleOpenFileSystem = () => {
        setShowFileSystem(true);
    }

    const handleCloseFileSystem = () => {
        setShowFileSystem(false);
    }

    return (
        <div className="desktop">
            <div className="icon" onClick={handleOpenFileSystem}>File System</div>
            <div className="icon" onClick={handleOpenTerminal}>Terminal</div>
            <div className="icon" onClick={handleOpenDoom}>Doom</div>

            {showFileSystem && (
                <Window title="File System" onClose={handleCloseFileSystem} width={800} height={600}>
                    <FileSystem onClose={handleCloseFileSystem} />
                </Window>
            )}
            {showTerminal && (
                <Window title="Terminal" onClose={handleCloseTerminal} width={800} height={600}>
                    <Terminal onClose={handleCloseTerminal} />
                </Window>
            )}
            {showDoom && (
                <Window title="DOOM" onClose={handleCloseDoom} width={680} height={720}>
                    <DoomComponent />
                </Window>
            )}
        </div>
    );
};

export default Desktop;