import React from "react";
import { Button } from "../../../shadcn/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../shadcn/components/ui/dialog";

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  action: "enter" | "exit";
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  action,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px] p-6 md:p-8 rounded-lg bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            {action === "enter" ? "Enter Fullscreen" : "Exit Fullscreen"}
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to{" "}
            {action === "enter"
              ? "enter fullscreen mode?"
              : "exit fullscreen mode?"}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onCancel}
            className="dark:bg-gray-700 dark:text-white text-gray-700 bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className={`${
              action === "enter"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-red-600 hover:bg-red-700"
            } text-white`}
          >
            {action === "enter" ? "Enter" : "Exit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
