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
    <div className="bg-theme-teal md:rounded-t-[4rem] md:rounded-b-[4rem]  py-36 relative">
      <div className="md:h-96 md:w-96 bg-white/20 absolute top-24 left-5 rounded-full"></div>
      <div className="md:h-64 md:w-64 bg-white/20 absolute bottom-12 right-5 rounded-full"></div>

      <div className="max-w-7xl mx-auto relative">
        <h2 className="text-center text-white font-bold px-4 py-2 text-3xl  sm:text-4xl md:text-6xl tracking-tighter  pb-24">
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
    <div className="px-4 md:px-0 grid grid-cols-1  md:grid-cols-2 gap-4 md:gap-12 ">
      {safetyFeatures.map((feature, index) => (
        <div key={index} className="flex  bg-white/30 px-4 py-6 rounded-3xl">
          <div className="bg-theme-yellow h-6 mr-4 w-6 grid place-content-center rounded-full">
            <Check className="text-white" weight="bold" />
          </div>
          <section className="">
            <h3 className="font-bold text-sm md:text-base  leading-tight">
              {feature.title}
            </h3>

            <p className="text-xs md:text-base">{feature.description}</p>
          </section>
        </div>
      ))}
    </div>
  );
};
