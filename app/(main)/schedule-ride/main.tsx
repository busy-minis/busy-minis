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
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-teal-700 to-teal-500">
      {/* Background Enhancements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-teal-500 to-transparent opacity-80"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-orange-400 to-yellow-200 opacity-80"></div>
      </div>

      <section className="relative pt-16 pb-16 lg:pb-36 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20">
            <span className="font-semibold text-xl sm:text-2xl mb-2 sm:mb-3 block tracking-wider uppercase">
              Book A Ride
            </span>
            <h2 className="font-extrabold text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 leading-tight">
              Choose Your Ride Plan
            </h2>
            <p className="text-base sm:text-lg max-w-3xl mx-auto text-gray-200">
              Whether it&lsquo;s a one-time trip or a weekly service, choose the
              ride plan that best fits your family&lsquo;s needs, with safety
              and reliability guaranteed.
            </p>
          </div>

          {/* Ride Options */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-10 text-center">
            {rideOptions.map((option, index) => (
              <Link key={index} href={option.link} className="w-full sm:w-1/2">
                <div className="group cursor-pointer p-6 sm:p-8 md:p-10 rounded-3xl bg-white shadow-xl hover:shadow-2xl hover:bg-teal-100 transform hover:-translate-y-3 transition-all duration-500 ease-in-out relative overflow-hidden">
                  {/* Animated Background Highlight */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-yellow-500 opacity-10 group-hover:opacity-40 transition-opacity duration-500"></div>

                  {/* Icon with a more prominent design */}
                  <div className="w-16 h-16 sm:w-20 md:w-24 sm:h-20 md:h-24 mx-auto bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mb-4 sm:mb-6 md:mb-8 transform group-hover:scale-110 transition-transform duration-500">
                    {option.icon}
                  </div>

                  <h4 className="font-extrabold text-xl sm:text-2xl md:text-3xl text-gray-900 mb-2 sm:mb-3 md:mb-4">
                    {option.name}
                  </h4>
                  <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed max-w-xs mx-auto">
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
