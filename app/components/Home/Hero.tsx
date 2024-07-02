"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { MapPin } from "@phosphor-icons/react";
export default function Hero() {
  return (
    <div className="max-w-7xl mx-auto items-center justify-center mt-24">
      <div className="flex">
        <section className="max-w-3xl">
          <ChangingText />
          <section className="  border-neutral-400 rounded-2xl">
            <h1 className="text-8xl tracking-tighter font-semibold  mt-4 ">
              Safe Rides,{" "}
              <span className="text-neutral-700"> Smiling Kids</span>
            </h1>
          </section>
          <p className="max-w-2xl text-xl  leading-loose mt-8 ">
            Meet{" "}
            <span className="font-bold tracking-tighter">
              Busy Minis Transportation
            </span>
            . Your trusted partner for safe, reliable, and convenient
            transportation for children.
          </p>
          <button className=" border-neutral-800 transition-all duration-500  px-10 py-4 mt-16 font-bold text-2xl">
            Schedule A Ride
          </button>
        </section>
        <aside>
          <div className="border-zinc-400 rounded-3xl p-1  border-2 relative ">
            <div className="px-80 py-24 size-96 bg-neutral-600/50 absolute top-0 rounded-full blur-3xl -z-10"></div>
            <Image
              src={"/assets/taxi.png"}
              className="border-2 border-zinc-800 rounded-3xl opacity-80"
              alt=""
              height={1000}
              width={1000}
            />
          </div>
          <div className="flex opacity-80  mt-4 gap-2 justify-end  items-center   w-full">
            <MapPin className="text-red-500" />

            <p className="">Serving Coweta, Fayette, and Clayton counties </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

const ChangingText = () => {
  const texts = [
    "For Working Parents",
    "For Emergency Trips",
    "For Easy Transportation",
  ];
  const [text, setText] = React.useState("Hello");
  useEffect(() => {
    const interval = setInterval(() => {
      setText(texts[Math.floor(Math.random() * texts.length)]);
    }, 2000);
    return () => clearInterval(interval);
  });
  return (
    <div className=" border-2 rounded-3xl min-w-60 text-center italic transition-all duration-400 w-fit px-2 py-1 ">
      {text}
    </div>
  );
};
