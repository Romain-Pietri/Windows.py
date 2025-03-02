import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
                console.log(data.message);
                navigate('/desktop');
            } else {
                setMessage(data.error);
            }
        } catch (error) {
            setMessage('Erreur lors de la connexion.');
        }
    };

    return (
        <div>
            <h2>Connexion</h2>
            <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn-login" onClick={handleLogin}>Se connecter</button>
            {message && <p>{message}</p>}
            <button className="btn-login" onClick={() => navigate('/register')}>S'inscrire</button>
        </div>
    );
};

export default LoginComponent;