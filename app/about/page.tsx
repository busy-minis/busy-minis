"use client";
import React, { useState } from "react";
import Footer from "../components/ui/Footer";
import { TextParallaxContentExample } from "../components/ui/TextScroll";
import { NavBar } from "../components/ui/NavBar";
import HoverDevCards from "../components/ui/Cards";
import classNames from "classnames";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

import { ArrowDown, ArrowFatDown } from "@phosphor-icons/react";
export default function page() {
  return (
    <div className="">
      <NavBar />
      <div className=" py-24 ">
        <main className="max-w-7xl mx-auto  ">
          <div className="relative">
            <h1 className="text-8xl   px-4 font-bold  tracking-tighter whitespace-nowrap ">
              ABOUT <span className="text-theme-teal"> US</span>
              <div className="size-10 bg-theme-orange rounded-tl-3xl absolute top-0 left-0 -z-10"></div>
            </h1>
          </div>

          <div className="flex justify-between mt-12">
            <article className=" ">
              <p className="mt-8 max-w-2xl text-lg  leading-relaxed">
                Welcome to Busy Minis Transportation, your trusted partner in
                safe and reliable transportation solutions for children in
                Coweta, Fayette, and Clayton counties. <br /> <br /> At Busy
                Minis, we understand the challenges faced by busy parents
                juggling work schedules and their children{"'"}s diverse
                activities. Our mission is to provide peace of mind by offering
                secure and convenient transportation tailored specifically for
                young passengers.
              </p>
            </article>
            <section className="relative">
              <Image
                src={"/assets/09.png"}
                alt=""
                className="rounded-tl-full"
                height={400}
                width={400}
                quality={100}
              />
            </section>
          </div>

          <div className="bg-neutral-800 rounded-3xl  text-neutral-200  py-12 mt-24">
            <h2 className="text-5xl  text-center text-theme-orange font-bold">
              Our Mission
            </h2>
            <p className="mt-8 leading-relaxed max-w-3xl text-lg mx-auto text-center">
              At Busy Minis Transportation, we understand the demands of busy
              families. Our mission is to provide safe, reliable, and convenient
              transportation for your children, giving you peace of mind and
              more time to focus on what matters most. We’re here to ensure your
              kids get to their activities safely and on time, every time.
            </p>
            <div className="grid place-content-center">
              <button className="mt-24 rounded-3xl bg-theme-orange font-bold text-xl  text-white px-10 py-2 ">
                GET A QUOTE
              </button>
            </div>
          </div>
        </main>
      </div>

      <div className=" max-w-7xl mx-auto mt-48 text-lg">
        <p className="text-center text-3xl pb-12">Frequently asked questions</p>

        <Question
          question={"How do I register my child?"}
          answer={
            "Fill out our online registration form to create your rider profile."
          }
        />
        <Question
          question={"What happens after I register?"}
          answer={
            "Meet with our team to discuss service options, safety protocols, and any questions you may have."
          }
        />
        <Question
          question={"How do I schedule a ride?"}
          answer={
            "You can easily schedule rides through our website, and receive all necessary details and confirmations."
          }
        />
        <Question
          question={"What if I need to cancel a ride?"}
          answer={
            "You can easily cancel rides through our website, and receive confirmation of the cancellation."
          }
        />
      </div>

      <Footer />
    </div>
  );
}

const Question = (props: any) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="max-w-4xl mx-auto border-b  border-neutral-400">
      <section
        onClick={() => setOpen(!open)}
        className="flex justify-between py-6 w-full  items-center"
      >
        <h3 className="font-semibold">{props.question}</h3>
        <ArrowDown />
      </section>

      {open && <p className="pb-6 text-neutral-500"> {props.answer}</p>}
    </div>
  );
};

const Item = (props: any) => {
  const colorClass = classNames({
    "bg-blue-400": props.color === "blue",
    "bg-red-400": props.color === "red",
    "bg-green-400": props.color === "green",
  });
  return (
    <div className={` p-8  rounded-t-3xl w-full`}>
      <p className="  text-3xl  w-full">{props.title}</p>
      <p className="text-xl pb-24 mt-12  ">{props.text}</p>
    </div>
  );
};

const Wrap = () => {
  return (
    <section className="relative w-fit py-6 -left-4 ">
      <div className="bg-white absolute -rotate-1 text-2xl py-1 border-2  border-neutral-900 text-neutral-900 font-bold tracking-tighter uppercase flex gap-4 items-center whitespace-nowrap overflow-hidden w-fit">
        Minis <Arr /> Transportation <Arr /> Busy <Arr />
        Minis <Arr /> Transportation <Arr /> Busy <Arr />
        Minis <Arr /> Transportation <Arr /> Busy <Arr />
        Minis <Arr /> Transportation <Arr /> Busy <Arr />
      </div>
      <div className="bg-white rotate-1 absolute text-2xl  border-2 py-1  border-neutral-900 text-neutral-900 font-bold tracking-tighter uppercase flex gap-4 items-center whitespace-nowrap overflow-hidden w-fit ">
        Busy <Arr /> Minis <Arr /> Transportation <Arr />
        Busy <Arr /> Minis <Arr /> Transportation <Arr />
        Busy <Arr /> Minis <Arr /> Transportation <Arr />
        Busy <Arr /> Minis <Arr /> Transportation <Arr />
      </div>
    </section>
  );
};

const Arr = () => {
  return (
    <div className="flex justify-center bg-neutral-900 text-white rounded-full p-1 w-fit text-lg ">
      <ArrowRight />
    </div>
  );
};
