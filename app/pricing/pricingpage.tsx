"use client";
import { useState, useEffect } from "react";
import React from "react";
import { NavBar } from "../components/ui/NavBar";
import {
  Users,
  UsersThree,
  UsersFour,
  User,
  MinusSquare,
  PlusSquare,
} from "@phosphor-icons/react";
import Image from "next/image";
import Footer from "../components/ui/Footer";

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
    <section className="relative">
      <div className="pb-24">
        <Image
          src={"/assets/dall.png"}
          fill
          alt=""
          className="-z-10 opacity-20 bg-contain object-cover"
        />
        <div className="max-w-5xl mx-auto pt-12 px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl text-center tracking-tighter font-light">
            Get A Free Quote
          </h3>
          <section className="flex flex-col md:flex-row mt-8 border bg-white">
            <div className="p-8 w-full">
              <div className="mt-2">
                <h4 className="text-3xl font-semibold tracking-tighter text-theme-orange">
                  Ride Pricing Calculator
                </h4>
                <p className="text-xs md:text-sm mt-2 font-medium">
                  *All prices are estimates*
                </p>

                <div className="flex flex-col text-gray-700 text-lg font-semibold space-y-2 mt-8">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="rideType"
                      value="single"
                      checked={selectedRideType === "single"}
                      onChange={() => setSelectedRideType("single")}
                      className="form-radio h-4 w-4 text-theme-orange focus:ring-0"
                    />
                    <span className="ml-2">One time ride - $16.00/trip</span>
                  </label>

                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="rideType"
                      value="regular"
                      checked={selectedRideType === "regular"}
                      onChange={() => setSelectedRideType("regular")}
                      className="form-radio h-4 w-4 text-theme-orange focus:ring-0"
                    />
                    <span className="ml-2">Regular Ride - $13.00/trip</span>
                  </label>
                </div>
                <h4 className="block text-lg font-semibold mb-2 text-gray-700 mt-8">
                  Passengers
                </h4>

                <section className="flex justify-between mt-4 space-x-2">
                  <Number
                    number={"1"}
                    setPassengers={setPassengers}
                    passengers={passengers}
                  />
                  <Number
                    number={"2"}
                    setPassengers={setPassengers}
                    passengers={passengers}
                  />
                  <Number
                    number={"3"}
                    setPassengers={setPassengers}
                    passengers={passengers}
                  />
                  <Number
                    number={"4"}
                    setPassengers={setPassengers}
                    passengers={passengers}
                  />
                </section>
                <MileSlider setMiles={setMiles} miles={miles} />
                <AdditionalStops stops={stops} setStops={setStops} />
                <p className="text-2xl mt-16 font-semibold tracking-tighter text-theme-orange">
                  Total Price: ${totalPrice.toFixed(2)}
                </p>
                <p className="mt-4">Have a question? Contact us anytime!</p>
                <button className="bg-theme-orange rounded-md text-neutral-200 px-4 py-1 mt-8">
                  Get in Touch
                </button>
              </div>
            </div>

            <RideInfo selectedRideType={selectedRideType} />
          </section>
          <Chart />
        </div>
      </div>
      <Footer />
    </section>
  );
}

const RideInfo = ({ selectedRideType }: { selectedRideType: RideType }) => {
  return (
    <section className="bg-theme-orange text-white w-full md:w-1/2 py-12 md:py-48 px-4">
      <div className="text-center">
        {selectedRideType === "single" ? (
          <>
            <h4 className="font-bold">One Time Ride</h4>
            <p className="mt-4">
              One Time Rides start at $16 per trip with a $3 non-refundable
              booking fee; pick up and drop off is included. The base rate
              covers up to five miles and one passenger. Standard rates apply
              for additional miles, passengers, stops, or extended hours.
            </p>
          </>
        ) : (
          <>
            <h4 className="font-bold">Regular Rides</h4>
            <p className="mt-4">
              Regular rides start at $13 per trip, with a $3 non-refundable
              booking fee. Regular rides are for Minis who need transport at
              least four days a week. The base rate covers up to five miles and
              one passenger. Standard rates apply for additional miles,
              passengers, stops, or extended hours. Regular riders have the
              option of monthly invoicing.
            </p>
          </>
        )}
      </div>
    </section>
  );
};

const AdditionalStops = ({
  stops,
  setStops,
}: {
  stops: number;
  setStops: (stops: number) => void;
}) => {
  const addStop = () => {
    setStops(stops + 1);
  };

  const removeStop = () => {
    setStops(stops - 1);
  };

  return (
    <div className="mt-8 flex justify-between items-center">
      <h4 className="text-lg font-semibold mb-2 text-gray-700">
        Additional Stops: {stops}
      </h4>
      <div className="flex space-x-2">
        <button
          onClick={() => removeStop()}
          disabled={stops <= 0}
          className="disabled:opacity-50"
        >
          <MinusSquare className="" size={25} />
        </button>
        <button
          onClick={() => addStop()}
          className="text-theme-orange hover:text-theme-dark"
        >
          <PlusSquare className="" size={25} />
        </button>
      </div>
    </div>
  );
};

