import React from "react";
import { Car, Recycle, Dot } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default function page() {
  return (
    <div className="space-y-4 w-full relative">
      <h1 className="text-3xl pb-4 tracking-tighter font-semibold text-gray-700">
        Your Trips{" "}
      </h1>
      {/* <NoRidesFound /> */}
      <Ride />
    </div>
  );
}

const NoRidesFound = () => {
  return (
    <div className="grid text-center h-full bg-white   place-content-center  py-24 rounded-md shadow-sm border">
      {/* <Ride /> */}
      <p>You have no scheduled rides at this time.</p>
      <Link
        href={"/book"}
        className="px-6 py-2 mt-4 w-fit mx-auto text-neutral-100 bg-theme-orange rounded-md"
      >
        Schedule A Ride
      </Link>
    </div>
  );
};

const Ride = () => {
  return (
    <div className="flex bg-white  gap-8 items-center justify-between border-2 rounded-lg p-4">
      <div className="px-2">
        <Car weight="fill" size={35} />
      </div>

      <div>
        <p className="font-semibold text-lg">263 Sedgewick Trail</p>
      </div>
      {/* <div>
            <p>123 Main Street</p>
          </div> */}
      <div className="flex items-center gap-1 text-sm">
        <p>July 17th</p>
        <Dot />
        <p className="">1:45 pm </p>
      </div>
      <div>
        <Recycle />
      </div>

      <button className="bg-theme-orange text-sm rounded-md text-white uppercase font-semibold px-4 py-1 ">
        View Details
      </button>
      <button className="bg-red-800 text-sm rounded-md text-white uppercase font-semibold px-4 py-1 ">
        Cancel Ride
      </button>
    </div>
  );
};
