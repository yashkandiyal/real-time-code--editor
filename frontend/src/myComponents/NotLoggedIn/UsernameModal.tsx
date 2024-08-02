import React from "react";
import { Button } from "../../shadcn/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../shadcn/components/ui/dialog";
import { Input } from "../../shadcn/components/ui/input";

interface UsernameModalProps {
  isOpen: boolean;

  onSubmit: (username: string) => void;
  currentLoggedinUsername: string;
}

const UsernameModal: React.FC<UsernameModalProps> = ({
  isOpen,

  onSubmit,
  currentLoggedinUsername,
}) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Your Username</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p>You will join the room with the following username:</p>
          <Input
            id="username"
            value={currentLoggedinUsername || ""}
            readOnly
            className="cursor-not-allowed"
          />
        </div>
        <DialogFooter>
          <Button
            onClick={() => onSubmit(currentLoggedinUsername)}
            variant="default"
          >
            Join Room
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UsernameModal;
