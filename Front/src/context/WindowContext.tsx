import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WindowContextProps {
    bringToFront: () => number;
}

interface WindowProviderProps {
    children: ReactNode;
}

const WindowContext = createContext<WindowContextProps | undefined>(undefined);

export const WindowProvider: React.FC<WindowProviderProps> = ({ children }) => {
    const [highestZIndex, setHighestZIndex] = useState(1);

    const bringToFront = () => {
        setHighestZIndex((prev) => prev + 1);
        return highestZIndex + 1;
    };

    return (
        <WindowContext.Provider value={{ bringToFront }}>
            {children}
        </WindowContext.Provider>
    );
};

export const useWindowContext = () => {
    const context = useContext(WindowContext);
    if (!context) {
        throw new Error('useWindowContext must be used within a WindowProvider');
    }
    return context;
};