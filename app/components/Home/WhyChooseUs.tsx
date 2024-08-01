"use client";
import React from "react";
import { Shield } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Car, Check, ShieldPlus } from "@phosphor-icons/react";

export default function WhyChooseUs() {
  const sections = [
    {
      title: "Safety First",
      description:
        "Our drivers are certified, trained, and equipped with CPR and First Aid certification. Each ride is accompanied by a trained Shuttle Aid for additional support.",
      bgColor: "bg-white",
    },
    {
      title: "Reliable Service",
      description:
        "We prioritize punctuality and reliability, ensuring your children get to their destinations on time, every time.",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Convenient Options",
      description:
        "With services tailored to your family's needs, we provide a hassle-free transportation solution.",
      bgColor: "bg-trf",
    },
  ];

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const x = useTransform(scrollYProgress, [0, 0.1], [-1000, 0]);

  return (
    <div className="">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_29_4)">
          <path d="M0 0L720 96H1440V160H720H0V0Z" fill="#3EB7AE" />
        </g>
        <defs>
          <clipPath id="clip0_29_4">
            <rect width="100%" height="100%" fill="white" />
          </clipPath>
        </defs>
      </svg>

      <div className="  bg-theme-teal text-teal-950  pb-36 py-12  ">
        <div className="max-w-7xl mx-auto relative">
          <div className="mx-auto rounded-3xl text-sm px-4 py-1 w-fit  bg-gradient-to-r from-emerald-200 to-teal-300 ">
            Busy Minis
          </div>
          <h2 className="text-center text-teal-950 mt-4 font-bold  px-4 py-2 text-3xl  sm:text-4xl md:text-6xl   pb-24">
            Why Choose Us?
          </h2>
          {/* <Image
          src={"/assets/mac.jpg"}
          alt=""
          height={400}
          width={400}
          className="rounded-full mx-auto my-24 absolute top-48 left-24 -z-10"
        /> */}

          <DriverSafetyComponent />
        </div>
      </div>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 224"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_29_2)">
          <path d="M0 32L1440 224V0H0V32Z" fill="#3EB7AE" />
        </g>
        <defs>
          <clipPath id="clip0_29_2">
            <rect width="100%" height="100%" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

const DriverSafetyComponent = () => {
  const safetyFeatures = [
    {
      title: "Experienced & Compassionate Drivers",
      description: "Clean driving records and genuine care for children.",
    },
    {
      title: "Rigorous Background Checks",
      description: "Ensuring trustworthy and reliable staff.",
    },
    {
      title: "First Aid Kits & Safety Equipment",
      description: "Always on board.",
    },
    {
      title: "Regular Evaluations",
      description:
        "Continuous performance assessments to maintain high standards.",
    },
    {
      title: "Pick-Up/Drop-Off Notices",
      description: "Timely updates for parents.",
    },
    {
      title: "Dual Dash Cams",
      description: "Monitoring road and cabin views for safety.",
    },
    {
      title: "Marked Vehicles",
      description: "Easily identifiable for safety.",
    },
    {
      title: "Uniformed Drivers",
      description: "Professional and easily recognizable.",
    },
  ];

  return (
    <div className="px-4  md:px-0 grid grid-cols-1  md:grid-cols-2 gap-4 md:gap-12 ">
      {safetyFeatures.map((feature, index) => (
        <div
          key={index}
          className="flex    bg-gradient-to-r from-emerald-200 to-teal-300 px-8 py-6 rounded-lg"
        >
          <div className=" mt-2 bg-theme-orange h-6 mr-4 w-6 grid place-content-center rounded-full">
            <Check className="text-white" weight="bold" />
          </div>
          <section className="">
            <h3 className="text-sm md:text-2xl   ">{feature.title}</h3>

            <p className="text-xs md:text-base mt-1">{feature.description}</p>
          </section>
        </div>
      ))}
    </div>
  );
};