const MileSlider = ({
  setMiles,
  miles,
}: {
  setMiles: (miles: number) => void;
  miles: number;
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMiles(parseFloat(event.target.value));
  };

  return (
    <div className="w-full mx-auto mt-8">
      <label
        htmlFor="miles"
        className="block text-lg font-semibold mb-2 text-gray-700"
      >
        Distance in Miles
      </label>
      <input
        id="miles"
        type="range"
        min="0"
        max="50"
        step="1"
        value={miles}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
      />
      <div className="flex justify-between text-gray-600 mt-2">
        <span>0</span>
        <span>{miles} miles</span>
        <span>50+</span>
      </div>
    </div>
  );
};

const Number = ({
  number,
  setPassengers,
  passengers,
}: {
  number: string;
  setPassengers: (passengers: number) => void;
  passengers: number;
}) => {
  const handleClick = () => {
    setPassengers(parseFloat(number));
  };
  return (
    <div
      onClick={handleClick}
      className={`flex items-center px-4 sm:px-12 py-4 gap-2 rounded-md shadow-md border ${
        parseFloat(number) === passengers ? "bg-theme-orange" : "bg-white"
      } border-neutral-500 cursor-pointer`}
    >
      <p
        className={`text-lg ${
          parseFloat(number) === passengers ? "text-white" : "text-black"
        }`}
      >
        {number}
      </p>
      <p
        className={`text-lg ${
          parseFloat(number) === passengers ? "text-white" : "text-black"
        }`}
      >
        {getIcon(number)}
      </p>
    </div>
  );
};

const getIcon = (number: string) => {
  switch (number) {
    case "1":
      return <User className="h-6 w-6 " />;
    case "2":
      return <Users className="h-6 w-6 " />;
    case "3":
      return <UsersThree className="h-6 w-6 " />;
    case "4":
      return <UsersFour className="h-6 w-6 " />;
    default:
      return null;
  }
};

const Chart = () => {
  return (
    <div className="bg-white p-6 rounded-md shadow-md mt-8 text-xs sm:text-sm">
      <h2 className="text-xl font-bold mb-4 text-gray-600">Pricing Chart</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="border-b-2 p-2">Category</th>
            <th className="border-b-2 p-2">Description</th>
            <th className="border-b-2 p-2">Cost</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-b p-2 font-semibold">Base Fare</td>
            <td className="border-b p-2 font-bold" colSpan={2}>
              The total amount you are charged is made up of the Base Fare, a
              Booking Fee, and local operating costs as applicable.
            </td>
          </tr>
          <tr>
            <td className="border-b p-2 font-semibold">One Time Rides</td>
            <td className="border-b p-2">
              One Time Rides start at $16 per trip with a $3 non-refundable
              booking fee; pick up and drop off is included. The base rate
              covers up to five miles and one passenger. Standard rates apply
              for additional miles, passengers, stops, or extended hours.
            </td>
            <td className="border-b p-2">$16.00/trip</td>
          </tr>
          <tr>
            <td className="border-b p-2 font-semibold">Regular Rides</td>
            <td className="border-b p-2">
              Regular rides start at $13 per trip, with a $3 non-refundable
              booking fee. Regular rides are for Minis who need transport at
              least four days a week. The base rate covers up to five miles and
              one passenger. Standard rates apply for additional miles,
              passengers, stops, or extended hours. Regular riders have the
              option of monthly invoicing.
            </td>
            <td className="border-b p-2">$13.00/trip</td>
          </tr>
          <tr>
            <td className="border-b p-2 font-semibold">Extended Hours</td>
            <td className="border-b p-2">{"(before 6am or after 6pm)"}</td>
            <td className="border-b p-2">+10.00/trip</td>
          </tr>
          <tr>
            <td className="border-b p-2 font-semibold">Extended Miles</td>
            <td className="border-b p-2">{"(>5 miles)"}</td>
            <td className="border-b p-2">+2.00/mile</td>
          </tr>
          <tr>
            <td className="border-b p-2 font-semibold">Additional Stops</td>
            <td className="border-b p-2">Each additional stop</td>
            <td className="border-b p-2">+5.00/stop</td>
          </tr>
          <tr>
            <td className="border-b p-2 font-semibold">
              Additional Passengers
            </td>
            <td className="border-b p-2">Each additional passenger</td>
            <td className="border-b p-2">+5.00/person</td>
          </tr>
          <tr>
            <td className="border-b p-2 font-semibold">Wait Times</td>
            <td className="border-b p-2">
              {"(After a 5 minute grace period)"}
            </td>
            <td className="border-b p-2">+1.00/min (up to 10 mins)</td>
          </tr>
          <tr>
            <td className="border-b p-2 font-semibold">Last Minute Booking</td>
            <td className="border-b p-2">
              {"(for last-minute booking; ride within 1 hour)"}
            </td>
            <td className="border-b p-2">+25.00</td>
          </tr>
          <tr>
            <td className="border-b p-2 font-semibold">Referral Credit</td>
            <td className="border-b p-2">$30 credit</td>
            <td className="border-b p-2">-30.00</td>
          </tr>
          <tr>
            <td className="border-b p-2 font-semibold">VIP Discount</td>
            <td className="border-b p-2">
              {"(Veterans, Instructors, Public Service)"}
            </td>
            <td className="border-b p-2">10% off</td>
          </tr>
          <tr>
            <td className="border-b p-2 font-semibold">Sibling Discount</td>
            <td className="border-b p-2">For each additional sibling</td>
            <td className="border-b p-2">10% off</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
