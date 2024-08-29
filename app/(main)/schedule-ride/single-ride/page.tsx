"use client";
import React, { useState, useEffect } from "react";
import { createRide } from "@/utils/supabase/supabaseQueries";
import Footer from "@/app/components/ui/Footer";
import AddressAutocomplete from "./AddressAutocompleteProps";
import LoadGoogleMapsScript from "./LoadGoogleMapsScript";
import { format, isBefore, parseISO, addHours } from "date-fns";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51Pq0V6AU6tLKej0RgL8EyqnGLr2FSrqtraFvpHgSi6R5jGL2J2BhRJJmumdajy3WgzuNlnZK6drMlrLAtw5cixYP00kozGoK19"
);

interface Rider {
  name: string;
  age: string;
}

interface FormData {
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

export default function SingleRideBooking() {
  const today = format(new Date(), "yyyy-MM-dd");
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<FormData>({
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
  const [isWithinOneHour, setIsWithinOneHour] = useState(false);
  const [totalPrice, setTotalPrice] = useState(19); // Base price
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const calculateTotalPrice = () => {
    let price = 19; // Base price
    if (isSameDay) price += 25;
    if (isOffPeak) price += 15;
    if (formData.riders.length > 1) {
      price += (formData.riders.length - 1) * 5;
    }
    setTotalPrice(price);
  };
  useEffect(() => {
    calculateTotalPrice();
  }, [isSameDay, isOffPeak, formData.riders]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FormData | keyof Rider,
    index?: number
  ) => {
    const { value } = e.target;

    if (typeof index === "number" && (field === "name" || field === "age")) {
      const updatedRiders = [...formData.riders];
      updatedRiders[index][field] = value;
      setFormData({ ...formData, riders: updatedRiders });
    } else {
      setFormData({ ...formData, [field]: value });
      if (field === "pickupDate")
        checkSameDayAndTime(value, formData.pickupTime);
      if (field === "pickupTime")
        checkSameDayAndTime(formData.pickupDate, value);
    }
  };

  const checkSameDayAndTime = (pickupDate: string, pickupTime: string) => {
    const isSame = pickupDate === today;
    const isOffPeakTime =
      pickupTime &&
      (parseInt(pickupTime.split(":")[0]) < 6 ||
        parseInt(pickupTime.split(":")[0]) >= 18);
    const withinOneHour =
      pickupDate &&
      pickupTime &&
      isBefore(
        parseISO(`${pickupDate}T${pickupTime}`),
        addHours(new Date(), 1)
      );

    setIsSameDay(isSame);
    setIsOffPeak(Boolean(isOffPeakTime));
    setIsWithinOneHour(Boolean(withinOneHour));
  };

  const handleAddRider = () =>
    setFormData({
      ...formData,
      riders: [...formData.riders, { name: "", age: "" }],
    });

  const handleRemoveRider = (index: number) =>
    setFormData({
      ...formData,
      riders: formData.riders.filter((_, i) => i !== index),
    });

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

  const validateStep1 = () => {
    const errors: string[] = [];

    // Check if Pickup Date and Time are set
    if (!formData.pickupDate) errors.push("Pickup Date is required.");
    if (!formData.pickupTime) errors.push("Pickup Time is required.");

    // Check if each rider has a name and age
    formData.riders.forEach((rider, index) => {
      if (!rider.name) errors.push(`Rider ${index + 1} Name is required.`);
      if (!rider.age) errors.push(`Rider ${index + 1} Age is required.`);
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Proceed to Stripe Payment Page
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
    <div className="min-h-screen flex flex-col justify-between">
      <LoadGoogleMapsScript /> {/* Load Google Maps API */}
      <div className="container mx-auto px-4 sm:px-6 pt-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-6">
          Book a Single Ride
        </h1>

        <form
          className="max-w-lg mx-auto bg-white p-8 shadow-lg rounded-lg"
          onSubmit={handleSubmit}
        >
          {step === 1 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Pickup Date"
                  type="date"
                  value={formData.pickupDate}
                  min={today} // Restrict past dates
                  onChange={(e) => handleInputChange(e, "pickupDate")}
                />
                <Input
                  label="Pickup Time"
                  type="time"
                  value={formData.pickupTime}
                  onChange={(e) => handleInputChange(e, "pickupTime")}
                />
              </div>

              {isSameDay && (
                <Warning text="Same-day pickups will incur an additional fee." />
              )}
              {isOffPeak && (
                <Warning text="Off-peak hours (before 6 AM or after 6 PM) will incur an additional fee of $15.00." />
              )}
              {isWithinOneHour && (
                <Warning text="Rides within one hour will incur an additional fee" />
              )}

              {formData.riders.map((rider, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
                >
                  <Input
                    label={`Rider ${index + 1} Name`}
                    value={rider.name}
                    onChange={(e) => handleInputChange(e, "name", index)}
                  />
                  <Input
                    label={`Rider ${index + 1} Age`}
                    type="number"
                    value={rider.age}
                    onChange={(e) => handleInputChange(e, "age", index)}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      className="text-red-600 font-bold mt-2"
                      onClick={() => handleRemoveRider(index)}
                    >
                      Remove Rider
                    </button>
                  )}
                </div>
              ))}

              {formData.riders.length < 4 && (
                <button
                  type="button"
                  className="w-full px-4 py-2 bg-teal-500 text-white"
                  onClick={handleAddRider}
                >
                  Add Another Rider
                </button>
              )}

              {validationErrors.length > 0 && (
                <div className="text-red-600 text-sm mb-4">
                  {validationErrors.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}

              <button
                type="button"
                className="w-full px-4 py-2 bg-orange-500 text-white mt-4"
                onClick={handleNextStep}
              >
                Next: Add Location
              </button>
            </>
          ) : (
            <>
              <AddressAutocomplete
                label="Pickup Address"
                onAddressSelect={handlePickupAddressSelect}
              />
              <AddressAutocomplete
                label="Dropoff Address"
                onAddressSelect={handleDropoffAddressSelect}
              />

              <div className="mt-4">
                <h2 className="text-lg font-bold">
                  Total Price: ${totalPrice.toFixed(2)}
                </h2>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  className="w-full px-4 py-2 bg-gray-500 text-white mr-2"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-orange-500 text-white ml-2"
                >
                  Continue to Payment
                </button>
              </div>
            </>
          )}
        </form>
      </div>
      <Footer />
    </div>
  );
}

interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: string; // Allow a minimum for date restriction
}

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  value,
  onChange,
  min,
}) => (
  <div className="mb-6">
    <label className="block text-gray-700 font-semibold mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      min={min}
      className="block w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-lg"
      required
    />
  </div>
);

interface WarningProps {
  text: string;
}

const Warning: React.FC<WarningProps> = ({ text }) => (
  <p className="text-center text-red-600 mb-4">{text}</p>
);
