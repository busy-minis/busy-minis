import Link from "next/link";
import Image from "next/image";
import MobileMenu from "./MobileMenu";
import NavItems from "./NavItems";
import { createClient } from "@/utils/supabase/server";
import Logout from "./Logout";

export const NavBar = async () => {
  const supabase = createClient();

  // Fetch user data from the authentication table
  const { data: authData, error: authError } = await supabase.auth.getUser();
  const user = authData?.user;

  // If user is not authenticated or user.email is missing, show login and schedule ride
  if (!user || !user.email || authError) {
    return (
      <nav className="flex z-40 sticky top-0 lg:bg-white/50 bg-white/90 lg:backdrop-blur-lg justify-between items-center px-12 py-3 shadow-md md:shadow-none">
        <Logo />
        <NavItems />
        <div className="hidden lg:flex items-center space-x-6">
          <LinkButton href="/schedule-ride" label="Schedule a Ride" />
          <LinkButton href="/login" label="Login" />
        </div>
        <MobileMenu isLoggedIn={false} />
      </nav>
    );
  }

  // // Log email for debugging purposes
  // console.log("Authenticated user email:", user.email);

  // // Step 1: Check if the user is a driver
  // const { data: driverData, error: driverError } = await supabase
  //   .from("drivers")
  //   .select("id")
  //   .ilike("email", user.email.trim()) // Case-insensitive comparison with trim
  //   .single();

  // if (driverError) {
  //   console.error("Error fetching driver data:", driverError.message);
  // } else if (driverData) {
  //   console.log("Driver found:", driverData);
  // } else {
  //   console.log("No driver found for this user.");
  // }

  // let isDriver = false;
  // let dashboardHref = "/dashboard";
  // let dashboardLabel = "User Dashboard";

  // // If driver data exists, set as driver
  // if (driverData) {
  //   isDriver = true;
  //   dashboardHref = "/driverdashboard/available-rides";
  //   dashboardLabel = "Driver Dashboard";
  // }

  // // Step 2: Check if the user is a regular user if not a driver
  // if (!isDriver) {
  //   const { data: userData, error: userError } = await supabase
  //     .from("users")
  //     .select("id")
  //     .eq("email", user.email)
  //     .single();

  //   if (userError) {
  //     console.error("Error fetching user data:", userError.message);
  //   } else if (userData) {
  //     console.log("User found:", userData);
  //     dashboardHref = "/dashboard";
  //     dashboardLabel = "User Dashboard";
  //   } else {
  //     console.error("No user found in either drivers or users table.");
  //   }
  // }

  return (
    <nav className="flex z-40 sticky top-0 lg:bg-white/50 bg-white/90 lg:backdrop-blur-lg justify-between items-center px-12 py-3 shadow-md md:shadow-none">
      <Logo />
      <NavItems />
      <div className="hidden lg:flex items-center space-x-6">
        <LinkButton href="/schedule-ride" label="Schedule a Ride" />
        {/* <LinkButton href={dashboardHref} label={dashboardLabel} primary /> */}
        <Logout />
      </div>
      <MobileMenu isLoggedIn={true} dashboardHref={"Dashboard"} />
    </nav>
  );
};

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
        width={80}
        height={80}
        quality={100}
        className="cursor-pointer"
      />
    </Link>
  </div>
);

export default NavBar;
