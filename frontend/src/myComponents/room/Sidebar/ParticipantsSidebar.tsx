import React, { useState } from "react";
import { Button } from "../../../shadcn/components/ui/button";
import { FaMicrophone, FaMicrophoneSlash, FaTimes } from "react-icons/fa";
import { Avatar, AvatarFallback } from "../../../shadcn/components/ui/avatar";
import RemoveUserModal from "./RemoveUserModal";

interface Participant {
  username: string;
  email: string;
}

interface SidebarProps {
  participants: Participant[];
  isAuthor: boolean;
  handleRemove: (username: string) => void;
  currentUser: string;
}

const ParticipantsSidebar: React.FC<SidebarProps> = ({
  participants,
  isAuthor,
  handleRemove,
  currentUser,
}) => {
  const [micStates, setMicStates] = useState<Record<string, boolean>>(
    Object.fromEntries(
      participants.map((participant) => [participant.username, true])
    )
  );
  const [showRemoveUserModal, setShowRemoveUserModal] =
    useState<boolean>(false);
  const [removeUserDetails, setRemoveUserDetails] =
    useState<Participant | null>(null);

  const toggleMic = (username: string) => {
    setMicStates((prev) => ({ ...prev, [username]: !prev[username] }));
  };

  const toggleRemoveUserModal = (
    removeUser: string,
    removeUserEmail: string
  ) => {
    setRemoveUserDetails({ username: removeUser, email: removeUserEmail });
    setShowRemoveUserModal((prev) => !prev);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 h-full overflow-y-auto border-r border-gray-200 dark:border-gray-700 p-4">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Participants
        </h2>
        {participants.map((participant) => (
          <div
            key={participant.username}
            className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm"
          >
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200">
                  {participant.username
                    ? participant.username[0].toUpperCase()
                    : "?"}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {participant.username || "Unknown"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleMic(participant.username)}
                className="hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {micStates[participant.username] ? (
                  <FaMicrophone className="h-4 w-4 text-gray-800 dark:text-gray-200" />
                ) : (
                  <FaMicrophoneSlash className="h-4 w-4 text-gray-800 dark:text-gray-200" />
                )}
              </Button>
              {isAuthor && participant.username !== currentUser && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    toggleRemoveUserModal(
                      participant.username,
                      participant.email
                    )
                  }
                  className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
                >
                  <FaTimes className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
        {showRemoveUserModal && removeUserDetails && (
          <RemoveUserModal
            onClose={() => setShowRemoveUserModal(false)}
            currentUsername={currentUser}
            removeUserDetails={removeUserDetails}
            handleRemove={handleRemove}
          />
        )}
      </div>
    </div>
  );
};

export default ParticipantsSidebar;
