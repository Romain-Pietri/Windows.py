import React, { useState, useEffect, useRef } from 'react';

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
        } else if (e.key === 'ArrowUp') {
            try {
                const response = await fetch('http://localhost:8000/api/last_command/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                console.log('Last command:', data.result);
                setInput(data.result);
                if (inputRef.current) {
                    inputRef.current.value = data.result; // Mettre à jour la valeur de l'input
                }
            } catch (error) {
                console.error('Error fetching last command:', error);
            }
        }
    };

    return (
        <div className="terminal">
            <div className="terminal-output">
                {output.map((line, index) => (
                    <div key={index}>{line}</div>
                ))}
            </div>
            <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                className="terminal-input"
            />
        </div>
    );
};

export default Terminal;