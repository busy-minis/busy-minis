// components/Stops.tsx
import React from "react";
import { MapPinPlus, MinusCircle } from "@phosphor-icons/react";
import AddressAutocomplete from "./AddressAutocompleteProps";

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

interface StopsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const Stops: React.FC<StopsProps> = ({ formData, setFormData }) => {
  const addStop = () => {
    setFormData((prevData) => ({
      ...prevData,
      stops: [
        ...prevData.stops,
        { address: "", lat: undefined, lng: undefined },
      ],
    }));
  };

  const removeStop = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      stops: prevData.stops.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md mt-6">
      <h4 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <MapPinPlus size={28} className="mr-2 text-gray-700" /> Add Stops
      </h4>
      {formData.stops.length > 0 &&
        formData.stops.map((stop, index) => (
          <div key={index} className="mb-4">
            <AddressAutocomplete
              label={`Stop ${index + 1} Address`}
              value={stop.address}
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
                aria-label={`Remove Stop ${index + 1}`}
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
};

export default Stops;
