"use client";
import React, { useEffect } from "react";
import { Check } from "@phosphor-icons/react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function WhyChooseUs() {
  return (
    <section className="relative bg-gradient-to-b from-theme-teal/90 to-teal-700 text-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <div className="mx-auto text-xs sm:text-sm px-4 py-1 w-fit bg-gradient-to-r from-emerald-300 to-teal-400 text-teal-900 font-semibold rounded-full">
            Busy Minis
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4">
            Why Choose Us?
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-sm md:text-lg leading-relaxed text-teal-200">
            At Busy Minis Transportation, safety, reliability, and convenience
            are at the core of what we do. Discover why families trust us with
            their children’s transportation needs.
          </p>
        </motion.div>

        {/* Safety Features Section */}
        <DriverSafetyComponent />
      </div>

      {/* Decorative SVG at Bottom */}
      <div className="absolute bottom-0 w-full overflow-hidden leading-none">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillOpacity="1"
            d="M0,64L48,80C96,96,192,128,288,133.3C384,139,480,117,576,106.7C672,96,768,96,864,101.3C960,107,1056,117,1152,117.3C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="#3EB7AE"
          />
        </svg>
      </div>
    </section>
  );
}

const DriverSafetyComponent = () => {
  const safetyFeatures = [
    {
      title: "Regular Safety Inspections",
      description:
        "Routine checks and services performed on each vehicle to ensure they meet safety standards",
    },
    {
      title: "Experienced & Compassionate Drivers",
      description:
        "Our drivers have clean driving records and show genuine care for children.",
    },
    {
      title: "Rigorous Background Checks",
      description:
        "We ensure that all staff members are thoroughly vetted and trustworthy.",
    },
    {
      title: "First Aid Kits & Safety Equipment",
      description: "Always on board to ensure the safety of our passengers.",
    },
    {
      title: "Regular Evaluations",
      description:
        "Our drivers undergo continuous evaluations to maintain high standards.",
    },
    {
      title: "Pick-Up/Drop-Off Notifications",
      description:
        "We keep parents informed with timely updates on pick-up and drop-off times.",
    },
    {
      title: "Dual Dash Cams",
      description:
        "For safety monitoring, both road and cabin views are recorded.",
    },
    {
      title: "Marked Vehicles",
      description:
        "Our vehicles are easily identifiable to ensure safety and visibility.",
    },
    {
      title: "Uniformed Drivers",
      description: "Our professional drivers are easily recognizable.",
    },
  ];

  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", delay: i * 0.2 },
    }),
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
    >
      {safetyFeatures.map((feature, index) => (
        <motion.div
          key={index}
          custom={index}
          variants={fadeIn}
          className="flex flex-col items-start bg-white bg-opacity-95 shadow-lg p-6 rounded-lg transform hover:scale-105 transition-transform duration-300"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-orange-500 rounded-full mb-4">
            <Check className="text-white" size={24} weight="bold" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-teal-900">
            {feature.title}
          </h3>
          <p className="text-sm text-gray-600">{feature.description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};
