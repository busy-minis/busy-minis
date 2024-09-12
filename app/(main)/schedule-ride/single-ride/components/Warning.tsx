import { Info } from "@phosphor-icons/react";

interface WarningProps {
  text: string;
}

export const Warning: React.FC<WarningProps> = ({ text }) => (
  <p className=" text-red-600  mb-4 flex text-sm space-x-2">
    <Info />
    <span className=" leading-tight">{text}</span>
  </p>
);
