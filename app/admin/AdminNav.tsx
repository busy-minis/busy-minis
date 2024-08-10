"use client";
import Link from "next/link";
import React, { useState } from "react";

const AdminNavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <nav className="bg-stone-800 p-4 lg:px-24 shadow-md">
        <div className=" flex justify-between items-center">
          <div className="text-white text-lg font-semibold">
            BusyMinis Admin
          </div>
          <div className="block lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
            >
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                {isOpen ? (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.36 6.64L12 13.01 5.64 6.64 4.22 8.05l7.78 7.78 7.78-7.78-1.41-1.41z"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4 5h16v2H4V5zm0 6h16v2H4v-2zm0 6h16v2H4v-2z"
                  />
                )}
              </svg>
            </button>
          </div>
          <div className={`lg:flex hidden w-full lg:w-auto`}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6">
              <Link
                href="/admin/driver-form"
                className="block px-4 py-2 text-white hover:bg-stone-600 rounded-lg"
              >
                Driver Form
              </Link>
              <Link
                href="/admin/drivers"
                className="block px-4 py-2 text-white hover:bg-stone-600 rounded-lg"
              >
                Drivers
              </Link>
              <Link
                href="/"
                className="block px-4 py-2 text-white hover:bg-stone-600 rounded-lg"
              >
                Sign Out
              </Link>
              <Link
                href="/"
                className="block px-4 py-2 text-white hover:bg-stone-600 rounded-lg"
              >
                Orientation
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {isOpen && (
        <section className="bg-zinc-700 lg:hidden">
          <Link
            href="/admin/drivers"
            className="block px-4 py-2 text-white hover:bg-zinc-300 hover:text-black "
          >
            Drivers
          </Link>
          <Link
            href="/admin/driver-form"
            className="block px-4 py-2 text-white hover:bg-zinc-300 hover:text-black  "
          >
            Driver Form
          </Link>
          <Link
            href="/"
            className="block px-4 py-2 text-white hover:bg-zinc-300 hover:text-black  "
          >
            Sign Out
          </Link>
        </section>
      )}
    </div>
  );
};

export default AdminNavBar;
