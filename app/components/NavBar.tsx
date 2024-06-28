"use client";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { motion } from "framer-motion";
import Toggle from "./ui/Toggle";
import Link from "next/link";
export const NavBar = () => {
  return (
    <nav className="flex z-10 sticky top-0 backdrop-blur-2xl bg-neutral-100/50 border-neutral-600  justify-between items-center py-4 px-24  border-b-2">
      <Logo />
      <ul className="space-x-8">
        <Link href={"/"}>Home</Link>
        <Link className="line-through" href={"/"}>
          Pricing
        </Link>
        <Link href={"/about"}>About</Link>
        <Link className="line-through" href={"/"}>
          Services
        </Link>
        <Link href={"/contact"}>Contact</Link>
      </ul>
      <section className="flex gap-4">
        <button className="bg-neutral-900 text-white uppercase font-semibold px-4 py-1 ">
          Book a Ride
        </button>
        <button className="bg-neutral-900 text-white  uppercase font-semibold    px-4 py-1 ">
          Login
        </button>
      </section>
    </nav>
  );
};

const Logo = () => {
  return (
    <h3 className="uppercase tracking-tighter font-bold text-4xl ">
      Busy Minis
    </h3>
  );
};

const SlideTabs = () => {
  const [position, setPosition] = useState<Position>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <ul
      onMouseLeave={() => {
        setPosition((pv) => ({
          ...pv,
          opacity: 0,
        }));
      }}
      className="relative mx-auto flex w-fit rounded-full border-2 border-neutral-800  p-1"
    >
      <Tab setPosition={setPosition}>Home</Tab>
      <Tab setPosition={setPosition}>Pricing</Tab>
      <Tab setPosition={setPosition}>About</Tab>
      <Tab setPosition={setPosition}>Services</Tab>

      <Tab setPosition={setPosition}>Contact</Tab>

      <Cursor position={position} />
    </ul>
  );
};

const Tab = ({
  children,
  setPosition,
}: {
  children: string;
  setPosition: Dispatch<SetStateAction<Position>>;
}) => {
  const ref = useRef<null | HTMLLIElement>(null);

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref?.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      className="relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase text-white mix-blend-difference md:px-5 md:py-3 md:text-base"
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }: { position: Position }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      className="absolute z-0 h-7 rounded-full bg-neutral-800 md:h-12"
    />
  );
};

type Position = {
  left: number;
  width: number;
  opacity: number;
};
