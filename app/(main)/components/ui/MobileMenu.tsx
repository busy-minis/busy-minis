"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "@/utils/supabase/logout";
import {
  Menu,
  X,
  Car,
  Clock,
  Home,
  CreditCard,
  Info,
  Mail,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MobileMenuProps {
  isLoggedIn: boolean;
  dashboardHref?: string;
}

const MobileMenu = ({ isLoggedIn, dashboardHref }: MobileMenuProps) => {
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="text-gray-700"
        onClick={() => setOpen(true)}
        aria-label="Open Menu"
      >
        <Menu className="h-6 w-6" />
      </Button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex h-16 items-center justify-between px-6">
                <span className="text-lg font-semibold">Menu</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  aria-label="Close Menu"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <ScrollArea className="h-[calc(100vh-4rem)] pb-10">
                <div className="space-y-4 py-4">
                  {[
                    { href: "/", label: "Home", icon: Home },
                    { href: "/pricing", label: "Pricing", icon: CreditCard },
                    { href: "/about", label: "About", icon: Info },
                    { href: "/contact", label: "Contact", icon: Mail },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-2 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => setOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  ))}

                  {isLoggedIn ? (
                    <>
                      <Link
                        href="/my-rides"
                        className="flex items-center space-x-2 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                        onClick={() => setOpen(false)}
                      >
                        <Car className="h-5 w-5" />
                        <span>My Rides</span>
                      </Link>
                      <Link
                        href="/ride-history"
                        className="flex items-center space-x-2 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                        onClick={() => setOpen(false)}
                      >
                        <Clock className="h-5 w-5" />
                        <span>Ride History</span>
                      </Link>
                      <button
                        onClick={() => {
                          setOpen(false);
                          handleSignOut();
                        }}
                        className="flex w-full items-center space-x-2 px-6 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className="flex items-center space-x-2 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => setOpen(false)}
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Login</span>
                    </Link>
                  )}
                </div>
              </ScrollArea>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Button
                  className="w-full bg-theme-orange text-white shadow-md hover:shadow-lg"
                  onClick={() => setOpen(false)}
                  asChild
                >
                  <Link href="/schedule-ride">Schedule a Ride</Link>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileMenu;
