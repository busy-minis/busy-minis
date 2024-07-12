"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { MapPin } from "@phosphor-icons/react";
export default function Hero() {
  return (
    <div className=" mx-auto  items-center relative justify-center py-36">
      {/* <Image
        src={"/assets/01.jpg"}
        alt=""
        height={500}
        width={500}
        className="absolute -bottom-24 left-24"
      />
      <Image
        src={"/assets/01.jpg"}
        alt=""
        height={500}
        width={500}
        className="absolute bottom-24 right-24"
      /> */}
      <Image
        src={"/assets/01.jpg"}
        alt=""
        width={500}
        height={500}
        className="-z-10  absolute left-4 rounded-full "
        quality={100}
      />
      <div className="flex">
        <section className="max-w-3xl mx-auto flex flex-col items-center text-center">
          {/* <ChangingText /> */}
          <section className="  border-neutral-400 rounded-2xl">
            <h1 className="text-8xl tracking-tighter  font-semibold  mt-4 ">
              Safe Rides,{" "}
              <span className="text-theme-teal "> Smiling Kids</span>
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
          <div className="flex justify-center font-bold opacity-90 text-sm  mt-16 gap-2  items-center   w-full">
            <MapPin className="text-red-500" />

            <p className="">Serving Coweta, Fayette, and Clayton counties </p>
          </div>
          <button className="  border-zinc-800 border-2   rounded-full  transition-all duration-500  px-10 py-4 mt-8 font-bold text-2xl">
            Sign Up
          </button>
        </section>
        {/* <aside>
          <div className="border-zinc-400 rounded-3xl p-1  border-2 relative ">
            <Image
              src={"/assets/taxi.png"}
              className="border-2 border-zinc-800 rounded-3xl opacity-80"
              alt=""
              height={1000}
              width={1000}
            />
          </div>
        </aside> */}
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
