import toast from "react-hot-toast";
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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socketService from "../../services/SocketService";

interface ExistingRoomPageModalProps {
  isUserLoggedIn: boolean;
  children?: React.ReactNode;
  className?: string;
}

const ExistingRoomPageModal = ({
  isUserLoggedIn,
}: ExistingRoomPageModalProps) => {
  const [roomId, setRoomId] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure the socket is connected
    if (username) {
      socketService.connect(username, false);
    }
    // Clean up socket connection on component unmount
    return () => {
      socketService.disconnect();
    };
  }, [username, roomId]);

  const navigateToRoom = () => {
    if (!roomId || !username) {
      toast.error("Please enter room ID and username");
      return;
    }

    // Set up the event listener for room status
    socketService.on(
      "roomStatus",
      ({ roomExists }: { roomExists: boolean }) => {
        console.log("Room status:", roomExists);
        if (!roomExists) {
          toast.error("Room does not exist.");
        } else {
          // Emit joinRoom event after confirming the room exists
          socketService.emit("joinRoom", { roomId, username, isAuthor: false });

          navigate(`/room/${roomId}`, {
            state: {
              username,
              roomId,
              isAuthorr: false,
            },
          });
        }

        // Clean up event listener after response
        socketService.off("roomStatus");
      }
    );

    // Emit the RoomExists event to check if the room exists
    socketService.emit("RoomExists", { roomId });
  };

  const navigateUserToLogin = () => {
    if (!isUserLoggedIn) {
      navigate("/login");
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            onClick={navigateUserToLogin}
            className="bg-green-500 hover:bg-green-700 text-white text-xl sm:text-2xl px-4 py-6 rounded-lg"
          >
            Join an existing Room
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] text-black dark:text-white">
          <DialogHeader>
            <DialogTitle>Join a room</DialogTitle>
            <DialogDescription>
              Enter your Room ID and Username to start collaborating with
              others.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-black dark:text-white">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Room ID
              </Label>
              <Input
                id="name"
                placeholder="Enter Room ID"
                className="col-span-3"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 text-black dark:text-white">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                placeholder="Enter your Username"
                className="col-span-3"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={navigateToRoom}>
              Join
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExistingRoomPageModal;
