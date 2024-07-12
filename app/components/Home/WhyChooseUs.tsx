"use client";
import React from "react";
import { Shield } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Car, ShieldPlus } from "@phosphor-icons/react";

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
    <div className="bg-theme-teal  rounded-t-[4rem] rounded-b-[4rem] py-36 relative">
      <div className="h-96 w-96 bg-white/20 absolute top-24 left-5 rounded-full"></div>
      <div className="h-64 w-64 bg-white/20 absolute bottom-12 right-5 rounded-full"></div>

      <div className="max-w-7xl mx-auto relative">
        <div className="flex justify-center py-8 pb-24 stick top-36 -z-10">
          <h2 className="text-right text-white font-bold px-4 py-2 text-6xl tracking-tighter w-fit">
            Why Choose Us?
          </h2>
        </div>

        <div className="flex gap-8">
          {sections.map((section, index) => (
            <motion.section
              key={index}
              className={`text-center  text-white *:w-full pb-48 border-2  transition-all duration-300 hover:shadow-[10px_10px_0px_0px_#262626] relative rounded-3xl pt-24 max-w-md px-8 `}
              style={{ y, x }}
            >
              <ShieldPlus size={80} weight="thin" className="mx-auto" />
              <h2 className="text-4xl font-semibold mt-16 ">{section.title}</h2>
              <p className="mt-8 leading-relaxed text-lg ">
                {section.description}
              </p>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
}
