"use client";
import { Button } from "@/components/ui/button";
import { updateDriver } from "@/utils/supabase/supabaseQueries";
import React, { useState } from "react";

interface Driver {
  id: number;
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

const DriversPage: React.FC<DriversPageProps> = ({ drivers }) => {
  const [driverList, setDriverList] = useState(drivers);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const handleUpdate = async () => {
    if (selectedDriver) {
      try {
        await updateDriver(selectedDriver.id, selectedDriver);
        setDriverList(
          driverList.map((driver) =>
            driver.id === selectedDriver.id ? selectedDriver : driver
          )
        );
        setIsEditing(false);
        setSelectedDriver(null);
      } catch (error) {
        console.error("Error updating driver:", error);
      }
    }
  };

  const handleChange = (field: keyof Driver, value: string | number) => {
    if (selectedDriver) {
      setSelectedDriver(
        (prev) =>
          ({
            ...prev,
            [field]: value,
          } as Driver)
      );
    }
  };

  return (
    <div className="min-h-screen container bg-gray-50 py-12 px-4">
      <h1 className="text-4xl font-bold  text-zinc-800 mb-12">Drivers</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200 text-gray-600 text-sm uppercase font-semibold">
            <tr>
              <th className="py-4 px-6 text-left">Name</th>
              <th className="py-4 px-6 text-left">License Plate</th>
              <th className="py-4 px-6 text-left">Vehicle</th>
              <th className="py-4 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {driverList.map((driver) => (
              <tr key={driver.id} className="border-b border-gray-200">
                <td className="py-4 px-6">
                  {driver.first_name} {driver.last_name}
                </td>
                <td className="py-4 px-6">{driver.license_plate}</td>
                <td className="py-4 px-6">
                  {driver.vehicle_year} {driver.vehicle_brand} -{" "}
                  {driver.vehicle_color}
                </td>
                <td className="py-4 px-6">
                  <Button
                    onClick={() => {
                      setSelectedDriver(driver);
                      setIsEditing(true);
                    }}
                    className=" text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-all duration-200 shadow-md"
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditing && selectedDriver && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Edit Driver
            </h2>
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
                    value={selectedDriver[field as keyof Driver] as string}
                    onChange={(e) =>
                      handleChange(field as keyof Driver, e.target.value)
                    }
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all duration-200 shadow-md"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriversPage;
