import React from "react";
import AddressAutocomplete from "../AddressAutocompleteProps";
import { format } from "date-fns"; // Import the format function
import { ArrowLeft, ArrowRight, Plus, Trash } from "@phosphor-icons/react";

interface Stop {
  address: string;
  lat?: number;
  lng?: number;
}
export default function LocationSection({
  formData,
  setFormData,
  setDistance,
  setStep,
  handleNextStep,
  setValidationErrors,
  validationErrors,
}: any) {
  const handlePickupAddressSelect = (
    address: string,
    lat?: number,
    lng?: number
  ) => {
    setFormData({
      ...formData,
      pickupAddress: address,
      pickupLat: lat,
      pickupLng: lng,
    });
  };

  const handleDropoffAddressSelect = (
    address: string,
    lat?: number,
    lng?: number
  ) => {
    setFormData({
      ...formData,
      dropoffAddress: address,
      dropoffLat: lat,
      dropoffLng: lng,
    });
  };

  const formatTime = (time: string) => {
    const date = new Date(`1970-01-01T${time}`); // Use any date because we only care about the time part
    return format(date, "hh:mm a"); // Format time as 12-hour format (e.g., 01:02 PM)
  };

  const validateStep2 = () => {
    const errors = [];

    // Validate Pickup Address
    if (!formData.pickupAddress || !formData.pickupLat || !formData.pickupLng) {
      errors.push("Pickup address is required.");
    }

    // Validate Dropoff Address
    if (
      !formData.dropoffAddress ||
      !formData.dropoffLat ||
      !formData.dropoffLng
    ) {
      errors.push("Dropoff address is required.");
    }

    // Validate Stops
    formData.stops.forEach((stop: any, index: any) => {
      if (!stop.address || !stop.lat || !stop.lng) {
        errors.push(`Stop ${index + 1} address is incomplete.`);
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const calculateDistance = () => {
    if (
      window.google &&
      formData.pickupLat !== undefined &&
      formData.pickupLng !== undefined &&
      formData.dropoffLat !== undefined &&
      formData.dropoffLng !== undefined
    ) {
      const directionsService = new google.maps.DirectionsService();

      const waypoints = formData.stops
        .filter(
          (stop: Stop) => stop.lat !== undefined && stop.lng !== undefined
        )
        .map((stop: Stop) => ({
          location: new google.maps.LatLng(stop.lat!, stop.lng!),
          stopover: true,
        }));

      const request = {
        origin: new google.maps.LatLng(
          formData.pickupLat!,
          formData.pickupLng!
        ),
        destination: new google.maps.LatLng(
          formData.dropoffLat!,
          formData.dropoffLng!
        ),
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (result, status) => {
        if (
          status === "OK" &&
          result &&
          result.routes &&
          result.routes.length > 0
        ) {
          let totalDistance = 0;
          const legs = result.routes[0].legs;
          if (legs && legs.length > 0) {
            for (let i = 0; i < legs.length; i++) {
              const legDistanceValue = legs[i].distance?.value;
              if (legDistanceValue !== undefined) {
                totalDistance += legDistanceValue; // distance in meters
              } else {
                console.error(`Distance value is undefined for leg ${i}`);
              }
            }
            const distanceInMiles = (totalDistance / 1000) * 0.621371; // convert to miles
            setDistance(distanceInMiles);
            setFormData({
              ...formData,
              distance: distanceInMiles,
            });
          } else {
            console.error("No legs found in the route.");
          }
        } else {
          console.error("Error calculating route:", status);
        }
      });
    } else {
      console.error("Google Maps is not available or coordinates are missing.");
    }
  };

  const handleNextStepWithDistance = () => {
    if (validateStep2()) {
      calculateDistance();
      setStep(3);
    }
  };

  return (
    <div>
      <section className="flex gap-2 mb-8 items-center">
        <div className="bg-orange-500 grid place-content-center text-sm size-6 rounded-full text-white">
          2
        </div>
        <p className="font-semibold">Location</p>
      </section>
      <section className="mb-6 p-4 bg-white shadow rounded-lg">
        <div className="mb-4">
          <h4 className="font-semibold text-lg text-teal-700 mb-2">Riders:</h4>
          <ul className="list-disc list-inside">
            {formData.riders.map((rider: any, index: any) => (
              <li key={index} className="text-gray-800">
                <span className="font-medium">{rider.name}</span>, {rider.age}{" "}
                years old
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <p className="text-gray-600">
              <span className="font-medium text-teal-700">Pickup Date:</span>{" "}
              {formData.pickupDate}
            </p>
          </div>
          <div className="flex-1">
            <p className="text-gray-600">
              <span className="font-medium text-teal-700">Pickup Time:</span>{" "}
              {formatTime(formData.pickupTime)} {/* Format the time */}
            </p>
          </div>
        </div>
      </section>
      <AddressAutocomplete
        label="Pickup Address"
        onAddressSelect={handlePickupAddressSelect}
      />
      <AddressAutocomplete
        label="Dropoff Address"
        onAddressSelect={handleDropoffAddressSelect}
      />

      {/* Stops Section */}
      {formData.stops.map((stop: Stop, index: number) => (
        <div key={index} className="mb-4">
          <AddressAutocomplete
            label={`Stop ${index + 1} Address`}
            onAddressSelect={(address: string, lat?: number, lng?: number) => {
              const updatedStops = [...formData.stops];
              updatedStops[index] = { address, lat, lng };
              setFormData({ ...formData, stops: updatedStops });
            }}
          />
          <button
            type="button"
            className="text-red-600 bg-red-100 w-fit px-2 py-2 font-bold flex items-center space-x-2 mt-2"
            onClick={() => {
              const updatedStops = formData.stops.filter(
                (_: any, i: any) => i !== index
              );
              setFormData({ ...formData, stops: updatedStops });
            }}
          >
            <Trash size={20} />
            <span>Remove Stop</span>
          </button>
        </div>
      ))}
      {validationErrors.length > 0 && (
        <div className="text-red-600 text-sm mb-4 mt-2 text-center">
          {validationErrors.map((error: any, index: any) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}

      <button
        type="button"
        className="mb-4 px-4 py-2 bg-blue-600 w-full text-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-200 ease-in-out transform hover:-translate-y-1 flex justify-center items-center space-x-2"
        onClick={() => {
          setFormData({
            ...formData,
            stops: [
              ...formData.stops,
              { address: "", lat: undefined, lng: undefined },
            ],
          });
        }}
      >
        <Plus size={20} />
        <span>Add Stop</span>
      </button>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-200 ease-in-out transform hover:-translate-y-1 mr-2 flex justify-center items-center"
          onClick={() => setStep(1)}
        >
          Back
        </button>
        <button
          type="button"
          className="w-full px-4 py-2 bg-gradient-to-r from-theme-orange to-theme-yellow text-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-200 ease-in-out transform hover:-translate-y-1 ml-2 flex justify-center items-center"
          onClick={handleNextStepWithDistance}
        >
          Next
        </button>
      </div>
    </div>
  );
}
