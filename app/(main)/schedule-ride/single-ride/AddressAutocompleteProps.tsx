"use client";

import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

interface AddressAutocompleteProps {
  label: string;
  onAddressSelect: (address: string, lat?: number, lng?: number) => void;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  label,
  onAddressSelect,
}) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ["geocode"],
      componentRestrictions: { country: "us" },
    },
    debounce: 300,
  });

  useEffect(() => {
    return () => {
      clearSuggestions();
    };
  }, [clearSuggestions]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSelect = async (description: string) => {
    setValue(description, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address: description });
      const { lat, lng } = await getLatLng(results[0]);
      onAddressSelect(description, lat, lng);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <div className="mb-4">
      <Label
        htmlFor={`autocomplete-${label}`}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </Label>
      <div className="relative">
        <Input
          id={`autocomplete-${label}`}
          value={value}
          onChange={handleInput}
          disabled={!ready}
          className="w-full"
          placeholder={`Enter ${label.toLowerCase()}`}
          required
        />
        {status === "OK" && (
          <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-sm max-h-60 overflow-auto">
            {data.map(({ place_id, description }) => (
              <li
                key={place_id}
                onClick={() => handleSelect(description)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {description}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AddressAutocomplete;
