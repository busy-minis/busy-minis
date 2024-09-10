"use client";
import React, { useState, useEffect } from "react";
import Footer from "@/app/components/ui/Footer";
import LoadGoogleMapsScript from "./LoadGoogleMapsScript";
import { loadStripe } from "@stripe/stripe-js";
import DetailSection from "./components/DetailSection";
import LocationSection from "./components/LocationSection";
import ReviewSection from "./components/ReviewSection";

const stripePromise = loadStripe(
  "pk_test_51Pq0V6AU6tLKej0RgL8EyqnGL2FSrqtraFvpHgSi6R5jGL2J2BhRJJmumdajy3WgzuNlnZK6drMlrLAtw5cixYP00kozGoK19"
);

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
  });

  const [isSameDay, setIsSameDay] = useState(false);
  const [isOffPeak, setIsOffPeak] = useState(false);
  const [isMoreRiders, setIsMoreRiders] = useState(false);
  const [isWithinOneHour, setIsWithinOneHour] = useState(false);

  const [totalPrice, setTotalPrice] = useState(19); // Base price
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [distance, setDistance] = useState<number | null>(null);

  // Calculate base price
  const calculateTotalPrice = () => {
    let price = 19; // Base price
    if (isSameDay) price += 25;
    if (isOffPeak) price += 15;
    if (formData.riders.length > 1) {
      price += (formData.riders.length - 1) * 5;
    }
    if (distance) {
      price += calculateCost();
    }
    setTotalPrice(price);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [isSameDay, isOffPeak, formData.riders, distance]);

  // Validation function for Step 1
  const validateStep1 = () => {
    const errors: string[] = [];
    if (!formData.pickupDate) errors.push("Pickup Date is required.");
    if (!formData.pickupTime) errors.push("Pickup Time is required.");
    formData.riders.forEach((rider, index) => {
      if (!rider.name) errors.push(`Rider ${index + 1} Name is required.`);
      if (!rider.age) errors.push(`Rider ${index + 1} Age is required.`);
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
    <div className="px-2 min-h-screen flex flex-col justify-between relative bg-teal-50">
      <LoadGoogleMapsScript /> {/* Load Google Maps API */}
      <div className="container mx-auto px-4 sm:px-6 pt-10 pb-24">
        <h1 className="text-3xl sm:text-5xl font-bold text-center text-gray-900 mb-10">
          Book a Single Ride
        </h1>

        <form
          className="max-w-3xl mx-auto bg-white/80 backdrop-blur-3xl p-10 shadow-2xl rounded-lg"
          onSubmit={handleSubmit}
        >
          <div className="mb-8">
            {step === 1 && (
              <DetailSection
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
              />
            )}
            {step === 3 && (
              <ReviewSection
                distance={distance}
                formData={formData}
                totalPrice={totalPrice}
              />
            )}
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
