import React from 'react';
import Desktop from './components/Desktop';
import { WindowProvider } from './context/WindowContext';
import WidgetDate from "./components/WidgetDate";


const App: React.FC = () => {
    return (
        <WindowProvider>
            <div className="App">
                <WidgetDate />
                <Desktop />
            </div>
        </WindowProvider>
    );
};

export default App;