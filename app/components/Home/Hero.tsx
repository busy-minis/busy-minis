"use client";
import Image from "next/image";
import { MapPin } from "@phosphor-icons/react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative flex items-center justify-center py-24 sm:py-36 overflow-hidden ">
      {/* Background Image in the Top Left */}
      <motion.div
        className="absolute top-0 hidden xl:flex left-0 -z-10"
        initial={{ opacity: 0, x: -50, y: -50 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        <Image
          src="/assets/01.jpg"
          alt="Background image"
          width={500} // Adjust the size as needed
          height={500}
          quality={100}
          className="rounded-tl-lg"
        />
      </motion.div>

      {/* Floating Logo */}
      <motion.div
        className="absolute -z-10 right-4 top-3/4 md:top-2/3 md:right-12 xl:right-24 hidden sm:block"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <Image
          src="/logo.png"
          alt="Logo"
          width={300}
          height={300}
          className="rounded-full"
          quality={100}
        />
      </motion.div>

      <motion.div
        className="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Hero Title */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-teal-900"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Safe Rides, <br />
          <span className="text-theme-teal">Smiling Kids</span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          className="mt-6 text-lg md:text-xl lg:text-2xl leading-relaxed text-teal-800 max-w-2xl mx-auto"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Meet <span className="font-bold">Busy Minis Transportation</span>,
          your trusted partner for safe, reliable, and convenient childrens
          transportation.
        </motion.p>

        {/* Location Info */}
        <motion.div
          className="flex justify-center items-center font-semibold text-sm md:text-lg text-teal-800 mt-8 md:mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <MapPin className="text-red-500 animate-bounce mr-2" size={28} />
          <p>Serving Coweta, Fayette, and Clayton counties</p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="mt-10 md:mt-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <button className="bg-theme-orange text-white rounded-full px-10 py-4 text-lg md:text-xl font-semibold shadow-lg hover:shadow-xl hover:bg-orange-500 transition-transform transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-600">
            SIGN UP
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
