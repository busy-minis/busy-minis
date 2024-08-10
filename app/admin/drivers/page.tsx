"use client";
import { useState } from "react";
import DriverCard from "./DriverCard";

interface Driver {
  id: number;
  photo: string;
  fullName: string;
  licensePlate: string;
}

const DriversPage = () => {
  const [drivers, setDrivers] = useState<Driver[]>([
    // Sample data, replace with actual data fetching
    {
      id: 1,
      photo: "/assets/tea.png",
      fullName: "John Doe",
      licensePlate: "ABC1234",
    },
    {
      id: 2,
      photo: "/assets/bass.jpg",
      fullName: "Jane Smith",
      licensePlate: "XYZ5678",
    },
    {
      id: 3,
      photo: "/assets/coffee.png",
      fullName: "Jacob Maine",
      licensePlate: "GFDI2013",
    },
  ]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [driverToEdit, setDriverToEdit] = useState<Driver | null>(null);
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);

  const handleEdit = (driver: Driver) => {
    setDriverToEdit(driver);
    setIsEditModalOpen(true);
  };

  const handleDelete = (driver: Driver) => {
    setDriverToDelete(driver);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (driverToDelete) {
      setDrivers(drivers.filter((driver) => driver.id !== driverToDelete.id));
      setIsDeleteModalOpen(false);
      setDriverToDelete(null);
    }
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (driverToEdit) {
      setDrivers(
        drivers.map((driver) =>
          driver.id === driverToEdit.id
            ? {
                ...driver,
                fullName: driverToEdit.fullName,
                licensePlate: driverToEdit.licensePlate,
              }
            : driver
        )
      );
      setIsEditModalOpen(false);
      setDriverToEdit(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (driverToEdit) {
      setDriverToEdit({ ...driverToEdit, [e.target.name]: e.target.value });
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Drivers</h1>
      {drivers.map((driver) => (
        <DriverCard
          key={driver.id}
          photo={driver.photo}
          fullName={driver.fullName}
          licensePlate={driver.licensePlate}
          onEdit={() => handleEdit(driver)}
          onDelete={() => handleDelete(driver)}
        />
      ))}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg overflow-hidden shadow-lg max-w-lg w-full">
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">Edit Driver</h2>
              <form onSubmit={saveEdit}>
                <div className="mb-4">
                  <label
                    htmlFor="fullName"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={driverToEdit?.fullName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="licensePlate"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    License Plate
                  </label>
                  <input
                    type="text"
                    id="licensePlate"
                    name="licensePlate"
                    value={driverToEdit?.licensePlate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg overflow-hidden shadow-lg max-w-lg w-full">
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
              <p>Are you sure you want to delete {driverToDelete?.fullName}?</p>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriversPage;
