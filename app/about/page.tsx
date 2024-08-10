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
      <NavBar page="about" />
      <About1 />
      <div className="  ">
        <main className="max-w-7xl mx-auto  ">
          <div className="border-2 border-zinc-400 rounded-xl px-4 md:px-0  shadow-lg py-12 mt-24">
            <h2 className="text-2xl sm:text-4xl md:text-5xl  text-center text-theme-orange font-light">
              Our Mission
            </h2>
            <p className="mt-8 leading-relaxed max-w-3xl text-gray-700  text-sm sm:text-base md:text-lg mx-auto text-center ">
              At Busy Minis Transportation, we understand the demands of busy
              families. Our mission is to provide safe, reliable, and convenient
              transportation for your children, giving you peace of mind and
              more time to focus on what matters most. We’re here to ensure your
              kids get to their activities safely and on time, every time.
            </p>
            <div className="grid place-content-center">
              <button className="mt-24 rounded-md bg-theme-orange text-base md:text-xl  text-white px-10 py-2 ">
                Get a Quote
              </button>
            </div>
          </div>
        </main>
      </div>
      <DriverSafetyInfo />
      <div className=" max-w-7xl mx-auto mt-48 text-lg px-4 md:px-0">
        <p className="text-center font-light text-3xl pb-12">
          Frequently asked questions
        </p>
        <div>
          {faqData.map((item, index) => (
            <Question
              key={index}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

const Question = (props: any) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="max-w-4xl mx-auto border-b hover:bg-gray-200 px-2 cursor-pointer  border-neutral-400">
      <section
        onClick={() => setOpen(!open)}
        className="flex justify-between py-6 w-full  items-center"
      >
        <h3 className=" text-sm sm:text-base md:text-lg font-medium ">
          {props.question}
        </h3>
        <ArrowDown />
      </section>

      {open && (
        <p className="pb-6 text-neutral-600  text-sm sm:text-base md:text-lg ">
          {" "}
          {props.answer}
        </p>
      )}
    </div>
  );
};
const driverSafetyData = [
  {
    title: "Driver Verification Process",
    description:
      "Includes in-person interviews, county, state, and national criminal record checks, FBI-approved fingerprinting background checks, drug tests, motor vehicle reviews, and a minimum of five years of caregiving experience.",
  },
  // {
  //   title: "Female Drivers",
  //   description: "Most of our drivers are female.",
  // },
  {
    title: "Safe Driver Training",
    description: "All drivers undergo comprehensive safety training.",
  },
  {
    title: "Dual Dash Cam",
    description:
      "Our vehicles are equipped with dual dash cams for road and cabin views.",
  },
  {
    title: "Pick-Up/Drop-Off Notice",
    description:
      "Parents receive notifications when their child is picked up and dropped off.",
  },
  {
    title: "Marked Vehicles",
    description: "All vehicles are clearly marked for easy identification.",
  },
  {
    title: "Uniformed Drivers",
    description: "Our drivers wear uniforms for easy recognition.",
  },
  {
    title: "First Aid Kits and Safety Equipment",
    description:
      "Each vehicle is equipped with first aid kits and necessary safety equipment.",
  },
  {
    title: "Regular Vehicle Maintenance",
    description:
      "We conduct regular maintenance and safety inspections on all our vehicles.",
  },
];

// Component for displaying title and description in a grid layout
const TitleDescriptionGrid = (props: any) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4   md:gap-8 px-2 md:px-0">
      {props.data.map((item: any, index: any) => (
        <div
          key={index}
          className="border border-gray-300 p-4 px-6 rounded-lg text-xs md:text-base"
        >
          <h3 className=" text-orange-500 text-xl">{item.title}</h3>
          <p className="text-gray-600 mt-2">{item.description}</p>
        </div>
      ))}
    </div>
  );
};

// FAQ component that renders the TitleDescriptionGrid
const DriverSafetyInfo = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <h2 className=" text-2xl sm:text-3xl md:text-4xl text-center font-light pb-6 pt-36">
        Drivers and Safety
      </h2>
      <p className="pb-24 text-center max-w-4xl mx-auto ">
        At Busy Minis,{" "}
        <span className="text-theme-orange font-semibold">
          safety is our top priority
        </span>{" "}
        . We have implemented rigorous safety protocols to ensure the well-being
        of your children.
      </p>
      <TitleDescriptionGrid data={driverSafetyData} />
    </div>
  );
};

