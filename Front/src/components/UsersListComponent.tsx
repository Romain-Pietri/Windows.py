import React, { useState } from 'react';

const UsersListComponent: React.FC = () => {
    const [users, setUsers] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleFetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/get_all_users/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (data.users) {
                setUsers(data.users);
            } else {
                setError(data.error || 'Erreur lors de la récupération des utilisateurs.');
            }
        } catch (error) {
            setError('Erreur lors de la récupération des utilisateurs.');
        }
    };

    return (
        <div>
            <h2>Liste des utilisateurs</h2>
            <button onClick={handleFetchUsers}>Afficher les utilisateurs</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {users.map((user, index) => (
                    <li key={index}>{user}</li>
                ))}
            </ul>
        </div>
    );
};

export default UsersListComponent;