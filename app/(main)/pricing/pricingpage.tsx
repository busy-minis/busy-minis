"use client";
import React, { useState, useEffect } from "react";
import {
  UsersThree,
  PhoneOutgoing,
  Wheelchair,
  SoccerBall,
  Church,
  Ticket,
  Gift,
  MapPinLine,
  MinusSquare,
  PlusSquare,
} from "@phosphor-icons/react";
import Link from "next/link";
import { motion } from "framer-motion";

type RideType = "single" | "regular";

export default function PricingPage() {
  const [selectedRideType, setSelectedRideType] = useState<RideType>("single");
  const [passengers, setPassengers] = useState(1);
  const [stops, setStops] = useState(0);
  const [miles, setMiles] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const baseFare = selectedRideType === "single" ? 16 : 13;
    const bookingFee = 3;
    const additionalMiles = miles > 5 ? (miles - 5) * 2 : 0;
    const additionalPassengers = passengers > 1 ? (passengers - 1) * 5 : 0;
    const additionalStops = stops * 5;
    const calculatedPrice =
      baseFare +
      bookingFee +
      additionalMiles +
      additionalPassengers +
      additionalStops;

    setTotalPrice(calculatedPrice);
  }, [selectedRideType, passengers, stops, miles]);

  return (
    <section className="bg-gradient-to-br from-teal-50 to-teal-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-teal-900">
            Pricing Calculator
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-700">
            Estimate your ride cost in just a few clicks.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="mt-12 grid md:grid-cols-2 gap-12">
          {/* Pricing Calculator */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <RidePricingCalculator
              selectedRideType={selectedRideType}
              setSelectedRideType={setSelectedRideType}
              passengers={passengers}
              setPassengers={setPassengers}
              miles={miles}
              setMiles={setMiles}
              stops={stops}
              setStops={setStops}
              totalPrice={totalPrice}
            />
          </motion.div>

          {/* Ride Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-teal-900 text-white rounded-xl shadow-lg p-8 flex flex-col justify-center"
          >
            <RideInfo selectedRideType={selectedRideType} />
          </motion.div>
        </div>

        {/* Pricing Details */}
        <motion.div
          className="mt-24"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <PricingChart />
        </motion.div>
      </div>
    </section>
  );
}

// Ride Pricing Calculator Component
const RidePricingCalculator = ({
  selectedRideType,
  setSelectedRideType,
  passengers,
  setPassengers,
  miles,
  setMiles,
  stops,
  setStops,
  totalPrice,
}: any) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-teal-900">
        Customize Your Ride
      </h2>
      <p className="text-gray-500 mt-2">Estimate your ride cost</p>

      {/* Ride Type Selection */}
      <div className="mt-6">
        <h3 className="text-lg font-medium text-teal-900">Ride Type</h3>
        <div className="flex items-center space-x-4 mt-4">
          <RadioOption
            label="One-time Ride"
            value="single"
            selectedValue={selectedRideType}
            onChange={() => setSelectedRideType("single")}
          />
          <RadioOption
            label="Regular Ride"
            value="regular"
            selectedValue={selectedRideType}
            onChange={() => setSelectedRideType("regular")}
          />
        </div>
      </div>

      {/* Passengers Selection */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-teal-900">Passengers</h3>
        <div className="flex space-x-4 mt-4">
          {["1", "2", "3", "4"].map((num) => (
            <PassengerButton
              key={num}
              number={num}
              setPassengers={setPassengers}
              passengers={passengers}
            />
          ))}
        </div>
      </div>

      {/* Miles Slider */}
      <MileSlider setMiles={setMiles} miles={miles} />

      {/* Additional Stops */}
      <AdditionalStops stops={stops} setStops={setStops} />

      {/* Total Price */}
      <div className="mt-12 text-center">
        <p className="text-3xl font-bold text-teal-900">
          Total Price: ${totalPrice.toFixed(2)}
        </p>
        <Link href="/contact">
          <div className="mt-6 inline-block bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-xl transition transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
            Contact Us
          </div>
        </Link>
      </div>
    </div>
  );
};

// Radio Option Component
const RadioOption = ({
  label,
  value,
  selectedValue,
  onChange,
}: {
  label: string;
  value: string;
  selectedValue: string;
  onChange: () => void;
}) => (
  <label className="flex items-center cursor-pointer space-x-2">
    <input
      type="radio"
      name="rideType"
      value={value}
      checked={selectedValue === value}
      onChange={onChange}
      className="form-radio text-teal-600 h-5 w-5"
    />
    <span className="text-lg text-teal-900 font-medium">{label}</span>
  </label>
);

