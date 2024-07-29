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
import { useUser } from "@clerk/clerk-react";

interface NewRoomPageModalProps {
  isUserLoggedIn: boolean;
  children?: React.ReactNode;
  className?: string;
}

const NewRoomPageModal = ({ isUserLoggedIn }: NewRoomPageModalProps) => {
  const [roomId, setRoomId] = useState<string | null>("");
  const [username, setUsername] = useState<string | null>("");
  const navigate = useNavigate();
  const { user } = useUser();
  const userEmailAddress = user?.emailAddresses[0].emailAddress;

  useEffect(() => {
    if (username) {
      socketService.connect(username, true);
    }
    return () => {
      socketService.disconnect();
    };
  }, [username]);

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
    if (!roomId || !username) {
      toast.error("Please enter room ID and username");
      return;
    }

    socketService.emit("joinRoom", { roomId, username, isAuthor: true });

    navigate(`/room/${roomId}`, {
      state: {
        username,
        isAuthorr: true,
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
            className="bg-blue-500 hover:bg-blue-700 text-white text-xl sm:text-2xl px-4 py-6 rounded-lg"
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
                value={username || ""}
                placeholder="Enter your Username"
                onChange={(e) => setUsername(e.target.value)}
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
