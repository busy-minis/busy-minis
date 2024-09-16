"use client";
import React, { useState, useEffect, useCallback } from "react";
import { CalendarCheck, Info } from "@phosphor-icons/react";
import { createWeeklyRide } from "@/utils/supabase/supabaseQueries";
import { loadStripe } from "@stripe/stripe-js";
import { FormData } from "@/app/types/types";
import AddressAutocomplete from "./components/AddressAutocompleteProps";
import LoadGoogleMapsScript from "./components/LoadGoogleMapsScript";
import Riders from "./components/Riders";
import Review from "./components/Review";
import Time from "./components/Time";

const stripePromise = loadStripe(
  "pk_test_51Pq0V6AU6tLKej0RgL8EyqnGLr2FSrqtraFvpHgSi6R5jGL2J2BhRJJmumdajy3WgzuNlnZK6drMlrLAtw5cixYP00kozGoK19"
);

const daysOfWeekMap: { [key: string]: number } = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export default function WeeklyRideBookingPage(props: { userId: string }) {
  const [formData, setFormData] = useState<FormData>({
    user_id: props.userId,
    status: "pending",
    end_date: "",
    pickupDate: "",
    pickupAddress: "",
    pickupLat: undefined,
    pickupLng: undefined,
    dropoffAddress: "",
    dropoffLat: undefined,
    dropoffLng: undefined,
    riders: [{ name: "", age: "" }],
    selectedTime: "",
    selectedDays: [] as string[],
  });
  const [dateError, setDateError] = useState("");
  const [timeWarning, setTimeWarning] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPrice, setTotalPrice] = useState(13);
  const [distance, setDistance] = useState<number | null>(null);
  const [loadingDistance, setLoadingDistance] = useState(false);

  const daysOfWeek = Object.keys(daysOfWeekMap);

  const calculateDistance = useCallback(() => {
    if (
      window.google &&
      formData.pickupLat &&
      formData.pickupLng &&
      formData.dropoffLat &&
      formData.dropoffLng
    ) {
      setLoadingDistance(true); // Show loading while distance is being calculated
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
          setLoadingDistance(false);
          if (status === "OK" && response) {
            const distanceInMeters =
              response.rows[0].elements[0].distance.value;
            const distanceInKilometers = distanceInMeters / 1000;
            const distanceInMiles = distanceInKilometers * 0.621371;

            setDistance(distanceInMiles);
          } else {
            console.error("Error calculating distance:", status);
          }
        }
      );
    } else {
      console.error("Google Maps is not available or coordinates are missing.");
    }
  }, [
    formData.pickupLat,
    formData.pickupLng,
    formData.dropoffLat,
    formData.dropoffLng,
  ]);

  const calculateTotalPrice = useCallback(() => {
    const basePricePerDay = 13;
    const selectedDaysCount = formData.selectedDays.length;

    const calculateCost = () => {
      const miles = distance;
      let totalCost = 0;

      if (miles !== null && miles > 5) {
        const additionalMiles = miles - 5;
        totalCost += additionalMiles * 2;
      }

      return Math.round(totalCost * 100) / 100;
    };

    let price = selectedDaysCount * basePricePerDay;

    if (timeWarning) price += 10;
    if (formData.riders.length > 1) {
      price += (formData.riders.length - 1) * 5;
    }
    if (distance) {
      price += calculateCost();
    }

    setTotalPrice(price);
  }, [timeWarning, formData.riders, formData.selectedDays, distance]);

  useEffect(() => {
    calculateTotalPrice();
  }, [calculateTotalPrice]);

  const calculateNextPickupDate = (selectedDays: string[]): string | null => {
    if (selectedDays.length === 0) return null;

    const today = new Date();
    const todayDay = today.getDay();

    let minOffset = 7;
    selectedDays.forEach((day) => {
      const selectedDayOffset = daysOfWeekMap[day];
      let offset = (selectedDayOffset - todayDay + 7) % 7;
      if (offset === 0) offset = 7;
      if (offset < minOffset) minOffset = offset;
    });

    const nextPickupDate = new Date();
    nextPickupDate.setDate(today.getDate() + minOffset);
    return nextPickupDate.toISOString().split("T")[0];
  };

  // Validate that the user has filled in all necessary fields
  const validateForm = () => {
    if (!formData.pickupAddress || !formData.dropoffAddress) {
      setValidationError("Please fill in both pickup and dropoff addresses.");
      return false;
    }

    if (!formData.riders.every((rider) => /^[a-zA-Z\s]+$/.test(rider.name))) {
      setValidationError("Rider names should only contain letters.");
      return false;
    }

    // Ensure at least 4 days are selected
    if (formData.selectedDays.length < 4) {
      setValidationError("Please select at least 4 days.");
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleDaySelection = (day: string) => {
    setFormData((prevData) => {
      const updatedDays = prevData.selectedDays.includes(day)
        ? prevData.selectedDays.filter((selectedDay) => selectedDay !== day)
        : [...prevData.selectedDays, day];

      const pickupDate = calculateNextPickupDate(updatedDays);

      return {
        ...prevData,
        selectedDays: updatedDays,
        pickupDate: pickupDate || "",
      };
    });
  };

  const handleNext = () => {
    if (!validateForm()) return; // Prevent page navigation if validation fails
    calculateDistance();
    setPage(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pickupDate) {
      setDateError("Please select at least one day.");
      return;
    }

    try {
      await createWeeklyRide({ formData });

      const stripe = await stripePromise;

      if (stripe) {
        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            price: totalPrice,
            rideData: formData,
          }),
        });

        const session = await response.json();
        await stripe.redirectToCheckout({ sessionId: session.id });
      }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <LoadGoogleMapsScript />
      <section className="relative pb-20 lg:pb-36">
        <div className="container mx-auto px-6">
          <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto bg-white p-10 rounded-xl shadow-xl space-y-10"
          >
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div
                className={`h-2.5 rounded-full ${
                  page === 1 ? "bg-teal-500 w-1/2" : "bg-teal-500 w-full"
                }`}
              ></div>
            </div>

            {page === 1 ? (
              <>
                <h1 className="text-3xl font-bold text-center text-teal-700">
                  Weekly Ride Booking
                </h1>

                <Riders formData={formData} setFormData={setFormData} />

                <div className="bg-gray-50 p-6 rounded-xl shadow-md">
                  <AddressAutocomplete
                    label="Pickup Address"
                    onAddressSelect={(address, lat, lng) =>
                      setFormData({
                        ...formData,
                        pickupAddress: address,
                        pickupLat: lat,
                        pickupLng: lng,
                      })
                    }
                  />
                  <AddressAutocomplete
                    label="Dropoff Address"
                    onAddressSelect={(address, lat, lng) =>
                      setFormData({
                        ...formData,
                        dropoffAddress: address,
                        dropoffLat: lat,
                        dropoffLng: lng,
                      })
                    }
                  />

                  {distance !== null && !loadingDistance && (
                    <p className="mt-4 text-sm text-teal-700">
                      Distance: {distance.toFixed(2)} miles
                    </p>
                  )}
                  {loadingDistance && (
                    <p className="mt-4 text-sm text-yellow-600">
                      Calculating distance...
                    </p>
                  )}
                </div>

                <Time
                  timeWarning={timeWarning}
                  setFormData={setFormData}
                  formData={formData}
                  setTimeWarning={setTimeWarning}
                  dateError={dateError}
                />

                <div className="bg-gray-50 p-6 rounded-xl shadow-md">
                  <h4 className="text-2xl font-semibold text-teal-900 mb-6 flex items-center">
                    <CalendarCheck size={28} className="mr-2 text-teal-600" />
                    Select Days of the Week
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {daysOfWeek.map((day) => (
                      <label
                        key={day}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          value={day}
                          checked={formData.selectedDays.includes(day)}
                          onChange={() => handleDaySelection(day)}
                          className="form-checkbox h-5 w-5 text-teal-600 focus:ring-0"
                        />
                        <span className="ml-2 text-teal-900">{day}</span>
                      </label>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-yellow-600">
                    <Info size={16} className="inline" /> If you select a day
                    that matches today, your ride will be scheduled for the same
                    day in the following week, as same-day bookings are not
                    allowed.
                  </p>
                </div>

                {validationError && (
                  <div className="text-red-500 text-sm text-center">
                    {validationError}
                  </div>
                )}

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-teal-600 text-white px-8 py-3 rounded-xl shadow-lg justify-center hover:bg-teal-700 transition duration-300 inline-flex w-full items-center"
                  >
                    <CalendarCheck size={24} className="mr-2" />
                    Next : Review Details
                  </button>
                </div>
              </>
            ) : (
              <Review
                distance={distance}
                formData={formData}
                setPage={setPage}
                totalPrice={totalPrice}
              />
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
