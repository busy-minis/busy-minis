"use client";
import { useState } from "react";
import React from "react";
import { NavBar } from "../components/ui/NavBar";

export default function page() {
  return (
    <div>
      <NavBar page="pricing" />
      <div className="max-w-7xl mx-auto mt-24">
        <section className="flex justify-between">
          <div>
            <h3 className="text-5xl tracking-tighter font-light">
              Get A Free Quote
            </h3>
            <div className="mt-2 max-w-md ">
              <p className="text-sm ">*All Quotes are Estimates*</p>
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
              <button className="bg-theme-orange rounded-md text-neutral-200 px-4 py-1 mt-8 ">
                Get in Touch
              </button>
            </div>
          </div>

          <QuoteCalculator />
        </section>
      </div>
    </div>
  );
}

const QuoteCalculator = () => {
  return (
    <div className="w-full max-w-md  ">
      <div className="  w-full bg-theme-orange text-base text-white    rounded-lg ">
        <h2 className="text-2xl  py-4 px-4 tracking-tighter text-center">
          Quote Calculator
        </h2>
        <div className="p-8 space-y-8">
          <section>
            <p className="font-semibold">Ride Type</p>
            <div className="flex mt-2 gap-4 text-neutral-700">
              <div className="flex gap-1 items-center">
                <input type="radio" /> <p>Single Ride</p>
              </div>
              <div className="flex gap-1 items-center">
                <input type="radio" /> <p>Regular Ride</p>
              </div>
            </div>
          </section>
          <section className="space-y-2">
            <p className="font-semibold">Distance in Miles</p>
            <input
              className="px-2 py-1  rounded-md border-neutral-400 border"
              name="distance"
              type="text"
              placeholder="miles"
            />
          </section>
          <section className="">
            <label htmlFor="passengers" className="font-semibold">
              Number of Passengers
            </label>
            <section className="flex gap-2 mt-2 text-black ">
              <Number number={"1"} />
              <Number number={"2"} />
              <Number number={"3"} /> <Number number={"4"} />
            </section>

            {/* <button className="bg-theme-orange text-white  w-full  px-14 py-2 mt-8 mx-auto rounded-md">
              Calculate Quote
            </button> */}
          </section>
        </div>
      </div>
      <aside className="w-full p-8 border bg-white  border-black mt-4 rounded-lg ">
        <h3 className="font-semibold tracking-tighter text-xl">
          Estimated Quote:
        </h3>
        <p className="text-2xl font-bold text-theme-orange mt-2">$24.00 </p>
      </aside>
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
