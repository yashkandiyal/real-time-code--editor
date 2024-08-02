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
  currentLoggedinUsername?: string;
  userEmailAddress: string;
}

const ExistingRoomPageModal = ({
  isUserLoggedIn,
  currentLoggedinUsername,
  userEmailAddress,
}: ExistingRoomPageModalProps) => {
  const [roomId, setRoomId] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    // Ensure the socket is connected
    if (currentLoggedinUsername) {
      socketService.connect(currentLoggedinUsername, false);
    }
    // Clean up socket connection on component unmount
    return () => {
      socketService.disconnect();
    };
  }, [currentLoggedinUsername]);

  const navigateToRoom = () => {
    if (!roomId || !currentLoggedinUsername) {
      toast.error("Please enter room ID and username");
      return;
    }

    // Emit the RoomExists event to check if the room exists
    socketService.emit("RoomExists", { roomId });

    // Set up the event listener for room status
    socketService.once(
      "roomStatus",
      ({ roomExists }: { roomExists: boolean }) => {
        if (!roomExists) {
          toast.error("Room does not exist.");
          return;
        }

        // Emit the usersInRoom event
        socketService.emit("usersInRoom", { roomId });

        // check if the email is already in use in the room
        socketService.on(
          "emailInUse",
          ({ isAlreadyInUse }: { isAlreadyInUse: boolean }) => {
            if (isAlreadyInUse) {
              toast.error(
                "Email is already in use in the room.Please try again with a different email."
              );
              return;
            }
          }
        );

        // Handle the currentUsersInRoom event
     

        // Emit checkBlockedStatus event before joining the room
        socketService.emit("checkBlockedStatus", {
          roomId,
          email: userEmailAddress,
        });

        // Set up the event listener for blocked status
        socketService.once(
          "blockedStatus",
          ({ isBlocked }: { isBlocked: boolean }) => {
            if (isBlocked) {
              toast.error("You are not allowed to join this room");
              return;
            }

            // Emit joinRoom event after confirming the user is not blocked
            socketService.emit("joinRoom", {
              roomId,
              username: currentLoggedinUsername,
              isAuthor: false,
              email: userEmailAddress,
            });

            socketService.off("currentUsersInRoom");
            socketService.off("emailInUse");

            // Redirect if not blocked
            navigate(`/room/${roomId}`, {
              state: {
                username: currentLoggedinUsername,
                roomId,
                authorStatus: false,
                userEmailAddress,
              },
            });
          }
        );
      }
    );
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
            className="bg-green-500 hover:bg-green-700 text-white text-xl sm:text-2xl px-4 py-6 rounded-lg w-full"
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
                value={currentLoggedinUsername}
                readOnly
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
