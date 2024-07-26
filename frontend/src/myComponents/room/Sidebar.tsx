import React, { useState } from "react";
import { Button } from "../../shadcn/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../shadcn/components/ui/sheet";
import {
  FaComment,
  FaTimes,
  FaHome,
  FaUsers,
  FaCog,
  FaChevronDown,
  FaChevronUp,
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
  participants: string[]; // Add this line
  isAuthor: boolean;
  handleRemove: (username: string) => void;
  handleInvite:()=>void;
}

const Sidebar = ({
  messages,
  sendMessage,
  participants,
  isAuthor,
  handleRemove,
}: SidebarProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);

  const menuItems = [
    { name: "Home", icon: <FaHome /> },
    { name: "Users", icon: <FaUsers /> },
    { name: "Settings", icon: <FaCog /> },
  ];

  const toggleParticipants = () => {
    setIsParticipantsOpen(!isParticipantsOpen);
    setActiveItem("Users");
  };

  return (
    <div className="w-64 bg-white text-black h-screen flex flex-col ">
      <div className="flex items-center justify-between p-4 bg-white">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <Button
          variant="ghost"
          size="icon"
          className="p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
          onClick={() => setIsChatOpen(true)}
        >
          <FaComment className="h-5 w-5" />
          <span className="sr-only">Toggle Chat</span>
        </Button>
      </div>
      <nav className="flex-grow overflow-y-auto">
        <ul className="space-y-2 mt-4">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Button
                variant="ghost"
                className={`w-full justify-between px-4 py-2 ${
                  activeItem === item.name
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() =>
                  item.name === "Users"
                    ? toggleParticipants()
                    : setActiveItem(item.name)
                }
              >
                <span className="flex items-center">
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </span>
                {item.name === "Users" && (
                  <span>
                    {isParticipantsOpen ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                )}
              </Button>
              {item.name === "Users" && isParticipantsOpen && (
                <ul className="bg-gray-800 py-2">
                  {participants.map((participant, index) => (
                    <li key={index} className="px-8 py-2 hover:bg-gray-700">
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
      <div className="p-4 bg-gray-800">
        <Button variant="outline" className="w-full">
          Logout
        </Button>
      </div>
      <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
        <SheetContent
          side="right"
          className="w-[400px] sm:w-[540px] overflow-scroll bg-white text-black"
        >
          <SheetHeader className="border-b border-gray-700 pb-4 mb-4">
            <SheetTitle className="text-white">Chat</SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsChatOpen(false)}
              className="absolute top-4 right-4 hover:bg-gray-800"
            >
              <FaTimes className="h-5 w-5" />
              <span className="sr-only">Close Chat</span>
            </Button>
          </SheetHeader>
          <div className="flex-grow overflow-hidden">
            <Chat messages={messages} sendMessage={sendMessage} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Sidebar;