const faqData = [
  {
    question: "Can I request the same driver?",
    answer:
      "Yes, you can request a specific driver when booking. If the requested driver is unavailable, the ride will be released to other drivers in the area. All regular ride customers will have the same driver each week.",
  },
  {
    question: "How much does a ride cost?",
    answer:
      "Rides start at $19 plus a $3 booking fee. The total fare depends on mileage, the number of passengers and stops, and any excess wait or additional travel miles. You can easily get a quote through our website.",
  },
  {
    question: "How does the booking process work?",
    answer:
      "Visit the Busy Minis website, provide rider information, and specify the pick-up and drop-off locations. Parents can leave special instructions and check ride status on the website. First time riders must complete a 30-minute orientation where they will meet their driver.",
  },
  {
    question: "How will my child recognize their driver?",
    answer:
      "You will receive the driver's information and photo once the ride is claimed. We encourage sharing this information with your child. All drivers display the Busy Minis logo on their windshields.",
  },
  {
    question: "Can I book more than one ride at a time?",
    answer:
      "Rides need to be booked individually, but our regular rides services can be scheduled through a quick phone call.",
  },
  {
    question: "How does Busy Minis vet their drivers?",
    answer:
      "We only hire drivers who meet our high standards. The vetting process includes multi-jurisdictional background checks, DMV screens, vehicle approvals, interviews, and inspections. All drivers must have up-to-date vehicle registration and insurance, and a valid driver's license.",
  },
  {
    question: "What if I need to cancel a ride?",
    answer:
      "You can easily cancel rides through the website. Depending on the timing, a full or partial refund will be issued. Rides canceled within two hours of pickup are non-refundable.",
  },
  {
    question: "How will I know when my ride is claimed?",
    answer:
      "You will receive a notification once a driver claims your ride. You can also check ride status on the website.",
  },
  {
    question: "Does Busy Minis offer discounts?",
    answer:
      "Yes, regular clients can enjoy discounted rates. Additionally, our community VIPs (Volunteers, Instructor's, Public Servants) receive a discount for their service! Contact us at hello@busyminis.com for more information.",
  },
  {
    question: "What if my school requires a carpool tag?",
    answer:
      "We work with most schools to facilitate carpool pickups. You can send carpool tag information directly to your driver.",
  },
  {
    question: "Do you provide booster seats?",
    answer:
      "Yes, indicate the need for a booster seat on the website. Not all drivers have booster seats, so it's important to specify this need in advance.",
  },
  {
    question: "What are your hours of operation?",
    answer:
      "Our service operates from 6am-6pm EST, though driver availability may vary during early mornings, late evenings, weekends, and holidays. Customer support is available between 5am-7pm EST.",
  },
  {
    question: "How far in advance can I book?",
    answer:
      "You can request rides as far in advance as needed. Early requests increase the likelihood of driver availability.",
  },
  {
    question: "Is there a carpool option?",
    answer:
      "Yes, we support carpool requests. If you choose to put your Mini on the Move with other families, the cost for carpooling is reduced!",
  },
  {
    question: "Can I meet my driver?",
    answer:
      "Yes, first time riders must complete orientation. During the 30-minute orientation you will have a meet-and-greet with your driver.",
  },
  {
    question: "What are the wait time charges?",
    answer:
      "A 5-minute grace period is provided at pickup. After that, wait time charges of $1.00 per minute apply.",
  },
  {
    question: "What areas do you service?",
    answer:
      "We proudly serve all areas of Coweta, Fayette, and Clayton Counties in the south Atlanta region. Contact us for specific inquiries.",
  },
  {
    question: "What if I need to make a change to my ride?",
    answer:
      "If your ride has been claimed, contact the driver directly for minor time changes. For significant changes we ask that you cancel the ride and request a new one. Rides canceled within two hours of pickup are non-refundable.",
  },
  {
    question: "What age range of kids do you pick up?",
    answer:
      "Right now we are supporting the busy schedules of Minis ages 7-17. Contact us for specific inquiries.",
  },
  {
    question: "How many passengers can ride in a car?",
    answer:
      "All one-time ride vehicles support at least two to four passengers. Carpooling vehicles support up to 12 passengers.",
  },
  {
    question: "Can I add a stop on the ride?",
    answer:
      "Yes, you can add extra pickup or drop-off stops on the website for an additional fee.",
  },
  {
    question: "Can my child eat in the car?",
    answer:
      "Eating in the car is at the driver's discretion. We recommend eating before or after the ride and ensuring the car remains clean.",
  },
];

