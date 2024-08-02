import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../shadcn/components/ui/dialog";
import { Checkbox } from "../../../shadcn/components/ui/checkbox";
import { Button } from "../../../shadcn/components/ui/button";
import socketService from "../../../services/SocketService";
import { useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

interface RemoveUserModalProps {
  onClose: () => void;
  currentUsername: string;
  removeUserDetails: { username: string; email: string };
  handleRemove: (removeUser: string) => void;
}

const RemoveUserModal: React.FC<RemoveUserModalProps> = ({
  onClose,
  currentUsername,
  removeUserDetails,
  handleRemove,
}) => {
  const [blockUser, setBlockUser] = useState<boolean>(false);
  const location = useLocation();
  const roomId = location.pathname.split("/")[2];

  useEffect(() => {
    if (!currentUsername) {
      socketService.connect(currentUsername, true);
    }
  }, [currentUsername]);

  useEffect(() => {
    const handleUserBlocked = ({ email }: { email: string }) => {
      toast.error(`User ${email} has been blocked`);
    };

    const handleUserAlreadyBlocked = ({ email }: { email: string }) => {
      toast.error(`User ${email} is already blocked`);
    };

    socketService.on("userBlocked", handleUserBlocked);
    socketService.on("userAlreadyBlocked", handleUserAlreadyBlocked);

    return () => {
      socketService.off("userBlocked", handleUserBlocked);
      socketService.off("userAlreadyBlocked", handleUserAlreadyBlocked);
    };
  }, [roomId, currentUsername]);

  const handleBlockUserAndRemove = () => {
    if (blockUser) {
      socketService.emit("blockUser", {
        roomId,
        email: removeUserDetails.email,
      });
    }
    handleRemove(removeUserDetails.username);
    onClose();
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 md:p-8">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Remove User
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Are you sure you want to remove this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <Checkbox
              id="block-user"
              checked={blockUser}
              onCheckedChange={(checked) => setBlockUser(checked as boolean)}
              className="text-blue-600 dark:text-blue-400"
            />
            <label
              htmlFor="block-user"
              className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Block user
            </label>
          </div>
          <DialogFooter className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBlockUserAndRemove}
              className="bg-red-600 dark:bg-red-700 text-white"
            >
              Remove User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RemoveUserModal;
