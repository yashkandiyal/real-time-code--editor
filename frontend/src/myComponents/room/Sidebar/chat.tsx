import React, { useState, useEffect, useRef } from "react";
import { Button } from "../../../shadcn/components/ui/button";
import { Input } from "../../../shadcn/components/ui/input";
import { FaPaperPlane, FaThumbtack, FaTimes } from "react-icons/fa";
import { Switch } from "../../../shadcn/components/ui/switch";
import { Card } from "../../../shadcn/components/ui/card";
import { ScrollArea } from "../../../shadcn/components/ui/scroll-area";
import { Separator } from "@radix-ui/react-select";

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
  sidebarType: "participants" | "messages" | "none";
  toggleSidebar: (type: "participants" | "messages" | "none") => void;
}

const Chat: React.FC<ChatProps> = ({
  messages,
  sendMessage,
  currentUser,
  isAuthor,
  toggleMessagePermissions,

  toggleSidebar,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [allowMessages, setAllowMessages] = useState(true);
  const [pinnedMessages, setPinnedMessages] = useState<Set<string>>(new Set());

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    toggleMessagePermissions(allowMessages);
  }, [allowMessages, toggleMessagePermissions]);

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  const handleToggleMessages = () => {
    setAllowMessages(!allowMessages);
  };

  const handleTimestamp = (timestamp: string): string => {
    if (!timestamp) {
      console.error("Timestamp is empty or undefined:", timestamp);
      return "Invalid Timestamp";
    }

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      console.error("Failed to parse timestamp. Input:", timestamp);
      return "Invalid Timestamp";
    }

    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    try {
      const formattedTime = new Intl.DateTimeFormat("en-GB", options).format(
        date
      );
      return formattedTime;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Timestamp";
    }
  };

  const handlePinMessage = (messageId: string) => {
    setPinnedMessages((prev) => {
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
    <Card className="w-full bg-white dark:bg-gray-800 h-full overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          In-call messages
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          onClick={() => {
            toggleSidebar("none"); // Close sidebar
          }}
        >
          <FaTimes />
        </Button>
      </div>
      <Separator />
      {isAuthor && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
            Let everyone send messages
          </span>
          <Switch
            checked={allowMessages}
            onCheckedChange={handleToggleMessages}
          />
        </div>
      )}
      <ScrollArea className="p-4">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 italic">
          Unless they're pinned, messages can only be seen by people in the call
          when the message is sent. All messages are deleted when the call ends.
        </div>

        {Array.from(pinnedMessages).map((messageId) => {
          const message = messages.find((msg) => msg.id === messageId);
          if (!message) return null;
          const messageTime = handleTimestamp(message.timestamp);
          return (
            <Card
              key={messageId}
              className="mb-4 p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg"
            >
              <div className="flex items-baseline justify-between mb-1">
                <span className="font-semibold text-sm text-blue-700 dark:text-blue-300">
                  {message.sender === currentUser ? "You" : message.sender}
                </span>
                <span className="text-xs text-blue-500 dark:text-blue-400">
                  {messageTime}
                </span>
              </div>
              <p className="text-sm text-gray-800 dark:text-gray-200">
                {message.content}
              </p>
              <div className="text-sm text-blue-600 dark:text-blue-400 font-semibold mt-2 flex items-center">
                <FaThumbtack className="mr-1" /> Pinned
              </div>
            </Card>
          );
        })}

        {messages.map((message) => {
          const messageTime = handleTimestamp(message.timestamp);
          return (
            <div key={message.id} className="mb-4 relative group">
              <div className="flex items-baseline justify-between mb-1">
                <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                  {message.sender === currentUser ? "You" : message.sender}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {messageTime}
                </span>
              </div>
              <p className="text-sm text-gray-800 dark:text-gray-200">
                {message.content}
              </p>
              {isAuthor && (
                <Button
                  className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handlePinMessage(message.id)}
                  variant="ghost"
                  size="icon"
                >
                  <FaThumbtack className="text-gray-500 dark:text-gray-400" />
                </Button>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </ScrollArea>
      <Separator />
      {isAuthor || allowMessages ? (
        <form
          onSubmit={handleSubmitMessage}
          className="p-4 flex items-center bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 rounded-b-lg"
        >
          <Input
            type="text"
            placeholder="Send a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow mr-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit" size="icon" variant="ghost">
            <FaPaperPlane className="text-blue-500 dark:text-blue-400" />
          </Button>
        </form>
      ) : (
        <div className="p-4 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-center text-sm rounded-b-lg">
          Messaging is disabled by the author.
        </div>
      )}
    </Card>
  );
};

export default Chat;
