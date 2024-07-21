import React from 'react';
import { Button } from '../../../shadcn/components/ui/button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  action: 'enter' | 'exit';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onConfirm, onCancel, action }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-lg font-semibold mb-4">
          {action === 'enter' ? 'Enter Fullscreen' : 'Exit Fullscreen'}
        </h2>
        <p className="mb-4">
          Are you sure you want to {action === 'enter' ? 'enter fullscreen mode?' : 'exit fullscreen mode?'}
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            {action === 'enter' ? 'Enter' : 'Exit'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
