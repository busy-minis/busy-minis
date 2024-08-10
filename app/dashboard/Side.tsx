import {
  CarProfile,
  Note,
  CalendarCheck,
  User,
  ClockCounterClockwise,
  Phone,
  SignOut,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Side() {
  return (
    <div className="flex flex-col w-64 h-screen px-5 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
      <Link href={"/"}>
        <Logo />
      </Link>
      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav className="-mx-3 space-y-6 ">
          <div className="space-y-3 ">
            <label className="px-3 text-xs text-gray-500 uppercase dark:text-gray-400">
              Rides
            </label>
            <Link
              href={"/dashboard"}
              className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
            >
              <CarProfile weight="fill" />
              <span className="mx-2 text-sm font-medium">My Rides</span>
            </Link>
            <Link
              href={"/dashboard/book"}
              className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
            >
              <CalendarCheck weight="fill" />
              <span className="mx-2 text-sm font-medium">Schedule a Ride</span>
            </Link>
          </div>
          <div className="space-y-3 ">
            <label className="px-3 text-xs text-gray-500 uppercase dark:text-gray-400">
              Account
            </label>
            <Link
              href={"/dashboard/profile"}
              className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
            >
              <User weight="fill" />
              <span className="mx-2 text-sm font-medium">Rider Profile</span>
            </Link>
            <Link
              href={"/dashboard/history"}
              className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
            >
              <ClockCounterClockwise weight="fill" />
              <span className="mx-2 text-sm font-medium">Ride History</span>
            </Link>
            <Link
              href={"/dasboard/contact"}
              className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
            >
              <Phone weight="fill" />
              <span className="mx-2 text-sm font-medium">Contact Us</span>
            </Link>
            <Link
              href={"/"}
              className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
            >
              <SignOut weight="fill" />
              <span className="mx-2 text-sm font-medium">Exit DashBoard</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}

const Logo = () => {
  return (
    <div className="">
      <Image
        src={"/logo-small.png"}
        alt=""
        width={60}
        height={100}
        quality={100}
      />
    </div>
  );
};
