import React, { useState, useEffect } from 'react';

interface Message {
  message: string;
  whosend: string;
}

const Whatapp = () => {
  const [conversations, setConversations] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [newChatUserId, setNewChatUserId] = useState('');
  const userId = '0'; // Remplacez par l'ID de l'utilisateur actuel

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/get_conversation/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user1: userId }),
      });
      const data = await response.json();
      setConversations(data.result);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (chatUser: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/get_message/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user1: userId, user2: chatUser[0] }),
      });
      const data = await response.json();
      // Assuming the API returns a list of tuples, convert them to objects
      const formattedMessages = data.result.map((msg: [string, string, string, string, string]) => ({
        message: msg[2],
        whosend: msg[4],
      }));
      setMessages(formattedMessages);
      setCurrentChat(chatUser);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      await fetch('http://localhost:8000/api/send_message/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user1: userId,
          user2: currentChat,
          message: newMessage,
          whosend: userId,
        }),
      });
      setMessages([...messages, { message: newMessage, whosend: userId }]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const startNewConversation = () => {
    if (newChatUserId.trim() === '') return;
    setConversations([...conversations, newChatUserId]);
    setCurrentChat(newChatUserId);
    setMessages([]); // Clear previous messages
    setNewChatUserId('');
  };

  return (
    <div className="whatapp">
      <div className="whatapp__sidebar">
        <h2>Conversations</h2>
        <ul>
          {conversations.map((conversation, index) => (
            <li key={index} onClick={() => fetchMessages(conversation)}>
              {conversation}
            </li>
          ))}
        </ul>
        <div className="whatapp__newChat">
          <input
            type="text"
            value={newChatUserId}
            onChange={(e) => setNewChatUserId(e.target.value)}
            placeholder="Enter user ID"
          />
          <button onClick={startNewConversation}>Start New Chat</button>
        </div>
      </div>
      <div className="whatapp__chat">
        {currentChat ? (
          <>
            <div className="whatapp__chatHeader">
              <h2>Chat with {currentChat}</h2>
            </div>
            <div className="whatapp__chatBody">
              {messages.map((msg, index) => (
                <p key={index} className={`whatapp__message ${msg.whosend === userId ? 'sent' : 'received'}`}>
                  {msg.message}
                </p>
              ))}
            </div>
            <div className="whatapp__chatFooter">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="whatapp__noChat">
            <h2>Select a conversation to start chatting</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Whatapp;