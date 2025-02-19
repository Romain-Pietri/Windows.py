import React from 'react';

const Desktop: React.FC = () => {
    return (
        <div className="desktop">
            <div className="icon">My Computer</div>
            <div className="icon">Documents</div>
            <div className="icon">Recycle Bin</div>
            <div className="window">
                <h2>Window Title</h2>
                <p>This is a sample window content.</p>
            </div>
        </div>
    );
};

export default Desktop;