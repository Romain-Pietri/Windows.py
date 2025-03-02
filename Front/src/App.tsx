import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
    Outlet,
} from 'react-router-dom';
import Desktop from './components/Desktop';
import LoginComponent from './components/LoginComponent';
import RegisterComponent from './components/RegisterComponent';
import { WindowProvider } from './context/WindowContext';
import { AuthProvider, useAuth } from './context/AuthContext';

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <WindowProvider>
                <Router>
                    <Routes>
                        <Route path="/register" element={<RegisterComponent />} />
                        <Route path="/login" element={<LoginComponent />} />
                        <Route path="/desktop" element={<PrivateRoute><Desktop /></PrivateRoute>} />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                </Router>
            </WindowProvider>
        </AuthProvider>
    );
};

export default App;