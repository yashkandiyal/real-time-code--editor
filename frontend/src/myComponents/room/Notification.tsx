import { Button } from "../../shadcn/components/ui/button";
import { Card, CardContent, CardFooter } from "../../shadcn/components/ui/card";
import { Avatar, AvatarFallback } from "../../shadcn/components/ui/avatar";
import { FaCheck, FaTimes } from "react-icons/fa";

interface NotificationProps {
  username: string;
  onApprove: () => void;
  onReject: () => void;
}

const Notification = ({ username, onApprove, onReject }: NotificationProps) => {
  return (
    <div className="fixed bottom-4 right-4 max-w-sm w-full sm:w-96 z-50">
      <Card className="shadow-lg">
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
        <CardFooter className="flex justify-end space-x-2 bg-muted/50 p-4">
          <Button
            onClick={onReject}
            variant="outline"
            className="text-destructive hover:bg-destructive/10"
          >
            <FaTimes className="mr-2 h-4 w-4" />
            Reject
          </Button>
          <Button
            onClick={onApprove}
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
