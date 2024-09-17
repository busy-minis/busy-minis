// Modal.tsx
"use client";
import React from "react";
import { XCircle } from "@phosphor-icons/react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-md">
        <div className="flex items-center mb-4">
          <XCircle size={32} className="text-red-600 mr-2" />
          <h3 className="text-xl font-semibold text-gray-800">
            Confirm Cancellation
          </h3>
        </div>
        <p className="text-gray-700 mb-6">
          Are you sure you want to cancel this ride?{" "}
          <span className="font-semibold text-red-600">
            You may not be refunded.
          </span>
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200"
          >
            No, Keep Ride
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Yes, Cancel Ride
          </button>
        </div>
      </div>
    </div>
  );
}
