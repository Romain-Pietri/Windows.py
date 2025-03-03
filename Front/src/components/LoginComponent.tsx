import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css';

const LoginComponent: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (data.message) {
                setMessage(data.message);
                login();
                document.cookie = `session_id=${data.userid}; path=/;`;
                navigate('/desktop');
            } else {
                setMessage(data.error);
            }
        } catch (error) {
            setMessage('Erreur lors de la connexion.');
        }
    };

    return (
        <div className="login-container">
            <h2>Connexion</h2>
            <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn-login" onClick={handleLogin}>Se connecter</button>
            {message && <p>{message}</p>}
            <p className="signup-link">or, <a onClick={() => navigate('/register')}>s'inscrire</a></p>
        </div>
    );
};

export default LoginComponent;
