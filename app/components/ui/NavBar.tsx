"use client";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Cross, Hamburger, UserCircle, X } from "@phosphor-icons/react";
import Image from "next/image";
export const NavBar = () => {
  return (
    <nav className="flex z-10 sticky top-0 bg-neutral-100  justify-between items-center px-4  lg:px-24  ">
      <Logo />
      <ul
        className="space-x-8 hidden lg:block 
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
      <section className="lg:flex gap-4 hidden">
        <Link
          href={"/login"}
          className="bg-theme-orange rounded-md  text-white  px-4 py-1 "
        >
          Schedule a Ride
        </Link>
        <Link
          href={"/login"}
          className="bg-neutral-900 rounded-md text-white    px-4 py-1 "
        >
          Login
        </Link>
        {/* <Link href={"/dashboard"}>
          <UserCircle size={40} />
        </Link> */}
      </section>
      <MobileMenu />
    </nav>
  );
};

const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  return (
    <nav className="lg:hidden">
      <Hamburger size={40} onClick={() => setOpen(true)} />
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

const Logo = () => {
  return (
    <div className="">
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

// const SlideTabs = () => {
//   const [position, setPosition] = useState<Position>({
//     left: 0,
//     width: 0,
//     opacity: 0,
//   });

//   return (
//     <ul
//       onMouseLeave={() => {
//         setPosition((pv) => ({
//           ...pv,
//           opacity: 0,
//         }));
//       }}
//       className="relative mx-auto flex w-fit rounded-full border-2 border-neutral-800  p-1"
//     >
//       <Tab setPosition={setPosition}>Home</Tab>
//       <Tab setPosition={setPosition}>Pricing</Tab>
//       <Tab setPosition={setPosition}>About</Tab>
//       <Tab setPosition={setPosition}>Services</Tab>

//       <Tab setPosition={setPosition}>Contact</Tab>

//       <Cursor position={position} />
//     </ul>
//   );
// };

// const Tab = ({
//   children,
//   setPosition,
// }: {
//   children: string;
//   setPosition: Dispatch<SetStateAction<Position>>;
// }) => {
//   const ref = useRef<null | HTMLLIElement>(null);

//   return (
//     <li
//       ref={ref}
//       onMouseEnter={() => {
//         if (!ref?.current) return;
//         const { width } = ref.current.getBoundingClientRect();
//         setPosition({
//           left: ref.current.offsetLeft,
//           width,
//           opacity: 1,
//         });
//       }}
//       className="relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase text-white mix-blend-difference md:px-5 md:py-3 md:text-base"
//     >
//       {children}
//     </li>
//   );
// };

// const Cursor = ({ position }: { position: Position }) => {
//   return (
//     <motion.li
//       animate={{
//         ...position,
//       }}
//       className="absolute z-0 h-7 rounded-full bg-neutral-800 md:h-12"
//     />
//   );
// };

// type Position = {
//   left: number;
//   width: number;
//   opacity: number;
// };
