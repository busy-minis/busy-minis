"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressAutocompleteProps {
  label: string;
  value: string;
  onAddressSelect: (address: string, lat?: number, lng?: number) => void;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  label,
  value,
  onAddressSelect,
}) => {
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  useEffect(() => {
    if (!window.google) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      document.getElementById(`autocomplete-${label}`) as HTMLInputElement,
      { types: ["geocode"] }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const address = place.formatted_address || "";
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        setInputValue(address);
        onAddressSelect(address, lat, lng);
      } else {
        const address = place.formatted_address || "";
        setInputValue(address);
        onAddressSelect(address);
      }
    });

    return () => {
      window.google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [label, onAddressSelect]);

  return (
    <div className="mb-4">
      <Label
        htmlFor={`autocomplete-${label}`}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </Label>
      <Input
        id={`autocomplete-${label}`}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full"
        placeholder={`Enter ${label.toLowerCase()}`}
        required
      />
    </div>
  );
};

export default AddressAutocomplete;
