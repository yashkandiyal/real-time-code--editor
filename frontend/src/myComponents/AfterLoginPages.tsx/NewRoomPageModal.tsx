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
import { nanoid } from "nanoid";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const NewRoomPageModal = () => {
  const [roomId, setRoomId] = useState<string | null>("");
  const [username, setUsername] = useState<string | null>("");
  const navigate = useNavigate();
  //This function is used to generate unique room id
  const generateRoomId = () => {
    setRoomId(nanoid());
  };
  const navigateToRoom = () => {
    if (!roomId || !username) {
      toast.error("Please enter room id and username");
      return;
    } else {
      navigate(`/room/${roomId}`,{
        state:{
          username
        }
      });
    }
  };
  const EnterKey=(event:any)=>{
    if(event.key=="Enter"){
      navigateToRoom();
    }
  }
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Dialog>
        <DialogTrigger asChild>
          <Button>Create new room</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] p-6 text-black dark:text-white">
          <DialogHeader>
            <DialogTitle>Create your new room</DialogTitle>
            <DialogDescription>
              Click on generate to create a new room Id.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-black dark:text-white">
            <div className="grid grid-cols-1 gap-4">
              <Label htmlFor="roomId">Room Id</Label>
              <Input id="roomId" placeholder="Enter Room Id" value={roomId!} />
            </div>
            <Button onClick={generateRoomId}>Generate Unique Room ID</Button>
            <div className="grid grid-cols-1 gap-4 text-black dark:text-white">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username!}
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
