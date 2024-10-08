import Link from "next/link";
import Image from "next/image";
import MobileMenu from "./MobileMenu";
import NavItems from "./NavItems";
import { createClient } from "@/utils/supabase/server";
import Logout from "./Logout";
import { redirect } from "next/navigation";

export const NavBar = async () => {
  const supabase = createClient();

  // Fetch user data from the authentication table
  const { data: authData, error: authError } = await supabase.auth.getUser();
  const user = authData?.user;

  // If user is not authenticated or user.email is missing, show login and schedule ride
  if (!user || !user.email || authError) {
    return (
      <nav className="border-b flex z-40 sticky top-0  bg-white  justify-between items-center px-4 sm:px-12 py-1 shadow-md md:shadow-none">
        <Logo />
        <NavItems isLoggedIn={false} />
        <div className="hidden lg:flex items-center space-x-6">
          <LinkButton href="/schedule-ride" label="Schedule a Ride" />
          <LinkButton href="/login" label="Login" />
        </div>
        <MobileMenu isLoggedIn={false} />
      </nav>
    );
  }

  // Check user's role from metadata
  const userRole = user.user_metadata?.role;

  // If the user is not a driver, redirect them
  if (userRole == "driver") {
    redirect("/available-rides");
  }

  return (
    <nav className="border-b flex z-40 sticky top-0 bg-white justify-between items-center px-12 py-1 shadow-md md:shadow-none">
      <Logo />
      <NavItems isLoggedIn={true} />
      <div className="hidden lg:flex items-center space-x-6">
        <LinkButton href="/schedule-ride" label="Schedule Ride" />
        <Logout />
      </div>
      <MobileMenu isLoggedIn={true} />
    </nav>
  );
};

// ... rest of the code remains the same
// Reusable LinkButton Component
interface LinkButtonProps {
  href: string;
  label: string;
  primary?: boolean;
}

const LinkButton = ({ href, label, primary = false }: LinkButtonProps) => {
  return (
    <Link
      href={href}
      className={`px-5 py-2 rounded-md font-medium text-sm transition duration-300 ${
        primary
          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md hover:shadow-lg"
          : "bg-neutral-900 text-white hover:bg-neutral-800"
      }`}
    >
      {label}
    </Link>
  );
};

const Logo = () => (
  <div className="flex items-center">
    <Link href="/">
      <Image
        src="/logo-small.png"
        alt="Busy Minis Logo"
        width={60}
        height={60}
        quality={100}
        className="cursor-pointer"
      />
    </Link>
  </div>
);

export default NavBar;
