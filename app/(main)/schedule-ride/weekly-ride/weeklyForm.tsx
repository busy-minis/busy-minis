"use client";
import React, { useState, useEffect, useCallback } from "react";
import Footer from "@/app/components/ui/Footer";
import { CalendarCheck, Clock, Info } from "@phosphor-icons/react";
import { createWeeklyRide } from "@/utils/supabase/supabaseQueries";
import { loadStripe } from "@stripe/stripe-js";

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

interface Rider {
  name: string;
  age: string;
}

interface FormData {
  user_id: string;
  status: string;
  pickupDate: string;
  selectedTime: string;
  selectedDays: string[];
  pickupAddress: string;
  end_date: string;
  pickupLat?: number;
  pickupLng?: number;
  dropoffAddress: string;
  dropoffLat?: number;
  dropoffLng?: number;
  riders: Rider[];
}

export default function WeeklyRideBookingPage(props: { userId: string }) {
  const [formData, setFormData] = useState<FormData>({
    user_id: props.userId,
    status: "pending",
    end_date: "",
    pickupDate: "", // Will be auto-calculated based on selected days
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
  const [page, setPage] = useState(1);
  const [totalPrice, setTotalPrice] = useState(13);
  const [distance, setDistance] = useState<number | null>(null);

  const daysOfWeek = Object.keys(daysOfWeekMap);

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
  // Calculate total price based on riders and time
  const calculateTotalPrice = useCallback(() => {
    const basePricePerDay = 13; // Base price per day
    const selectedDaysCount = formData.selectedDays.length; // Number of selected days
    const calculateCost = () => {
      const miles = distance;
      let totalCost = 0; // Initialize the total cost

      if (miles !== null && miles > 5) {
        const additionalMiles = miles - 5;
        totalCost += additionalMiles * 2; // $2 per mile after 5 miles
      }

      // Round the total cost to two decimal places as a number
      return Math.round(totalCost * 100) / 100;
    };

    // Calculate base price for all selected days
    let price = selectedDaysCount * basePricePerDay; // Price based on the number of selected days

    if (timeWarning) price += 10; // Add off-peak surcharge
    if (formData.riders.length > 1) {
      price += (formData.riders.length - 1) * 5; // Add rider surcharge
    }
    if (distance) {
      price += calculateCost(); // Add distance surcharge
    }

    setTotalPrice(price); // Set the calculated price
  }, [timeWarning, formData.riders, formData.selectedDays, distance]);
  useEffect(() => {
    calculateTotalPrice();
  }, [calculateTotalPrice]);

  // Calculate the first pickup date after today based on selected days
  const calculateNextPickupDate = (selectedDays: string[]): string | null => {
    if (selectedDays.length === 0) return null;

    const today = new Date();
    const todayDay = today.getDay(); // 0 for Sunday, 1 for Monday, etc.

    // Find the next available day after today
    let minOffset = 7;
    selectedDays.forEach((day) => {
      const selectedDayOffset = daysOfWeekMap[day];
      let offset = (selectedDayOffset - todayDay + 7) % 7;
      if (offset === 0) offset = 7; // Skip today if the same day is selected
      if (offset < minOffset) minOffset = offset;
    });

    const nextPickupDate = new Date();
    nextPickupDate.setDate(today.getDate() + minOffset);
    return nextPickupDate.toISOString().split("T")[0]; // Return in YYYY-MM-DD format
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
        pickupDate: pickupDate || "", // Automatically update the pickup date
      };
    });
  };
  const handleNext = () => {
    calculateDistance();
    setPage(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pickupDate) {
      setDateError("Please select at least one day.");
      return;
    }

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
  };

  return (
    <div className="">
      <LoadGoogleMapsScript /> {/* Load Google Maps API */}
      {/* Booking Form */}
      <section className="relative pb-20 lg:pb-36">
        <div className="container mx-auto px-6">
          <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto bg-white p-10 rounded-xl shadow-xl space-y-10"
          >
            {page === 1 ? (
              <>
                {/* Riders Card */}
                <Riders formData={formData} setFormData={setFormData} />

                {/* Pickup and Dropoff Card */}
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
                </div>

                {/* Date & Time Card */}
                <Time
                  timeWarning={timeWarning}
                  setFormData={setFormData}
                  formData={formData}
                  setTimeWarning={setTimeWarning}
                  dateError={dateError}
                />

                {/* Days of the Week Card */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-md">
                  <h4 className="text-2xl font-semibold text-teal-900 mb-6 flex items-center">
                    <CalendarCheck size={28} className="mr-2 text-teal-600" />{" "}
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
                    that matches today's date, your ride will be scheduled for
                    the same day in the following week, as same-day bookings are
                    not allowed.
                  </p>
                </div>

                {/* Next Button */}
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
                formData={formData}
                setPage={setPage}
                totalPrice={totalPrice}
              />
            )}
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
}
