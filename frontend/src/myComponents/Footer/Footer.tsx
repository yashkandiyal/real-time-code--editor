import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../shadcn/components/ui/dialog";
import { Button } from "../../shadcn/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../shadcn/components/ui/dropdown-menu";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaSmile,
  FaExclamationCircle,
  FaUserFriends,
  FaEllipsisV,
} from "react-icons/fa";
import { MdOutlineCallEnd } from "react-icons/md";
import { IoHandRightOutline, IoChatbox } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import "./Footer.css";

interface FooterProps {
  leaveRoom: () => void;
  roomId: string;
  username: string;
  toggleSidebar: (type: "participants" | "messages") => void;
  sidebarType: "participants" | "messages" | "none";
}

interface Emoji {
  emoji: string;
  x: number;
  id: string;
  username: string;
}

const Footer: React.FC<FooterProps> = ({
  leaveRoom,
  roomId,
  username,
  toggleSidebar,
  sidebarType,
}) => {
  const [micOn, setMicOn] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [micError, setMicError] = useState(false);
  const [micAccessRequested, setMicAccessRequested] = useState(false);
  const [lastEmojiTime, setLastEmojiTime] = useState<number>(0);
  const [handRaised, setHandRaised] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const emojiIdRef = useRef(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setShowDropdown(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const requestMicAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicError(false);
    } catch (err) {
      console.error("Microphone access denied:", err);
      setMicError(true);
    }
  };

  const toggleMic = async () => {
    if (!micAccessRequested) {
      setMicAccessRequested(true);
      await requestMicAccess();
    }
    setMicOn((prevMicOn) => !prevMicOn);
  };

  const handleLeave = () => {
    setShowDialog(true);
  };

  const handleEmojiClick = (
    emoji: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const currentTime = Date.now();
    if (currentTime - lastEmojiTime > 1000) {
      const x = event.clientX;
      const newEmoji: Emoji = {
        emoji,
        x,
        id: `emoji-${emojiIdRef.current++}`,
        username,
      };

      setEmojis((prev) => [...prev, newEmoji]);
      setLastEmojiTime(currentTime);

      setTimeout(() => {
        setEmojis((prev) => prev.filter((e) => e.id !== newEmoji.id));
      }, 3000);
    }
  };

  const toggleHandRaise = () => {
    setHandRaised((prev) => !prev);
    if (!handRaised) {
      const audio = new Audio("/path/to/notification-sound.mp3");
      audio.play();
    }
  };

  return (
    <>
      <motion.footer
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-gray-800 py-2 px-6 flex items-center justify-between fixed bottom-0 left-0 right-0 z-50 shadow-lg"
      >
        <div
          className={`flex items-center space-x-1 text-gray-400 text-lg ${
            showDropdown ? "hidden md:flex" : ""
          }`}
        >
          <span>
            {currentTime.toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </span>
          <span>|</span>
          <span>{roomId}</span>
        </div>
        <div className="flex items-center space-x-4 md:pr-36 justify-center flex-grow">
          {windowWidth > 768 && (
            <ControlButton
              icon={FaSmile}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                handleEmojiClick("😊", e)
              }
            />
          )}
          {windowWidth > 500 && (
            <ControlButton
              icon={IoHandRightOutline}
              onClick={toggleHandRaise}
              active={handRaised}
            />
          )}
          <ControlButton
            icon={micOn ? FaMicrophone : FaMicrophoneSlash}
            onClick={toggleMic}
            error={micError}
          />
          <ControlButton
            icon={FaUserFriends}
            onClick={() => toggleSidebar("participants")}
            active={sidebarType === "participants"}
          />
          <ControlButton
            icon={IoChatbox}
            onClick={() => toggleSidebar("messages")}
            active={sidebarType === "messages"}
          />
          {showDropdown && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <FaEllipsisV className="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-gray-800 border border-gray-600"
              >
                {windowWidth <= 768 && (
                  <DropdownMenuItem
                    onClick={(e: any) => handleEmojiClick("😊", e)}
                  >
                    <FaSmile className="w-6 h-6 mr-2" />
                    Emoji
                  </DropdownMenuItem>
                )}
                {windowWidth <= 500 && (
                  <DropdownMenuItem onClick={toggleHandRaise}>
                    <IoHandRightOutline className="w-6 h-6 mr-2" />
                    {handRaised ? "Lower Hand" : "Raise Hand"}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button
            variant="destructive"
            size="icon"
            className="bg-red-600 hover:bg-red-700 text-white rounded-full"
            onClick={handleLeave}
            style={{ width: "56px", height: "56px", padding: "0" }}
          >
            <MdOutlineCallEnd className="w-6 h-6" />
          </Button>
        </div>
        {!showDropdown && <div className="w-[56px]"></div>}
      </motion.footer>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogTrigger />
        <DialogContent className="max-w-lg sm:max-w-xl bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8 md:p-10">
          <DialogTitle className="text-2xl font-semibold text-red-600 dark:text-red-400">
            Confirm Leave
          </DialogTitle>
          <DialogDescription className="mt-4 text-base text-gray-600 dark:text-gray-400">
            Are you sure you want to leave the meeting?
          </DialogDescription>
          <DialogFooter className="mt-8 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={leaveRoom}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-600"
            >
              Leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {emojis.map((e) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: -100 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{ position: "fixed", left: e.x, bottom: "120px" }}
            className="pointer-events-none flex flex-col items-center"
          >
            <span className="text-4xl">{e.emoji}</span>
            <span className="text-md text-black-100">{e.username}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
};

const ControlButton: React.FC<{
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  active?: boolean;
  error?: boolean;
}> = ({ icon: Icon, onClick, active = false, error = false }) => (
  <Button
    onClick={onClick}
    size="icon"
    className={`relative ${
      error ? "bg-red-600" : active ? "bg-green-600" : "bg-gray-700"
    } hover:bg-gray-600 text-white`}
  >
    <Icon className="w-6 h-6" />
    {error && (
      <FaExclamationCircle className="absolute top-0 right-0 w-4 h-4 text-red-500" />
    )}
  </Button>
);

export default Footer;
