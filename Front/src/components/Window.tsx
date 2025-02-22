import React, { useState, useRef, useEffect } from 'react';
import { useWindowContext } from '../context/WindowContext';

interface WindowProps {
    onClose: () => void;
    children: React.ReactNode;
    title: string;
    width?: number;
    height?: number;
}

const Window: React.FC<WindowProps> = ({ onClose, children, title, width = 800, height = 600 }) => {
    const windowRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [zIndex, setZIndex] = useState(1);
    const { bringToFront } = useWindowContext();

    useEffect(() => {
        // Center the window on the screen
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        setPosition({ x: centerX, y: centerY });
    }, [width, height]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        setOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
        setZIndex(bringToFront()); // Mettre la fenêtre au premier plan
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - offset.x,
                y: e.clientY - offset.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div
            className="window"
            ref={windowRef}
            style={{ width, height, top: `${position.y}px`, left: `${position.x}px`, position: 'absolute', zIndex }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseDown={handleMouseDown}
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