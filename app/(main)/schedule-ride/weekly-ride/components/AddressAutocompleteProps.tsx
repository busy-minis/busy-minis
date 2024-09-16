import React, { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

interface AddressAutocompleteProps {
  label: string;
  onAddressSelect: (address: string, lat?: number, lng?: number) => void;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  label,
  onAddressSelect,
}) => {
  const autocompleteRef = useRef<HTMLInputElement>(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Debounce the inputValue by 500ms to prevent excessive API requests
  const [debouncedValue] = useDebounce(inputValue, 500);

  useEffect(() => {
    const checkGoogleMaps = () => {
      if (
        typeof window !== "undefined" &&
        window.google &&
        window.google.maps
      ) {
        setIsGoogleMapsLoaded(true);
      } else {
        const interval = setInterval(() => {
          if (window.google && window.google.maps) {
            setIsGoogleMapsLoaded(true);
            clearInterval(interval);
          }
        }, 100);
      }
    };

    checkGoogleMaps();
  }, []);

  useEffect(() => {
    if (!autocompleteRef.current || !isGoogleMapsLoaded) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      autocompleteRef.current!,
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

        // Update the input value with the selected address
        setInputValue(address);
        onAddressSelect(address, lat, lng);
      } else {
        const address = place.formatted_address || "";
        setInputValue(address); // Update input with address
        onAddressSelect(address); // Provide only the address, lat/lng undefined
      }
    });

    // Cleanup the listener on unmount
    return () => {
      window.google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [isGoogleMapsLoaded, onAddressSelect]);

  return (
    <div className="mb-6">
      <label className="block text-gray-700 font-semibold mb-2">{label}</label>
      <input
        ref={autocompleteRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="block w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-lg"
        placeholder={`Enter ${label.toLowerCase()}`}
        required
      />
    </div>
  );
};

export default AddressAutocomplete;
