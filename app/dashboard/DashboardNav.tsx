"use client";

import { UserCircle } from "@phosphor-icons/react/dist/ssr";

import Link from "next/link";
import { Bell } from "@phosphor-icons/react";

export default function DashboardNav() {
  return (
    <nav className="flex border-b items-center justify-between py-4 pr-24 pl-8 bg-white">
      {/* <Link
        href={"/"}
        className="bg-neutral-900 text-sm px-4 h-fit py-1 rounded-md text-neutral-200"
      >
        Exit Dashboard
      </Link> */}

      {/* <section className=" flex gap-4">
        <Bell size={30} weight="fill" />
        <UserCircle size={30} weight="fill" />
      </section> */}
    </nav>
  );
}
