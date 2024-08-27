"use client";
import React from "react";
import { Phone, Mailbox, MapPin } from "@phosphor-icons/react";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="w-full max-w-3xl space-y-12 px-6 sm:px-8 lg:px-12">
        {/* Title Section */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-teal-800">
          Contact Us
        </h1>

        {/* Company Info & Contact Section */}
        <div className="bg-white p-8 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-teal-800">
              Busy Minis Transportation Company
            </h2>
            <p className="text-lg text-gray-600">Safe Rides, Smiling Kids</p>
            <p className="text-lg text-gray-600">
              Serving Coweta, Fayette, and Clayton counties
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-teal-800">
              Get in Touch
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-6 w-6 text-teal-700" />
                <div>
                  <p className="text-lg font-semibold text-teal-800">Call Us</p>
                  <p className="text-gray-600">Lia Gil: (000) 595-1911</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mailbox className="h-6 w-6 text-teal-700" />
                <div>
                  <p className="text-lg font-semibold text-teal-800">
                    Email Us
                  </p>
                  <p className="text-gray-600">lia@busyminis.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-6 w-6 text-teal-700" />
                <div>
                  <p className="text-lg font-semibold text-teal-800">
                    Visit Us
                  </p>
                  <p className="text-gray-600">
                    000 University Avenue, Fayetteville, GA 30214
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hours of Operation Section */}
        <div className="bg-teal-700 p-8 rounded-lg text-center text-white shadow-md">
          <h3 className="text-xl font-semibold mb-4">Hours of Operation</h3>
          <p className="text-lg">Monday - Friday: 6am - 6pm</p>
          <p className="text-lg">Weekends: Upon request</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
