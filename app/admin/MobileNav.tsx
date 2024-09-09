"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle Menu Open/Close
  const toggleMenu = () => setIsOpen(!isOpen);

  // Close the menu if clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    const nav = document.getElementById("mobile-nav");
    if (nav && !nav.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <nav className="lg:hidden">
      {/* Toggle Button */}
      <button
        onClick={toggleMenu}
        className="text-white focus:outline-none"
        aria-expanded={isOpen}
        aria-label="Toggle mobile menu"
      >
        {isOpen ? (
          <X size={32} weight="bold" />
        ) : (
          <List size={32} weight="bold" />
        )}
      </button>

      {/* Mobile Sliding Drawer */}
      <div
        id="mobile-nav"
        className={`fixed top-0 left-0 w-64 h-full bg-gray-900 text-white transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } z-50 shadow-lg`}
        role="menu"
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-8">BusyMinis Admin</h2>
          <ul className="space-y-6">
            <li>
              <Link
                href="/admin/driver-form"
                className="block hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Driver Form
              </Link>
            </li>
            <li>
              <Link
                href="/admin/drivers"
                className="block hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Drivers
              </Link>
            </li>
            <li>
              <Link
                href="/admin/verify-users"
                className="block hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Verify Users
              </Link>
            </li>
            <li>
              <Link
                href="/admin/schedule"
                className="block hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Schedule
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="block hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Sign Out
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Backdrop when menu is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMenu}
        />
      )}
    </nav>
  );
};

export default MobileNav;
