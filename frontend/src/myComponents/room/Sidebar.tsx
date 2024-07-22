import { useState } from "react";
import { Button } from "../../shadcn/components/ui/button";
import { FaPlus, FaTimes } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "../../shadcn/components/ui/avatar";

interface ParticipantsProps {
  participants: string[];
  isAuthor: boolean;
  handleRemove: (username: string) => void;
  handleInvite: (email: string) => void;
  className?: string;
}

const ParticipantsComponent = ({ username }: { username: string }) => {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg shadow-sm transition-all">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder-user.jpg" alt={`Avatar of ${username}`} />
          <AvatarFallback>{username[0]}</AvatarFallback>
        </Avatar>
        <div className="text-sm font-medium">{username}</div>
      </div>
    </div>
  );
};

const InviteModal = ({
  isOpen,
  onClose,
  onInvite,
}: {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string) => void;
}) => {
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
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md mx-2">
        <h2 className="text-lg font-semibold mb-4">Invite Participant</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
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
  handleRemove,
  handleInvite,
}: ParticipantsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const uniqueParticipants = Array.from(new Set(participants));

  return (
    <div className="relative flex flex-col h-full ">
      <div className="flex flex-col flex-1">
        <div className="w-full lg:w-72 border-r border-gray-200 p-6 flex flex-col shadow-md rounded-md h-full">
          <header className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium">
              Participants ({uniqueParticipants.length})
            </h2>
            {isAuthor && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(true)}
                className="p-2 rounded-full  focus:outline-none focus:ring-2"
              >
                <FaPlus className="h-5 w-5" />
                <span className="sr-only">Add participant</span>
              </Button>
            )}
          </header>
          <div className="flex flex-col gap-2 flex-1">
            {uniqueParticipants.map((item: string, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <ParticipantsComponent username={item} />
                {isAuthor && index !== 0 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemove(item)}
                    className="ml-2 p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    <FaTimes className="h-5 w-5 text-red-500" />
                    <span className="sr-only">Remove</span>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
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