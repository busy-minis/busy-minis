// ConfirmationModal.tsx
"use client";
import React from "react";
import { XCircle } from "@phosphor-icons/react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-md">
        <div className="flex items-center mb-4">
          <XCircle size={32} className="text-red-600 mr-2" aria-hidden="true" />
          <h3 id="modal-title" className="text-xl font-semibold text-gray-800">
            Confirm Cancellation
          </h3>
        </div>
        <p id="modal-description" className="text-gray-700 mb-6">
          Are you sure you want to cancel this ride?{" "}
          <span className="font-semibold text-red-600">
            You may not be refunded.
          </span>
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200"
            disabled={isLoading}
          >
            No, Keep Ride
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : (
              <></>
            )}
            Yes, Cancel Ride
          </button>
        </div>
      </div>
    </div>
  );
}
