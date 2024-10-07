"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronRight, Calendar, Shield, Clock } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-teal-700 to-teal-900">
      {/* Background pattern */}

      {/* Right side image */}
      <motion.div
        className="absolute inset-y-0 right-0 w-full lg:w-1/2 hidden lg:block"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <Image
          src="/assets/kids_in_bus.jpg"
          alt="Kids in Bus"
          layout="fill"
          objectFit="cover"
          quality={90}
          className="object-cover "
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-teal-900/70 to-teal-900"></div>
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24 flex flex-col lg:flex-row items-center lg:items-start justify-between">
        {/* Text Content */}
        <motion.div
          className="text-white max-w-xl mb-12 lg:mb-0 text-center lg:text-left"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Safe Rides, <br />
            <span className="text-orange-400">Smiling Kids</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl mb-8 text-zinc-100"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Welcome to{" "}
            <span className="font-semibold">Busy Minis Transportation</span>,
            your trusted partner for safe, reliable, and convenient child
            transportation services.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link href="/schedule-ride">
              <Button className="bg-orange-500 text-white hover:bg-orange-600 transition-all duration-300 text-base py-6 px-8 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105">
                Book a Ride
              </Button>
            </Link>

            <Link href="/about">
              <Button
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-teal-700 transition-all duration-300 text-base py-6 px-8 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105"
              >
                Learn More
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>

          {/* Feature list */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-orange-400" />
              <span className="text-sm font-medium">Safe & Secure</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-orange-400" />
              <span className="text-sm font-medium">On-Time Service</span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-orange-400" />
              <span className="text-sm font-medium">Flexible Scheduling</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating badge */}
      <motion.div
        className="absolute bottom-24 left-4 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-full px-6 py-3 text-white text-sm font-semibold shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        Serving Coweta, Fayette, and Clayton Counties
      </motion.div>

      {/* Decorative element */}
    </section>
  );
}
