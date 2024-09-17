"use client";
import React from "react";
import Link from "next/link";
import {
  CursorClick,
  UsersThree,
  CashRegister,
  RocketLaunch,
  Wheelchair,
  SoccerBall,
  Church,
  Ticket,
  Gift,
  MapPinLine,
  PhoneOutgoing,
} from "@phosphor-icons/react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { motion } from "framer-motion";

export default function WhatWeOffer() {
  const services = [
    {
      name: "Tutoring/After School Transport",
      description:
        "Ensuring your child's academic success with safe, reliable rides to and from tutoring sessions and after-school activities.",
      icon: <CursorClick size={24} className="text-white" />,
    },
    {
      name: "Summer Camp Transport",
      description:
        "Making summer camp memories hassle-free with secure and dependable transportation tailored to your schedule.",
      icon: <RocketLaunch size={24} className="text-white" />,
    },
    {
      name: "Last-Minute or Sick Child Pick-Up",
      description:
        "Providing peace of mind with prompt and safe pick-up services for last-minute or sick child situations.",
      icon: <PhoneOutgoing size={24} className="text-white" />,
    },
    {
      name: "Special Needs Transport",
      description:
        "Dedicated to serving children with special needs with tailored, compassionate, and secure transportation solutions.",
      icon: <Wheelchair size={24} className="text-white" />,
    },
    {
      name: "Sports/Extracurricular Transport",
      description:
        "Supporting your child's passions with reliable transportation to sports practices and extracurricular activities.",
      icon: <SoccerBall size={24} className="text-white" />,
    },
    {
      name: "Religious Activity Transport",
      description:
        "Facilitating your family's faith journey with dependable transportation to and from religious events.",
      icon: <Church size={24} className="text-white" />,
    },
    {
      name: "Six Flags Season Pass Transport",
      description:
        "Enhancing fun and convenience with secure transportation to and from Six Flags for season pass holders.",
      icon: <Ticket size={24} className="text-white" />,
    },
    {
      name: "Birthday Party Transport",
      description:
        "Making birthdays even more special with safe and reliable transportation to and from party venues.",
      icon: <Gift size={24} className="text-white" />,
    },
    {
      name: "Customized Routes",
      description:
        "Meeting your unique family needs with personalized and flexible transportation routes designed just for you.",
      icon: <MapPinLine size={24} className="text-white" />,
    },
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-teal-50 to-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
          What Do We Offer?
        </h2>
        <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          Busy Minis Transportation offers services tailored to your
          family&lsquo;s needs. From safe school transportation to
          extracurricular activities, we ensure a reliable experience.
        </p>
      </div>

      {/* Offers Grid */}
      <motion.div
        className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        {services.map((service, index) => (
          <OfferItem
            key={index}
            icon={service.icon}
            title={service.name}
            description={service.description}
            delay={index * 0.2}
          />
        ))}
      </motion.div>

      {/* Call to Action */}
      <motion.div
        className="flex justify-center mt-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <Link href="/pricing">
          <div className="flex items-center bg-orange-600 hover:bg-orange-700 text-white transition-all px-8 py-4 gap-3 rounded-full shadow-lg text-lg font-semibold hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
            <span>Get A Quote</span>
            <ArrowRight className="text-2xl" weight="bold" />
          </div>
        </Link>
      </motion.div>
    </section>
  );
}

// Offer Item Component
const OfferItem = ({ icon, title, description, delay }: any) => {
  return (
    <motion.div
      className="flex flex-col text-center items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay }}
    >
      {/* Icon Container */}
      <div className="flex items-center justify-center w-16 h-16 bg-orange-600 rounded-full mb-4 shadow-lg">
        {icon}
      </div>

      {/* Service Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>

      {/* Service Description */}
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};
