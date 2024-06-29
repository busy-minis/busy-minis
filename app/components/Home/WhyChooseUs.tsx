import React from "react";
import { Shield } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
export default function WhyChooseUs() {
  return (
    <div className="max-w-7xl mx-auto mt-48 relative ">
      <div className="flex justify-center py-8 pb-24 stick top-36 -z-10">
        <h2 className="text-right bg-neutral-900 text-neutral-100 px-4 py-2 text-3xl w-fit">
          Why Choose Us?
        </h2>
      </div>

      <div className="flex gap-8">
        <section className="text-center w-full border-2 border-neutral-800  shadow-[10px_10px_0px_0px_#262626]  relative rounded-3xl pt-24 pb-24 bg-orange-200 max-w-md px-8">
          <div className=" w-full left-0 grid place-content-center">
            <Image
              src={"/assets/face.png"}
              alt=" s"
              width={200}
              height={200}
              className=" "
            />
          </div>

          <h2 className="text-3xl font-semibold mt-14 ">Safety First</h2>
          <p className="mt-8">
            Our drivers are certified, trained, and equipped with CPR and First
            Aid certification. Each ride is accompanied by a trained Shuttle Aid
            for additional support.
          </p>
        </section>
        <section className="text-center border-2 border-neutral-800  w-full shadow-[10px_10px_0px_0px_#262626] relative rounded-3xl pt-24 pb-24 bg-indigo-50 max-w-md px-8">
          <div className=" w-full left-0 grid place-content-center">
            <Image
              src={"/assets/fam.png"}
              alt=" s"
              width={400}
              height={400}
              className=" "
            />
          </div>

          <h2 className="text-3xl font-semibold  ">Reliable Service</h2>
          <p className="mt-8">
            Reliable Service: We prioritize punctuality and reliability,
            ensuring your children get to their destinations on time, every
            time.
          </p>
        </section>
        <section className="text-center rounded-3xl w-full border-2 border-neutral-800   shadow-[10px_10px_0px_0px_#262626] relative  pt-24 pb-24 bg-white max-w-md px-8">
          <div className=" w-full left-0 grid place-content-center">
            <Image
              src={"/assets/boat.png"}
              alt=" s"
              width={285}
              height={2850}
              className=" "
            />
          </div>

          <h2 className="text-3xl font-semibold  ">Convenient Options</h2>
          <p className="mt-8">
            With services tailored to your family&apos;s needs, we provide a
            hassle-free transportation solution.
          </p>
        </section>
      </div>
    </div>
  );
}
