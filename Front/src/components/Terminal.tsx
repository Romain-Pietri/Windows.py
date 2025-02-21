import React, { useState, useEffect, useRef } from 'react';
import Window from './Window';

interface TerminalProps {
    onClose: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ onClose }) => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState<string[]>(['Bienvenue dans le terminal. Tapez une commande et appuyez sur Entrée.']);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setOutput([...output, `$ ${input}`]);
            try {
                const response = await fetch('http://localhost:8000/api/command/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ command: input }),
                });
                const data = await response.json();
                setOutput((prevOutput) => [...prevOutput, data.result]);
            } catch (error) {
                setOutput((prevOutput) => [...prevOutput, 'Error: Unable to fetch data']);
            }
            setInput('');
        }
    };

    return (
        <Window onClose={onClose} title="Terminal">
            <div className="terminal-content">
                {output.map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
                <div className="terminal-input-line">
                    <span>$</span>
                    <input
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        ref={inputRef}
                        autoFocus
                    />
                </div>
            </div>
        </Window>
    );
};

export default Terminal;