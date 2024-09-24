"use client";
import React, { useState, useEffect, useCallback } from "react";
import { isAfter, parseISO } from "date-fns";
import LoadGoogleMapsScript from "./LoadGoogleMapsScript";
import { loadStripe } from "@stripe/stripe-js";
import DetailSection from "./components/DetailSection";
import LocationSection from "./components/LocationSection";
import ReviewSection from "./components/ReviewSection";
import { Spinner } from "./components/Spinner";
import { FormData, Rider } from "./components/FormTypes";
const stripePromise = loadStripe("YOUR_STRIPE_PUBLIC_KEY");

export default function SingleRideBooking(props: { userId: string }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

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
    stops: [],
    distance: 0,
  });

  const [isSameDay, setIsSameDay] = useState(false);
  const [isOffPeak, setIsOffPeak] = useState(false);

  const [isMoreRiders, setIsMoreRiders] = useState(false);
  const [isWithinOneHour, setIsWithinOneHour] = useState(false);
  const [isWithin30Minutes, setIsWithin30Minutes] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState(16);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [distance, setDistance] = useState<number | null>(null);

  const calculateTotalPrice = useCallback(() => {
    const calculateCost = () => {
      const miles = distance;
      const baseRate = 0;
      let totalCost = baseRate;

      if (miles !== null && miles > 5) {
        const additionalMiles = miles - 5;
        totalCost += additionalMiles * 2;
      }

      return Math.round(totalCost * 100) / 100;
    };

    let price = 16;
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
  }, [isSameDay, isOffPeak, formData.riders, distance, formData.stops]);

  useEffect(() => {
    calculateTotalPrice();
  }, [calculateTotalPrice]);

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

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const stripe = await stripePromise;

    if (stripe) {
      setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-50 to-indigo-100">
      <LoadGoogleMapsScript />
      <div className="container mx-auto px-2 md:px-4 sm:px-6 pt-10 pb-24">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-center text-gray-900 mb-10">
          Book a Single Ride
        </h1>

        <form
          className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md  md:p-10 shadow-2xl rounded-lg"
          onSubmit={handleSubmit}
        >
          <div className="mb-8">
            {step === 1 && (
              <DetailSection
                setIsWithin30Minutes={setIsWithin30Minutes}
                isWithin30Minutes={isWithin30Minutes}
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
          {loading && <Spinner />}
        </form>
      </div>
    </div>
  );
}
