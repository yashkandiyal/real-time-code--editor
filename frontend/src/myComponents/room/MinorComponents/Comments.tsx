import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiEdit2, FiTrash2, FiSmile } from 'react-icons/fi';
import { Button } from '../../../shadcn/components/ui/button';  
import { Input } from '../../../shadcn/components/ui/input';
import useSocket from '../../../hooks/SocketHook'; 

interface Message {
  id: number;
  user: string;
  text: string;
  timestamp: Date;
}

const Comments: React.FC<{ username: string; roomId: string }> = ({ username, roomId }) => {
  const [input, setInput] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [reaction, setReaction] = useState<{ [key: number]: string }>({});

  const {
    messages,
    sendMessage,
    participants,
  } = useSocket({
    username,
    isAuthor: false, // Adjust this based on your logic
    roomId,
    navigate: () => {}, // Implement navigation if needed
  });

  useEffect(() => {
    console.log("Current participants:", participants);
  }, [participants]);

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    if (editingMessageId) {
      // Handle edit (not implemented in this example)
      setEditingMessageId(null);
    } else {
      sendMessage(input);
    }

    setInput('');
  };

  const handleEditMessage = (id: number) => {
    const message = messages.find((msg: Message) => msg.id === id);
    if (message) {
      setEditingMessageId(id);
      setInput(message.text);
    }
  };

  const handleDeleteMessage = (id: number) => {
    // Implement delete functionality
    console.log(`Delete message with id: ${id}`);
  };

  const handleAddReaction = (id: number, emoji: string) => {
    setReaction((prev) => ({ ...prev, [id]: emoji }));
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="mb-4">
        <h3>Participants ({participants.length}):</h3>
        <ul>
          {participants.map((participant, index) => (
            <li key={index}>{participant}</li>
          ))}
        </ul>
      </div>
      <div className="overflow-y-auto flex-grow space-y-2">
        {messages.map((message: Message) => (
          <motion.div
            key={message.id}
            className="bg-gray-200 rounded-lg p-3 shadow-md flex justify-between items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <p className="font-bold">{message.user}</p>
              <p className="text-sm">{message.text}</p>
              <div className="text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleString()}
              </div>
              <div className="flex space-x-2 mt-1">
                <FiSmile
                  onClick={() => handleAddReaction(message.id, '😊')}
                  className="cursor-pointer"
                />
                {reaction[message.id] && <span>{reaction[message.id]}</span>}
              </div>
            </div>
            <div className="flex space-x-2">
              <FiEdit2
                onClick={() => handleEditMessage(message.id)}
                className="cursor-pointer"
              />
              <FiTrash2
                onClick={() => handleDeleteMessage(message.id)}
                className="cursor-pointer"
              />
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={handleSendMessage}>
          <FiSend />
        </Button>
      </div>
    </div>
  );
};

export default Comments;