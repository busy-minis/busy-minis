import React from "react";

export default function CTA() {
  return (
    <div className="mt-48   max-w-7xl mx-auto">
      <h3 className="max-w-4xl  mx-auto text-3xl sm:text-4xl md:text-6xl font-semibold leading-tight tracking-tighter text-center ">
        What are you waiting for ?
        <br /> Reach out
        <span className=""> today</span> and get a <br />
        <span className=""> free quote</span>
      </h3>

      <div className="gap-12 flex justify-center mt-24">
        <button className="bg-theme-orange rounded-full text-white px-8 py-2 text-base md:text-2xl ">
          Get A Quote
        </button>
      </div>
    </div>
  );
}
