"use client";
import React from "react";
import {
  CursorClick,
  UsersThree,
  CashRegister,
  RocketLaunch,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function HowItWorks() {
  return (
    <section className="relative py-24 bg-gradient-to-br from-orange-100 via-teal-100 to-yellow-100 overflow-hidden">
      {/* Decorative Background Images */}
      <div className="hidden xl:block">
        <Image
          src="/assets/blackcar.svg"
          alt="Black Car"
          width={300}
          height={300}
          className="absolute top-12 left-24 -z-10 opacity-70"
        />
        <Image
          src="/assets/blackcar.svg"
          alt="Black Car"
          width={300}
          height={300}
          className="absolute top-64 right-0 -z-10 opacity-70"
        />
        <Image
          src="/assets/whitecar.svg"
          alt="White Car"
          width={300}
          height={300}
          className="absolute top-12 right-48 -z-10 opacity-70"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <div className="inline-block text-xs sm:text-sm px-4 py-1 bg-gradient-to-r from-emerald-300 to-teal-400 text-teal-900 font-semibold rounded-full">
            Busy Minis
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 text-gray-900">
            How Busy Minis Works
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-sm md:text-lg leading-relaxed text-gray-700">
            We simplify the process for you to register, schedule rides, and
            enjoy a seamless experience every step of the way.
          </p>
        </motion.div>

        {/* Contact Us Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex justify-center mt-10"
        >
          <Link href="/contact">
            <div className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
              Contact Us
            </div>
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

      {/* Decorative SVG at Bottom */}
      <div className="absolute bottom-0 w-full overflow-hidden leading-none">
        <svg
          width="100%"
          height="100"
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillOpacity="1"
            d="M0,64L48,80C96,96,192,128,288,133.3C384,139,480,117,576,106.7C672,96,768,96,864,101.3C960,107,1056,117,1152,117.3C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="#FFA500"
          />
        </svg>
      </div>
    </section>
  );
}

// Step data
const steps = [
  {
    title: "Register Your Rider",
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
