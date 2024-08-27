"use client";
import { useState, useEffect } from "react";
import React from "react";
import {
  Users,
  UsersThree,
  UsersFour,
  User,
  MinusSquare,
  PlusSquare,
} from "@phosphor-icons/react";
import Footer from "@/app/components/ui/Footer";

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
    <section className="bg-gradient-to-br from-teal-50 to-teal-100 min-h-screen">
      <div className="pb-24">
        <div className="max-w-7xl mx-auto pt-12 px-6 lg:px-8">
          <h3 className="text-5xl text-center font-bold text-teal-900">
            Pricing Calculator
          </h3>
          <p className="text-center text-gray-700 mt-4 text-lg">
            Calculate your ride cost in just a few clicks.
          </p>

          <div className="grid md:grid-cols-2 gap-12 mt-16">
            <div className="bg-white rounded-xl shadow-lg p-8">
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
            </div>
            <div className="bg-teal-900 text-white rounded-xl shadow-lg p-8">
              <RideInfo selectedRideType={selectedRideType} />
            </div>
          </div>

          <PricingChart />
        </div>
      </div>
      <Footer />
    </section>
  );
}

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
      <h4 className="text-3xl font-semibold text-teal-900">
        Customize Your Ride
      </h4>
      <p className="text-gray-500 mt-2">Estimate your ride cost</p>

      <div className="mt-6">
        <h5 className="text-lg font-semibold text-teal-900">Ride Type</h5>
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

      <div className="mt-8">
        <h5 className="text-lg font-semibold text-teal-900">Passengers</h5>
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

      <MileSlider setMiles={setMiles} miles={miles} />
      <AdditionalStops stops={stops} setStops={setStops} />

      <div className="mt-12 text-center">
        <p className="text-3xl font-bold text-teal-900">
          Total Price: ${totalPrice.toFixed(2)}
        </p>
        <button className="bg-teal-600 text-white px-6 py-3 mt-6 rounded-lg shadow-md hover:bg-teal-700 transition">
          Get in Touch
        </button>
      </div>
    </div>
  );
};

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
      className="form-radio text-teal-600 focus:ring-0"
    />
    <span className="text-lg text-teal-900 font-medium">{label}</span>
  </label>
);

const PassengerButton = ({
  number,
  setPassengers,
  passengers,
}: {
  number: string;
  setPassengers: (passengers: number) => void;
  passengers: number;
}) => (
  <div
    onClick={() => setPassengers(parseInt(number))}
    className={`w-16 h-16 flex items-center justify-center rounded-lg border ${
      parseInt(number) === passengers
        ? "bg-teal-600 text-white"
        : "bg-white text-teal-900 hover:bg-teal-100"
    } cursor-pointer transition`}
  >
    <span className="text-lg font-semibold">{number}</span>
  </div>
);

const MileSlider = ({
  setMiles,
  miles,
}: {
  setMiles: (miles: number) => void;
  miles: number;
}) => (
  <div className="mt-8">
    <h5 className="text-lg font-semibold text-teal-900">Distance (miles)</h5>
    <input
      type="range"
      min="0"
      max="50"
      value={miles}
      onChange={(e) => setMiles(parseInt(e.target.value))}
      className="w-full mt-4"
    />
    <div className="flex justify-between mt-2 text-teal-600">
      <span>0 miles</span>
      <span>{miles} miles</span>
      <span>50+ miles</span>
    </div>
  </div>
);

const AdditionalStops = ({
  stops,
  setStops,
}: {
  stops: number;
  setStops: (stops: number) => void;
}) => (
  <div className="mt-8">
    <h5 className="text-lg font-semibold text-teal-900">
      Additional Stops: {stops}
    </h5>
    <div className="flex items-center mt-4 space-x-4">
      <button
        onClick={() => setStops(Math.max(0, stops - 1))}
        className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition"
      >
        <MinusSquare size={24} />
      </button>
      <button
        onClick={() => setStops(stops + 1)}
        className="bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 transition"
      >
        <PlusSquare size={24} />
      </button>
    </div>
  </div>
);

const RideInfo = ({ selectedRideType }: { selectedRideType: RideType }) => (
  <div className="text-center">
    {selectedRideType === "single" ? (
      <>
        <h4 className="text-3xl font-bold">One-Time Ride</h4>
        <p className="mt-4 text-lg text-white">
          One-Time rides start at $16/trip with a $3 booking fee. The base rate
          covers up to 5 miles and 1 passenger. Additional charges apply for
          extra miles, passengers, and stops.
        </p>
      </>
    ) : (
      <>
        <h4 className="text-3xl font-bold">Regular Rides</h4>
        <p className="mt-4 text-lg text-white">
          Regular rides start at $13/trip with a $3 booking fee. Ideal for
          frequent travelers, this rate covers up to 5 miles and 1 passenger.
          Additional charges apply for extra miles, passengers, and stops.
        </p>
      </>
    )}
  </div>
);

const PricingChart = () => (
  <div className="bg-white rounded-lg shadow-md p-4 sm:p-8 mt-8 sm:mt-16">
    <h2 className="text-xl sm:text-2xl font-bold text-teal-900 mb-4 text-center sm:text-left">
      Pricing Details
    </h2>
    <div className="overflow-x-auto">
      <table className="min-w-full text-left">
        <thead>
          <tr>
            <th className="border-b p-2 sm:p-4 text-teal-900">Category</th>
            <th className="border-b p-2 sm:p-4 text-teal-900">Description</th>
            <th className="border-b p-2 sm:p-4 text-teal-900">Cost</th>
          </tr>
        </thead>
        <tbody>
          {pricingDetails.map((row, index) => (
            <tr key={index}>
              <td className="border-b p-2 sm:p-4 font-semibold">
                {row.category}
              </td>
              <td className="border-b p-2 sm:p-4">{row.description}</td>
              <td className="border-b p-2 sm:p-4">{row.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const pricingDetails = [
  {
    category: "One-Time Rides",
    description: "Covers up to 5 miles and 1 passenger. $3 booking fee.",
    cost: "$16/trip",
  },
  {
    category: "Regular Rides",
    description: "Frequent riders (min. 4 days/week). $3 booking fee.",
    cost: "$13/trip",
  },
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
