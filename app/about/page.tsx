import React from "react";
import Footer from "../components/Footer";
import { TextParallaxContentExample } from "../components/ui/TextScroll";
import { NavBar } from "../components/NavBar";
import HoverDevCards from "../components/ui/Cards";
export default function page() {
  return (
    <div>
      <NavBar />

      <main className="max-w-7xl mx-auto text-xl mt-32">
        <h1 className="text-6xl tracking-tighter">Busy Minis</h1>
        <h1 className="text-6xl tracking-tighter mt-6">Transportation</h1>
        <h1 className="text-6xl tracking-tighter">...</h1>

        <p className="mt-8 max-w-5xl leading-relaxed">
          Welcome to Busy Minis Transportation, your trusted partner in safe and
          reliable transportation solutions for children in Coweta, Fayette, and
          Clayton counties. At Busy Minis, we understand the challenges faced by
          busy parents juggling work schedules and their children{"'"}s diverse
          activities. Our mission is to provide peace of mind by offering secure
          and convenient transportation tailored specifically for young
          passengers.
        </p>

        <h2 className="text-5xl mt-16">Our Mission</h2>
        <p className="mt-8  max-w-5xl">
          Busy Minis Transportation aims to be the #1 Community Trusted
          Transportation alternative, meeting the ever-changing needs of
          children and families. We strive to uphold our commitment to safety,
          reliability, and exceptional service while accommodating a variety of
          transportation needs—from tutoring sessions to birthday parties, and
          everything in between.
        </p>
        <h2 className="text-5xl mt-16 text-center">What Sets Us Apart</h2>
        <div className=" grid-cols-3 grid gap-4 mt-8 ">
          <Item
            title={"Safety First"}
            text={
              "We prioritize safety with certified drivers and trained Shuttle Aids on every ride. Our vehicles are equipped with dual dash cams, daily inspections, and first aid kits to ensure a secure journey for every child."
            }
          />
          <Item
            title={"Customized Service"}
            text={
              "We offer flexible routes and scheduling options designed to fit your family’s unique needs. Whether it&apos;s a regular tutoring session or a last-minute pick-up, Busy Minis is here to help. "
            }
          />
          <Item
            title={"Community Focus"}
            text={
              "Proudly serving the South Atlanta Area, we build trust through transparent communication, rigorous safety protocols, and personalized customer care."
            }
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

const Item = (props: any) => {
  return (
    <div className="  rounded-xl w-full  border-2 border-black   bg-white ">
      <p className="font-bold border-b-2 p-4  border-neutral-800 border-dashed w-full">
        {props.title}
      </p>
      <p className=" text-base p-4 pb-24 rounded-b-xl  bg-gradient-to-br from-neutral-200 to-indigo-100">
        {props.text}
      </p>
    </div>
  );
};
