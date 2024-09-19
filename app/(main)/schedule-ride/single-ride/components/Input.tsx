// app/single-ride/components/Input.tsx
"use client";
import React from "react";

interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  value,
  onChange,
  min,
  icon,
}) => (
  <div className="mb-6">
    <label className="block text-gray-700 font-semibold mb-2 flex items-center space-x-2">
      {icon}
      <span>{label}</span>
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      min={min}
      className="block w-full px-4 py-2 text-gray-900 bg-gray-200 rounded-lg border-2 border-transparent focus:border-indigo-600 focus:bg-white focus:outline-none transition-colors duration-200"
      required
    />
  </div>
);
