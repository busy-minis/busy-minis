"use client";
import React, { useState, useRef, useCallback } from "react";
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const GOOGLE_MAPS_API_KEY = "AIzaSyCUa2HZ94Us1drPt-7bdpWaEB-Eaa4lzlg";

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = [
  "places",
];

const GoogleMapsAddressAutofill = ({ onAddressSelect }: any) => {
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [stopAddresses, setStopAddresses] = useState<string[]>([]);
  const autocompleteRefs = useRef<(google.maps.places.Autocomplete | null)[]>(
    []
  );

  const handleAddressChange = (index: number, value: string) => {
    const newAddresses = [...stopAddresses];
    newAddresses[index] = value;
    setStopAddresses(newAddresses);
  };

  const handleAddStop = () => {
    setStopAddresses([...stopAddresses, ""]);
  };

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const selectedAddresses = [
        pickupAddress,
        ...autocompleteRefs.current.map(
          (ref, index) =>
            ref?.getPlace()?.formatted_address || stopAddresses[index]
        ),
        dropoffAddress,
      ];
      onAddressSelect(selectedAddresses);
    },
    [onAddressSelect, pickupAddress, dropoffAddress, stopAddresses]
  );

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={libraries}>
      <div>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="pickupAddress"
              className="block text-sm font-medium text-gray-700"
            >
              Pickup Address
            </label>
            <Autocomplete
              onLoad={(autocomplete) =>
                (autocompleteRefs.current[0] = autocomplete)
              }
              onPlaceChanged={() =>
                setPickupAddress(
                  autocompleteRefs.current[0]?.getPlace()?.formatted_address ||
                    ""
                )
              }
            >
              <Input
                id="pickupAddress"
                name="pickupAddress"
                type="text"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                autoComplete="off"
                required
                className="block w-full shadow-sm sm:text-sm border-gray-300 bg-white  rounded-md"
              />
            </Autocomplete>
          </div>

          {stopAddresses.map((address, index) => (
            <Autocomplete
              key={index}
              onLoad={(autocomplete) =>
                (autocompleteRefs.current[index + 1] = autocomplete)
              }
              onPlaceChanged={() =>
                handleAddressChange(
                  index,
                  autocompleteRefs.current[index + 1]?.getPlace()
                    ?.formatted_address || ""
                )
              }
            >
              <div>
                <label
                  htmlFor={`stopAddress-${index}`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Stop Address {index + 1}
                </label>
                <Input
                  id={`stopAddress-${index}`}
                  name={`stopAddress-${index}`}
                  type="text"
                  value={address}
                  onChange={(e) => handleAddressChange(index, e.target.value)}
                  autoComplete="off"
                  className="block w-full shadow-sm sm:text-sm border-gray-300  bg-white rounded-md"
                />
              </div>
            </Autocomplete>
          ))}

          <div>
            <label
              htmlFor="dropoffAddress"
              className="block text-sm font-medium text-gray-700"
            >
              Dropoff Address
            </label>
            <Autocomplete
              onLoad={(autocomplete) =>
                (autocompleteRefs.current[stopAddresses.length + 1] =
                  autocomplete)
              }
              onPlaceChanged={() =>
                setDropoffAddress(
                  autocompleteRefs.current[stopAddresses.length + 1]?.getPlace()
                    ?.formatted_address || ""
                )
              }
            >
              <Input
                id="dropoffAddress"
                name="dropoffAddress"
                type="text"
                value={dropoffAddress}
                onChange={(e) => setDropoffAddress(e.target.value)}
                autoComplete="off"
                required
                className="block w-full shadow-sm sm:text-sm border-gray-300 bg-white rounded-md"
              />
            </Autocomplete>
          </div>
          <Button
            type="button"
            onClick={handleAddStop}
            className="w-full bg-neutral-700"
          >
            Add Stop
          </Button>

          {/* <Button type="submit" className="w-full bg-theme-orange">
            Submit Addresses
          </Button> */}
        </form>
      </div>
    </LoadScript>
  );
};

export default GoogleMapsAddressAutofill;
