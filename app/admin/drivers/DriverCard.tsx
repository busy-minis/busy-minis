import Image from "next/image";
import { FC } from "react";

interface DriverCardProps {
  photo: string;
  fullName: string;
  licensePlate: string;
  onEdit: () => void;
  onDelete: () => void;
}

const DriverCard: FC<DriverCardProps> = ({
  photo,
  fullName,
  licensePlate,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex items-center bg-white shadow-lg rounded-lg p-4 mb-4">
      <Image
        src={photo}
        alt={fullName}
        width={100}
        height={100}
        className=" rounded-md mr-4"
      />
      <div className="flex-grow">
        <h2 className="text-lg font-bold">{fullName}</h2>
        <p className="text-gray-600">License Plate: {licensePlate}</p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={onEdit}
          className="bg-theme-orange text-white px-3 py-1 rounded hover:bg-theme-teal transition-colors"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DriverCard;
