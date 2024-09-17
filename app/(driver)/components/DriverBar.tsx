// app/components/DriverBarClient.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // Client-side hook for active state
import {
  Car,
  List,
  UserCircle,
  UserGear,
  SignOut,
} from "@phosphor-icons/react/dist/ssr"; // Phosphor icons for nav items

import Logout from "./Logout";
import DriverMobile from "./DriverMobile";

const DriverBarClient = () => {
  const pathname = usePathname(); // Detect the current path

  // Helper function to check if a link is active
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="flex z-40 sticky top-0 bg-white/90 backdrop-blur-lg justify-between items-center px-6 py-4 shadow-md">
      <div className="flex items-center space-x-4">
        <Logo />
        <span className="text-xl font-semibold text-gray-800 hidden md:inline">
          Driver Portal
        </span>
      </div>
      <div className="hidden lg:flex items-center space-x-6">
        <NavItem
          href="/available-rides"
          label="Browse Rides"
          icon={<Car size={20} />}
          isActive={isActive("/available-rides")}
        />
        <NavItem
          href="/accepted-rides"
          label="My Rides"
          icon={<List size={20} />}
          isActive={isActive("/accepted-rides")}
        />
        <NavItem
          href="/profile"
          label="My Profile"
          icon={<UserGear size={20} />}
          isActive={isActive("/profile")}
        />
        <Logout />
      </div>
      <DriverMobile isLoggedIn={true} dashboardHref="Dashboard" />
    </nav>
  );
};

// Reusable NavItem Component with active state
interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}

const NavItem = ({ href, label, icon, isActive }: NavItemProps) => {
  return (
    <Link href={href}>
      <div
        className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-300 ${
          isActive
            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        aria-current={isActive ? "page" : undefined}
      >
        {icon}
        <span className="font-medium">{label}</span>
      </div>
    </Link>
  );
};

// Logo component for navigation bar
const Logo = () => (
  <div className="flex items-center">
    <Link href="/">
      <Image
        src="/logo-small.png"
        alt="Busy Minis Logo"
        width={40}
        height={40}
        quality={100}
        className="cursor-pointer"
      />
    </Link>
  </div>
);

export default DriverBarClient;
