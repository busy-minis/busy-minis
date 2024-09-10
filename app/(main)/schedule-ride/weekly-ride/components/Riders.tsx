"use client";
import React from "react";
import { UserPlus, UserMinus, Info } from "@phosphor-icons/react";

export default function Riders({ formData, setFormData }: any) {
  const addPassenger = () => {
    setFormData((prevData: any) => ({
      ...prevData,
      riders: [...prevData.riders, { name: "", age: "" }],
    }));
  };

  const removePassenger = (index: number) => {
    setFormData((prevData: any) => ({
      ...prevData,
      riders: prevData.riders.filter((_: any, i: any) => i !== index),
    }));
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
      <h4 className="text-2xl font-semibold text-teal-900 mb-6 flex items-center">
        <UserPlus size={28} className="mr-2 text-teal-600" /> Add Riders
      </h4>
      {formData.riders.map((rider: any, index: any) => (
        <div key={index} className="grid grid-cols-5 gap-4 mb-4">
          <input
            type="text"
            placeholder={`Rider ${index + 1} Name`}
            value={rider.name}
            onChange={(e) => {
              const newRiders = [...formData.riders];
              newRiders[index].name = e.target.value;
              setFormData({ ...formData, riders: newRiders });
            }}
            className="col-span-3 p-3 border border-gray-300 rounded-lg focus:ring-teal-600 focus:border-teal-600"
          />
          <input
            type="number"
            placeholder="Age"
            value={rider.age}
            onChange={(e) => {
              const newRiders = [...formData.riders];
              newRiders[index].age = e.target.value;
              setFormData({ ...formData, riders: newRiders });
            }}
            className="col-span-1 p-3 border border-gray-300 rounded-lg focus:ring-teal-600 focus:border-teal-600"
          />
          {formData.riders.length > 1 && (
            <button
              type="button"
              onClick={() => removePassenger(index)}
              className="col-span-1 bg-red-500 text-white p-2 rounded-lg shadow hover:bg-red-600 transition"
            >
              <UserMinus size={24} />
            </button>
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
}
