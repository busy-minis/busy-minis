"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavItems(props: { isLoggedIn: boolean }) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <ul className="space-x-8 hidden lg:flex">
      <NavItem href="/" label="Home" active={isActive("/")} />
      <NavItem href="/pricing" label="Pricing" active={isActive("/pricing")} />
      <NavItem href="/about" label="About" active={isActive("/about")} />

      <NavItem
        href="/services"
        label="Services"
        active={isActive("/services")}
      />
      <NavItem href="/contact" label="Contact" active={isActive("/contact")} />
      {props.isLoggedIn && (
        <>
          <NavItem
            href="/my-rides"
            label="My Rides"
            active={isActive("/my-rides")}
          />
          <NavItem
            href="/ride-history"
            label="Ride Histoy"
            active={isActive("/ride-history")}
          />
        </>
      )}
    </ul>
  );
}

const NavItem = ({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) => {
  return (
    <Link
      href={href}
      className={`${
        active ? "text-theme-orange font-semibold" : "text-gray-700"
      } m-4 group relative w-max`}
    >
      <span>{label}</span>
      <span
        className={`absolute -bottom-1 left-0 w-0 transition-all h-0.5 bg-theme-orange ${
          active ? "w-full" : "group-hover:w-full"
        }`}
      ></span>
    </Link>
  );
};
