import React from "react";

interface UpgradeModalProps {
  show: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({
  show,
  onClose,
  onUpgrade,
}) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Upgrade Your Plan</h2>
        <p className="mb-4">
          You are currently on a free tier where only 2 users are allowed in a
          room. Click the button below to upgrade your plan.
        </p>
        <div className="flex justify-end">
          <button
            className="mr-2 bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={onUpgrade}
          >
            Upgrade Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
