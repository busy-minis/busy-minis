"use client";

import { List, X, Car, ClockCounterClockwise } from "@phosphor-icons/react"; // Add appropriate icons
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "@/utils/supabase/logout";

interface MobileMenuProps {
  isLoggedIn: boolean;
  dashboardHref?: string;
}

const MobileMenu = ({ isLoggedIn, dashboardHref }: MobileMenuProps) => {
  const [open, setOpen] = useState(false);

  // Sign-out function for mobile
  const handleSignOut = async () => {
    await logout();
    window.location.href = "/login"; // Redirect after sign-out
  };

  return (
    <nav className="lg:hidden">
      {/* Open Menu Button */}
      <button
        className="text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-md"
        onClick={() => setOpen(true)}
        aria-label="Open Menu"
      >
        <List size={32} weight="bold" />
      </button>

      <AnimatePresence>
        {/* Fullscreen Sliding Menu */}
        {open && (
          <>
            {/* Background Overlay */}
            <motion.div
              className="fixed inset-0 z-40 bg-black bg-opacity-70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            ></motion.div>

            {/* Fullscreen Menu */}
            <motion.div
              className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Close Button */}
              <div className="flex justify-end p-6">
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close Menu"
                  className="text-white hover:text-orange-500 transition-colors"
                >
                  <X size={32} weight="bold" />
                </button>
              </div>

              {/* Menu Items */}
              <motion.ul
                className="flex flex-col items-center justify-center space-y-8 text-lg font-semibold flex-grow"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                  hidden: {
                    opacity: 0,
                  },
                }}
              >
                {[
                  { href: "/", label: "Home" },
                  { href: "/pricing", label: "Pricing" },
                  { href: "/about", label: "About" },

                  { href: "/contact", label: "Contact" },
                ].map((item) => (
                  <motion.li
                    key={item.href}
                    variants={{
                      visible: { opacity: 1, y: 0 },
                      hidden: { opacity: 0, y: 20 },
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="text-2xl transition-colors hover:text-orange-500"
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}

                {/* Conditionally Rendered Dashboard/Sign Out */}
                {isLoggedIn ? (
                  <>
                    <motion.li
                      variants={{
                        visible: { opacity: 1, y: 0 },
                        hidden: { opacity: 0, y: 20 },
                      }}
                    >
                      <Link
                        href={"/my-rides"}
                        onClick={() => setOpen(false)}
                        className="text-2xl text-white hover:text-orange-400 flex items-center transition-colors"
                      >
                        <Car size={28} className="mr-2 text-orange-500" />
                        My Rides
                      </Link>
                    </motion.li>

                    <motion.li
                      variants={{
                        visible: { opacity: 1, y: 0 },
                        hidden: { opacity: 0, y: 20 },
                      }}
                    >
                      <Link
                        href="/ride-history"
                        onClick={() => setOpen(false)}
                        className="text-2xl text-white hover:text-orange-400 flex items-center transition-colors"
                      >
                        <ClockCounterClockwise
                          size={28}
                          className="mr-2 text-orange-500"
                        />
                        Ride History
                      </Link>
                    </motion.li>

                    <motion.li
                      variants={{
                        visible: { opacity: 1, y: 0 },
                        hidden: { opacity: 0, y: 20 },
                      }}
                    >
                      <button
                        onClick={() => {
                          setOpen(false);
                          handleSignOut();
                        }}
                        className="text-2xl text-red-500 hover:text-red-600"
                      >
                        Sign Out
                      </button>
                    </motion.li>
                  </>
                ) : (
                  <motion.li
                    variants={{
                      visible: { opacity: 1, y: 0 },
                      hidden: { opacity: 0, y: 20 },
                    }}
                  >
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="text-2xl transition-colors hover:text-orange-500"
                    >
                      Login
                    </Link>
                  </motion.li>
                )}
              </motion.ul>

              {/* Bottom CTA */}
              <motion.div
                className="p-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  href="/schedule-ride"
                  onClick={() => setOpen(false)}
                  className="inline-block px-6 py-3 text-lg font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Schedule a Ride
                </Link>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default MobileMenu;
