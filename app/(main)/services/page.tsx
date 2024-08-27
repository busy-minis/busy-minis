"use client";
import React from "react";
import Footer from "@/app/components/ui/Footer";
import {
  Star,
  Book,
  Sun,
  PhoneOutgoing,
  Wheelchair,
  SoccerBall,
  Church,
  Ticket,
  Gift,
  MapPinLine,
} from "@phosphor-icons/react";

export default function Page() {
  const services = [
    {
      name: "Tutoring/After School Transport",
      description:
        "Ensuring your child's academic success with safe, reliable rides to and from tutoring sessions and after-school activities.",
      icon: <Book size={24} className="text-white" />,
    },
    {
      name: "Summer Camp Transport",
      description:
        "Making summer camp memories hassle-free with secure and dependable transportation tailored to your schedule.",
      icon: <Sun size={24} className="text-white" />,
    },
    {
      name: "Last-Minute or Sick Child Pick-Up",
      description:
        "Providing peace of mind with prompt and safe pick-up services for last-minute or sick child situations.",
      icon: <PhoneOutgoing size={24} className="text-white" />,
    },
    {
      name: "Special Needs Transport",
      description:
        "Dedicated to serving children with special needs with tailored, compassionate, and secure transportation solutions.",
      icon: <Wheelchair size={24} className="text-white" />,
    },
    {
      name: "Sports/Extracurricular Transport",
      description:
        "Supporting your child's passions with reliable transportation to sports practices and extracurricular activities.",
      icon: <SoccerBall size={24} className="text-white" />,
    },
    {
      name: "Religious Activity Transport",
      description:
        "Facilitating your family's faith journey with dependable transportation to and from religious events.",
      icon: <Church size={24} className="text-white" />,
    },
    {
      name: "Six Flags Season Pass Transport",
      description:
        "Enhancing fun and convenience with secure transportation to and from Six Flags for season pass holders.",
      icon: <Ticket size={24} className="text-white" />,
    },
    {
      name: "Birthday Party Transport",
      description:
        "Making birthdays even more special with safe and reliable transportation to and from party venues.",
      icon: <Gift size={24} className="text-white" />,
    },
    {
      name: "Customized Routes",
      description:
        "Meeting your unique family needs with personalized and flexible transportation routes designed just for you.",
      icon: <MapPinLine size={24} className="text-white" />,
    },
  ];

  return (
    <div className="relative">
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-teal-200 to-white opacity-80"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-orange-100 to-white opacity-80"></div>
      </div>

      <section className="relative pt-16 sm:pt-24 pb-12 sm:pb-16 lg:pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="font-semibold text-lg sm:text-xl text-teal-600 mb-2 block">
              Our Services
            </span>
            <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-4 sm:mb-6">
              What We Offer
            </h2>
            <p className="text-base sm:text-lg max-w-xl mx-auto text-gray-600">
              Busy Minis offers safe, reliable, and convenient transportation
              services to help busy parents balance work and life. Our services
              are tailored to meet the needs of families and children, ensuring
              safety and satisfaction every ride.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 text-center">
            {services.map((service, index) => (
              <div
                key={index}
                className="group p-6 sm:p-8 rounded-lg bg-white shadow-lg hover:shadow-2xl hover:bg-teal-50 transform transition-all duration-300 ease-in-out"
              >
                <div className="w-12 sm:w-16 h-12 sm:h-16   mx-auto bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center mb-4 sm:mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h4 className="font-semibold text-lg sm:text-xl text-gray-900 mb-2 sm:mb-3">
                  {service.name}
                </h4>
                <p className="text-sm sm:text-base text-gray-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-teal-100 py-12 sm:py-16">
        <div className="container mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-teal-700 mb-4">
            Why Choose Busy Minis?
          </h2>
          <p className="text-base sm:text-lg max-w-xl mx-auto text-teal-600 mb-6 sm:mb-8">
            We prioritize the safety, reliability, and comfort of your children.
            With a dedicated team of trained drivers and a fleet of safe,
            reliable vehicles, you can trust Busy Minis to get your children
            where they need to be, on time, every time.
          </p>
          <button className="bg-teal-600 text-white font-semibold px-6 sm:px-8 py-3 rounded-full shadow-lg hover:bg-teal-700 transition duration-300">
            Get a Quote Today
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
