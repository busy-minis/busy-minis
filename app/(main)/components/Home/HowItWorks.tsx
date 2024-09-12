"use client";
import {
  CursorClick,
  UsersThree,
  CashRegister,
  RocketLaunch,
} from "@phosphor-icons/react/dist/ssr";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function HowItWorks() {
  return (
    <section className="relative py-24 bg-gradient-to-br from-theme-orange/10 via-theme-teal/10 to-theme-yellow/10 overflow-hidden">
      {/* Background Images */}
      <div className="hidden xl:block">
        <Image
          src="/assets/blackcar.svg"
          alt="Black Car"
          width={300}
          height={300}
          className="absolute top-12 left-24 -z-10"
        />
        <Image
          src="/assets/blackcar.svg"
          alt="Black Car"
          width={300}
          height={300}
          className="absolute top-64 right-0 -z-10"
        />
        <Image
          src="/assets/whitecar.svg"
          alt="White Car"
          width={300}
          height={300}
          className="absolute top-12 right-48 -z-10"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        {/* Title Section */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold text-gray-900 text-center tracking-tight"
        >
          How Busy Mini Works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mt-6 text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto"
        >
          We simplify the process for you to register, schedule rides, and enjoy
          a seamless experience every step of the way.
        </motion.p>

        {/* Contact Us Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex justify-center mt-10"
        >
          <Link
            href="/contact"
            className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl text-lg"
          >
            Contact Us
          </Link>
        </motion.div>

        {/* Steps Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mt-16">
          {steps.map((step, index) => (
            <Step
              key={index}
              title={step.title}
              text={step.text}
              Icon={step.Icon}
              number={index + 1}
              delay={step.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Step data
const steps = [
  {
    title: "Register your rider",
    text: "Quickly fill out a form to create a rider profile.",
    Icon: CursorClick,
    delay: 0.5,
  },
  {
    title: "Attend Orientation",
    text: "Meet with our team to go over program policies & expectations.",
    Icon: UsersThree,
    delay: 0.7,
  },
  {
    title: "Prepare for the Ride",
    text: "Easily schedule rides online or by phone.",
    Icon: CashRegister,
    delay: 0.9,
  },
  {
    title: "Enjoy the Ride",
    text: "Track rides in real-time and receive confirmation texts along the way.",
    Icon: RocketLaunch,
    delay: 1.1,
  },
];

// Step Component
const Step = ({ title, text, Icon, number, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, delay }}
    className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
  >
    {/* Step Number */}
    <div className="w-12 h-12 bg-orange-600 text-white text-lg font-bold rounded-full shadow-lg mb-4 flex items-center justify-center">
      {number}
    </div>

    {/* Step Icon */}
    <div className="text-orange-600 mb-4">
      <Icon className="text-4xl" />
    </div>

    {/* Step Title and Description */}
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{text}</p>
  </motion.div>
);
