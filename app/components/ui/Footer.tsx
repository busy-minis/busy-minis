"use client";
import Image from "next/image";
import {
  FacebookLogo,
  TwitterLogo,
  InstagramLogo,
} from "@phosphor-icons/react";

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-gray-200 py-12">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
          {/* Logo and Social Links */}
          <div className="flex flex-col items-center lg:items-start">
            <Image
              src="/logo.png"
              alt="Busy Minis Logo"
              width={120}
              height={120}
              className="mb-6"
            />
            <div className="flex space-x-6">
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <FacebookLogo size={28} weight="fill" />
              </a>
              <a
                href="https://twitter.com"
                aria-label="Twitter"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <TwitterLogo size={28} weight="fill" />
              </a>
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <InstagramLogo size={28} weight="fill" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex justify-center lg:justify-start">
            <ul className="space-y-4 text-center lg:text-left">
              {["Home", "Pricing", "About", "Services", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center lg:text-right">
            <p className="text-sm text-gray-400">
              Have questions? Reach us at:
            </p>
            <p className="text-lg font-semibold text-white mt-2">
              contact@busminis.com
            </p>
            <p className="text-sm text-gray-400 mt-1">+1 (555) 123-4567</p>
          </div>
        </div>

        <hr className="my-10 border-gray-700" />

        {/* Bottom Text */}
        <div className="flex flex-col lg:flex-row justify-between items-center text-center text-xs text-gray-400">
          <span>
            &copy; 2024 Busy Minis Transportation Company. All rights reserved.
          </span>
          <div className="space-x-4 mt-4 lg:mt-0">
            <a
              href="#"
              className="hover:text-white transition-colors duration-300"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors duration-300"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
