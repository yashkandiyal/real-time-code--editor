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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
interface ExistingRoomPageModalProps {
  isUserLoggedIn: boolean;
  children?: React.ReactNode;
}
const ExistingRoomPageModal = ({isUserLoggedIn}:ExistingRoomPageModalProps) => {
  const [roomId, setRoomId] = useState<string | null>("");
  const [username, setUsername] = useState<string | null>("");
  const navigate = useNavigate();
  const navigateToRoom = () => {
    if (!roomId || !username) {
      toast.error("Please enter room id and username");
      return;
    } else {
      navigate(`/room/${roomId}`, {
        state: {
          username,
          roomId
        },
      });
    }
  };
  //here we will check that if the user is not logged in then we will redirect the user to the login page
  const navigateUserToLogin= () => {
    if (!isUserLoggedIn) {
      navigate("/login");
      return;
    }
  }
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button onClick={navigateUserToLogin} >Join an existing Room</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]  text-black dark:text-white">
          <DialogHeader>
            <DialogTitle>Join a room</DialogTitle>
            <DialogDescription>
              Enter your Room Id and Username to start collaborating with
              others.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-black dark:text-white">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                RoomId
              </Label>
              <Input
                id="name"
                placeholder="Enter Room Id"
                className="col-span-3"
                value={roomId!}
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
                value={username!}
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
