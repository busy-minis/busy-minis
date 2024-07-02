"use client";
import React, { useState } from "react";
import Footer from "../components/ui/Footer";
import { TextParallaxContentExample } from "../components/ui/TextScroll";
import { NavBar } from "../components/ui/NavBar";
import HoverDevCards from "../components/ui/Cards";
import classNames from "classnames";
import Image from "next/image";
import { ArrowDown, ArrowFatDown } from "@phosphor-icons/react";
export default function page() {
  return (
    <div className="">
      <NavBar />

      <main className="max-w-7xl mx-auto  mt-32 relative">
        <div className="flex">
          <section className="relative">
            <div className="h-[600px] w-[500px] bg-orange-400"></div>
            <h1 className="text-8xl bg-neutral-800 text-neutral-200 px-4 font-bold  tracking-tighter absolute top-12 whitespace-nowrap -right-72">
              ABOUT US
            </h1>
          </section>
          <article className="p-24 grid place-content-center">
            <p className="mt-8 max-w-4xl text-lg  leading-relaxed">
              Welcome to Busy Minis Transportation, your trusted partner in safe
              and reliable transportation solutions for children in Coweta,
              Fayette, and Clayton counties. <br /> <br /> At Busy Minis, we
              understand the challenges faced by busy parents juggling work
              schedules and their children{"'"}s diverse activities. Our mission
              is to provide peace of mind by offering secure and convenient
              transportation tailored specifically for young passengers.
            </p>
          </article>
        </div>
        <div className="bg-neutral-800  text-neutral-200  py-12 mt-24">
          <h2 className="text-5xl  text-center">Our Mission</h2>
          <p className="mt-8 leading-relaxed max-w-3xl text-lg mx-auto text-center">
            Busy Minis Transportation aims to be the #1 Community Trusted
            Transportation alternative, meeting the ever-changing needs of
            children and families. We strive to uphold our commitment to safety,
            reliability, and exceptional service while accommodating a variety
            of transportation needs—from tutoring sessions to birthday parties,
            and everything in between.
          </p>
          <div className="grid place-content-center">
            <button className="mt-24 bg-orange-400 font-bold text-xl  text-neutral-900 px-4 py-2 ">
              GET A QUOTE
            </button>
          </div>
        </div>

        <h2 className="text-5xl mt-36 text-center   w-fit mx-auto px-8 py-2">
          What Sets Us Apart
        </h2>
      </main>
      <div className="bg-neutral-300 p-8 max-w-7xl mx-auto rounded-3xl  gap-4 mt-8 ">
        <Item
          color={"blue"}
          title={"Safety First"}
          text={
            "We prioritize safety with certified drivers and trained Shuttle Aids on every ride. Our vehicles are equipped with dual dash cams, daily inspections, and first aid kits to ensure a secure journey for every child."
          }
        />
        <Item
          color={"red"}
          title={"Customized Service"}
          text={
            "We offer flexible routes and scheduling options designed to fit your family’s unique needs. Whether it&apos;s a regular tutoring session or a last-minute pick-up, Busy Minis is here to help. "
          }
        />
        <Item
          color={"green"}
          title={"Community Focus"}
          text={
            "Proudly serving the South Atlanta Area, we build trust through transparent communication, rigorous safety protocols, and personalized customer care."
          }
        />
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
