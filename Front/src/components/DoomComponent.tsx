import React, { useRef, useEffect } from 'react';

const DoomComponent: React.FC = () => {
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

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <div style={{ backgroundColor: '#333', color: 'white', padding: '10px', fontFamily: 'monospace', fontSize: '12px' }}>
                <h3>Commandes pour jouer :</h3>
                <ul>
                    <li>Flèches directionnelles : Déplacer</li>
                    <li>Ctrl : Tirer</li>
                    <li>Espace : Utiliser</li>
                    <li>Shift : Courir</li>
                    <li>1-7 : Changer d'arme</li>
                </ul>
            </div>
            <div style={{ flex: 1, position: 'relative', backgroundColor: '#111111' }}>
                <iframe
                    ref={iframeRef}
                    src="https://danihre.github.io/jsdoom/"
                    style={{ width: '100%', height: 'calc(100% - 13px)', border: 'none', position: 'absolute', top: 0, left: 0, background: 'black' }}
                    scrolling="no"
                    title="DOOM"
                ></iframe>
            </div>
        </div>
    );
};

export default DoomComponent;