"use client";
import React from "react";
import { NavBar } from "../components/ui/NavBar";
import Footer from "../components/ui/Footer";
import { Star } from "@phosphor-icons/react/dist/ssr";

export default function page() {
  const services = [
    {
      name: "Tutoring/After School Transport",
      description:
        "Ensuring your child's academic success with safe, reliable rides to and from tutoring sessions and after-school activities.",
    },
    {
      name: "Summer Camp Transport",
      description:
        "Making summer camp memories hassle-free with secure and dependable transportation tailored to your schedule.",
    },
    {
      name: "Last-Minute or Sick Child Pick-Up",
      description:
        "Providing peace of mind with prompt and safe pick-up services for last-minute or sick child situations.",
    },
    {
      name: "Special Needs Transport",
      description:
        "Dedicated to serving children with special needs with tailored, compassionate, and secure transportation solutions.",
    },
    {
      name: "Sports/Extracurricular Transport",
      description:
        "Supporting your child's passions with reliable transportation to sports practices and extracurricular activities.",
    },
    {
      name: "Religious Activity Transport",
      description:
        "Facilitating your family's faith journey with dependable transportation to and from religious events.",
    },
    {
      name: "Job Interview Transport",
      description:
        "Empowering young job seekers with punctual and safe transportation to important job interviews.",
    },
    {
      name: "Six Flags Season Pass Transport",
      description:
        "Enhancing fun and convenience with secure transportation to and from Six Flags for season pass holders.",
    },
    {
      name: "Birthday Party Transport",
      description:
        "Making birthdays even more special with safe and reliable transportation to and from party venues.",
    },
    {
      name: "Customized Routes",
      description:
        "Meeting your unique family needs with personalized and flexible transportation routes designed just for you.",
    },
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
          <div className="container mx-auto px-4">
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
                  <p className="text-lg pt-8">
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
                <div key={index} className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
                  <div
                    className="
                      p-6
                      md:p-10
                      xl:p-10
                      rounded-[20px]
                      bg-white
                      shadow-md
                      hover:shadow-lg
                    "
                  >
                    <div
                      className="
                        w-[50px]
                        h-[50px]
                        md:w-[70px]
                        md:h-[70px]
                        flex
                        items-center
                        justify-center
                        bg-theme-orange
                        rounded-2xl
                        mb-6
                        md:mb-8
                      "
                    >
                      <Star size={35} color="white" />
                    </div>
                    <h4 className="font-semibold text-lg md:text-xl mb-3">
                      {service.name}
                    </h4>
                    <p className="text-body-color">{service.description}</p>
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
