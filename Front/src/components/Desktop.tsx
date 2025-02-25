import React, { useState } from 'react';
import Terminal from './Terminal';
import DoomComponent from './DoomComponent';
import Window from './Window';
import Feed from "./Feed";
import FileSystem from './FileSystem';
import Chatbot from './Chatbot';
import Whatapp from './Whatapp';
import Maigret from './Maigret';
import Postit from './Postit';

import ImgTerminal from '../img/terminal.png';
import ImgDoom from '../img/doom.png';
import ImgFichier from '../img/fichier.png';
import ImgWhatApps from '../img/whatsapp.png';
import ImgFeed from '../img/feed.png';
import ImgChatbot from '../img/chatbot.png';
import ImgMaigret from '../img/maigret.png';


const Desktop: React.FC = () => {
    const [showTerminal, setShowTerminal] = useState(false);
    const [showDoom, setShowDoom] = useState(false);
    const [showFeed, setShowFeed] = useState(false);
    const [showFileSystem, setShowFileSystem] = useState(false);
    const [showWhatapp, setShowWhatapp] = useState(false);
    const [showChatbot, setShowChatbot] = useState(false);
    const [showHarvester, setShowHarvester] = useState(false);
    const [showPostit, setShowPostit] = useState(false);

    const handleOpenTerminal = () => setShowTerminal(true);
    const handleCloseTerminal = () => setShowTerminal(false);
    
    const handleOpenChatbot = () => setShowChatbot(true);
    const handleCloseChatbot= () => setShowChatbot(false);

    const handleOpenFeed = () => setShowFeed(true);
    const handleCloseFeed = () => setShowFeed(false);

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
    const handleOpenHarvester = () => setShowHarvester(true);
    const handleCloseHarvester = () => setShowHarvester(false);

    const handleOpenPostit = () => setShowPostit(true);
    const handleClosePostit = () => setShowPostit(false);
    return (
        <div className="desktop">
            
            <div className="icon" onClick={handleOpenFileSystem}><img src={ImgFichier} alt="Fichier Icon"/><p className="icon-name">Fichier</p></div>
            <div className="icon" onClick={handleOpenTerminal}><img src={ImgTerminal} alt="Terminal Icon"/><p className="icon-name">Terminal</p></div>
            <div className="icon" onClick={handleOpenDoom}><img src={ImgDoom} alt="Doom Icon"/><p className="icon-name">Doom</p></div>
            <div className="icon" onClick={handleOpenWhatapp}><img src={ImgWhatApps} alt="WhatApps Icon"/><p className="icon-name">WhatApps</p></div>
            <div className="icon" onClick={handleOpenFeed}><img src={ImgFeed} alt="Feed Icon"/><p className="icon-name">Actualités</p></div>
            <div className="icond" onClick={handleOpenChatbot}><img src={ImgChatbot} alt="Chatbot Icon"/><p className="icon-name">Chatbot</p></div>
            <div className="icon" onClick={handleOpenHarvester}>
                <img src={ImgMaigret} alt="Maigret Icon" style={{ borderRadius: '10%' }}/>
                <p className="icon-name">Maigret</p>
            </div>
            
            <div className="icon" onClick={handleOpenPostit}><img src={ImgFichier} alt="Postit Icon"/><p className="icon-name">Postit</p></div>
            {showPostit && (
                <Window title="Postit"  onClose={handleClosePostit} width={400} height={400}>
                    <Postit />
                </Window>
            )}


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
            {showFeed && (
                <Window title="Flux d'actualités" onClose={handleCloseFeed} width={800} height={600}>
                    <Feed />
                </Window>
            )}

            {showWhatapp && (
                <Window title="Whatapp" onClose={handleCloseWhatapp} width={800} height={600}>
                    <Whatapp />
                </Window>
            )}


            {showChatbot && (
                <Window title="Chatbot" onClose={handleCloseChatbot} width={800} height={600}>
                    <Chatbot />
                </Window>
            )}

            {showHarvester && (
                <Window title="Maigret" onClose={handleCloseHarvester} width={800} height={600}>
                    <Maigret onClose={handleCloseHarvester} />
                </Window>
            )}
        </div>
    );
};

export default Desktop;
