import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../shadcn/components/ui/button';
import { Input } from '../../shadcn/components/ui/input';
import { FaPaperPlane, FaThumbtack } from 'react-icons/fa';
import { Switch } from '../../shadcn/components/ui/switch';

interface Message {
  id: string; // Add an ID to uniquely identify messages
  sender: string;
  content: string;
  timestamp: string; // Assuming timestamp is a string
}

interface ChatProps {
  messages: Message[];
  sendMessage: (message: string) => void;
  currentUser: string;
  isAuthor: boolean;
  toggleMessagePermissions: (allow: boolean) => void;
}

const Chat: React.FC<ChatProps> = ({
  messages,
  sendMessage,
  currentUser,
  isAuthor,
  toggleMessagePermissions,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [allowMessages, setAllowMessages] = useState(true);
  const [pinnedMessages, setPinnedMessages] = useState<Set<string>>(new Set());
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    toggleMessagePermissions(allowMessages);
  }, [allowMessages, toggleMessagePermissions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleToggleMessages = () => {
    setAllowMessages(!allowMessages);
  };

  const handleTimestamp = (timestamp: string): string => {
    if (!timestamp) {
      console.error('Timestamp is empty or undefined:', timestamp);
      return 'Invalid Timestamp';
    }

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      console.error('Failed to parse timestamp. Input:', timestamp);
      return 'Invalid Timestamp';
    }

    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    try {
      const formattedTime = new Intl.DateTimeFormat('en-GB', options).format(date);
      return formattedTime;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Timestamp';
    }
  };

  const handlePinMessage = (messageId: string) => {
    setPinnedMessages(prev => {
      const newPinnedMessages = new Set(prev);
      if (newPinnedMessages.has(messageId)) {
        newPinnedMessages.delete(messageId);
      } else {
        newPinnedMessages.add(messageId);
      }
      return newPinnedMessages;
    });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold">In-call messages</h2>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-gray-700"
          onClick={() => {
            /* Close chat */
          }}
        >
          ×
        </Button>
      </div>
      {isAuthor && (
        <div className="flex items-center justify-between p-4 bg-gray-100">
          <span className="text-sm text-gray-600">Let everyone send messages</span>
          <Switch checked={allowMessages} onCheckedChange={handleToggleMessages} />
        </div>
      )}
      <div className="flex-grow overflow-y-auto p-4">
        <div className="text-sm text-gray-500 mb-4">
          Unless they're pinned, messages can only be seen by people in the call
          when the message is sent. All messages are deleted when the call ends.
        </div>
        
        {/* Display pinned messages */}
        {Array.from(pinnedMessages).map((messageId) => {
          const message = messages.find(msg => msg.id === messageId);
          if (!message) return null;
          const messageTime = handleTimestamp(message.timestamp);
          return (
            <div key={messageId} className="mb-4">
              <div className="flex items-baseline justify-between mb-1">
                <span className="font-semibold text-sm">
                  {message.sender === currentUser ? 'You' : message.sender}
                </span>
                <span className="text-xs text-gray-500">{messageTime}</span>
              </div>
              <p className="text-sm">{message.content}</p>
              <div className="text-sm text-gray-600 font-semibold mt-2">
                Pinned
              </div>
            </div>
          );
        })}

        {/* Display regular messages */}
        {messages.map((message) => {
          const messageTime = handleTimestamp(message.timestamp);
          return (
            <div
              key={message.id}
              className="mb-4 relative"
              onMouseEnter={() => isAuthor && setHoveredMessageId(message.id)}
              onMouseLeave={() => isAuthor && setHoveredMessageId(null)}
            >
              <div className="flex items-baseline justify-between mb-1">
                <span className="font-semibold text-sm">
                  {message.sender === currentUser ? 'You' : message.sender}
                </span>
                <span className="text-xs text-gray-500">{messageTime}</span>
              </div>
              <p className="text-sm">{message.content}</p>
              {isAuthor && hoveredMessageId === message.id && (
                <Button
                  className="absolute top-1 right-1"
                  onClick={() => handlePinMessage(message.id)}
                  variant="ghost"
                  size="icon"
                >
                  <FaThumbtack className="text-gray-500" />
                </Button>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      {isAuthor || allowMessages ? (
        <form
          onSubmit={handleSubmitMessage}
          className="p-4 border-t border-gray-200 flex items-center"
        >
          <Input
            type="text"
            placeholder="Send a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow mr-2 text-sm"
          />
          <Button type="submit" size="icon" variant="ghost">
            <FaPaperPlane className="text-blue-500" />
          </Button>
        </form>
      ) : (
        <div className="p-4 bg-gray-100 text-gray-500 text-center text-sm">
          Messaging is disabled by the author.
        </div>
      )}
    </div>
  );
};

export default Chat;
