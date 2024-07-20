import { useState, useEffect } from "react";
import { Button } from "../../shadcn/components/ui/button";
import { FaMicrophone, FaPlus, FaCheck, FaTimes } from "react-icons/fa";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../shadcn/components/ui/avatar";

import Notification from "./Notification";

interface ParticipantsProps {
  participants: string[];
  isAuthor: boolean;
  joinRequests: string[];
  handleApprove: (username: string) => void;
  handleReject: (username: string) => void;
  handleRemove: (username: string) => void;
}

const ParticipantsComponent = ({ username }: { username: string }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder-user.jpg" />
          <AvatarFallback>{username[0]}</AvatarFallback>
        </Avatar>
        <div className="text-sm">{username}</div>
      </div>
      <Button variant="ghost" size="icon">
        <FaMicrophone className="h-4 w-4" />
        <span className="sr-only">Mute/Unmute</span>
      </Button>
    </div>
  );
};

const Sidebar = ({
  participants,
  isAuthor,
  joinRequests,
  handleApprove,
  handleReject,
  handleRemove,
}: ParticipantsProps) => {
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthor && joinRequests.length > 0) {
      setNotification(joinRequests[joinRequests.length - 1]);
    }
  }, [isAuthor, joinRequests]);

  const handleNotificationApprove = () => {
    if (notification) {
      handleApprove(notification);
      setNotification(null);
    }
  };

  const handleNotificationReject = () => {
    if (notification) {
      handleReject(notification);
      setNotification(null);
    }
  };

  // Remove duplicates from participants array
  const uniqueParticipants = Array.from(new Set(participants));

  return (
    <div>
      <div className="w-72 border-l border-muted p-6 relative hidden sm:block">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">
              Participants ({uniqueParticipants.length})
            </div>
            {isAuthor && (
              <Button variant="ghost" size="icon">
                <FaPlus className="h-4 w-4" />
                <span className="sr-only">Add participant</span>
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {uniqueParticipants.map((item: string, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <ParticipantsComponent username={item} />
                {isAuthor && index !== 0 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemove(item)}
                    className="ml-2"
                  >
                    <FaTimes className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                )}
              </div>
            ))}
          </div>
          {isAuthor && joinRequests.length > 0 && (
            <div className="mt-6">
              <div className="text-sm font-medium">
                Join Requests ({joinRequests.length})
              </div>
              <div className="flex flex-col gap-2 mt-2">
                {joinRequests.map((request, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>{request[0]}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm">{request}</div>
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleApprove(request)}
                        className="ml-2"
                      >
                        <FaCheck className="h-4 w-4" />
                        <span className="sr-only">Approve</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleReject(request)}
                        className="ml-2"
                      >
                        <FaTimes className="h-4 w-4" />
                        <span className="sr-only">Reject</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* ... (mobile view remains unchanged) */}
      {isAuthor && notification && (
        <Notification
          username={notification}
          onApprove={handleNotificationApprove}
          onReject={handleNotificationReject}
        />
      )}
    </div>
  );
};

export default Sidebar;
