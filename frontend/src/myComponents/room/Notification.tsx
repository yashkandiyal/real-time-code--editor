import { Button } from "../../shadcn/components/ui/button";
import { Card, CardContent, CardFooter } from "../../shadcn/components/ui/card";
import { Avatar, AvatarFallback } from "../../shadcn/components/ui/avatar";
import { FaCheck, FaTimes } from "react-icons/fa";

interface NotificationProps {
  username: string;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void; // Added to close the notification
}

const Notification = ({ username, onApprove, onReject, onClose }: NotificationProps) => {
  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 max-w-sm w-full sm:w-96 z-50">
      <Card className="shadow-lg backdrop-blur-md bg-white/30 border border-white/20">
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            <Avatar className="h-10 w-10 bg-blue-500">
              <AvatarFallback className="dark:text-white text-black">
                {username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">Join Request</h4>
              <p className="text-sm text-muted-foreground">
                <strong className="font-semibold">{username}</strong> wants to
                join the room.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 bg-white/30 p-4 border-t border-white/20">
          <Button
            onClick={() => {
              onReject();
              onClose();
            }}
            variant="outline"
            className="text-destructive hover:bg-destructive/10"
          >
            <FaTimes className="mr-2 h-4 w-4" />
            Reject
          </Button>
          <Button
            onClick={() => {
              onApprove();
              onClose();
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            <FaCheck className="mr-2 h-4 w-4" />
            Approve
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Notification;
