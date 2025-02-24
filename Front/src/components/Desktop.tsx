import React, { useState } from 'react';
import Terminal from './Terminal';
import DoomComponent from './DoomComponent';
import Window from './Window';
import FileSystem from './FileSystem';

import ImgTerminal from '../img/terminal.png';
import ImgDoom from '../img/doom.png';
import ImgFichier from '../img/fichier.png';

import Whatapp from './Whatapp';
const Desktop: React.FC = () => {
    const [showTerminal, setShowTerminal] = useState(false);
    const [showDoom, setShowDoom] = useState(false);
    const [showFileSystem, setShowFileSystem] = useState(false);
    const [showWhatapp, setShowWhatapp] = useState(false);

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

    const handleOpenWhatapp = () => {
        setShowWhatapp(true);
    }

    const handleCloseWhatapp = () => {
        setShowWhatapp(false);
    }

    return (
        <div className="desktop">
            <div className="icon" onClick={handleOpenFileSystem}><img src={ImgFichier} alt="Fichier Icon"/><p className="icon-name">Fichier</p></div>
            <div className="icon" onClick={handleOpenTerminal}><img src={ImgTerminal} alt="Terminal Icon"/><p className="icon-name">Terminal</p></div>
            <div className="icon" onClick={handleOpenDoom}><img src={ImgDoom} alt="Doom Icon"/><p className="icon-name">Doom</p></div>
            
            <div className="icon" onClick={handleOpenFileSystem}>File System</div>
            <div className="icon" onClick={handleOpenTerminal}>Terminal</div>
            <div className="icon" onClick={handleOpenDoom}>Doom</div>
            <div className="icon" onClick={handleOpenWhatapp}>Whatapp</div>
            
            

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

            {showWhatapp && (
                <Window title="Whatapp" onClose={handleCloseWhatapp} width={800} height={600}>
                    <Whatapp />
                </Window>
            )}
        </div>
    );
};

export default Desktop;