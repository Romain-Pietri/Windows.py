import React from 'react';
import NotepadComponent from './NotepadComponent';

interface NotepadModalProps {
    filePath: string;
    userId: number;
    path: string;
    onClose: () => void;
}

const NotepadModal: React.FC<NotepadModalProps> = ({ filePath, userId, path, onClose }) => {
    return (
        <div className="notepad-modal">
            <div className="notepad-modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <NotepadComponent filePath={filePath} userId={userId} path={path} onClose={onClose} />
            </div>
        </div>
    );
};

export default NotepadModal;