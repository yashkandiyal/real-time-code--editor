import { Button } from "../../shadcn/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../shadcn/components/ui/dialog";
import { Input } from "../../shadcn/components/ui/input";
import { Label } from "../../shadcn/components/ui/label";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MdContentCopy } from "react-icons/md"; // Importing MdContentCopy icon
import socketService from "../../services/SocketService"; // Import socketService

interface NewRoomPageModalProps {
  isUserLoggedIn: boolean;
  children?: React.ReactNode;
  className?: string;
  currentLoggedinUsername?: string;
  userEmailAddress: string;
}

const NewRoomPageModal = ({
  isUserLoggedIn,
  currentLoggedinUsername,
  userEmailAddress,
}: NewRoomPageModalProps) => {
  const [roomId, setRoomId] = useState<string | null>("");

  const navigate = useNavigate();

  useEffect(() => {
    if (currentLoggedinUsername) {
      socketService.connect(currentLoggedinUsername!, true);
    }
    return () => {
      socketService.disconnect();
    };
  }, [currentLoggedinUsername]);

  const generateRoomId = () => {
    setRoomId(nanoid());
  };

  const copyRoomIdToClipboard = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId).then(() => {
        toast.success("Room ID copied to clipboard!");
      });
    }
  };

  const navigateToRoom = () => {
    if (!roomId || !currentLoggedinUsername) {
      toast.error("Please enter room ID and username");
      return;
    }

    socketService.emit("joinRoom", {
      roomId,
      username: currentLoggedinUsername,
      isAuthor: true,
      email: userEmailAddress,
    });

    navigate(`/room/${roomId}`, {
      state: {
        username: currentLoggedinUsername,
        authorStatus: true,
        userEmailAddress,
      },
    });
  };

  const EnterKey = (event: any) => {
    if (event.key === "Enter") {
      navigateToRoom();
    }
  };

  const navigateUserToLogin = () => {
    if (!isUserLoggedIn) {
      navigate("/login");
      return;
    }
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            onClick={navigateUserToLogin}
            className="bg-blue-500 hover:bg-blue-700 text-white text-xl sm:text-2xl px-4 py-6 rounded-lg w-full mb-4 sm:mb-0 sm:mr-4"
          >
            Create new room
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] p-6 text-black dark:text-white">
          <DialogHeader>
            <DialogTitle>Create your new room</DialogTitle>
            <DialogDescription>
              Click on generate to create a new room ID.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-black dark:text-white">
            <div className="grid grid-cols-1 gap-4">
              <Label htmlFor="roomId">Room ID</Label>
              <div className="flex items-center">
                <Input
                  id="roomId"
                  placeholder="Enter Room ID"
                  value={roomId || ""}
                  readOnly
                />
                <Button
                  variant="ghost"
                  className="ml-2"
                  onClick={copyRoomIdToClipboard}
                >
                  <MdContentCopy className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <Button onClick={generateRoomId}>Generate Unique Room ID</Button>
            <div className="grid grid-cols-1 gap-4 text-black dark:text-white">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={currentLoggedinUsername}
                placeholder="Enter your Username"
                onKeyUp={EnterKey}
              />
            </div>
          </div>
          <DialogFooter className="flex justify-end">
            <Button type="submit" onClick={navigateToRoom}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewRoomPageModal;