const About1 = () => {
  return (
    <>
      <section className="overflow-hidden pt-12 pb-12 lg:pt-[60px] lg:pb-[90px]  ">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center justify-between -mx-4">
            <div className="w-full px-4 lg:w-6/12">
              <div className="flex items-center -mx-3 sm:-mx-4">
                <div className="w-full px-3 sm:px-4 xl:w-1/2">
                  <div className="py-3 sm:py-4">
                    <Image
                      src={"/assets/09.png"}
                      alt=""
                      className=" rounded-3xl"
                      width={400}
                      height={400}
                      quality={100}
                    />
                  </div>
                  <div className="py-3 sm:py-4">
                    <Image
                      src={"/assets/laugh.png"}
                      alt=""
                      className=" rounded-3xl"
                      width={400}
                      height={400}
                      quality={100}
                    />
                  </div>
                </div>
                <div className="w-full px-3 sm:px-4 xl:w-1/2">
                  <div className="relative  my-4">
                    <Image
                      src={"/assets/pexel.jpg"}
                      alt=""
                      className=" rounded-3xl"
                      width={400}
                      height={400}
                      quality={100}
                    />
                    <span className="absolute -right-7 -bottom-7 z-[-1]">
                      <svg
                        width={134}
                        height={106}
                        viewBox="0 0 134 106"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="1.66667"
                          cy={104}
                          r="1.66667"
                          transform="rotate(-90 1.66667 104)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="16.3333"
                          cy={104}
                          r="1.66667"
                          transform="rotate(-90 16.3333 104)"
                          fill="#ec742e"
                        />
                        <circle
                          cx={31}
                          cy={104}
                          r="1.66667"
                          transform="rotate(-90 31 104)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="45.6667"
                          cy={104}
                          r="1.66667"
                          transform="rotate(-90 45.6667 104)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="60.3334"
                          cy={104}
                          r="1.66667"
                          transform="rotate(-90 60.3334 104)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="88.6667"
                          cy={104}
                          r="1.66667"
                          transform="rotate(-90 88.6667 104)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="117.667"
                          cy={104}
                          r="1.66667"
                          transform="rotate(-90 117.667 104)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="74.6667"
                          cy={104}
                          r="1.66667"
                          transform="rotate(-90 74.6667 104)"
                          fill="#ec742e"
                        />
                        <circle
                          cx={103}
                          cy={104}
                          r="1.66667"
                          transform="rotate(-90 103 104)"
                          fill="#ec742e"
                        />
                        <circle
                          cx={132}
                          cy={104}
                          r="1.66667"
                          transform="rotate(-90 132 104)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="1.66667"
                          cy="89.3333"
                          r="1.66667"
                          transform="rotate(-90 1.66667 89.3333)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="16.3333"
                          cy="89.3333"
                          r="1.66667"
                          transform="rotate(-90 16.3333 89.3333)"
                          fill="#ec742e"
                        />
                        <circle
                          cx={31}
                          cy="89.3333"
                          r="1.66667"
                          transform="rotate(-90 31 89.3333)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="45.6667"
                          cy="89.3333"
                          r="1.66667"
                          transform="rotate(-90 45.6667 89.3333)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="60.3333"
                          cy="89.3338"
                          r="1.66667"
                          transform="rotate(-90 60.3333 89.3338)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="88.6667"
                          cy="89.3338"
                          r="1.66667"
                          transform="rotate(-90 88.6667 89.3338)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="117.667"
                          cy="89.3338"
                          r="1.66667"
                          transform="rotate(-90 117.667 89.3338)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="74.6667"
                          cy="89.3338"
                          r="1.66667"
                          transform="rotate(-90 74.6667 89.3338)"
                          fill="#ec742e"
                        />
                        <circle
                          cx={103}
                          cy="89.3338"
                          r="1.66667"
                          transform="rotate(-90 103 89.3338)"
                          fill="#ec742e"
                        />
                        <circle
                          cx={132}
                          cy="89.3338"
                          r="1.66667"
                          transform="rotate(-90 132 89.3338)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="1.66667"
                          cy="74.6673"
                          r="1.66667"
                          transform="rotate(-90 1.66667 74.6673)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="1.66667"
                          cy="31.0003"
                          r="1.66667"
                          transform="rotate(-90 1.66667 31.0003)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="16.3333"
                          cy="74.6668"
                          r="1.66667"
                          transform="rotate(-90 16.3333 74.6668)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="16.3333"
                          cy="31.0003"
                          r="1.66667"
                          transform="rotate(-90 16.3333 31.0003)"
                          fill="#ec742e"
                        />
                        <circle
                          cx={31}
                          cy="74.6668"
                          r="1.66667"
                          transform="rotate(-90 31 74.6668)"
                          fill="#ec742e"
                        />
                        <circle
                          cx={31}
                          cy="31.0003"
                          r="1.66667"
                          transform="rotate(-90 31 31.0003)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="45.6667"
                          cy="74.6668"
                          r="1.66667"
                          transform="rotate(-90 45.6667 74.6668)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="45.6667"
                          cy="31.0003"
                          r="1.66667"
                          transform="rotate(-90 45.6667 31.0003)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="60.3333"
                          cy="74.6668"
                          r="1.66667"
                          transform="rotate(-90 60.3333 74.6668)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="60.3333"
                          cy="30.9998"
                          r="1.66667"
                          transform="rotate(-90 60.3333 30.9998)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="88.6667"
                          cy="74.6668"
                          r="1.66667"
                          transform="rotate(-90 88.6667 74.6668)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="88.6667"
                          cy="30.9998"
                          r="1.66667"
                          transform="rotate(-90 88.6667 30.9998)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="117.667"
                          cy="74.6668"
                          r="1.66667"
                          transform="rotate(-90 117.667 74.6668)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="117.667"
                          cy="30.9998"
                          r="1.66667"
                          transform="rotate(-90 117.667 30.9998)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="74.6667"
                          cy="74.6668"
                          r="1.66667"
                          transform="rotate(-90 74.6667 74.6668)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="74.6667"
                          cy="30.9998"
                          r="1.66667"
                          transform="rotate(-90 74.6667 30.9998)"
                          fill="#ec742e"
                        />
                        <circle
                          cx={103}
                          cy="74.6668"
                          r="1.66667"
                          transform="rotate(-90 103 74.6668)"
                          fill="#ec742e"
                        />
                        <circle
                          cx={103}
                          cy="30.9998"
                          r="1.66667"
                          transform="rotate(-90 103 30.9998)"
                          fill="#ec742e"
                        />
                        <circle
                          cx={132}
                          cy="74.6668"
                          r="1.66667"
                          transform="rotate(-90 132 74.6668)"
                          fill="#ec742e"
                        />
                        <circle
                          cx={132}
                          cy="30.9998"
                          r="1.66667"
                          transform="rotate(-90 132 30.9998)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="1.66667"
                          cy="60.0003"
                          r="1.66667"
                          transform="rotate(-90 1.66667 60.0003)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="1.66667"
                          cy="16.3333"
                          r="1.66667"
                          transform="rotate(-90 1.66667 16.3333)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="16.3333"
                          cy="60.0003"
                          r="1.66667"
                          transform="rotate(-90 16.3333 60.0003)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="16.3333"
                          cy="16.3333"
                          r="1.66667"
                          transform="rotate(-90 16.3333 16.3333)"
                          fill="#ec742e"
                        />
                        <circle
                          cx={31}
                          cy="60.0003"
                          r="1.66667"
                          transform="rotate(-90 31 60.0003)"
                          fill="#ec742e"
                        />
                        <circle
                          cx={31}
                          cy="16.3333"
                          r="1.66667"
                          transform="rotate(-90 31 16.3333)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="45.6667"
                          cy="60.0003"
                          r="1.66667"
                          transform="rotate(-90 45.6667 60.0003)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="45.6667"
                          cy="16.3333"
                          r="1.66667"
                          transform="rotate(-90 45.6667 16.3333)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="60.3333"
                          cy="60.0003"
                          r="1.66667"
                          transform="rotate(-90 60.3333 60.0003)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="60.3333"
                          cy="16.3333"
                          r="1.66667"
                          transform="rotate(-90 60.3333 16.3333)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="88.6667"
                          cy="60.0003"
                          r="1.66667"
                          transform="rotate(-90 88.6667 60.0003)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="88.6667"
                          cy="16.3333"
                          r="1.66667"
                          transform="rotate(-90 88.6667 16.3333)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="117.667"
                          cy="60.0003"
                          r="1.66667"
                          transform="rotate(-90 117.667 60.0003)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="117.667"
                          cy="16.3333"
                          r="1.66667"
                          transform="rotate(-90 117.667 16.3333)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="74.6667"
                          cy="60.0003"
                          r="1.66667"
                          transform="rotate(-90 74.6667 60.0003)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="74.6667"
                          cy="16.3333"
                          r="1.66667"
                          transform="rotate(-90 74.6667 16.3333)"
                          fill="#ec742e"
                        />
                        <circle
                          cx={103}
                          cy="60.0003"
                          r="1.66667"
                          transform="rotate(-90 103 60.0003)"
                          fill="#ec742e"
                        />
                        <circle
                          cx={103}
                          cy="16.3333"
                          r="1.66667"
                          transform="rotate(-90 103 16.3333)"
                          fill="#ec742e"
                        />
                        <circle
                          cx={132}
                          cy="60.0003"
                          r="1.66667"
                          transform="rotate(-90 132 60.0003)"
                          fill="#ec742e"
                        />
                        <circle
                          cx={132}
                          cy="16.3333"
                          r="1.66667"
                          transform="rotate(-90 132 16.3333)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="1.66667"
                          cy="45.3333"
                          r="1.66667"
                          transform="rotate(-90 1.66667 45.3333)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="1.66667"
                          cy="1.66683"
                          r="1.66667"
                          transform="rotate(-90 1.66667 1.66683)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="16.3333"
                          cy="45.3333"
                          r="1.66667"
                          transform="rotate(-90 16.3333 45.3333)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="16.3333"
                          cy="1.66683"
                          r="1.66667"
                          transform="rotate(-90 16.3333 1.66683)"
                          fill="#ec742e"
                        />
                        <circle
                          cx={31}
                          cy="45.3333"
                          r="1.66667"
                          transform="rotate(-90 31 45.3333)"
                          fill="#ec742e"
                        />
                        <circle
                          cx={31}
                          cy="1.66683"
                          r="1.66667"
                          transform="rotate(-90 31 1.66683)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="45.6667"
                          cy="45.3333"
                          r="1.66667"
                          transform="rotate(-90 45.6667 45.3333)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="45.6667"
                          cy="1.66683"
                          r="1.66667"
                          transform="rotate(-90 45.6667 1.66683)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="60.3333"
                          cy="45.3338"
                          r="1.66667"
                          transform="rotate(-90 60.3333 45.3338)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="60.3333"
                          cy="1.66683"
                          r="1.66667"
                          transform="rotate(-90 60.3333 1.66683)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="88.6667"
                          cy="45.3338"
                          r="1.66667"
                          transform="rotate(-90 88.6667 45.3338)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="88.6667"
                          cy="1.66683"
                          r="1.66667"
                          transform="rotate(-90 88.6667 1.66683)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="117.667"
                          cy="45.3338"
                          r="1.66667"
                          transform="rotate(-90 117.667 45.3338)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="117.667"
                          cy="1.66683"
                          r="1.66667"
                          transform="rotate(-90 117.667 1.66683)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="74.6667"
                          cy="45.3338"
                          r="1.66667"
                          transform="rotate(-90 74.6667 45.3338)"
                          fill="#ec742e"
                        />
                        <circle
                          cx="74.6667"
                          cy="1.66683"
                          r="1.66667"
                          transform="rotate(-90 74.6667 1.66683)"
                          fill="#ec742e"
                        />
                        <circle
                          cx={103}
                          cy="45.3338"
                          r="1.66667"
                          transform="rotate(-90 103 45.3338)"
                          fill="#ec742e"
                        />
                        <circle
                          cx={103}
                          cy="1.66683"
                          r="1.66667"
                          transform="rotate(-90 103 1.66683)"
                          fill="#ec742e"
                        />
                        <circle
                          cx={132}
                          cy="45.3338"
                          r="1.66667"
                          transform="rotate(-90 132 45.3338)"
                          fill="#ec742e"
                        />
                        <circle
                          cx={132}
                          cy="1.66683"
                          r="1.66667"
                          transform="rotate(-90 132 1.66683)"
                          fill="#ec742e"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full px-4 lg:w-1/2 xl:w-5/12">
              <div className="mt-10 lg:mt-0">
                <span className="block mb-4 text-2xl font-light text-theme-orange">
                  About Us
                </span>
                <h2 className="mb-5 text-3xl tracking-tighter  text-dark sm:text-[40px]/[48px]">
                  Ensure your Minis travel joyfully by providing reliable and
                  safe transportation services.
                </h2>
                <p className="mb-5 text-base text-gray-700 leading-relaxed  ">
                  Busy Minis was founded by Lia, a working mother of two, who
                  struggled to balance her work commitments with her childrens
                  busy schedules. When she realized there were no reliable
                  options to get her kids to and from their activities, Lia
                  decided to create a solution herself. With extensive research
                  and planning, Busy Minis was born to help parents achieve a
                  better work-life balance without compromising their childrens
                  activities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
