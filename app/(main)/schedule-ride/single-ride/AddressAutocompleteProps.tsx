import React, { useEffect, useRef } from "react";

interface AddressAutocompleteProps {
  label: string;
  onAddressSelect: (address: string, lat?: number, lng?: number) => void;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  label,
  onAddressSelect,
}) => {
  const autocompleteRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!autocompleteRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(
      autocompleteRef.current,
      {
        types: ["geocode"],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const address = place.formatted_address || "";
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        onAddressSelect(address, lat, lng); // Provide lat/lng
      } else {
        const address = place.formatted_address || "";
        onAddressSelect(address); // Provide only address, lat/lng undefined
      }
    });
  }, [onAddressSelect]);

  return (
    <div className="mb-6">
      <label className="block text-gray-700 font-semibold mb-2">{label}</label>
      <input
        ref={autocompleteRef}
        className="block w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-lg"
        placeholder={`Enter ${label.toLowerCase()}`}
        required
      />
    </div>
  );
};

export default AddressAutocomplete;
