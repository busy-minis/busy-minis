"use client";
import {
  CarProfile,
  CalendarCheck,
  User,
  ClockCounterClockwise,
  Phone,
  SignOut,
  Door,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { X } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";

export default function Side() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sticky top-0 z-40 bg-gray-700">
      {/* Mobile Menu Button */}
      <div className="lg:hidden flex sticky top-0   justify-between items-center p-4 bg-white dark:bg-gray-900 border-b dark:border-gray-700 shadow-md">
        <button
          className="text-gray-600 h-screen   dark:text-gray-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          <MenuIcon />
        </button>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 px-4 transition-transform bg-gradient-to-tl from-teal-700 via-teal-900 to-teal-800 dark:bg-gray-900 shadow-lg lg:relative lg:translate-x-0 lg:flex lg:flex-col min-h-screen ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-5">
          <Logo />
          <button
            className="lg:hidden text-gray-200"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col justify-between flex-1 mt-6 space-y-8">
          <nav className="space-y-2">
            <label className="px-3 text-xs font-semibold text-gray-300 uppercase">
              Rides
            </label>
            <NavLink href="/dashboard" icon={User} label="Rider Profile" />
            <NavLink
              href="/dashboard/ride"
              icon={CarProfile}
              label="My Rides"
            />
            <NavLink
              href="/dashboard/book"
              icon={CalendarCheck}
              label="Schedule a Ride"
            />
          </nav>
          <nav className="space-y-2">
            <label className="px-3 text-xs font-semibold text-gray-300 uppercase">
              Account
            </label>
            <NavLink
              href="/dashboard/history"
              icon={ClockCounterClockwise}
              label="Ride History"
            />
            <NavLink
              href="/dashboard/contact"
              icon={Phone}
              label="Contact Us"
            />
            <NavLink href="/" icon={SignOut} label="Exit Dashboard" />
            <NavLink href="/" icon={Door} label="Sign Out" />
          </nav>
        </div>
      </div>
    </div>
  );
}

const Logo = () => (
  <div>
    <Image
      src="/logo-small.png"
      alt="Logo"
      width={60}
      height={100}
      quality={100}
    />
  </div>
);

const MenuIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16m-7 6h7"
    />
  </svg>
);

const NavLink = ({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-3 text-gray-300 font-medium rounded-lg transition-colors duration-300 transform ${
        isActive
          ? "bg-teal-600 shadow-md text-white"
          : "hover:bg-teal-700 hover:text-white"
      }`}
    >
      <Icon
        className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400"}`}
      />
      <span className="ml-4">{label}</span>
    </Link>
  );
};
