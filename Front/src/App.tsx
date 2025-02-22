import React from 'react';
import Desktop from './components/Desktop';
import { WindowProvider } from './context/WindowContext';

const App: React.FC = () => {
    return (
        <WindowProvider>
            <div className="App">
                <Desktop />
            </div>
        </WindowProvider>
    );
};

export default App;