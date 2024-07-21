import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from './dialog';

interface AlertProps {
  isOpen: boolean;
  onConfirm: () => void; 
  onCancel: () => void;
  action: 'enter' | 'exit';
}

const Alert: React.FC<AlertProps> = ({ isOpen, onCancel, action }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Show alert after 2 seconds
      const showAlertTimeout = setTimeout(() => setShow(true), 1000);

      // Hide alert after 3 seconds (2 seconds display + 1 second fade out)
      const hideAlertTimeout = setTimeout(() => setShow(false), 4000);

      return () => {
        clearTimeout(showAlertTimeout);
        clearTimeout(hideAlertTimeout);
      };
    } else {
      setShow(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={show} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent
        className={`fixed top-40 left-1/2 transform -translate-x-1/2 z-50 max-w-md p-4 bg-black text-white transition-opacity duration-1000 ${
          show ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
      >
        <DialogHeader className="mt-0 mb-2">
          <DialogTitle>
            {action === 'enter' ? 'Fullscreen Entered' : 'Fullscreen Exited'}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="mt-0 mb-2">
          {action === 'enter'
            ? 'You have entered fullscreen mode.'
            : 'You have exited fullscreen mode.'}
        </DialogDescription>
        <DialogClose className="absolute top-2 right-2" />
      </DialogContent>
    </Dialog>
  );
};

export default Alert;
