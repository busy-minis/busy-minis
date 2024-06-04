import Image from "next/image";
import React from "react";

export default function Schedule() {
  return (
    <section className="relative">
      <div className="sticky -z-10 top-0 flex justify-center">
        <Image src="/hero.svg" alt="hero" width={800} height={800} />
      </div>
      <div className="text-4xl  gap-4  flex rounded-2xl z-10"></div>
    </section>
  );
}
