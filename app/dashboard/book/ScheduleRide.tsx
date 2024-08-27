"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createRide } from "@/utils/supabase/supabaseQueries";
import { useRouter } from "next/navigation";

const GOOGLE_MAPS_API_KEY = "AIzaSyCUa2HZ94Us1drPt-7bdpWaEB-Eaa4lzlg";
const libraries: "places"[] = ["places"];

export default function SingleRidePage() {
  const router = useRouter();
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [riders, setRiders] = useState([""]);
  const [totalPrice, setTotalPrice] = useState(25);
  const [isOffPeak, setIsOffPeak] = useState(false);
  const [showSameDayWarning, setShowSameDayWarning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pickupLocation, setPickupLocation] = useState<string>("");
  const [dropoffLocation, setDropoffLocation] = useState<string>("");
  const [stopLocations, setStopLocations] = useState<string[]>([]);
  const autocompleteRefs = useRef<(google.maps.places.Autocomplete | null)[]>(
    []
  );

  const handlePickupTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTime = e.target.value;
    const [hours] = selectedTime.split(":").map(Number);

    // Off-peak time logic
    if (hours < 6 || hours >= 18) {
      setIsOffPeak(true);
      setTotalPrice((prevPrice) => prevPrice + 15);
    } else {
      setIsOffPeak(false);
      setTotalPrice((prevPrice) => prevPrice - 15);
    }

    formik.setFieldValue("pickupTime", selectedTime);
  };

  const formik = useFormik({
    initialValues: {
      rideType: "single",
      riders: [""],
      pickupDate: "",
      pickupTime: "",
      pickupAddress: "",
      dropoffAddress: "",
      specialInstructions: "",
      stops: 0,
    },
    validationSchema: Yup.object({
      riders: Yup.array()
        .of(Yup.string().required("Rider is required"))
        .min(1, "At least one rider is required")
        .max(4, "You can add up to 4 riders"),
      pickupTime: Yup.string().required("Pickup time is required"),
      pickupAddress: Yup.string().required("Pickup address is required"),
      dropoffAddress: Yup.string().required("Dropoff address is required"),
      specialInstructions: Yup.string(),
    }),
    onSubmit: () => {
      setIsModalOpen(true);
    },
  });

  const handleConfirmRide = async () => {
    try {
      const rideData = {
        user_id: "ef9bf9a7-c67a-479b-81ed-cb29d352eb6d", // Replace with actual user ID
        pickup_location: pickupLocation,
        dropoff_location: dropoffLocation,
        pickup_time: `${formik.values.pickupDate}T${formik.values.pickupTime}`,
        status: "pending",
        passengers: formik.values.riders,
        stops: stopLocations.length > 0 ? stopLocations : null,
        special_instructions: formik.values.specialInstructions,
      };

      const data = await createRide(rideData);
      if (data && data.length > 0) {
        setSubmitSuccess(true);
        setIsModalOpen(false); // Close modal
        formik.resetForm();
        router.push(`/dashboard/book/success?rideId=${data[0].id}`);
      }
    } catch (error) {
      console.error("Error confirming ride:", error);
      setSubmitSuccess(false);
    }
  };

  useEffect(() => {
    let price = 25;
    price += (riders.length - 1) * 10;
    if (formik.values.stops > 0) {
      price += formik.values.stops * 5;
    }
    if (isOffPeak) {
      price += 15;
    }
    setTotalPrice(price);
  }, [formik.values, riders.length, isOffPeak]);

  const handleAddRider = () => {
    if (riders.length < 4) {
      const newRiders = [...riders, ""];
      setRiders(newRiders);
      formik.setFieldValue("riders", newRiders);
    }
  };

  const handleRemoveRider = (index: number) => {
    const updatedRiders = riders.filter((_, i) => i !== index);
    setRiders(updatedRiders);
    formik.setFieldValue("riders", updatedRiders);
  };

  const handleRiderChange = (index: number, value: string) => {
    const updatedRiders = [...riders];
    updatedRiders[index] = value;
    setRiders(updatedRiders);
    formik.setFieldValue("riders", updatedRiders);
  };

  const handlePickupDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    const currentDate = new Date();

    setShowSameDayWarning(
      selectedDate.toDateString() === currentDate.toDateString()
    );

    formik.handleChange(e);
  };

  const handleAddStop = () => {
    setStopLocations([...stopLocations, ""]);
  };

  const handleRemoveStop = (index: number) => {
    const newAddresses = stopLocations.filter((_, i) => i !== index);
    setStopLocations(newAddresses);
    autocompleteRefs.current = autocompleteRefs.current.filter(
      (_, i) => i !== index
    );
  };

  const convertToGeographyPoint = (place: google.maps.places.PlaceResult) => {
    const lat = place?.geometry?.location?.lat();
    const lng = place?.geometry?.location?.lng();
    if (lat && lng) {
      return `POINT(${lng} ${lat})`; // POINT format in (lon lat) order
    }
    return "";
  };

  const handleAddressSelect = useCallback(
    (autocompleteIndex: number, type: "pickup" | "dropoff" | "stop") => {
      const place = autocompleteRefs.current[autocompleteIndex]?.getPlace();
      const geographyPoint = convertToGeographyPoint(place!);

      if (type === "pickup") {
        setPickupLocation(geographyPoint);
        formik.setFieldValue("pickupAddress", place?.formatted_address || "");
      } else if (type === "dropoff") {
        setDropoffLocation(geographyPoint);
        formik.setFieldValue("dropoffAddress", place?.formatted_address || "");
      } else if (type === "stop") {
        const newStopLocations = [...stopLocations];
        newStopLocations[autocompleteIndex - 1] = geographyPoint;
        setStopLocations(newStopLocations);
      }
    },
    [pickupLocation, dropoffLocation, stopLocations]
  );

  return (
    <div className="p-6 sm:p-8 md:p-12 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold tracking-tight text-gray-800 mb-8">
        Schedule a Single Ride
      </h1>
      {submitSuccess && (
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg"
          role="alert"
        >
          <p className="font-bold">Success</p>
          <p>Your ride has been scheduled successfully.</p>
        </div>
      )}
      <form onSubmit={formik.handleSubmit} className="space-y-8">
        <div className="p-6 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded-md">
          <h2 className="text-lg font-semibold">Single Ride</h2>
          <p className="mt-2">
            A single ride provides transportation for a one-time occasion.
            Perfect for specific events, such as a tutoring session, a birthday
            party, or a one-off extracurricular activity.
          </p>
          <p className="mt-2">
            <strong>Cost:</strong> $25 one way (0-10 miles) or $35 round trip
            (0-10 miles).
          </p>
        </div>

        <div>
          <label
            htmlFor="riders"
            className="block text-sm font-medium text-gray-700"
          >
            Rider(s)
          </label>
          {riders.map((rider, index) => (
            <div key={index} className="mt-2 flex items-center space-x-2">
              <Input
                id={`rider-${index}`}
                name={`rider-${index}`}
                type="text"
                value={rider}
                onChange={(e) => handleRiderChange(index, e.target.value)}
                className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
              {riders.length > 1 && (
                <Button
                  type="button"
                  onClick={() => handleRemoveRider(index)}
                  className="bg-red-500 hover:bg-red-700 text-white text-xs px-2 py-1 rounded"
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          {riders.length < 4 && (
            <Button
              type="button"
              onClick={handleAddRider}
              className="mt-4 bg-theme-orange"
            >
              Add Another Rider
            </Button>
          )}
        </div>

        <div>
          <label
            htmlFor="pickupDate"
            className="block text-sm font-medium text-gray-700"
          >
            Pickup Date
          </label>
          <Input
            id="pickupDate"
            name="pickupDate"
            type="date"
            onChange={handlePickupDateChange}
            onBlur={formik.handleBlur}
            value={formik.values.pickupDate}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white"
          />
          {formik.touched.pickupDate && formik.errors.pickupDate ? (
            <div className="text-red-600">{formik.errors.pickupDate}</div>
          ) : null}
          {showSameDayWarning && (
            <div className="mt-2 text-yellow-600">
              Note: Same-day rides incur an additional fee of $25.
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="pickupTime"
            className="block text-sm font-medium text-gray-700"
          >
            Pickup Time
          </label>
          <Input
            id="pickupTime"
            name="pickupTime"
            type="time"
            onChange={handlePickupTimeChange}
            onBlur={formik.handleBlur}
            value={formik.values.pickupTime}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white"
          />
          {formik.touched.pickupTime && formik.errors.pickupTime ? (
            <div className="text-red-600">{formik.errors.pickupTime}</div>
          ) : null}
        </div>

        {isOffPeak && (
          <div className="mt-2 text-yellow-600">
            Note: Pickup time is during off-peak hours. An additional $15 fee
            will be applied.
          </div>
        )}

        <LoadScript
          googleMapsApiKey={GOOGLE_MAPS_API_KEY}
          libraries={libraries}
        >
          <div className="space-y-6">
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
                onPlaceChanged={() => handleAddressSelect(0, "pickup")}
              >
                <Input
                  id="pickupAddress"
                  name="pickupAddress"
                  type="text"
                  autoComplete="off"
                  required
                  className="block w-full shadow-sm sm:text-sm border-gray-300 bg-white rounded-md"
                />
              </Autocomplete>
            </div>

            {stopLocations.map((address, index) => (
              <div key={index} className="relative">
                <Autocomplete
                  onLoad={(autocomplete) =>
                    (autocompleteRefs.current[index + 1] = autocomplete)
                  }
                  onPlaceChanged={() => handleAddressSelect(index + 1, "stop")}
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
                      autoComplete="off"
                      className="block w-full shadow-sm sm:text-sm border-gray-300 bg-white rounded-md"
                    />
                  </div>
                </Autocomplete>
                <Button
                  type="button"
                  onClick={() => handleRemoveStop(index)}
                  className="absolute top-0 right-0 mt-1 mr-1 bg-red-500 hover:bg-red-700 text-white text-xs px-2 py-1 rounded"
                >
                  Remove
                </Button>
              </div>
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
                  (autocompleteRefs.current[stopLocations.length + 1] =
                    autocomplete)
                }
                onPlaceChanged={() =>
                  handleAddressSelect(stopLocations.length + 1, "dropoff")
                }
              >
                <Input
                  id="dropoffAddress"
                  name="dropoffAddress"
                  type="text"
                  autoComplete="off"
                  required
                  className="block w-full shadow-sm sm:text-sm border-gray-300 bg-white rounded-md"
                />
              </Autocomplete>
            </div>
            <Button
              type="button"
              onClick={handleAddStop}
              className="bg-neutral-700"
            >
              Add Stop
            </Button>
          </div>
        </LoadScript>

        <div className="mt-4 p-4 bg-gray-50 border-l-4 border-gray-400 text-gray-800 rounded-md">
          <h2 className="font-semibold text-lg">Total Price: ${totalPrice}</h2>
        </div>

        <Button type="submit" className="w-full bg-theme-orange">
          Continue To Payment
        </Button>
      </form>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Confirm Your Ride
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Ride Type:</p>
                <p className="text-sm uppercase">Single</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Riders:</p>
                <p className="text-sm">{riders.join(", ")}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Pickup Date:</p>
                <p className="text-sm">{formik.values.pickupDate}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Pickup Time:</p>
                <p className="text-sm">{formik.values.pickupTime}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Pickup Address:</p>
                <p className="text-sm">{formik.values.pickupAddress}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Dropoff Address:</p>
                <p className="text-sm">{formik.values.dropoffAddress}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Stops:</p>
                <p className="text-sm">{stopLocations.length}</p>
              </div>
              <div className="mt-4 p-4 bg-gray-100 rounded-md shadow-inner">
                <h3 className="text-lg font-bold text-center text-gray-800">
                  Total Price:{" "}
                  <span className="text-2xl text-theme-orange">
                    ${totalPrice}
                  </span>
                </h3>
              </div>
            </div>
            <div className="mt-6 flex justify-between space-x-4">
              <Button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-400 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmRide}
                className="bg-theme-orange hover:bg-theme-orange-dark text-white py-2 px-4 rounded-md"
              >
                Confirm Ride
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
