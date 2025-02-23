import React, { useState, useEffect } from 'react';

interface NotepadComponentProps {
    filePath: string;
    userId: number;
    path: string;
    onClose: () => void;
}

const NotepadComponent: React.FC<NotepadComponentProps> = ({ filePath, userId, path, onClose }) => {
    const [content, setContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchFileContent(filePath, path);
    }, [filePath]);

    const fetchFileContent = async (file: string, path:string) => {
      
        try {
            const response = await fetch('http://localhost:8000/api/command/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ command: `cat ${file}`, directory: path, userid: userId }),
            });
            const data = await response.json();
            setContent(data.result);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching file content:', error);
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await fetch('http://localhost:8000/api/command/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ command: `cat ${content} > ${filePath}`,directory: path, userid: userId }),
            });
            alert('File saved successfully!');
        } catch (error) {
            console.error('Error saving file:', error);
            alert('Error saving file.');
        }
    };

    return (
        <div className="notepad">
            <div className="notepad-header">
                <button onClick={onClose}>X</button>
                <span>{filePath}</span>
                <button onClick={handleSave}>Save</button>
            </div>
            <div className="notepad-content">
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{ width: '100%', height: 'calc(100% - 40px)' }}
                    />
                )}
            </div>
        </div>
    );
};

export default NotepadComponent;