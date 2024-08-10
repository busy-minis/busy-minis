"use client";

import Image from "next/image";
import React, { FC } from "react";

interface Driver {
  id: number;
  photo_url: string;
  first_name: string;
  last_name: string;
  license_plate: string;
  vehicle_brand: string;
  is_active: boolean;
  current_location: string | null;
}

interface DriversPageProps {
  drivers: Driver[];
}

const DriverCard: FC<DriverCardProps> = ({ photo, fullName, licensePlate }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center bg-white shadow-lg rounded-lg p-4 mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
      <Image
        src={photo}
        alt={fullName}
        width={100}
        height={100}
        className="rounded-md"
      />
      <div className="flex-grow text-center sm:text-left">
        <h2 className="text-lg font-bold">{fullName}</h2>
        <p className="text-gray-600">License Plate: {licensePlate}</p>
      </div>
      <div className="flex space-x-2">
        <button className="bg-theme-orange text-white px-3 py-1 rounded hover:bg-theme-teal transition-colors w-full sm:w-auto">
          Edit
        </button>
        <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors w-full sm:w-auto">
          Delete
        </button>
      </div>
    </div>
  );
};

interface DriverCardProps {
  photo: string;
  fullName: string;
  licensePlate: string;
}

export default function DriversPage({ drivers }: DriversPageProps) {
  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Drivers</h1>
      {drivers.map((driver) => (
        <DriverCard
          key={driver.id}
          photo={driver.photo_url}
          fullName={`${driver.first_name} ${driver.last_name}`}
          licensePlate={driver.license_plate}
        />
      ))}
    </div>
  );
}
