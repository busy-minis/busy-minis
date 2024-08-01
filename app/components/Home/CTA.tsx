import Link from "next/link";
import React from "react";

export default function CTA() {
  return (
    <div className="mt-48 flex items-center   max-w-7xl mx-auto">
      <Link
        href={"/pricing"}
        className="max-w-5xl   font-semibold mx-auto  text-3xl sm:text-3xl md:text-4xl  leading-tight  text-center "
      >
        What are you waiting for ?
        <br /> Reach out
        <span className=""> today</span> and get a <br />
        <span className=""> free quote</span>
      </Link>

      <div className="gap-12 flex justify-center mt-24"></div>
    </div>
  );
}
