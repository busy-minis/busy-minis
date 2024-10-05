import Link from "next/link";
import MobileNav from "./MobileNav";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUserRole } from "@/utils/supabase/supabaseQueries";
import LogoutButton from "./LogoutButton";

const AdminNavBar = async () => {
  const supabase = createClient();

  // Get the currently logged-in user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/403");
  }

  // Get the user's role
  const userRole = await getUserRole(user.id);
  if (!userRole) {
    redirect("/403");
  }

  // If the user is not an admin, redirect to forbidden page
  if (userRole !== "admin") {
    redirect("/403");
  }

  return (
    <div className="bg-zinc-950">
      <nav className="py-2 container">
        <div className="flex justify-between items-center">
          {/* Brand Name */}
          <div className="text-zinc-100 text-2xl bebes">
            <Link href="/admin">BusyMinis Admin</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex w-full lg:w-auto">
            <div className="flex text-zinc-400 space-x-6 font-semibold text-sm">
              <Link
                href="/admin/driver-form"
                className="hover:text-white rounded-lg px-4 py-2 transition-colors"
              >
                Driver Form
              </Link>
              <Link
                href="/admin/drivers"
                className="hover:text-white rounded-lg px-4 py-2 transition-colors"
              >
                Drivers
              </Link>
              <Link
                href="/admin/verify-users"
                className="hover:text-white rounded-lg px-4 py-2 transition-colors"
              >
                Verify Users
              </Link>
              <Link
                href="/admin/schedule"
                className="hover:text-white rounded-lg px-4 py-2 transition-colors"
              >
                Schedule
              </Link>
              <LogoutButton />
            </div>
          </div>

          {/* Mobile Menu */}
          <MobileNav />
        </div>
      </nav>
    </div>
  );
};

export default AdminNavBar;
