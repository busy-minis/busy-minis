// components/Riders.tsx
import React from "react";
import { UserPlus, UserMinus } from "@phosphor-icons/react";

interface Stop {
  address: string;
  lat?: number;
  lng?: number;
}

interface FormData {
  user_id: string;
  status: string;
  end_date: string;
  pickupDate: string;
  pickupAddress: string;
  pickupLat?: number;
  pickupLng?: number;
  stops: Stop[];
  dropoffAddress: string;
  dropoffLat?: number;
  dropoffLng?: number;
  riders: Rider[];
  selectedTime: string;
  selectedDays: string[];
}

interface Rider {
  name: string;
  age: string;
}

interface RidersProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const Riders: React.FC<RidersProps> = ({ formData, setFormData }) => {
  const addPassenger = () => {
    setFormData((prevData) => ({
      ...prevData,
      riders: [...prevData.riders, { name: "", age: "" }],
    }));
  };

  const removePassenger = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      riders: prevData.riders.filter((_, i) => i !== index),
    }));
  };

  const handleRiderChange = (
    index: number,
    field: keyof Rider,
    value: string
  ) => {
    const newRiders = [...formData.riders];
    newRiders[index][field] = value;
    setFormData({ ...formData, riders: newRiders });
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
      <h4 className="text-2xl font-semibold text-teal-900 mb-6 flex items-center">
        <UserPlus size={28} className="mr-2 text-teal-600" /> Add Riders
      </h4>
      {formData.riders.map((rider, index) => (
        <div key={index} className="grid grid-cols-5 gap-4 mb-4">
          <div className="col-span-3">
            <label
              htmlFor={`rider-name-${index}`}
              className="block text-gray-700"
            >
              Rider {index + 1} Name
            </label>
            <input
              id={`rider-name-${index}`}
              type="text"
              placeholder={`Rider ${index + 1} Name`}
              value={rider.name}
              onChange={(e) => handleRiderChange(index, "name", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-600 focus:border-teal-600"
              required
            />
          </div>
          <div className="col-span-1">
            <label
              htmlFor={`rider-age-${index}`}
              className="block text-gray-700"
            >
              Age
            </label>
            <input
              id={`rider-age-${index}`}
              type="number"
              min="1"
              placeholder="Age"
              value={rider.age}
              onChange={(e) => handleRiderChange(index, "age", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-600 focus:border-teal-600"
              required
            />
          </div>
          {formData.riders.length > 1 && (
            <div className="col-span-1 flex items-end">
              <button
                type="button"
                onClick={() => removePassenger(index)}
                className="w-full bg-red-500 text-white p-2 rounded-lg shadow hover:bg-red-600 transition"
                aria-label={`Remove Rider ${index + 1}`}
              >
                <UserMinus size={24} />
              </button>
            </div>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addPassenger}
        className="mt-4 bg-teal-600 text-white px-4 py-2 rounded-lg shadow hover:bg-teal-700 transition inline-flex items-center"
      >
        <UserPlus size={20} className="mr-2" /> Add Rider
      </button>
    </div>
  );
};

export default Riders;
