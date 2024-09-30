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

  const handleSignOut = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <nav className="lg:hidden">
      <button
        className="text-gray-800 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-md"
        onClick={() => setOpen(true)}
        aria-label="Open Menu"
      >
        <List size={32} weight="bold" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black bg-opacity-70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            ></motion.div>

            <motion.div
              className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-teal-900 to-teal-800 text-white"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex justify-end p-6">
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close Menu"
                  className="text-white hover:text-teal-300 transition-colors"
                >
                  <X size={32} weight="bold" />
                </button>
              </div>

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
                <MobileMenuItem
                  href="/available-rides"
                  label="Browse Rides"
                  onClick={() => setOpen(false)}
                />
                <MobileMenuItem
                  href="/accepted-rides"
                  label="My Rides"
                  onClick={() => setOpen(false)}
                />
                <MobileMenuItem
                  href="/profile"
                  label="Profile"
                  onClick={() => setOpen(false)}
                />
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
                    className="text-2xl text-red-400 hover:text-red-300 transition-colors"
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

interface MobileMenuItemProps {
  href: string;
  label: string;
  onClick: () => void;
}

const MobileMenuItem = ({ href, label, onClick }: MobileMenuItemProps) => (
  <motion.li
    variants={{
      visible: { opacity: 1, y: 0 },
      hidden: { opacity: 0, y: 20 },
    }}
  >
    <Link
      href={href}
      onClick={onClick}
      className="text-2xl transition-colors hover:text-teal-300"
    >
      {label}
    </Link>
  </motion.li>
);

export default DriverMobile;
