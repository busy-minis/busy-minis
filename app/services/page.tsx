import React from "react";
import { NavBar } from "../components/ui/NavBar";
import Footer from "../components/ui/Footer";
import { Dot, Star } from "@phosphor-icons/react/dist/ssr";

export default function page() {
  const services = [
    "Tutoring/After School Transport",
    "Summer Camp Transport",
    "Last-Minute or Sick Child Pick-Up",
    "Special Needs Transport",
    "Sports/Extracurricular Transport",
    "Religious Activity Transport",
    "Job Interview Transport",
    "Six Flags Season Pass Transport",
    "Birthday Party Transport",
    "Customized Routes",
  ];
  return (
    <div>
      <NavBar />
      <main className="max-w-5xl mt-24 mx-auto text-lg">
        <section className="flex justify-between">
          <div>
            <h3 className="text-4xl tracking-tighter font-semibold">
              Get A Free Quote
            </h3>
            <div className="mt-2 max-w-md ">
              <p>*All Quotes are Estimates*</p>
              <p className="mt-8">
                Rides start at $19 with a $3 non-refundable booking fee. The
                base rate covers up to five miles and two passengers. Standard
                rates apply for additional miles, travel time, passengers and
                stops.
              </p>
              <p className="mt-4">
                We have a ten minute grace period from the designated pickup to
                start time, as we know there can be delays with carpool lines
                and activities. Rides are subject to additional fees for excess
                wait and travel time.
              </p>
              <p className="mt-4">Have a question? Contact us anytime!</p>
              <button className="bg-neutral-900 text-neutral-200 px-4 py-1 mt-8 ">
                Get in Touch
              </button>
            </div>
          </div>

          <QuoteCalculator />
        </section>
        <h2 className="text-5xl mt-24">Our Services</h2>
        <p className=" max-w-3xl mt-8 leading-relaxed">
          Busy Minis Transportation was founded to address the challenges faced
          by busy parents in balancing work schedules with their childrens
          extracurricular activities. Our services offer a solution by providing
          safe, reliable, and convenient transportation options for children
          aged 7-17.
        </p>
        <ul className="grid grid-cols-2  gap-y-4  mt-12">
          {services.map((service, index) => (
            <li className="flex items-center gap-2" key={index}>
              <Star size={15} />
              <p>{service}</p>
            </li>
          ))}
        </ul>
      </main>

      <Footer />
    </div>
  );
}

const QuoteCalculator = () => {
  return (
    <div className="p-8 px-12 bg-neutral-900 max-w-sm text-base space-y-8 rounded-3xl text-neutral-200">
      <section className="space-y-2">
        <p>Distance in Miles</p>
        <input
          className="px-2 py-1  rounded-md"
          name="distance"
          type="text"
          placeholder="miles"
        />
      </section>
      <section className="">
        <label htmlFor="passengers">Number of Passengers</label>
        <section className="flex gap-2 mt-2 text-neutral-100">
          <Number number={"1-2"} />
          <Number number={"3"} /> <Number number={"4"} />
        </section>
      </section>
    </div>
  );
};

const Number = (props: any) => {
  return (
    <div className="px-8 py-1 border border-neutral-500  rounded-lg  ">
      {props.number}
    </div>
  );
};
