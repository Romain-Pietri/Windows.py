import React, { useState } from 'react';

const VerifyUserComponent: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleVerifyUser = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/verify_user/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: username, password: password }),
            });
            const data = await response.json();
            setMessage(data.message || data.error);
        } catch (error) {
            setMessage('Erreur lors de la vérification de l\'utilisateur.');
        }
    };

    return (
        <div>
            <h2>Vérifier un utilisateur</h2>
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
            <button onClick={handleVerifyUser}>Vérifier</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default VerifyUserComponent;