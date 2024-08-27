"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Function to check if the link is active
  const isActive = (pathnameToCheck: string) => pathname === pathnameToCheck;

  return (
    <nav className="flex bg-gray-800 shadow-lg">
      <NavItem
        href="/driverdashboard/available-rides"
        active={isActive("/driverdashboard/available-rides")}
      >
        Available Rides
      </NavItem>
      <NavItem
        href="/driverdashboard/my-rides"
        active={isActive("/driverdashboard/my-rides")}
      >
        My Rides
      </NavItem>
    </nav>
  );
}

// Create a reusable NavItem component for each link in the navbar
function NavItem({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`py-4 px-6 text-lg font-bold w-full text-center transition-colors duration-200 ease-in-out ${
        active
          ? "bg-teal-600 text-white"
          : "bg-gray-800 text-gray-300 hover:bg-teal-500 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}
