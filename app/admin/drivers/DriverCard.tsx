"use client";
import { deleteDriver, updateDriver } from "@/utils/supabase/supabaseQueries";
import Image from "next/image";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface Driver {
  id: number;
  photo_url: string;
  first_name: string;
  last_name: string;
  license_plate: string;
  vehicle_brand: string;
  vehicle_year: string;
  vehicle_color: string;
}

interface DriversPageProps {
  drivers: Driver[];
}

const DriverCard: React.FC<{
  driver: Driver;
  onDelete: () => void;
  onUpdate: (updatedDriver: Driver) => void;
}> = ({ driver, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedDriver, setUpdatedDriver] = useState(driver);

  const handleSaveChanges = async () => {
    await updateDriver(driver.id, updatedDriver);
    onUpdate(updatedDriver);
    setIsEditing(false);
  };

  const handleChange = (field: keyof Driver, value: string | number) => {
    setUpdatedDriver((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-stone-800 rounded-lg shadow-lg p-6 flex flex-col items-center space-y-6 sm:flex-row sm:space-y-0 sm:space-x-6">
      <Image
        src={driver.photo_url}
        alt={`${driver.first_name} ${driver.last_name}`}
        width={100}
        height={100}
        className="rounded-full object-cover shadow-md"
      />
      <div className="flex-grow text-center sm:text-left">
        <h3 className="text-2xl font-semibold text-gray-100">
          {driver.first_name} {driver.last_name}
        </h3>
        <p className="text-gray-200">License Plate: {driver.license_plate}</p>
        <p className="text-gray-200">
          {driver.vehicle_year} {driver.vehicle_brand} - {driver.vehicle_color}
        </p>
      </div>
      <div className="flex space-x-3">
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-all duration-200 shadow-md">
              Edit
            </button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-800">
                Edit Driver
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {[
                { label: "First Name", field: "first_name" },
                { label: "Last Name", field: "last_name" },
                { label: "License Plate", field: "license_plate" },
                { label: "Vehicle Brand", field: "vehicle_brand" },
                {
                  label: "Vehicle Year",
                  field: "vehicle_year",
                  type: "number",
                },
                { label: "Vehicle Color", field: "vehicle_color" },
              ].map(({ label, field, type = "text" }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={updatedDriver[field as keyof Driver] as string}
                    onChange={(e) =>
                      handleChange(field as keyof Driver, e.target.value)
                    }
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>
              ))}
            </div>
            <DialogFooter className="mt-6 flex justify-end space-x-3">
              <DialogClose asChild>
                <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all duration-200 shadow-md">
                  Cancel
                </button>
              </DialogClose>
              <button
                onClick={handleSaveChanges}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md"
              >
                Save Changes
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <button
          onClick={onDelete}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const DriversPage: React.FC<DriversPageProps> = ({ drivers }) => {
  const [driverList, setDriverList] = useState(drivers);

  const handleDelete = async (id: number) => {
    try {
      await deleteDriver(id);
      setDriverList(driverList.filter((driver) => driver.id !== id));
    } catch (error) {
      console.error("Error deleting driver:", error);
    }
  };

  const handleUpdate = (updatedDriver: Driver) => {
    setDriverList(
      driverList.map((driver) =>
        driver.id === updatedDriver.id ? updatedDriver : driver
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 ">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
        Drivers
      </h1>
      <div className="grid gap-8 lg:grid-cols-2">
        {driverList.map((driver) => (
          <DriverCard
            key={driver.id}
            driver={driver}
            onDelete={() => handleDelete(driver.id)}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default DriversPage;
