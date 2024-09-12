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
      icon: <Car size={32} className="text-white" />,
      link: "/schedule-ride/single-ride",
    },
    {
      name: "Weekly Ride",
      description:
        "Ideal for recurring trips to school, after-school activities, or other regular engagements. Save time and gain peace of mind with a weekly ride plan tailored to your schedule.",
      icon: <CalendarCheck size={32} className="text-white" />,
      link: "/schedule-ride/weekly-ride",
    },
  ];

  return (
    <div className="relative">
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-teal-400 to-teal-100 opacity-70"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-orange-200 to-yellow-100 opacity-70"></div>
      </div>

      <section className="relative pt-16 pb-16 lg:pb-36">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20">
            <span className="font-semibold text-xl sm:text-2xl text-teal-700 mb-2 sm:mb-3 block">
              Book A Ride
            </span>
            <h2 className="font-bold text-4xl sm:text-5xl text-gray-900 mb-4 sm:mb-6">
              Choose Your Ride Plan
            </h2>
            <p className="text-base sm:text-lg max-w-3xl mx-auto text-gray-600">
              Select the ride plan that best fits your family’s needs. Whether
              its a one-time trip or a weekly service, we offer options that
              provide safety, reliability, and flexibility for your child’s
              transportation.
            </p>
          </div>

          <div className="flex gap-16 text-center">
            {rideOptions.map((option, index) => (
              <Link key={index} href={option.link}>
                <div className="group cursor-pointer p-8 sm:p-10 rounded-3xl bg-white shadow-xl hover:shadow-2xl hover:bg-teal-100 transform hover:-translate-y-3 transition-all duration-500 ease-in-out">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mb-6 sm:mb-8 transform group-hover:scale-110 transition-transform duration-500">
                    {option.icon}
                  </div>
                  <h4 className="font-semibold text-xl sm:text-2xl text-gray-900 mb-3 sm:mb-4">
                    {option.name}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-3">
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
