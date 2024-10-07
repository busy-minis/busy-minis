"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MousePointerClick,
  Users,
  CalendarCheck,
  Car,
  Cloud,
  HelpingHand,
  Headset,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  const steps = [
    {
      title: "Register Your Rider",
      description: "Quickly fill out a form to create a rider profile.",
      icon: MousePointerClick,
    },
    {
      title: "Attend Orientation",
      description:
        "Meet with our team to go over program policies & expectations.",
      icon: Users,
    },
    {
      title: "Schedule Rides",
      description: "Easily schedule rides online or by phone.",
      icon: CalendarCheck,
    },
    {
      title: "Enjoy the Ride",
      description:
        "Track rides in real-time and receive confirmation texts along the way.",
      icon: Car,
    },
  ];

  return (
    <section className="relative bg-white py-24 overflow-hidden">
      {/* Background Clouds */}
      <div className="absolute inset-0 pointer-events-none">
        <Cloud className="absolute text-orange-100 w-64 h-64 -top-16 -left-16 opacity-50" />
        <Cloud className="absolute text-teal-100 w-48 h-48 top-1/4 right-0 opacity-50" />
        <Cloud className="absolute text-orange-100 w-56 h-56 bottom-0 left-1/4 opacity-50" />
      </div>

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block rounded-full bg-gradient-to-r from-orange-400 to-teal-400 px-4 py-1 text-xs font-semibold text-white mb-4">
            Busy Minis
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How Busy Minis Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We simplify the process for you to register, schedule rides, and
            enjoy a seamless experience every step of the way.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-orange-100 to-orange-500" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`flex items-center mb-16 ${
                index % 2 === 0 ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <div
                className={`w-1/2 ${
                  index % 2 === 0 ? "pr-12 text-right" : "pl-12 text-left"
                }`}
              >
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-100 shadow-lg flex items-center justify-center z-10">
                <step.icon className="w-6 h-6 text-theme-orange" />
              </div>
              <div className="w-1/2" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-xl text-gray-700 mb-6">
            Ready to get started or have questions? We&apos;re here to help!
          </p>
          <motion.div
            className="flex justify-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Link href="/contact" className="flex items-center gap-2">
                Contact Us Today
                <Headset className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
