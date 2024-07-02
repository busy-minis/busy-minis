import React from "react";

export default function CTA() {
  return (
    <div className="py-24 max-w-7xl mx-auto">
      <div className="flex justify-end">
        <h3 className="max-w-4xl text-6xl font-bold tracking-tighter text-right">
          What are you waiting for ? Reach out{" "}
          <span className="text-orange-400">today</span> to schedule your ride
        </h3>
      </div>

      <div className="flex gap-12 justify-center mt-24">
        <button className="bg-orange-400 px-8 py-2 text-2xl ">
          Schedule A Ride
        </button>
        <button className="bg-orange-400 px-8 py-2 text-2xl ">
          Get A Quote
        </button>
      </div>
    </div>
  );
}
