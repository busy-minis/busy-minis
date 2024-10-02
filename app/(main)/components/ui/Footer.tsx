"use client";

import Image from "next/image";
import Link from "next/link";
import { FacebookLogo } from "@phosphor-icons/react";

const Footer = () => {
  const navigationLinks = [
    { name: "Home", href: "/" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },

    { name: "Contact", href: "/contact" },
  ];

  return (
    <footer className="bg-zinc-900 text-gray-200">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Logo and Social Links */}
          <div className="flex flex-col items-center md:items-start">
            <Image
              src="/logo.png"
              alt="Busy Minis Logo"
              width={120}
              height={120}
              className="mb-6"
            />
            <a
              href="https://www.facebook.com/BusyMinis"
              aria-label="Follow us on Facebook"
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              <FacebookLogo className="h-6 w-6" />
            </a>
          </div>

          {/* Navigation Links */}
          <nav className="flex justify-center md:justify-start">
            <ul className="space-y-4 text-center md:text-left">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Info */}
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-400">
              Have questions? Reach us at:
            </p>
            <a
              href="mailto:lia@busyminis.com"
              className="text-lg font-semibold text-white mt-2 hover:underline"
            >
              lia@busyminis.com
            </a>
            <a
              href="tel:+14049818020"
              className="block text-sm text-gray-400 mt-1 hover:underline"
            >
              +1 404-981-8020
            </a>
          </div>
        </div>

        <hr className="my-8 border-gray-700" />

        {/* Copyright */}
        <div className="text-center text-xs text-gray-400">
          <span>
            &copy; {new Date().getFullYear()} Busy Minis Transportation Company.
            All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
