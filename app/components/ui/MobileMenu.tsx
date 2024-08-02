"use client";
import { List, X } from "@phosphor-icons/react";
import React, { useRef, useState } from "react";
import Link from "next/link";

const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  return (
    <nav className="lg:hidden">
      <List size={40} onClick={() => setOpen(true)} />
      {open && (
        <div className="h-screen fixed top-0 left-0 w-screen bg-white">
          <div
            onClick={() => setOpen(false)}
            className="flex  justify-end mt-4 pr-8"
          >
            <X size={25} weight="bold" className="hover:cursor-pointer" />
          </div>
          <ul
            className="flex flex-col text-3xl items-center gap-4  mt-8
      "
          >
            <Link href={"/"}>Home</Link>
            <Link className="hover:bg-theme-orange px-2 py-1 " href={"/"}>
              Pricing
            </Link>
            <Link href={"/about"}>About</Link>
            <Link href={"/services"}>Services</Link>
            <Link href={"/contact"}>Contact</Link>
          </ul>
        </div>
      )}
    </nav>
  );
};
export default MobileMenu;
