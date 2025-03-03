import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const RegisterComponent: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (data.message) {
                setMessage(data.message);
                navigate('/login');
            } else {
                setMessage(data.error);
            }
        } catch (error) {
            setMessage("Erreur lors de l'inscription.");
        }
    };

    return (
        <div className="login-container">
            <h2>Créer un compte</h2>
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
            <button className="btn-login" onClick={handleRegister}>S'inscrire</button>
            {message && <p>{message}</p>}
            <p className="signup-link">Déjà un compte ? <a onClick={() => navigate('/login')}>Se connecter</a></p>
        </div>
    );
};

export default RegisterComponent;
