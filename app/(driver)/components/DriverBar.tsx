"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Car, List, UserCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/utils/supabase/logout";
import DriverMobile from "./DriverMobile";

const DriverBarClient = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const handleSignOut = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950/75">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Logo />
            <span className="text-xl tracking-tighter text-gray-900 dark:text-gray-100 hidden md:inline">
              Driver Portal
            </span>
          </div>
          <div className="hidden lg:flex items-center space-x-1">
            <NavItem
              href="/available-rides"
              label="Browse Rides"
              icon={<Car className="h-4 w-4" />}
              isActive={isActive("/available-rides")}
            />
            <NavItem
              href="/accepted-rides"
              label="My Rides"
              icon={<List className="h-4 w-4" />}
              isActive={isActive("/accepted-rides")}
            />
            <NavItem
              href="/profile"
              label="My Profile"
              icon={<UserCircle className="h-4 w-4" />}
              isActive={isActive("/profile")}
            />
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </Button>
          </div>
          <DriverMobile isLoggedIn={true} dashboardHref="/dashboard" />
        </div>
      </div>
    </nav>
  );
};

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}

const NavItem = ({ href, label, icon, isActive }: NavItemProps) => {
  return (
    <Link href={href}>
      <Button
        variant={isActive ? "default" : "ghost"}
        className="h-9"
        aria-current={isActive ? "page" : undefined}
      >
        {icon}
        <span className="ml-2">{label}</span>
      </Button>
    </Link>
  );
};

const Logo = () => (
  <Link href="/" className="flex items-center space-x-2">
    <Image
      src="/logo-small.png"
      alt="Busy Minis Logo"
      width={32}
      height={32}
      className="rounded-sm"
    />
  </Link>
);

export default DriverBarClient;
