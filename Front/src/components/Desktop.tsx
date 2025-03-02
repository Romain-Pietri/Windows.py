import React, { useState } from 'react';
import Terminal from './Terminal';
import DoomComponent from './DoomComponent';
import Weather from './Weather';
import Window from './Window';
// import AddUserComponent from './AddUserComponent';
// import UsersListComponent from './UsersListComponent';

const Desktop: React.FC = () => {
    const [showTerminal, setShowTerminal] = useState(false);
    const [showDoom, setShowDoom] = useState(false);
    const [showWeather, setShowWeather] = useState(false);
    // const [showAddUser, setShowAddUser] = useState(false);
    // const [showUserList, setShowUserList] = useState(false);

    const handleOpenTerminal = () => setShowTerminal(true);
    const handleCloseTerminal = () => setShowTerminal(false);

    const handleOpenDoom = () => setShowDoom(true);
    const handleCloseDoom = () => setShowDoom(false);

    const handleOpenWeather = () => setShowWeather(true);
    const handleCloseWeather = () => setShowWeather(false);

    // const handleOpenAddUser = () => setShowAddUser(true);
    // const handleCloseAddUser = () => setShowAddUser(false);

    // const handleOpenUserList = () => setShowUserList(true);
    // const handleCloseUserList = () => setShowUserList(false);

    return (
        <div className="desktop">
            <div className="icon" onClick={handleOpenTerminal}>Terminal</div>
            <div className="icon" onClick={handleOpenDoom}>Doom</div>
            <div className="icon" onClick={handleOpenWeather}>Weather</div>
            {/* <div className="icon" onClick={handleOpenAddUser}>Add User</div>
            <div className="icon" onClick={handleOpenUserList}>User List</div> */}
            {showTerminal && (
                <Window title="Terminal" onClose={handleCloseTerminal} width={800} height={600}>
                    <Terminal onClose={handleCloseTerminal} />
                </Window>
            )}
            {showDoom && (
                <Window title="DOOM" onClose={handleCloseDoom} width={1024} height={880}>
                    <DoomComponent />
                </Window>
            )}
            {showWeather && (
                <Window title="Weather" onClose={handleCloseWeather} width={800} height={600}>
                    <Weather onClose={handleCloseWeather}/>
                </Window>
            )}
            {/* {showAddUser && (
                <Window title="Add User" onClose={handleCloseAddUser} width={400} height={300}>
                    <AddUserComponent />
                </Window>
            )}
            {showUserList && (
                <Window title="User List" onClose={handleCloseUserList} width={400} height={300}>
                    <UsersListComponent />
                </Window>
            )} */}
        </div>
    );
};

export default Desktop;