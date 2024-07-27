import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Chat from "./chat";
import ParticipantsSidebar from "./ParticipantsSidebar";

interface SidebarProps {
  participants: string[];
  isAuthor: boolean;
  handleRemove: (username: string) => void;
  handleInvite: () => void;
  messages: any; // Replace 'any' with your message type
  sendMessage: (message: string) => void;
  currentUser: string;
  sidebarType: "participants" | "messages" | "none";
  toggleSidebar: (type: "participants" | "messages"|"none") => void;
}

const Sidebar = ({
  participants,
  isAuthor,
  handleRemove,
  currentUser,
  sidebarType,
  messages,
  sendMessage,
  toggleSidebar
  
}: SidebarProps) => {
  const [isScreenMobile, setIsScreenMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsScreenMobile(true);
      } else {
        setIsScreenMobile(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (sidebarType === "none") return null;

  return (
    <motion.div
      initial={{ x: isScreenMobile ? 0 : "100%" }}
      animate={{ x: 0 }}
      exit={{ x: isScreenMobile ? 0 : "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`px-4 ${
        isScreenMobile
          ? "w-full min-w-full fixed top-0 bottom-0 right-0  py-6 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-transform duration-300 ease-in-out"
          : "w-full max-w-xs"
      }`}
    >
      <div className="flex flex-col h-full">
        {sidebarType === "participants" ? (
          <ParticipantsSidebar
            participants={participants}
            isAuthor={isAuthor}
            handleRemove={handleRemove}
            currentUser={currentUser}
          />
        ) : (
          <Chat
            messages={messages}
            sendMessage={sendMessage}
            currentUser={currentUser}
            isAuthor={isAuthor}
            toggleMessagePermissions={() => {}}
            sidebarType={sidebarType}
            toggleSidebar={toggleSidebar}
          />
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;
