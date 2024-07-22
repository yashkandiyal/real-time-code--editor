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
  FaMicrophone,
  FaMicrophoneSlash,
  FaSmile,
  FaExclamationCircle,
  FaUserFriends,
  FaCommentAlt,
  FaEllipsisV,
} from "react-icons/fa";
import { MdOutlineCallEnd, MdCoPresent } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import "./Footer.css";

interface FooterProps {
  leaveRoom: () => void;
  roomId: string;
  username: string; // Added username prop
}

interface Emoji {
  emoji: string;
  x: number;
  id: string;
  username: string; // Added username field
}

const Footer: React.FC<FooterProps> = ({ leaveRoom, roomId, username }) => {
  const [micOn, setMicOn] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [micError, setMicError] = useState(false);
  const [micAccessRequested, setMicAccessRequested] = useState(false);
  const [lastEmojiTime, setLastEmojiTime] = useState<number>(0); // State for managing delay

  const emojiIdRef = useRef(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
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
    setMicOn(prevMicOn => !prevMicOn);
  };


  const handleLeave = () => {
    setShowDialog(true);
  };

  const handleEmojiClick = (emoji: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const currentTime = Date.now();
    if (currentTime - lastEmojiTime > 1000) { // 1 second delay
      const x = event.clientX;
      const newEmoji: Emoji = {
        emoji,
        x,
        id: `emoji-${emojiIdRef.current++}`,
        username, // Include username
      };

      setEmojis((prev) => [...prev, newEmoji]);
      setLastEmojiTime(currentTime); // Update last emoji click time

      setTimeout(() => {
        setEmojis((prev) => prev.filter((e) => e.id !== newEmoji.id));
      }, 3000);
    }
  };

  return (
    <>
      <motion.footer 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-[#202124] py-4 px-6 flex items-center justify-between bottom-0 left-0 right-0 z-50 shadow-lg"
      >
        <div className="flex items-center space-x-1 text-gray-400 text-lg">
          <span>{currentTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false })}</span>
          <span>|</span>
          <span>{roomId}</span>
        </div>
        <div className="flex items-center space-x-4 justify-center flex-grow">
          <ControlButton icon={micOn ? FaMicrophone : FaMicrophoneSlash} onClick={toggleMic} error={micError} />
          <ControlButton icon={MdCoPresent} onClick={() => {}} />
          <EmojiButton onEmojiClick={handleEmojiClick} />
          <ControlButton icon={FaUserFriends} onClick={() => {}} />
          <ControlButton icon={FaCommentAlt} onClick={() => {}} />
          <ControlButton icon={FaEllipsisV} onClick={() => {}} />
          <Button 
            variant="destructive" 
            size="icon" 
            className="bg-red-600 hover:bg-red-700 text-white rounded-full"
            onClick={handleLeave}
            style={{ width: '56px', height: '56px', padding: '0' }}
          >
            <MdOutlineCallEnd className="w-6 h-6" />
          </Button>
        </div>
        <div className="w-[56px]"></div> {/* Spacer to balance the layout */}
      </motion.footer>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogTrigger />
        <DialogContent>
          <DialogTitle>Confirm Leave</DialogTitle>
          <DialogDescription>Are you sure you want to leave the meeting?</DialogDescription>
          <DialogFooter>
            <Button onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={leaveRoom}>Leave</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AnimatePresence>
        {emojis.map((e) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: -100 }} // Faster movement
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }} // Shorter duration
            style={{ position: 'fixed', left: e.x, bottom: '120px' }}
            className="pointer-events-none flex flex-col items-center"
          >
            <span className="text-4xl">{e.emoji}</span>
            <span className="text-md text-black-100">{e.username}</span> {/* Improved visibility */}
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
};

interface ControlButtonProps {
  icon: React.ElementType;
  onClick: () => void;
  error?: boolean;
}

const ControlButton: React.FC<ControlButtonProps> = ({ icon: Icon, onClick, error }) => (
  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
    <Button 
      variant="ghost" 
      size="icon" 
      className="text-white bg-[#3c4043] hover:bg-[#4a4d51] rounded-full"
      onClick={onClick}
      style={{ width: '56px', height: '56px', padding: '0' }}
    >
      <Icon className="w-6 h-6" />
      {error && <FaExclamationCircle className="text-red-600 absolute top-0 right-0 text-sm" />}
    </Button>
  </motion.div>
);

interface EmojiButtonProps {
  onEmojiClick: (emoji: string, event: React.MouseEvent<HTMLButtonElement>) => void;
}

const EmojiButton: React.FC<EmojiButtonProps> = ({ onEmojiClick }) => (
  <div className="relative group">
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-white bg-[#3c4043] hover:bg-[#4a4d51] rounded-full"
        style={{ width: '56px', height: '56px', padding: '0' }}
      >
        <FaSmile className="w-6 h-6" />
      </Button>
    </motion.div>
    <div className="absolute left-1/2 bottom-full mb-2 w-auto bg-[#3c4043] text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1/2 p-2 flex">
      {["❤️", "👍", "🎉", "👏", "😂", "😭", "😮", "😢", "🤔", "👎"].map((emoji) => (
        <motion.button
          key={emoji}
          className="text-2xl m-1 hover:bg-[#4a4d51] rounded p-1"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => onEmojiClick(emoji, event)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
        >
          {emoji}
        </motion.button>
      ))}
    </div>
  </div>
);

export default Footer;