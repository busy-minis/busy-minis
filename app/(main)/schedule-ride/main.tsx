"use client";
import React from "react";
import Link from "next/link";
import { Car, CalendarCheck } from "@phosphor-icons/react";

export default function RideOptions() {
  const rideOptions = [
    {
      name: "Single Ride",
      description:
        "Perfect for one-time needs like emergencies, last-minute plans, or special events. Ensure a safe and reliable ride for your child when you need it most.",
      icon: <Car size={40} className="text-white" />,
      link: "/schedule-ride/single-ride",
    },
    {
      name: "Weekly Ride",
      description:
        "Ideal for recurring trips to school, after-school activities, or other regular engagements. Save time and gain peace of mind with a weekly ride plan tailored to your schedule.",
      icon: <CalendarCheck size={40} className="text-white" />,
      link: "/schedule-ride/weekly-ride",
    },
  ];

  return (
    <div className="relative min-h-screen">
      <section className="relative pt-16 pb-16 lg:pb-36 text-zinc-900">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20">
            <span className="font-semibold text-xl sm:text-2xl mb-2 sm:mb-3 block tracking-wider uppercase">
              Book A Ride
            </span>
            <h2 className="font-extrabold text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 leading-tight">
              Choose Your Ride Plan
            </h2>
            <p className="text-base sm:text-lg max-w-3xl mx-auto text-zinc-600">
              Whether it&lsquo;s a one-time trip or a weekly service, choose the
              ride plan that best fits your family&lsquo;s needs, with safety
              and reliability guaranteed.
            </p>
          </div>

          {/* Ride Options */}
          <div className="flex flex-col sm:flex-row justify-center  gap-6 sm:gap-10 text-center">
            {rideOptions.map((option, index) => (
              <Link
                key={index}
                href={option.link}
                className="w-full border border-zinc-400 rounded-xl p-6 sm:p-8 md:p-6   transition-all duration-200 hover:bg-teal-100    sm:w-1/2"
              >
                <div className="      transform  relative overflow-hidden">
                  {/* Icon with a more prominent design */}
                  <div className="w-16 h-16 sm:w-20 md:w-24 sm:h-20 md:h-20 mx-auto bg-zinc-700  rounded-xl flex items-center justify-center mb-4 sm:mb-6 md:mb-8 transform group-hover:scale-110 transition-transform duration-500">
                    {option.icon}
                  </div>

                  <h4 className="font-extrabold text-xl sm:text-2xl md:text-3xl text-gray-900 mb-2 sm:mb-3 md:mb-4">
                    {option.name}
                  </h4>
                  <p className="text-sm sm:text-base  text-gray-700 leading-relaxed max-w-sm mx-auto">
                    {option.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
