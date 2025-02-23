import React, { useState, useEffect } from 'react';
import FolderIcon from '../img/Folder_icon.png';
import FileIcon from '../img/File_icon.png';
import NotepadModal from './NotepadModal';

interface FileSystemProps {
    onClose: () => void;
}

interface File {
    id: number;
    name: string;
    type: 'file' | 'directory';
    parent: string;
    owner: number;
}

const FileSystem: React.FC<FileSystemProps> = ({ onClose }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [currentDirectory, setCurrentDirectory] = useState('/');
    const [newFileName, setNewFileName] = useState('');
    const [newDirectoryName, setNewDirectoryName] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<'file' | 'directory' | null>(null);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const userid = 0;

    useEffect(() => {
        fetchFiles(currentDirectory);
    }, [currentDirectory]);

    const fetchFiles = async (directory: string) => {
        try {
            const response = await fetch('http://localhost:8000/api/command/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ command: 'ls -l', directory, userid }),
            });
            const data = await response.json();
            const files = data.result.split('\n').map((line: string, index: number) => {
                const [type, name] = line.split(': ');
                return { id: index, name, type: type.trim() } as File;
            }).filter((file: File) => file.name); // Filtrer les noms vides
            setFiles(files);
        } catch (error) {
            console.error('Erreur lors de la récupération des fichiers :', error);
        }
    };

    const handleDirectoryChange = (file: File) => {
        if (file.type === 'directory') {
            setCurrentDirectory(currentDirectory === '/' ? `/${file.name}` : `${currentDirectory}/${file.name}`);
        } else {
            setSelectedFile(file.name);
            console.log(currentDirectory);
        }
    };

    const handleBack = () => {
        if (currentDirectory !== '/') {
            const newDirectory = currentDirectory.split('/').slice(0, -1).join('/') || '/';
            setCurrentDirectory(newDirectory);
        }
    };

    const handleCreateFile = async () => {
        if (newFileName) {
            try {
                await fetch('http://localhost:8000/api/command/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ command: `touch ${newFileName}`, directory: currentDirectory, userid }),
                });
                setNewFileName('');
                fetchFiles(currentDirectory);
                setShowModal(false);
            } catch (error) {
                console.error('Erreur lors de la création du fichier :', error);
            }
        }
    };

    const handleCreateDirectory = async () => {
        if (newDirectoryName) {
            try {
                await fetch('http://localhost:8000/api/command/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ command: `mkdir ${newDirectoryName}`, directory: currentDirectory, userid }),
                });
                setNewDirectoryName('');
                fetchFiles(currentDirectory);
                setShowModal(false);
            } catch (error) {
                console.error('Erreur lors de la création du répertoire :', error);
            }
        }
    };

    const handleDelete = async (file: File) => {
        try {
            await fetch('http://localhost:8000/api/command/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ command: file.type === 'directory' ? `rmdir ${file.name}` : `rm ${file.name}`, directory: currentDirectory, userid }),
            });
            fetchFiles(currentDirectory);
        } catch (error) {
            console.error('Erreur lors de la suppression du fichier ou du répertoire :', error);
        }
    };

    const openModal = (type: 'file' | 'directory') => {
        setModalType(type);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setNewFileName('');
        setNewDirectoryName('');
    };

    const closeNotepad = () => {
        setSelectedFile(null);
    };

    return (
        <div className="file-system">
            <div className="file-system-header">
                <button onClick={handleBack} disabled={currentDirectory === '/'}>Back</button>
                <span className="current-directory">{currentDirectory}</span>
                <span></span>
            </div>
            <div className="file-system-controls">
                <select onChange={(e) => openModal(e.target.value as 'file' | 'directory')}>
                    <option value="">Create...</option>
                    <option value="file">New File</option>
                    <option value="directory">New Directory</option>
                </select>
            </div>
            <div className="file-system-content">
                {files.length === 0 ? (
                    <p>Ce dossier est vide</p>
                ) : (
                    <div className="file-grid">
                        {files.map((file) => (
                            <div key={file.id} className="file-item">
                                <button className="delete-button" onClick={() => handleDelete(file)}>×</button>
                                <img
                                    src={file.type === 'directory' ? FolderIcon : FileIcon}
                                    alt={file.type}
                                    className="file-icon"
                                    onClick={() => handleDirectoryChange(file)}
                                />
                                <span className="file-name">{file.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        {modalType === 'file' ? (
                            <>
                                <h2>Create New File</h2>
                                <input
                                    type="text"
                                    placeholder="File name"
                                    value={newFileName}
                                    onChange={(e) => setNewFileName(e.target.value)}
                                />
                                <button onClick={handleCreateFile}>Create</button>
                            </>
                        ) : (
                            <>
                                <h2>Create New Directory</h2>
                                <input
                                    type="text"
                                    placeholder="Directory name"
                                    value={newDirectoryName}
                                    onChange={(e) => setNewDirectoryName(e.target.value)}
                                />
                                <button onClick={handleCreateDirectory}>Create</button>
                            </>
                        )}
                    </div>
                </div>
            )}
            {selectedFile && (
                <NotepadModal filePath={selectedFile} userId={userid} path={currentDirectory}  onClose={closeNotepad} />
            )}
        </div>
    );
};

export default FileSystem;

