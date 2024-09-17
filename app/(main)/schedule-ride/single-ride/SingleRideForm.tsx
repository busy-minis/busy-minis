"use client";
import React, { useState, useEffect, useCallback } from "react";
import { isAfter, parseISO } from "date-fns";
import LoadGoogleMapsScript from "./LoadGoogleMapsScript";
import { loadStripe } from "@stripe/stripe-js";
import DetailSection from "./components/DetailSection";
import LocationSection from "./components/LocationSection";
import ReviewSection from "./components/ReviewSection";

const stripePromise = loadStripe(
  "pk_test_51Pq0V6AU6tLKej0RgL8EyqnGLr2FSrqtraFvpHgSi6R5jGL2J2BhRJJmumdajy3WgzuNlnZK6drMlrLAtw5cixYP00kozGoK19"
);

interface Stop {
  address: string;
  lat?: number;
  lng?: number;
}

interface Rider {
  name: string;
  age: string;
}

interface FormData {
  user_id: string;
  status: string;
  pickupDate: string;
  pickupTime: string;
  pickupAddress: string;
  pickupLat?: number;
  pickupLng?: number;
  dropoffAddress: string;
  dropoffLat?: number;
  dropoffLng?: number;
  riders: Rider[];
  distance: number;
  stops: Stop[]; // Add stops field
}

export default function SingleRideBooking(props: { userId: string }) {
  const [step, setStep] = useState(1); // Step tracker (1 to 3)

  const [formData, setFormData] = useState<FormData>({
    user_id: props.userId,
    status: "pending",
    pickupDate: "",
    pickupTime: "",
    pickupAddress: "",
    pickupLat: undefined,
    pickupLng: undefined,
    dropoffAddress: "",
    dropoffLat: undefined,
    dropoffLng: undefined,
    riders: [{ name: "", age: "" }],
    stops: [], // Initialize stops as empty array
    distance: 0,
  });

  const [isSameDay, setIsSameDay] = useState(false);
  const [isOffPeak, setIsOffPeak] = useState(false);
  const [isMoreRiders, setIsMoreRiders] = useState(false);
  const [isWithinOneHour, setIsWithinOneHour] = useState(false);

  const [totalPrice, setTotalPrice] = useState(16); // Base price
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [distance, setDistance] = useState<number | null>(null);

  // Calculate base price
  const calculateTotalPrice = useCallback(() => {
    const calculateCost = () => {
      const miles = distance;
      const baseRate = 0; // Base rate covers up to 5 miles
      let totalCost = baseRate;

      if (miles !== null && miles > 5) {
        const additionalMiles = miles - 5;
        totalCost += additionalMiles * 2; // $2 per mile after 5 miles
      }

      // Round the total cost to two decimal places as a number
      return Math.round(totalCost * 100) / 100;
    };
    let price = 16; // Base price
    if (isSameDay) price += 25;
    if (formData.stops && formData.stops.length > 0) {
      price += formData.stops.length * 5;
    }
    if (isOffPeak) price += 15;
    if (formData.riders.length > 1) {
      price += (formData.riders.length - 1) * 5;
    }
    if (distance) {
      price += calculateCost();
    }
    setTotalPrice(price);
  }, [isSameDay, isOffPeak, formData.riders, distance, formData.stops]); // Add calculateCost as a dependency

  useEffect(() => {
    calculateTotalPrice(); // Call the memoized version of the function
  }, [calculateTotalPrice]);
  // Validation function for Step 1
  const validateStep1 = () => {
    const errors: string[] = [];
    if (!formData.pickupDate) {
      errors.push("Pickup Date is required.");
    }
    if (!formData.pickupTime) errors.push("Pickup Time is required.");
    formData.riders.forEach((rider, index) => {
      if (!rider.name) errors.push(`Rider ${index + 1} Name is required.`);
      if (!rider.age || parseInt(rider.age) <= 0) {
        errors.push(`Rider ${index + 1} Age must be a positive number.`);
      }
    });
    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Move to the next step based on validation
  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  // Handle form submission on the last step
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="px-4 min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-50 to-indigo-100">
      <LoadGoogleMapsScript />
      <div className="container mx-auto px-4 sm:px-6 pt-10 pb-24">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-center text-gray-900 mb-10">
          Book a Single Ride
        </h1>

        <form
          className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md p-10 shadow-2xl rounded-lg"
          onSubmit={handleSubmit}
        >
          <div className="mb-8">
            {step === 1 && (
              <DetailSection
                setValidationErrors={setValidationErrors}
                validationErrors={validationErrors}
                formData={formData}
                setFormData={setFormData}
                handleNextStep={handleNextStep}
                isOffPeak={isOffPeak}
                setIsOffPeak={setIsOffPeak}
                isMoreRiders={isMoreRiders}
                setIsMoreRiders={setIsMoreRiders}
                isSameDay={isSameDay}
                setIsSameDay={setIsSameDay}
                setIsWithinOneHour={setIsWithinOneHour}
                isWithinOneHour={isWithinOneHour}
              />
            )}
            {step === 2 && (
              <LocationSection
                formData={formData}
                setFormData={setFormData}
                setDistance={setDistance}
                handleNextStep={handleNextStep}
                setStep={setStep}
                setValidationErrors={setValidationErrors}
                validationErrors={validationErrors}
              />
            )}
            {step === 3 && (
              <ReviewSection
                setStep={setStep}
                distance={distance}
                formData={formData}
                totalPrice={totalPrice}
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
