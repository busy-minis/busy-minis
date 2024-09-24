"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ModalProps {
  setShowModal: (show: boolean) => void;
  onConfirm: (inputValue?: string) => void;
  title?: string;
  message?: string;
  requireInput?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  setShowModal,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  requireInput = false,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (requireInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [requireInput]);

  const validateURL = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleConfirm = () => {
    if (requireInput) {
      if (!validateURL(inputValue)) {
        setInputError("Please enter a valid website URL.");
        return;
      }
      onConfirm(inputValue);
    } else {
      onConfirm();
    }
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handlePaste = () => {
    navigator.clipboard.readText().then((text) => {
      setInputValue(text);
      if (requireInput) {
        if (!validateURL(text)) {
          setInputError("Pasted text is not a valid website URL.");
        } else {
          setInputError(null);
        }
      }
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2
          id="modal-title"
          className="text-2xl font-semibold mb-4 text-gray-800"
        >
          {title}
        </h2>
        <p id="modal-description" className="mb-6 text-gray-600">
          {message}
        </p>
        {requireInput && (
          <div className="mb-4">
            <Input
              ref={inputRef}
              type="url"
              placeholder="Enter website URL here..."
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (inputError) setInputError(null);
              }}
              className={`mb-2 ${inputError ? "border-red-500" : ""}`}
              aria-invalid={inputError ? "true" : "false"}
            />
            {inputError && (
              <p className="text-red-500 text-sm mb-2">{inputError}</p>
            )}
            <Button
              onClick={handlePaste}
              variant="secondary"
              className="w-full"
            >
              Paste from Clipboard
            </Button>
          </div>
        )}
        <div className="flex justify-end space-x-3">
          <Button onClick={handleCancel} variant="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={requireInput && !inputValue}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
