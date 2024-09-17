"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex items-center justify-center py-24 sm:py-48 overflow-hidden">
      {/* Dark Overlay for Enhanced Text Readability */}
      <div className="absolute inset-0 bg-black opacity-70"></div>

      {/* Background Image with Reduced Brightness */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full"
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <Image
          src="/assets/kids_in_bus.jpg"
          alt="Kids in Bus"
          layout="fill"
          objectFit="cover"
          quality={80}
          className="object-cover filter brightness-50"
        />
      </motion.div>

      {/* Floating Logo Positioned Above the Overlay */}
      <motion.div
        className="absolute right-4 top-1/2 transform -translate-y-1/2 sm:right-12 lg:right-24 hidden sm:block z-20"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <Image
          src="/logo.png"
          alt="Busy Minis Transportation Logo"
          width={150}
          height={150}
          className="rounded-full bg-orange-200/40"
          quality={100}
        />
      </motion.div>

      {/* Content Container with Clear Text */}
      <motion.div
        className="relative z-30 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Hero Title */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-white mb-4 drop-shadow-lg"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Safe Rides, <br />
          <span className="text-yellow-400">Smiling Kids</span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          className="mt-6 text-lg md:text-xl lg:text-2xl leading-relaxed text-white max-w-2xl mx-auto drop-shadow"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Welcome to{" "}
          <span className="font-bold">Busy Minis Transportation</span>, your
          trusted partner for safe, reliable, and convenient child
          transportation services.
        </motion.p>

        {/* Location Information */}
        <motion.div
          className="flex justify-center items-center font-semibold text-sm md:text-lg text-white mt-8 md:mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <p className="bg-teal-600 bg-opacity-50 px-4 py-2 rounded-full">
            Serving Coweta, Fayette, and Clayton Counties
          </p>
        </motion.div>

        {/* Call-to-Action (CTA) Button */}
        {/* <motion.div
          className="mt-10 md:mt-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <Link href="/schedule-ride">
            <div className="inline-block bg-yellow-400 text-gray-800 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-yellow-500 transition transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400">
              Schedule A Ride
            </div>
          </Link>
        </motion.div> */}
      </motion.div>
    </section>
  );
}
