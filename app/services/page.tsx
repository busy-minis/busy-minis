"use client";
import React from "react";
import { NavBar } from "../components/ui/NavBar";
import Footer from "../components/ui/Footer";
import { Star } from "@phosphor-icons/react/dist/ssr";

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
      <NavBar page="services" />
      <>
        {/* component */}
        <link
          rel="stylesheet"
          href="https://cdn.tailgrids.com/tailgrids-fallback.css"
        />
        {/* ====== Services Section Start */}
        <section className="pt-20 lg:pt-[80px] pb-12 lg:pb-[90px]">
          <div className="container">
            <div className="flex flex-wrap -mx-4">
              <div className="w-full px-4">
                <div className="text-center mx-auto mb-12 lg:mb-20 max-w-[510px]">
                  <span className="font-semibold text-lg text-theme-orange mb-2 block">
                    Our Services
                  </span>
                  <h2
                    className="
                      font-bold
                      text-3xl
                      sm:text-4xl
                      md:text-[40px]
                     
                      mb-4
                    "
                  >
                    What We Offer
                  </h2>
                  <p className="text-lg  pt-8">
                    Busy Minis Transportation was founded to address the
                    challenges faced by busy parents in balancing work schedules
                    with their childrens extracurricular activities. Our
                    services offer a solution by providing safe, reliable, and
                    convenient transportation options for children aged 7-17.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap -mx-4">
              {services.map((service, index) => (
                <div key={index} className="w-full md:w-1/2 lg:w-1/3 px-4">
                  <div
                    className="
                      p-10
                      md:px-7
                      xl:px-10
                      rounded-[20px]
                      bg-white
                      shadow-md
                      hover:shadow-lg
                      mb-8
                    "
                  >
                    <div
                      className="
                        w-[70px]
                        h-[70px]
                        flex
                        items-center
                        justify-center
                        bg-theme-orange
                        rounded-2xl
                        mb-8
                      "
                    >
                      <Star size={35} color="white" />
                    </div>
                    <h4 className="font-semibold text-xl  mb-3">{service}</h4>
                    <p className="text-body-color">
                      We enjoy working with discerning clients, people for whom
                      quality, service, integrity & aesthetics.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* ====== Services Section End */}
      </>
      <Footer />
    </div>
  );
}
