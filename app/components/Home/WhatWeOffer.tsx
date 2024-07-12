import React from "react";
import { ArrowRight, Star } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
export default function WhatWeOffer() {
  return (
    <div className="max-w-7xl mt-48 rounded-3xl mx-auto bg-theme-orange text-neutral-200 py-24 p-8">
      <div className="text-center">
        <h2 className="mt-4 text-5xl tracking-tighter text-theme-yellow font-bold">
          What do we Offer ?
        </h2>
        <p className="mt-12 text-lg max-w-3xl text-center mx-auto leading-relaxed">
          Busy Minis Transportation offers a wide range of services tailored to
          fit your family&apos;s needs. From daily school commutes to
          last-minute pickups and special events, our flexible scheduling and
          customized routes provide a hassle-free transportation solution for
          busy families.
        </p>
      </div>

      <ul className="mt-36 grid grid-cols-2 gap-y-8 text-xl gap-x-24 w-fit  mx-auto">
        <Offer title={"Tutoring/After School Tutorials Transportation"} />
        <Offer title={"Summer Camp Transportation"} />
        <Offer title={"Last Minute or Sick Child Pick Up"} />
        <Offer title={"Transportation for Children with Special Needs"} />
        <Offer title={"Transportation for Sports/Extracurricular Activities"} />
        <Offer title={"Transportation for Religious Activities"} />

        <p></p>
        <p></p>
        <p></p>
        <p></p>
        <p></p>
      </ul>

      <Link
        href={"/services"}
        className="cursor-pointer  flex mx-auto bg-theme-yellow text-zinc-950 px-8 py-2 gap-4 rounded-3xl w-fit items-center"
      >
        <p>Find Out More</p>

        <ArrowRight
          size={30}
          className="p-2 font-bold text-neutral-900 bg-neutral-200 rounded-full"
        />
      </Link>
    </div>
  );
}

const Offer = (props: any) => {
  return (
    <div className="flex">
      <div className="flex gap-4 items-center">
        <Star className="text-theme-yellow" />
        <p className="font-bold"> {props.text}</p>
      </div>
      <h3 className="">{props.title}</h3>
    </div>
  );
};
