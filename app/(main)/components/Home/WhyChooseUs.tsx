"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Image from "next/image";

export default function WhyChooseUs() {
  const safetyFeatures = [
    "Regular Safety Inspections",
    "Experienced & Compassionate Drivers",
    "Rigorous Background Checks",
    "First Aid Kits & Safety Equipment",
    "Regular Evaluations",
    "Pick-Up/Drop-Off Notifications",
    "Dual Dash Cams",
    "Marked Vehicles",
    "Uniformed Drivers",
  ];

  return (
    <section className="relative bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <span className="inline-block rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 px-4 py-1 text-xs font-semibold text-white sm:text-sm">
            Busy Minis
          </span>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
            Why Choose Us?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-600 md:text-lg">
            At Busy Minis Transportation, safety, reliability, and convenience
            are at the core of what we do. Discover why families trust us with
            their child transportation needs.
          </p>
        </motion.div>

        <div className="mt-16">
          <div className="grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h3 className="mb-6 text-2xl font-semibold text-gray-800">
                Our Safety Commitment
              </h3>
              <p className="mb-8 text-gray-600">
                We prioritize the safety and well-being of every child in our
                care. Our comprehensive safety measures ensure peace of mind for
                parents and a secure environment for children during
                transportation.
              </p>
              <ul className="space-y-4">
                {safetyFeatures.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <Check className="h-5 w-5 flex-shrink-0 text-teal-500" />
                    <span className="text-gray-700">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className="relative hidden md:block"
            >
              <div className="absolute inset-0 " />
              <img
                src="/assets/smiling-driver.jpeg"
                alt="Child safety in transportation"
                className="h-full w-full rounded-lg object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
