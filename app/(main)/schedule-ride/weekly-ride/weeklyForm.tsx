"use client";
import React, { useState, useEffect, useCallback } from "react";
import { CalendarCheck, Info } from "@phosphor-icons/react";
import { createWeeklyRide } from "@/utils/supabase/supabaseQueries";
import { loadStripe } from "@stripe/stripe-js";
import AddressAutocomplete from "./components/AddressAutocompleteProps";
import LoadGoogleMapsScript from "./components/LoadGoogleMapsScript";
import Riders from "./components/Riders";
import Stops from "./components/Stops";
import Review from "./components/Review";
import Time from "./components/Time";

const stripePromise = loadStripe("your-stripe-public-key-here");

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

interface Stop {
  address: string;
  lat?: number;
  lng?: number;
}

interface FormData {
  renewal_date: string; // Add this line
  user_id: string;
  status: string;
  end_date: string;
  pickupDate: string;
  pickupAddress: string;
  pickupLat?: number;
  total_price: number;
  pickupLng?: number;
  stops: Stop[];
  dropoffAddress: string;
  dropoffLat?: number;
  dropoffLng?: number;
  riders: Rider[];
  selectedTime: string;
  selectedDays: string[];
}

export default function WeeklyRideBookingPage(props: { userId: string }) {
  const [totalPrice, setTotalPrice] = useState(13);

  const [formData, setFormData] = useState<FormData>({
    renewal_date: "",
    user_id: props.userId,
    status: "pending",
    end_date: "",
    pickupDate: "",
    total_price: totalPrice,
    pickupAddress: "",
    pickupLat: undefined,
    pickupLng: undefined,
    stops: [], // No initial stops
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
  const [regularPrice, setRegularPrice] = useState(0); // Add this line
  const [savings, setSavings] = useState(0); // Add this line

  const [distance, setDistance] = useState<number | null>(null);
  const [loadingDistance, setLoadingDistance] = useState(false);

  const daysOfWeek = Object.keys(daysOfWeekMap);

  const calculateDistance = useCallback(() => {
    if (
      window.google &&
      formData.pickupLat !== undefined &&
      formData.pickupLng !== undefined &&
      formData.dropoffLat !== undefined &&
      formData.dropoffLng !== undefined
    ) {
      setLoadingDistance(true);
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
        setLoadingDistance(false);
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
  }, [
    formData.pickupLat,
    formData.pickupLng,
    formData.dropoffLat,
    formData.dropoffLng,
    formData.stops,
  ]);

  const calculateTotalPrice = useCallback(() => {
    const basePricePerDay = 13;
    const regularPricePerDay = 16; // Regular ride price per trip
    const selectedDaysCount = formData.selectedDays.length;

    const calculateAdditionalCost = () => {
      const miles = distance;
      let totalCost = 0;

      if (miles !== null && miles > 5) {
        const additionalMiles = miles - 5;
        totalCost += additionalMiles * 2;
      }

      return Math.round(totalCost * 100) / 100;
    };

    // Calculate total price for weekly rides
    let price = selectedDaysCount * basePricePerDay;

    if (timeWarning) price += 10;
    if (formData.riders.length > 1) {
      price += (formData.riders.length - 1) * 5;
    }
    if (distance) {
      price += calculateAdditionalCost();
    }
    if (formData.stops.length > 0) {
      price += formData.stops.length * 5;
    }

    setTotalPrice(price);

    // Calculate total price for regular rides
    let regularPriceTotal = selectedDaysCount * regularPricePerDay;

    if (timeWarning) regularPriceTotal += 10;
    if (formData.riders.length > 1) {
      regularPriceTotal += (formData.riders.length - 1) * 5;
    }
    if (distance) {
      regularPriceTotal += calculateAdditionalCost();
    }
    if (formData.stops.length > 0) {
      regularPriceTotal += formData.stops.length * 5;
    }

    setRegularPrice(regularPriceTotal);

    // Calculate savings
    const savingsAmount = regularPriceTotal - price;
    setSavings(savingsAmount);
  }, [
    timeWarning,
    formData.riders,
    formData.selectedDays,
    distance,
    formData.stops.length,
  ]);

  useEffect(() => {
    calculateTotalPrice();
  }, [
    calculateTotalPrice,
    formData.selectedDays.length,
    formData.riders.length,
    formData.stops.length,
    distance,
    timeWarning,
  ]);

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

  function calculateRenewalDate(
    pickupDate: string,
    selectedDays: string[]
  ): string {
    const daysOfWeekMap: { [key: string]: number } = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };

    const dates = selectedDays.map((day) => {
      const targetDay = daysOfWeekMap[day];
      const initialDate = new Date(pickupDate);
      const currentDay = initialDate.getDay();

      let dayDifference = targetDay - currentDay;
      if (dayDifference < 0) dayDifference += 7; // Adjust for days that have already passed in the week
      if (dayDifference === 0) dayDifference = 7; // Ensure the day is in the next week

      const nextDate = new Date(initialDate);
      nextDate.setDate(initialDate.getDate() + dayDifference);

      return nextDate;
    });

    // Find the latest date
    const renewalDate = dates.reduce((latest, current) =>
      current > latest ? current : latest
    );

    return renewalDate.toISOString().split("T")[0]; // Return in YYYY-MM-DD format
  }

  const validateForm = () => {
    if (!formData.pickupAddress || !formData.dropoffAddress) {
      setValidationError("Please fill in both pickup and dropoff addresses.");
      return false;
    }

    if (!formData.riders.every((rider) => /^[a-zA-Z\s]+$/.test(rider.name))) {
      setValidationError("Rider names should only contain letters.");
      return false;
    }

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

      const pickupDate = calculateNextPickupDate(updatedDays) || "";

      // Calculate the renewal date
      const renewalDate =
        pickupDate && updatedDays.length > 0
          ? calculateRenewalDate(pickupDate, updatedDays)
          : "";

      return {
        ...prevData,
        selectedDays: updatedDays,
        pickupDate,
        renewal_date: renewalDate, // Set the renewal date here
      };
    });
  };

  const handleNext = () => {
    if (!validateForm()) return;
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
            className="max-w-3xl mx-auto bg-white p-2   md:p-10 rounded-xl shadow-xl space-y-10"
          >
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div
                className={`h-2.5 rounded-full ${
                  page === 1 ? "bg-gray-700 w-1/2" : "bg-gray-700 w-full"
                }`}
              ></div>
            </div>

            {page === 1 ? (
              <>
                <h1 className="text-3xl font-bold text-center text-gray-800">
                  Weekly Ride Booking
                </h1>

                <Riders formData={formData} setFormData={setFormData} />

                <div className="bg-gray-50   md:p-6 rounded-xl shadow-md">
                  <AddressAutocomplete
                    label="Pickup Address"
                    value={formData.pickupAddress} // Pass current pickup address
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
                    value={formData.dropoffAddress} // Pass current dropoff address
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

                <Stops formData={formData} setFormData={setFormData} />

                {distance !== null && !loadingDistance && (
                  <p className="mt-4 text-sm text-gray-700">
                    Distance: {distance.toFixed(2)} miles
                  </p>
                )}
                {loadingDistance && (
                  <p className="mt-4 text-sm text-yellow-600">
                    Calculating distance...
                  </p>
                )}

                <Time
                  timeWarning={timeWarning}
                  setFormData={setFormData}
                  formData={formData}
                  setTimeWarning={setTimeWarning}
                  dateError={dateError}
                />

                <div className="bg-gray-50   md:p-6 rounded-xl shadow-md">
                  <h4 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                    <CalendarCheck size={28} className="mr-2 text-gray-700" />
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
                          className="form-checkbox h-5 w-5 text-gray-700 focus:ring-0"
                        />
                        <span className="ml-2 text-gray-800">{day}</span>
                      </label>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-yellow-600">
                    <Info size={16} className="inline" /> Weekly rides will not
                    be booked on the same day and will start on the next
                    calendar day.
                  </p>
                  {/* Added informational text */}
                  <p className="mt-2 text-sm text-gray-600">
                    <Info size={16} className="inline" /> You must select at
                    least <strong>4 days</strong> for weekly rides.
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
                    className="bg-gray-700 text-white px-8 py-3 rounded-xl shadow-lg justify-center hover:bg-gray-800 transition duration-300 inline-flex w-full items-center"
                  >
                    <CalendarCheck size={24} className="mr-2" />
                    Next: Review Details
                  </button>
                </div>
              </>
            ) : (
              <Review
                distance={distance}
                formData={formData}
                setPage={setPage}
                totalPrice={totalPrice}
                regularPrice={regularPrice} // Add this line
                savings={savings} // Add this line
              />
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