// Passenger Button Component
const PassengerButton = ({
  number,
  setPassengers,
  passengers,
}: {
  number: string;
  setPassengers: (passengers: number) => void;
  passengers: number;
}) => (
  <button
    onClick={() => setPassengers(parseInt(number))}
    className={`w-16 h-16 flex items-center justify-center rounded-lg border transition ${
      parseInt(number) === passengers
        ? "bg-teal-600 text-white border-teal-600"
        : "bg-white text-teal-900 border-gray-300 hover:bg-teal-100"
    }`}
    aria-pressed={parseInt(number) === passengers}
  >
    <span className="text-lg font-semibold">{number}</span>
  </button>
);

// Mile Slider Component
const MileSlider = ({
  setMiles,
  miles,
}: {
  setMiles: (miles: number) => void;
  miles: number;
}) => (
  <div className="mt-8">
    <h3 className="text-lg font-medium text-teal-900">Distance (miles)</h3>
    <input
      type="range"
      min="0"
      max="50"
      value={miles}
      onChange={(e) => setMiles(parseInt(e.target.value))}
      className="w-full mt-4"
      aria-valuemin={0}
      aria-valuemax={50}
      aria-valuenow={miles}
      aria-label="Distance in miles"
    />
    <div className="flex justify-between mt-2 text-teal-600">
      <span>0 miles</span>
      <span>{miles} miles</span>
      <span>50+ miles</span>
    </div>
  </div>
);

// Additional Stops Component
const AdditionalStops = ({
  stops,
  setStops,
}: {
  stops: number;
  setStops: (stops: number) => void;
}) => (
  <div className="mt-8">
    <h3 className="text-lg font-medium text-teal-900">
      Additional Stops: {stops}
    </h3>
    <div className="flex items-center mt-4 space-x-4">
      <button
        onClick={() => setStops(Math.max(0, stops - 1))}
        className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition"
        aria-label="Decrease stops"
      >
        <MinusSquare size={24} />
      </button>
      <button
        onClick={() => setStops(stops + 1)}
        className="bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 transition"
        aria-label="Increase stops"
      >
        <PlusSquare size={24} />
      </button>
    </div>
  </div>
);

// Ride Information Component
const RideInfo = ({ selectedRideType }: { selectedRideType: RideType }) => (
  <div className="text-center">
    {selectedRideType === "single" ? (
      <>
        <h4 className="text-2xl sm:text-3xl font-bold">One-Time Ride</h4>
        <p className="mt-4 text-base sm:text-lg">
          One-Time rides start at{" "}
          <span className="font-semibold">$16/trip</span>. The base rate covers
          up to 5 miles and 1 passenger. Additional charges apply for extra
          miles, passengers, and stops.
        </p>
      </>
    ) : (
      <>
        <h4 className="text-2xl sm:text-3xl font-bold">Regular Rides</h4>
        <p className="mt-4 text-base sm:text-lg">
          Regular rides start at <span className="font-semibold">$13/trip</span>
          . Ideal for frequent travelers, this rate covers up to 5 miles and 1
          passenger. Additional charges apply for extra miles, passengers, and
          stops.
        </p>
      </>
    )}
    <PricingChart />
  </div>
);

// Pricing Chart Component
const PricingChart = () => (
  <div className="bg-white text-teal-900 rounded-lg shadow-md p-6 mt-8">
    <h3 className="text-xl font-bold mb-4 text-center">Pricing Details</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b-2 border-gray-200 text-left">
              Category
            </th>
            <th className="px-4 py-2 border-b-2 border-gray-200 text-left">
              Description
            </th>
            <th className="px-4 py-2 border-b-2 border-gray-200 text-left">
              Cost
            </th>
          </tr>
        </thead>
        <tbody>
          {pricingDetails.map((row, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="px-4 py-2 border-b border-gray-200">
                {row.category}
              </td>
              <td className="px-4 py-2 border-b border-gray-200">
                {row.description}
              </td>
              <td className="px-4 py-2 border-b border-gray-200 font-semibold">
                {row.cost}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Pricing Details Data
const pricingDetails = [
  {
    category: "Additional Miles",
    description: "Charge per mile beyond 5 miles.",
    cost: "+$2/mile",
  },
  {
    category: "Additional Passengers",
    description: "Cost for each extra passenger.",
    cost: "+$5/passenger",
  },
  {
    category: "Additional Stops",
    description: "Cost per stop.",
    cost: "+$5/stop",
  },
  {
    category: "Wait Times",
    description: "Charges after a 5-minute grace period.",
    cost: "+$1/minute",
  },
  {
    category: "Extended Hours",
    description: "Rides before 6 AM or after 6 PM.",
    cost: "+$10/trip",
  },
];
