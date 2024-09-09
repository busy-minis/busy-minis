"use client";

import { List, X } from "@phosphor-icons/react";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "@/utils/supabase/logout";

interface MobileMenuProps {
  isLoggedIn: boolean;
  dashboardHref?: string;
}

const DriverMobile = ({ isLoggedIn, dashboardHref }: MobileMenuProps) => {
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
                {/* Browse Rides */}
                <motion.li
                  variants={{
                    visible: { opacity: 1, y: 0 },
                    hidden: { opacity: 0, y: 20 },
                  }}
                >
                  <Link
                    href="/available-rides"
                    onClick={() => setOpen(false)}
                    className="text-2xl transition-colors hover:text-orange-500"
                  >
                    Browse Rides
                  </Link>
                </motion.li>

                {/* My Rides */}
                <motion.li
                  variants={{
                    visible: { opacity: 1, y: 0 },
                    hidden: { opacity: 0, y: 20 },
                  }}
                >
                  <Link
                    href="/accepted-rides"
                    onClick={() => setOpen(false)}
                    className="text-2xl transition-colors hover:text-orange-500"
                  >
                    My Rides
                  </Link>
                </motion.li>

                {/* Profile */}
                <motion.li
                  variants={{
                    visible: { opacity: 1, y: 0 },
                    hidden: { opacity: 0, y: 20 },
                  }}
                >
                  {/* <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="text-2xl transition-colors hover:text-orange-500"
                  >
                    Profile
                  </Link> */}
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
              </motion.ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default DriverMobile;
