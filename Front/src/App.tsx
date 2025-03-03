import React, { useEffect } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
    useLocation,
} from 'react-router-dom';
import Desktop from './components/Desktop';
import LoginComponent from './components/LoginComponent';
import RegisterComponent from './components/RegisterComponent';
import { WindowProvider } from './context/WindowContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import WidgetDate from "./components/WidgetDate";

// Fonction utilitaire pour vérifier la présence du cookie
const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
};

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
    const { isAuthenticated } = useAuth();
    const userIdCookie = getCookie('userid');

    useEffect(() => {
        console.log('isAuthenticated:', isAuthenticated);
        console.log('userIdCookie:', userIdCookie);
    }, [isAuthenticated, userIdCookie]);

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
                <WidgetDate /> {/* Afficher le widget date seulement si l'utilisateur est authentifié et le cookie userid est présent */}
            </WindowProvider>
        </AuthProvider>
    );
};

export default App;