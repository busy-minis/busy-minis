"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { MapPin } from "@phosphor-icons/react";
export default function Hero() {
  return (
    <div className="mx-auto overflow-hidden items-center relative justify-center pt-36 pb-24 sm:pb-0">
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
      {/* <div className="h-[24rem] w-[40rem] left-12 top-1/2 bg-theme-orange/10 -z-20 blur-3xl absolute "></div>
      <div className="h-[24rem] w-[40rem] right-0 bottom-0 bg-theme-teal/20 -z-20 blur-3xl absolute "></div> */}

      <Image
        src={"/assets/01.jpg"}
        alt=""
        width={500}
        height={500}
        className="-z-10 hidden 2xl:block absolute left-12 rounded-full "
        quality={100}
      />
      <Image
        src={"/assets/01.jpg"}
        alt=""
        width={150}
        height={150}
        className="-z-10 top-8 sm:hidden  absolute left-12 rounded-full "
        quality={100}
      />
      <Image
        src={"/assets/01.jpg"}
        alt=""
        width={150}
        height={150}
        className="-z-10 top-16 sm:hidden  absolute right-6 rounded-full "
        quality={100}
      />
      <Image
        src={"/assets/09.png"}
        alt=""
        width={300}
        height={300}
        className="-z-10 hidden absolute 2xl:block right-48 top-24 rounded-full "
        quality={100}
      />
      <div className="flex">
        <section className="px-4 md:px-0 max-w-3xl mx-auto flex flex-col items-center text-center">
          {/* <ChangingText /> */}
          <section className="  border-neutral-400 rounded-2xl">
            <h1 className="text-4xl sm:text-6xl  md:text-8xl tracking-tighter  font-semibold  mt-4 ">
              Safe Rides, <br />
              <span className="text-theme-teal "> Smiling Kids</span>
            </h1>
          </section>
          <p className="max-w-2xl text-sm md:text-xl  leading-loose mt-8 ">
            Meet{" "}
            <span className="font-bold tracking-tighter">
              Busy Minis Transportation
            </span>
            . Your trusted partner for safe, reliable, and convenient
            transportation for children.
          </p>
          <div className="flex justify-center font-bold opacity-90 text-xs md:text-sm  mt-24 gap-2  items-center   w-full">
            <MapPin className="text-red-500 animate-bounce" size={25} />

            <p className="">Serving Coweta, Fayette, and Clayton counties </p>
          </div>
          <button className="bg-neutral-900 transition-all duration-300  text-white  md:pb-4  rounded-full   px-4  md:px-10 py-1 md:py-3 mt-8 text-lg md:text-2xl">
            Schedule a Ride
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
