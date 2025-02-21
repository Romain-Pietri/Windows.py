import React, { useState, useRef, useEffect } from 'react';

interface WindowProps {
    onClose: () => void;
    children: React.ReactNode;
    title: string;
}

const Window: React.FC<WindowProps> = ({ onClose, children, title }) => {
    const windowRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        // Center the window on the screen
        const centerX = window.innerWidth / 2 - (windowRef.current?.offsetWidth || 0) / 2;
        const centerY = window.innerHeight / 2 - (windowRef.current?.offsetHeight || 0) / 2;
        setPosition({ x: centerX, y: centerY });
    }, []);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        console.log('Mouse down');
        setIsDragging(true);
        setOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isDragging) {
            console.log('Mouse move');
            setPosition({
                x: e.clientX - offset.x,
                y: e.clientY - offset.y,
            });
        }
    };

    const handleMouseUp = () => {
        console.log('Mouse up');
        setIsDragging(false);
    };

    return (
        <div
            className="window"
            ref={windowRef}
            style={{ top: `${position.y}px`, left: `${position.x}px` }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <div className="window-header" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
                <span>{title}</span>
                <button onClick={onClose}>X</button>
            </div>
            <div className="window-content">
                {children}
            </div>
        </div>
    );
};

export default Window;