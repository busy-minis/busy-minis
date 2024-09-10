interface WarningProps {
  text: string;
}

export const Warning: React.FC<WarningProps> = ({ text }) => (
  <p className=" text-red-600 font-semibold mb-4 flex  space-x-2">
    <WarningIcon />
    <span>{text}</span>
  </p>
);

const WarningIcon = () => (
  <svg
    className="w-6 h-6 text-red-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13 16h-1v-4h1m0 4h1v-4h-1m-1-4V7h2v5h-2zm1 7h.01M21 11.25A8.25 8.25 0 117.75 3 8.25 8.25 0 0121 11.25z"
    ></path>
  </svg>
);
