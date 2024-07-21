import { useState, useEffect, useRef, MouseEvent } from "react";
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
  FaVideo,
  FaVideoSlash,
  FaSmile,
  FaExclamationCircle,
} from "react-icons/fa";
import { MdOutlineCallEnd } from "react-icons/md";
import "./Footer.css";

interface FooterProps {
  leaveRoom: () => void;
}

interface Emoji {
  emoji: string;
  x: number;
  y: number;
  id: string;
}

const Footer = ({ leaveRoom }: FooterProps) => {
  const [micOn, setMicOn] = useState(false);
  const [videoOn, setVideoOn] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [micError, setMicError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [micAccessRequested, setMicAccessRequested] = useState(false);
  const [videoAccessRequested, setVideoAccessRequested] = useState(false);

  const emojiIdRef = useRef(0);
  const videoStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoStreamRef.current = stream;
        if (!videoOn) {
          stream.getTracks().forEach(track => track.stop());
        }
      } catch (error) {
        console.error("Error accessing media devices.", error);
        setVideoError(true);
      }
    };
    if (videoAccessRequested) {
      getUserMedia();
    }
  }, [videoAccessRequested, videoOn]);

  const requestMicAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicError(false);
    } catch (err) {
      console.error("Microphone access denied:", err);
      setMicError(true);
    }
  };

  const requestVideoAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoError(false);
    } catch (err) {
      console.error("Camera access denied:", err);
      setVideoError(true);
    }
  };

  const toggleMic = async () => {
    if (!micAccessRequested) {
      setMicAccessRequested(true);
      await requestMicAccess();
    }
    setMicOn(prevMicOn => !prevMicOn);
  };

  const toggleVideo = async () => {
    if (!videoAccessRequested) {
      setVideoAccessRequested(true);
      await requestVideoAccess();
    }
    setVideoOn(prevVideoOn => {
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach(track => track.stop());
      }
      return !prevVideoOn;
    });
  };

  const handleLeave = () => {
    setShowDialog(true);
  };

  const handleEmojiClick = (emoji: string, event: MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;
    const newEmoji: Emoji = {
      emoji,
      x,
      y,
      id: `emoji-${emojiIdRef.current++}`,
    };

    setEmojis((prev) => [...prev, newEmoji]);

    setTimeout(() => {
      setEmojis((prev) => prev.filter((e) => e.id !== newEmoji.id));
    }, 2500);
  };

  return (
    <footer className="bg-[#2C2C2C] p-4 flex flex-col md:flex-row items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className="text-white text-sm">
          {dateTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </span>
        <span className="text-white text-sm">|</span>
        <span className="text-white text-sm">
          {dateTime.toLocaleDateString("en-GB", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
      </div>
      <div className="flex items-center space-x-2 mt-4 md:mt-0 justify-center w-full">
        <Button variant="ghost" size="icon" className="text-white" onClick={toggleMic}>
          {micOn ? <FaMicrophone className="w-6 h-6" /> : <FaMicrophoneSlash className="w-6 h-6" />}
          {micError && <FaExclamationCircle className="text-red-600 ml-1" />}
        </Button>
        <Button variant="ghost" size="icon" className="text-white" onClick={toggleVideo}>
          {videoOn ? <FaVideo className="w-6 h-6" /> : <FaVideoSlash className="w-6 h-6" />}
          {videoError && <FaExclamationCircle className="text-red-600 ml-1" />}
        </Button>
        <div className="relative group">
          <Button variant="ghost" size="icon" className="text-white">
            <FaSmile className="w-6 h-6" />
          </Button>
          <div className="absolute left-0 bottom-full mb-2 w-40 bg-white text-black rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex flex-wrap p-2">
              {["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣"].map((emoji) => (
                <button key={emoji} className="text-xl m-1" onClick={(event) => handleEmojiClick(emoji, event)}>
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
        <Button variant="destructive" size="icon" className="text-red-600" onClick={handleLeave}>
          <MdOutlineCallEnd className="w-6 h-6" />
        </Button>
      </div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogTrigger />
        <DialogContent>
          <DialogTitle>Confirm Leave</DialogTitle>
          <DialogDescription>Are you sure you want to leave the meeting?</DialogDescription>
          <DialogFooter>
            <Button onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={leaveRoom}>
              Leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {emojis.map((e) => (
        <div key={e.id} className="animate-emoji" style={{ left: e.x, top: e.y }}>
          <span className="text-4xl">{e.emoji}</span>
        </div>
      ))}
    </footer>
  );
};

export default Footer;
