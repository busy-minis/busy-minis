import React from "react";
import AddressAutocomplete from "../AddressAutocompleteProps";
import { format } from "date-fns"; // Import the format function
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";

export default function LocationSection({
  formData,
  setFormData,
  setDistance,
  setStep,
  handleNextStep,
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

  const calculateDistance = () => {
    if (
      window.google &&
      formData.pickupLat &&
      formData.pickupLng &&
      formData.dropoffLat &&
      formData.dropoffLng
    ) {
      const service = new google.maps.DistanceMatrixService();

      service.getDistanceMatrix(
        {
          origins: [{ lat: formData.pickupLat, lng: formData.pickupLng }],
          destinations: [
            { lat: formData.dropoffLat, lng: formData.dropoffLng },
          ],
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === "OK" && response) {
            const distanceInMeters =
              response.rows[0].elements[0].distance.value; // distance in meters
            const distanceInKilometers = distanceInMeters / 1000; // convert to kilometers
            const distanceInMiles = distanceInKilometers * 0.621371; // convert kilometers to miles

            setDistance(distanceInMiles);
          } else {
            console.error("Error calculating distance:", status);
          }
        }
      );
    } else {
      console.error("Google Maps is not available or coordinates are missing.");
    }
  };

  const handleNextStepWithDistance = () => {
    calculateDistance();
    setStep(3);
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
