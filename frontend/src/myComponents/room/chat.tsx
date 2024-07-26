import React, { useState } from "react";
import { Button } from "../../shadcn/components/ui/button";
import { Input } from "../../shadcn/components/ui/input";
import { FaPaperPlane } from "react-icons/fa";

interface Message {
  sender: string;
  content: string;
  timestamp: Date;
}

const Chat = ({
  messages,
  sendMessage,
}: {
  messages: Message[];
  sendMessage: (message: string) => void;
}) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
        {messages.map((message, index) => (
          <div key={index} className="mb-4 bg-white p-3 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">{message.sender}</span>
              <span className="text-xs text-gray-500">
                {message.timestamp.toLocaleString()}
              </span>
            </div>
            <p>{message.content}</p>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmitMessage}
        className="p-4 bg-white border-t flex items-center"
      >
        <Input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow mr-2"
        />
        <Button type="submit" size="icon" variant="ghost">
          <FaPaperPlane />
        </Button>
      </form>
    </div>
  );
};

export default Chat;
