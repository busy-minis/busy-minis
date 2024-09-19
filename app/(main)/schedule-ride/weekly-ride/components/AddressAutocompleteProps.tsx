// components/AddressAutocompleteProps.tsx
import React, { useEffect, useRef, useState } from "react";

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
  const autocompleteRef = useRef<HTMLInputElement>(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

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

        // Cleanup
        return () => clearInterval(interval);
      }
    };

    checkGoogleMaps();
  }, []);

  useEffect(() => {
    if (!autocompleteRef.current || !isGoogleMapsLoaded) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      autocompleteRef.current,
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
        setError(null);
      } else {
        const address = place.formatted_address || "";
        setInputValue(address);
        onAddressSelect(address);
      }
    });

    // Cleanup the listener on unmount
    return () => {
      window.google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [isGoogleMapsLoaded, onAddressSelect]);

  return (
    <div className="mb-6">
      <label
        htmlFor={`autocomplete-${label}`}
        className="block text-gray-700 font-semibold mb-2"
      >
        {label}
      </label>
      <input
        id={`autocomplete-${label}`}
        ref={autocompleteRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={`block w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 ${
          error ? "focus:ring-red-500" : "focus:ring-teal-600"
        }`}
        placeholder={`Enter ${label.toLowerCase()}`}
        required
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `error-${label}` : undefined}
      />
      {error && (
        <p id={`error-${label}`} className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default AddressAutocomplete;
