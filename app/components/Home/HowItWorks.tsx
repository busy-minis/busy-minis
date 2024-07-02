"use client";
import { CashRegister } from "@phosphor-icons/react/dist/ssr";
import React from "react";
import { motion } from "framer-motion";
export default function HowItWorks() {
  return (
    <div className=" max-w-7xl mx-auto text-lg  rounded-3xl  mt-48  pt-36">
      <h2 className="text-4xl font-semibold text-center">
        How Busy Mini Works
      </h2>
      <p className="text-center mt-8 ">
        Prepare to fall in love . We make it easy to reach us and get started
      </p>
      <div className="flex justify-center mt-24">
        <button className="px-4 py-2 bg-orange-400">Contact Us </button>
      </div>
      <div className="w-full h-1 bg-black mt-48"></div>
      <div className="flex mt-36">
        <aside className="pr-24 border-r-2 ">
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
        <section className="pl-36">
          <Step
            title={"Register Your Rider"}
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
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex  pb-48"
    >
      <CashRegister className="text-7xl" />
      <section className="pl-12">
        <h2 className="text-5xl  tracking-tighter">{props.title}</h2>
        <p className="mt-4">{props.text}</p>
      </section>
    </motion.div>
  );
};
