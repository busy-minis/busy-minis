"use client";
import { useState } from "react";
import React from "react";
import { NavBar } from "../components/ui/NavBar";
import Footer from "../components/ui/Footer";
import { Dot, Star } from "@phosphor-icons/react/dist/ssr";

export default function page() {
  const services = [
    "Tutoring/After School Transport",
    "Summer Camp Transport",
    "Last-Minute or Sick Child Pick-Up",
    "Special Needs Transport",
    "Sports/Extracurricular Transport",
    "Religious Activity Transport",
    "Job Interview Transport",
    "Six Flags Season Pass Transport",
    "Birthday Party Transport",
    "Customized Routes",
  ];
  return (
    <div>
      <NavBar />
      <main className="max-w-5xl mt-24 mx-auto text-lg">
        <section className="flex justify-between">
          <div>
            <h3 className="text-4xl tracking-tighter font-semibold">
              Get A Free Quote
            </h3>
            <div className="mt-2 max-w-md ">
              <p>*All Quotes are Estimates*</p>
              <p className="mt-8">
                Rides start at $19 with a $3 non-refundable booking fee. The
                base rate covers up to five miles and two passengers. Standard
                rates apply for additional miles, travel time, passengers and
                stops.
              </p>
              <p className="mt-4">
                We have a ten minute grace period from the designated pickup to
                start time, as we know there can be delays with carpool lines
                and activities. Rides are subject to additional fees for excess
                wait and travel time.
              </p>
              <p className="mt-4">Have a question? Contact us anytime!</p>
              <button className="bg-neutral-900 text-neutral-200 px-4 py-1 mt-8 ">
                Get in Touch
              </button>
            </div>
          </div>

          {/* <QuoteCalculator /> */}
          <QuoteCalculatorr />
        </section>
        <h2 className="text-5xl mt-24">Our Services</h2>
        <p className=" max-w-3xl mt-8 leading-relaxed">
          Busy Minis Transportation was founded to address the challenges faced
          by busy parents in balancing work schedules with their childrens
          extracurricular activities. Our services offer a solution by providing
          safe, reliable, and convenient transportation options for children
          aged 7-17.
        </p>
        <ul className="grid grid-cols-2  gap-y-4  mt-12">
          {services.map((service, index) => (
            <li className="flex items-center gap-2" key={index}>
              <Star size={15} />
              <p>{service}</p>
            </li>
          ))}
        </ul>
      </main>

      <Footer />
    </div>
  );
}

const QuoteCalculatorr = () => {
  // State variables to hold user inputs
  const [rideType, setRideType] = useState("one-time"); // 'one-time' or 'regular'
  const [mileage, setMileage] = useState(5); // default mileage
  const [passengers, setPassengers] = useState(1); // default passengers
  const [additionalStops, setAdditionalStops] = useState(0); // additional stops
  const [extendedHours, setExtendedHours] = useState(false); // extended hours flag
  const [lastMinuteBooking, setLastMinuteBooking] = useState(false); // last minute booking flag

  // Constants for pricing details
  const baseFareOneTime = 16.0;
  const baseFareRegular = 13.0;
  const bookingFee = 3.0;
  const extendedHoursCharge = 10.0;
  const extendedMilesCharge = 2.0;
  const additionalStopCharge = 5.0;
  const additionalPassengerCharge = 5.0;
  const waitTimeCharge = 1.0;
  const lastMinuteBookingCharge = 25.0;

  // Calculate total fare
  const calculateTotalFare = () => {
    let totalFare = 0;

    // Base fare based on ride type
    const baseFare =
      rideType === "one-time" ? baseFareOneTime : baseFareRegular;

    // Apply extended hours charge
    if (extendedHours) {
      totalFare += extendedHoursCharge;
    }

    // Apply extended miles charge
    if (mileage > 5) {
      totalFare += (mileage - 5) * extendedMilesCharge;
    }

    // Apply additional stops charge
    totalFare += additionalStops * additionalStopCharge;

    // Apply additional passengers charge
    totalFare += (passengers - 1) * additionalPassengerCharge;

    // Apply wait time charge (up to 10 minutes)
    // Assuming we apply this charge for each minute beyond the grace period
    // In a real scenario, logic for exact wait time calculation may vary

    // Apply last minute booking charge
    if (lastMinuteBooking) {
      totalFare += lastMinuteBookingCharge;
    }

    // Add base fare and booking fee
    totalFare += baseFare + bookingFee;

    return totalFare.toFixed(2);
  };

  // Handle form submission (optional)
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const totalFare = calculateTotalFare();
    // Handle further actions like displaying total or sending data
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit}>
          {/* Input fields */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ride Type
            </label>
            <select
              className="form-select block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={rideType}
              onChange={(e) => setRideType(e.target.value)}
            >
              <option value="one-time">One Time Ride</option>
              <option value="regular">Regular Ride</option>
            </select>
          </div>

          {/* Additional input fields */}
          {/* (Add more fields as per your design, such as mileage, passengers, checkboxes for extended hours, etc.) */}

          {/* Button to calculate */}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Calculate Quote
          </button>
        </form>
      </div>

      {/* Display total fare */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-2">Estimated Quote:</h3>
        <p className="text-2xl text-blue-600 font-bold">
          ${calculateTotalFare()}
        </p>
      </div>

      {/* Additional information */}
      <p className="mt-4 text-gray-600">
        We have a ten minute grace period from the designated pickup to start
        time, as we know there can be delays with carpool lines and activities.
        Rides are subject to additional fees for excess wait and travel time.
      </p>
      <p className="mt-2 text-gray-600">Have a question? Contact us anytime!</p>
    </div>
  );
};

const QuoteCalculator = () => {
  return (
    <div className="p-8  py-24 px-12  shadow-lg max-w-sm text-base space-y-8 border-zinc-500 border-2 rounded-lg ">
      <section className="space-y-2">
        <p>Distance in Miles</p>
        <input
          className="px-2 py-1  rounded-md border-zinc-500 border-2"
          name="distance"
          type="text"
          placeholder="miles"
        />
      </section>
      <section className="">
        <label htmlFor="passengers">Number of Passengers</label>
        <section className="flex gap-2 mt-2 ">
          <Number number={"1-2"} />
          <Number number={"3"} /> <Number number={"4"} />
        </section>
        <div className="grid place-content-center">
          <button className="bg-theme-orange text-white text-xl  px-14 py-2 mt-8 mx-auto rounded-3xl">
            Submit
          </button>
        </div>
      </section>
    </div>
  );
};

const Number = (props: any) => {
  const [clicked, setClicked] = useState(false);
  return (
    <div
      onClick={() => setClicked(true)}
      className={`px-8 py-1 shadow-sm border bg-white ${clicked}  border-neutral-500 cursor-pointer rounded-lg`}
    >
      {props.number}
    </div>
  );
};
