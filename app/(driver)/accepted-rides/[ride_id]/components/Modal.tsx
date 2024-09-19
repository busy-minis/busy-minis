// components/Modal.tsx
"use client";

import React from "react";

interface ModalProps {
  setShowModal: (show: boolean) => void;
  onConfirm: () => void; // Function to call on confirm
  title?: string;
  message?: string;
}

const Modal: React.FC<ModalProps> = ({
  setShowModal,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
}) => {
  const handleConfirm = () => {
    onConfirm(); // Call the confirm handler
    setShowModal(false); // Close the modal
  };

  const handleCancel = () => {
    setShowModal(false); // Close the modal without doing anything
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
