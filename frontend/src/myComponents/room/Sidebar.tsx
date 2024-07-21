import { useState, useEffect, useRef } from "react";
import { Button } from "../../shadcn/components/ui/button";
import { FaMicrophone, FaPlus, FaCheck, FaTimes } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "../../shadcn/components/ui/avatar";
import Notification from "./Notification";

interface ParticipantsProps {
  participants: string[];
  isAuthor: boolean;
  joinRequests: string[];
  handleApprove: (username: string) => void;
  handleReject: (username: string) => void;
  handleRemove: (username: string) => void;
  handleInvite: (email: string) => void;
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

const InviteModal = ({ isOpen, onClose, onInvite }: { isOpen: boolean; onClose: () => void; onInvite: (email: string) => void; }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onInvite(email);
      setEmail("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-lg font-semibold mb-4">Invite Participant</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button type="submit">Invite</Button>
          </div>
        </form>
      </div>
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
  handleInvite,
}: ParticipantsProps) => {
  const [notification, setNotification] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setLocalStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    };
    getUserMedia();
  }, []);

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
    <div className="relative flex flex-col h-screen bg-white"> {/* Change to your page's background color */}
      <div className="flex flex-col flex-1 bg-white"> {/* Ensure this matches the upper half */}
        <div className="w-72 border-r border-muted p-6 flex flex-col bg-white"> {/* Ensure this matches the upper half */}
          {/* Join Requests Section */}
          {isAuthor && joinRequests.length > 0 && (
            <div className="mb-6">
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

          {/* Participants List */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium">
              Participants ({uniqueParticipants.length})
            </div>
            {isAuthor && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(true)}
              >
                <FaPlus className="h-4 w-4" />
                <span className="sr-only">Add participant</span>
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-2 flex-1 overflow-auto">
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
        </div>
        <div className="flex-1 bg-white relative"> {/* Ensure this matches the upper half */}
          {localStream && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full max-w-xs bg-black border-4 border-gradient-to-r from-blue-500 to-purple-500 rounded-lg overflow-hidden shadow-lg">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  playsInline
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {notification && (
        <div className="fixed inset-x-0 top-4 flex justify-center">
          <Notification
            username={notification}
            onApprove={handleNotificationApprove}
            onReject={handleNotificationReject}
          />
        </div>
      )}
      <InviteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInvite={(email) => {
          handleInvite(email);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default Sidebar;
