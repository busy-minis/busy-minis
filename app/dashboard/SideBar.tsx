"use client";
import { CarProfile, HouseLine, Note } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function SideBar() {
  return (
    <div className="flex flex-col px-4  h-full  w-[15%] bg-white   space-y-4  border-b-2 ">
      <Logo />
      <Link
        href={"/dashboard"}
        className="flex rounded-lg gap-4 px-8 py-4 bg-theme-orange/10 text-theme-orange items-center"
      >
        <HouseLine size={25} weight="fill" />
        <p className="">My Trips</p>
      </Link>
      <Link
        href={"/dashboard/book"}
        className="flex gap-4 px-8 py-4 bg-theme-orange/10 text-theme-orange items-center  rounded-lg "
      >
        <CarProfile weight="fill" size={25} />
        <p className="">Schedue A Ride</p>
      </Link>
      <Link
        href={"/dashboard/history"}
        className="flex gap-4 px-8 py-4 bg-theme-orange/10 text-theme-orange items-center  rounded-lg "
      >
        <Note size={25} weight="fill" />
        <p className="">Ride History</p>
      </Link>
    </div>
  );
}

const Logo = () => {
  return (
    <div className="flex justify-center">
      <Image
        src={"/logo-small.png"}
        alt=""
        width={80}
        height={200}
        quality={100}
      />
    </div>
  );
};
