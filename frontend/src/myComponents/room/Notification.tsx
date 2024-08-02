import { useEffect } from "react";
import { Button } from "../../shadcn/components/ui/button";
import { Card, CardContent, CardFooter } from "../../shadcn/components/ui/card";
import { Avatar, AvatarFallback } from "../../shadcn/components/ui/avatar";
import { FaCheck, FaTimes } from "react-icons/fa";

interface NotificationProps {
  username: string;
  email: string;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
  show: boolean;
}

const Notification = ({
  username,
  email,
  onApprove,
  onReject,
  onClose,
  show,
}: NotificationProps) => {
  useEffect(() => {
    if (show) {
      const audio = new Audio("/join.mp3");
      audio
        .play()
        .catch((error) => console.error("Error playing audio:", error));
    }
  }, [show]);

  if (!show) return null;

  return (
    <Card className="shadow-lg backdrop-blur-md bg-white/30 border border-white/20 rounded-lg overflow-hidden">
      <CardContent className="p-4 flex items-start space-x-4">
        <Avatar className="h-12 w-12 bg-blue-500">
          <AvatarFallback className="dark:text-white text-black">
            {username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">Join Request</h4>
          <p className="text-sm text-muted-foreground">
            <strong className="font-semibold">{username}</strong> ({email})
            wants to join the room.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 bg-white/30 p-4 border-t border-white/20">
        <Button
          onClick={() => {
            onReject();
            onClose();
          }}
          variant="outline"
          className="text-red-600 hover:bg-red-100"
        >
          <FaTimes className="mr-2 h-4 w-4" />
          Reject
        </Button>
        <Button
          onClick={() => {
            onApprove();
            onClose();
          }}
          className="bg-green-600 text-white hover:bg-green-700"
        >
          <FaCheck className="mr-2 h-4 w-4" />
          Approve
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Notification;
