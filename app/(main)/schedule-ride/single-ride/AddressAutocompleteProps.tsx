"use client";

import React, { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadGoogleMapsScript from "./LoadGoogleMapsScript";

interface AddressAutocompleteProps {
  label: string;
  onAddressSelect: (address: string, lat?: number, lng?: number) => void;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  label,
  onAddressSelect,
}) => {
  const autocompleteRef = useRef<HTMLInputElement>(null);
  const isGoogleMapsLoaded = LoadGoogleMapsScript();

  useEffect(() => {
    if (!isGoogleMapsLoaded || !autocompleteRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(
      autocompleteRef.current,
      {
        types: ["geocode"],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        onAddressSelect(
          place.formatted_address,
          place.geometry?.location?.lat(),
          place.geometry?.location?.lng()
        );
      }
    });

    return () => {
      google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [isGoogleMapsLoaded, onAddressSelect]);

  return (
    <div>
      <Label htmlFor={label}>{label}</Label>
      <Input
        ref={autocompleteRef}
        type="text"
        id={label}
        placeholder="Enter an address"
      />
    </div>
  );
};

export default AddressAutocomplete;
