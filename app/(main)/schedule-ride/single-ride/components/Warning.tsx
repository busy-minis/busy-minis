// app/single-ride/components/Warning.tsx
"use client";
import React from "react";
import { Info } from "@phosphor-icons/react";

interface WarningProps {
  text: string;
}

export const Warning: React.FC<WarningProps> = ({ text }) => (
  <p className="text-red-600 mb-4 flex items-center text-sm">
    <Info size={16} className="mr-2" />
    <span>{text}</span>
  </p>
);
