"use client";
import { CashRegister } from "@phosphor-icons/react/dist/ssr";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
export default function HowItWorks() {
  return (
    <div className="px-4 md:px-0 max-w-7xl mx-auto text-lg  rounded-3xl  mt-24  md:mt-48  pt-36">
      <h2 className="text-4xl sm:text-4xl md:text-6xl font-light tracking-tighter text-center">
        How Busy Mini Works
      </h2>
      <p className="text-center mt-8 text-sm ">
        Prepare to fall in love . We make it easy to reach us and get started
      </p>
      <div className="flex justify-center mt-24">
        <button className="px-8 py-2 bg-theme-orange rounded-full text-white ">
          Contact Us{" "}
        </button>
      </div>
      <div className="w-full h-1 bg-zinc-200 mt-48"></div>
      <div className="flex  mt-36">
        <aside className="pr-24 border-r-2 hidden md:block ">
          <ul className="space-y-8 sticky top-48 ">
            <div className="flex items-center gap-2 ">
              <div className="h-6 w-6 bg-neutral-300 text-base  grid place-content-center rounded-full">
                1
              </div>
              <p className="">Register</p>
            </div>
            <div className="flex items-center gap-2 ">
              <div className="h-6 w-6 bg-neutral-300 text-base  grid place-content-center rounded-full">
                2
              </div>
              <p className="whitespace-nowrap">Attend Orientation</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-neutral-300 text-base  grid place-content-center rounded-full">
                3
              </div>
              <p>Prepare</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-neutral-300 text-base  grid place-content-center rounded-full">
                4
              </div>
              <p>Enjoy</p>
            </div>
          </ul>
        </aside>
        <section className="md:pl-24  relative">
          <Step
            title={"Register your rider"}
            text={
              " Fill out our online registration form to create your rider profile."
            }
          />
          <Step
            title={"Attend Orientation"}
            text={
              " Meet with our team to discuss service options, safety protocols, and any questions you may have."
            }
          />
          <Step
            title={"Prepare for the Ride"}
            text={
              " Schedule rides easily through our website, and receive all necessary details and confirmations."
            }
          />
          <Step
            title={"Enjoy the Ride"}
            text={
              " Track your ride in real-time, ensure identity verification, and provide feedback for continuous improvement."
            }
          />
        </section>
      </div>
    </div>
  );
}

const Step = (props: any) => {
  return (
    <div className="flex  pb-48   ">
      <CashRegister className="hidden md:block text-5xl" />
      <section className="pl-4  md:pl-12">
        <h2 className="text-2xl sm:text-3xl  md:text-4xl font-light  tracking-tighter">
          {props.title}
        </h2>
        <p className="mt-4">{props.text}</p>
      </section>
    </div>
  );
};
