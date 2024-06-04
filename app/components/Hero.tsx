"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center mt-12">
      <ChangingText />
      <section className="  border-neutral-400 rounded-2xl">
        <h1 className="text-8xl tracking-tighter  text-center mt-4 title">
          Busy Minis Transportation Company{" "}
          <span className="font-light text-xl">&copy;</span>
        </h1>
      </section>
      <p className="max-w-2xl text-lg leading-relaxed mt-4 text-center">
        Busy Minis Transportation aims to be the #1 Community Trusted
        Transportation alternative, meeting the ever-changing needs of children
        and families by providing safe, reliable, and convenient transportation
        services for various activities and occasions.
      </p>
      <button className="bg-neutral-900 rounded-3xl hover:bg-orange-500 transition-all duration-500 text-neutral-100 px-10 py-4 mt-8">
        Get Started
      </button>
    </div>
  );
}

const ChangingText = () => {
  const texts = [
    "For Working Parents",
    "For Emergency Care",
    "For Safe Travels",
  ];
  const [text, setText] = React.useState("Hello");
  useEffect(() => {
    const interval = setInterval(() => {
      setText(texts[Math.floor(Math.random() * texts.length)]);
    }, 2000);
    return () => clearInterval(interval);
  });
  return (
    <div className="text-2xl bg-neutral-300 min-w-80 text-center font-bold italic transition-all duration-400 w-fit px-2 py-1 ">
      {text}
    </div>
  );
};
