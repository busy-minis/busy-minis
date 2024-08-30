"use client";
import React, { useState, useEffect } from "react";
import { createRide } from "@/utils/supabase/supabaseQueries";
import Footer from "@/app/components/ui/Footer";
import AddressAutocomplete from "./AddressAutocompleteProps";
import LoadGoogleMapsScript from "./LoadGoogleMapsScript";
import { format, isBefore, parseISO, addHours } from "date-fns";
import { loadStripe } from "@stripe/stripe-js";
import {
  Calendar,
  Clock,
  User,
  Plus,
  Trash,
  ArrowRight,
  ArrowLeft,
  CurrencyDollar,
} from "@phosphor-icons/react";

const stripePromise = loadStripe(
  "pk_test_51Pq0V6AU6tLKej0RgL8EyqnGLr2FSrqtraFvpHgSi6R5jGL2J2BhRJJmumdajy3WgzuNlnZK6drMlrLAtw5cixYP00kozGoK19"
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
  const today = format(new Date(), "yyyy-MM-dd");
  const [step, setStep] = useState(1);

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
    const data = await createRide(formData);
    console.log(data);
    //Proceed to Stripe Payment Page
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
    <div className="min-h-screen flex flex-col justify-between relative   ">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-teal-50 to-teal-100 opacity-70"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-orange-50 to-yellow-100 opacity-70"></div>
      </div>
      <LoadGoogleMapsScript /> {/* Load Google Maps API */}
      <div className="container mx-auto px-4 sm:px-6 pt-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-center text-gray-900 mb-10">
          Book a Single Ride
        </h1>

        <form
          className="max-w-3xl mx-auto bg-white/80 backdrop-blur-3xl p-10 shadow-2xl rounded-lg"
          onSubmit={handleSubmit}
        >
          <div className="mb-8">
            <div className="text-center mb-8 flex justify-center items-center space-x-4">
              <StepIndicator step={step} currentStep={1} label="Details" />
              <span className="font-semibold text-gray-700">|</span>
              <StepIndicator step={step} currentStep={2} label="Location" />
            </div>
            {step === 1 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Pickup Date"
                    type="date"
                    icon={<Calendar size={24} />}
                    value={formData.pickupDate}
                    min={today} // Restrict past dates
                    onChange={(e) => handleInputChange(e, "pickupDate")}
                  />
                  <Input
                    label="Pickup Time"
                    type="time"
                    icon={<Clock size={24} />}
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
                  <Warning text="Rides within one hour will incur an additional fee." />
                )}

                {formData.riders.map((rider, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-6"
                  >
                    <Input
                      label={`Rider ${index + 1} Name`}
                      icon={<User size={24} />}
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
                        className="text-red-600 bg-red-100 w-fit px-2 py-2 font-bold  flex items-center space-x-2"
                        onClick={() => handleRemoveRider(index)}
                      >
                        <Trash size={20} />
                        <span>Remove Rider</span>
                      </button>
                    )}
                  </div>
                ))}

                {formData.riders.length < 4 && (
                  <button
                    type="button"
                    className=" px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-200 ease-in-out transform hover:-translate-y-1 flex justify-center items-center space-x-2"
                    onClick={handleAddRider}
                  >
                    <Plus size={20} />
                    <span>Add Another Rider</span>
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
                  className="w-full px-4 py-2 bg-gradient-to-r from-theme-orange to-theme-yellow text-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-200 ease-in-out transform hover:-translate-y-1 mt-6 flex justify-center items-center space-x-2"
                  onClick={handleNextStep}
                >
                  <span>Next</span>
                  <ArrowRight size={24} />
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

                <div className="mt-6 flex justify-center items-center space-x-2">
                  <CurrencyDollar size={24} />
                  <h2 className="text-lg font-bold">
                    Total Price: ${totalPrice.toFixed(2)}
                  </h2>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-200 ease-in-out transform hover:-translate-y-1 mr-2 flex justify-center items-center space-x-2"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft size={24} />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-gradient-to-r from-theme-orange to-theme-yellow text-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-200 ease-in-out transform hover:-translate-y-1 ml-2 flex justify-center items-center space-x-2"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight size={24} />
                  </button>
                </div>
              </>
            )}
          </div>
        </form>
      </div>
      <div className="py-24"></div>
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
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  value,
  onChange,
  min,
  icon,
}) => (
  <div className="mb-6">
    <label className="block text-gray-700 font-semibold mb-2 flex items-center space-x-2">
      {icon}
      <span>{label}</span>
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      min={min}
      className="block w-full px-4 py-2 text-gray-900 bg-gray-200 rounded-lg border-2 border-transparent focus:border-theme-orange focus:bg-white focus:outline-none transition-colors duration-200"
      required
    />
  </div>
);

interface WarningProps {
  text: string;
}

const Warning: React.FC<WarningProps> = ({ text }) => (
  <p className=" text-red-600 font-semibold mb-4 flex  space-x-2">
    <WarningIcon />
    <span>{text}</span>
  </p>
);

const StepIndicator: React.FC<{
  step: number;
  currentStep: number;
  label: string;
}> = ({ step, currentStep, label }) => (
  <div className="flex items-center">
    <span
      className={`inline-block w-8 h-8 rounded-full ${
        step === currentStep
          ? "bg-theme-orange text-white"
          : "bg-gray-200 text-gray-700"
      } font-bold flex justify-center items-center`}
    >
      {currentStep}
    </span>
    <span className="ml-2 font-semibold text-gray-900">{label}</span>
  </div>
);

const WarningIcon = () => (
  <svg
    className="w-6 h-6 text-red-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13 16h-1v-4h1m0 4h1v-4h-1m-1-4V7h2v5h-2zm1 7h.01M21 11.25A8.25 8.25 0 117.75 3 8.25 8.25 0 0121 11.25z"
    ></path>
  </svg>
);
