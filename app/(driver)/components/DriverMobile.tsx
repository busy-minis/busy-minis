"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "@/utils/supabase/logout";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu, X, Car, List, UserCircle, LogOut } from "lucide-react";

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
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="text-gray-700 dark:text-gray-300"
        onClick={() => setOpen(true)}
        aria-label="Open Menu"
      >
        <Menu className="h-6 w-6" />
      </Button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            <motion.div
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white dark:bg-gray-900 shadow-xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Menu
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  aria-label="Close Menu"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <ScrollArea className="h-[calc(100vh-5rem)] p-4">
                <nav className="space-y-2">
                  <MobileMenuItem
                    href="/available-rides"
                    label="Browse Rides"
                    icon={<Car className="h-5 w-5" />}
                    onClick={() => setOpen(false)}
                  />
                  <MobileMenuItem
                    href="/accepted-rides"
                    label="My Rides"
                    icon={<List className="h-5 w-5" />}
                    onClick={() => setOpen(false)}
                  />
                  <MobileMenuItem
                    href="/profile"
                    label="Profile"
                    icon={<UserCircle className="h-5 w-5" />}
                    onClick={() => setOpen(false)}
                  />
                </nav>
              </ScrollArea>

              <div className="absolute bottom-0 left-0 right-0 p-4 border-t dark:border-gray-800">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => {
                    setOpen(false);
                    handleSignOut();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

interface MobileMenuItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const MobileMenuItem = ({
  href,
  label,
  icon,
  onClick,
}: MobileMenuItemProps) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex items-center space-x-2 px-4 py-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
  >
    {icon}
    <span className="font-medium">{label}</span>
  </Link>
);

export default DriverMobile;
