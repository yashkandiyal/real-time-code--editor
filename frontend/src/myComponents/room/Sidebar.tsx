import React, { useState } from "react";
import { Button } from "../../shadcn/components/ui/button";
import {
  Sheet,
  SheetContent,
} from "../../shadcn/components/ui/sheet";
import {
  FaComment,
  FaHome,
  FaUsers,
  FaCog,
  FaChevronRight,
  FaChevronLeft,
  FaSignOutAlt,
} from "react-icons/fa";
import Chat from "./chat";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../shadcn/components/ui/avatar";

interface Message {
  sender: string;
  content: string;
  timestamp: Date;
}

interface SidebarProps {
  messages: Message[];
  sendMessage: (message: string) => void;
  participants: string[];
  isAuthor: boolean;
  handleRemove: (username: string) => void;
  handleInvite: () => void;
  currentUser: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  messages,
  sendMessage,
  participants,
  isAuthor,
  handleRemove,
  currentUser,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [allowMessages, setAllowMessages] = useState(true);

  const menuItems = [
    { name: "Home", icon: <FaHome /> },
    { name: "Users", icon: <FaUsers /> },
    { name: "Settings", icon: <FaCog /> },
  ];

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleParticipants = () => {
    setIsParticipantsOpen(!isParticipantsOpen);
    setActiveItem("Users");
  };

  return (
    <>
      <div
        className={`bg-white text-black h-screen flex flex-col transition-all duration-300 ${
          isExpanded ? "w-64" : "w-16"
        }`}
      >
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 -right-4 bg-white rounded-full shadow-md z-10"
          onClick={toggleSidebar}
        >
          {isExpanded ? <FaChevronLeft /> : <FaChevronRight />}
        </Button>

        {/* Logo or App Name */}
        <div className="p-4 border-b border-gray-300 flex justify-between items-center">
          {isExpanded ? (
            <h2 className="text-xl font-bold">Dashboard</h2>
          ) : (
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
            onClick={() => setIsChatOpen(true)}
          >
            <FaComment className="h-5 w-5" />
            <span className="sr-only">Toggle Chat</span>
          </Button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-grow overflow-y-auto">
          <ul className="space-y-2 mt-4">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start px-4 py-2 ${
                    activeItem === item.name
                      ? "bg-gray-200 text-black"
                      : "text-gray-700 hover:bg-gray-100 hover:text-black"
                  }`}
                  onClick={() =>
                    item.name === "Users"
                      ? toggleParticipants()
                      : setActiveItem(item.name)
                  }
                >
                  <span className="mr-3">{item.icon}</span>
                  {isExpanded && item.name}
                </Button>
                {item.name === "Users" && isParticipantsOpen && isExpanded && (
                  <ul className="bg-gray-100 py-2">
                    {participants.map((participant, index) => (
                      <li key={index} className="px-8 py-2 hover:bg-gray-200">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={`https://api.adorable.io/avatars/40/${participant}.png`}
                            />
                            <AvatarFallback>{participant[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{participant}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-300">
          <Button variant="ghost" className="w-full justify-start">
            <FaSignOutAlt className="mr-3" />
            {isExpanded && "Logout"}
          </Button>
        </div>
      </div>

      <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
        <SheetContent
          side="right"
          className="w-full sm:w-[400px] p-0 bg-white"
        >
          <Chat
            messages={messages}
            sendMessage={sendMessage}
            currentUser={currentUser}
            isAuthor={isAuthor}
            toggleMessagePermissions={setAllowMessages}
            allowMessages={allowMessages}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;