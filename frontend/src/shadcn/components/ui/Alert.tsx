import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from './dialog';

interface AlertProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  action: 'enter' | 'exit' | 'copy' | 'download' | 'reset';
  message?: string;
  children?: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({ isOpen, onConfirm, onCancel, action }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const showAlertTimeout = setTimeout(() => setShow(true), 2000); // Show after 2 seconds
      const hideAlertTimeout = setTimeout(() => setShow(false), 5000); // Hide after 5 seconds

      return () => {
        clearTimeout(showAlertTimeout);
        clearTimeout(hideAlertTimeout);
      };
    } else {
      setShow(false);
    }
  }, [isOpen]);

  return (
    <>
      <Dialog open={show} onOpenChange={(open) => !open && onCancel()}>
        <DialogContent
          className={`fixed top-40 left-1/2 transform -translate-x-1/2 z-50 max-w-md p-4 bg-black text-white transition-opacity duration-1000 ${
            show ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
        >
          <DialogHeader className="mt-0 mb-2">
            <DialogTitle>
              {action === 'enter'
                ? 'Fullscreen Entered'
                : action === 'exit'
                ? 'Fullscreen Exited'
                : action === 'copy'
                ? 'Code Copied'
                : action === 'download'
                ? 'File Downloaded'
                : 'Reset Code'}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="mt-0 mb-2">
            {action === 'enter'
              ? 'You have entered fullscreen mode.'
              : action === 'exit'
              ? 'You have exited fullscreen mode.'
              : action === 'copy'
              ? 'Code has been copied to clipboard.'
              : action === 'download'
              ? 'Code file has been downloaded.'
              : 'Are you sure you want to reset the code?'}
          </DialogDescription>
          {action === 'reset' && (
            <div className="flex justify-end gap-2">
              <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded-md">
                Cancel
              </button>
              <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded-md">
                Reset
              </button>
            </div>
          )}
          <DialogClose className="absolute top-2 right-2" />
        </DialogContent>
      </Dialog>

      {action === 'enter' || action === 'exit' ? (
        <ConfirmationModal
          isOpen={isOpen}
          onConfirm={onConfirm}
          onCancel={onCancel}
          action={action}
        />
      ) : null}
    </>
  );
};

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  action: 'enter' | 'exit';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onConfirm, onCancel, action }) => (
  <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
    <DialogContent
      className="fixed top-40 left-1/2 transform -translate-x-1/2 z-50 max-w-md p-4 bg-white text-black"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
    >
      <DialogHeader className="mt-0 mb-2">
        <DialogTitle>
          {action === 'enter' ? 'Enter Fullscreen?' : 'Exit Fullscreen?'}
        </DialogTitle>
      </DialogHeader>
      <DialogDescription className="mt-0 mb-2">
        {action === 'enter'
          ? 'Are you sure you want to enter fullscreen mode?'
          : 'Are you sure you want to exit fullscreen mode?'}
      </DialogDescription>
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded-md">
          Cancel
        </button>
        <button onClick={onConfirm} className="px-4 py-2 bg-blue-500 text-white rounded-md">
          Confirm
        </button>
      </div>
      <DialogClose className="absolute top-2 right-2" />
    </DialogContent>
  </Dialog>
);

export default Alert;

export const AlertTitle = DialogTitle;
export const AlertDescription = DialogDescription;
