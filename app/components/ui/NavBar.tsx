import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import {
  Cross,
  Hamburger,
  List,
  Person,
  UserCircle,
  UserRectangle,
  X,
} from "@phosphor-icons/react";
import Image from "next/image";
import MobileMenu from "./MobileMenu";

export const NavBar = async (props: { page: string }) => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const { page } = props;

  return (
    <nav className="flex z-10 sticky top-0 bg-neutral-100 justify-between px-4 md:justify-around items-center">
      <Logo />
      <ul className="space-x-8 hidden lg:flex">
        <Link
          href="/"
          className={`${
            page === "home"
              ? "text-theme-orange font-semibold"
              : "text-gray-700"
          } m-4 group relative w-max`}
        >
          <span>Home</span>
          <span className="absolute -bottom-1 left-0 w-0 transition-all h-0.5 bg-theme-orange group-hover:w-full"></span>
        </Link>
        <Link
          href="/pricing"
          className={`${
            page === "pricing"
              ? "text-theme-orange font-semibold"
              : "text-gray-700"
          } m-4 group relative w-max`}
        >
          <span>Pricing</span>
          <span className="absolute -bottom-1 left-0 w-0 transition-all h-0.5 bg-theme-orange group-hover:w-full"></span>
        </Link>
        <Link
          href="/about"
          className={`${
            page === "about"
              ? "text-theme-orange font-semibold"
              : "text-gray-700"
          } m-4 group relative w-max`}
        >
          <span>About</span>
          <span className="absolute -bottom-1 left-0 w-0 transition-all h-0.5 bg-theme-orange group-hover:w-full"></span>
        </Link>
        <Link
          href="/services"
          className={`${
            page === "services"
              ? "text-theme-orange font-semibold"
              : "text-gray-700"
          } m-4 group relative w-max`}
        >
          <span>Services</span>
          <span className="absolute -bottom-1 left-0 w-0 transition-all h-0.5 bg-theme-orange group-hover:w-full"></span>
        </Link>
        <Link
          href="/contact"
          className={`${
            page === "contact"
              ? "text-theme-orange font-semibold"
              : "text-gray-700"
          } m-4 group relative w-max`}
        >
          <span>Contact</span>
          <span className="absolute -bottom-1 left-0 w-0 transition-all h-0.5 bg-theme-orange group-hover:w-full"></span>
        </Link>
      </ul>
      <section className="lg:flex gap-4 hidden">
        <Link
          href="/login"
          className="bg-theme-orange rounded-md text-white px-4 py-1"
        >
          Schedule a Ride
        </Link>
        <Link
          href="/login"
          className="bg-neutral-900 rounded-md text-white px-4 py-1"
        >
          Login
        </Link>
      </section>
      <MobileMenu />
    </nav>
  );
};

const Logo = () => {
  return (
    <div className="">
      <Link href={"/"}>
        <Image
          src={"/logo-small.png"}
          alt=""
          width={80}
          height={200}
          quality={100}
        />
      </Link>
    </div>
  );
};
