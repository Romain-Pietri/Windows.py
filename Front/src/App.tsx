import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
    Outlet,
    useLocation,
} from 'react-router-dom';
import Desktop from './components/Desktop';
import LoginComponent from './components/LoginComponent';
import RegisterComponent from './components/RegisterComponent';
import { WindowProvider } from './context/WindowContext';
import { AuthProvider, useAuth } from './context/AuthContext';

interface PrivateRouteProps {
    element: React.ComponentType<any>;
    path: string;
    // Ajoutez d'autres props de RouteProps si nécessaire
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element: Element, path, ...rest }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    return isAuthenticated ? (
        <Element {...rest} />
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <WindowProvider>
                <Router>
                    <Routes>
                        <Route path="/register" element={<RegisterComponent />} />
                        <Route path="/login" element={<LoginComponent />} />
                        <Route
                            path="/desktop"
                            element={<PrivateRoute element={Desktop} path="/desktop" />}
                        />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                </Router>
            </WindowProvider>
        </AuthProvider>
    );
};

export default App;