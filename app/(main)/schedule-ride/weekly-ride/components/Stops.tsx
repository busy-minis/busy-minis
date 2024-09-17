"use client";
import React from "react";
import { MapPinPlus, MinusCircle } from "@phosphor-icons/react";
import AddressAutocomplete from "./AddressAutocompleteProps";

export default function Stops({ formData, setFormData }: any) {
  const addStop = () => {
    setFormData((prevData: any) => ({
      ...prevData,
      stops: [
        ...prevData.stops,
        { address: "", lat: undefined, lng: undefined },
      ],
    }));
  };

  const removeStop = (index: number) => {
    setFormData((prevData: any) => ({
      ...prevData,
      stops: prevData.stops.filter((_: any, i: any) => i !== index),
    }));
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md mt-6">
      <h4 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <MapPinPlus size={28} className="mr-2 text-gray-700" /> Add Stops
      </h4>
      {/* Only show stop fields if there are stops added */}
      {formData.stops.length > 0 &&
        formData.stops.map((stop: any, index: any) => (
          <div key={index} className="mb-4">
            <AddressAutocomplete
              label={`Stop ${index + 1} Address`}
              value={stop.address} // Pass current stop address
              onAddressSelect={(address, lat, lng) => {
                const newStops = [...formData.stops];
                newStops[index] = { address, lat, lng };
                setFormData({ ...formData, stops: newStops });
              }}
            />
            {formData.stops.length > 1 && (
              <button
                type="button"
                onClick={() => removeStop(index)}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition inline-flex items-center"
              >
                <MinusCircle size={20} className="mr-2" /> Remove Stop
              </button>
            )}
          </div>
        ))}
      <button
        type="button"
        onClick={addStop}
        className="mt-4 bg-gray-700 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800 transition inline-flex items-center"
      >
        <MapPinPlus size={20} className="mr-2" /> Add Stop
      </button>
    </div>
  );
}
