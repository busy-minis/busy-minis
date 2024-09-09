import Link from "next/link";
import MobileNav from "./MobileNav";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUserRole } from "@/utils/supabase/supabaseQueries";

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
    <div>
      <nav className="bg-stone-800 p-4 lg:px-24 shadow-md">
        <div className="flex justify-between items-center">
          {/* Brand Name */}
          <div className="text-white text-lg font-semibold">
            <Link href="/admin">BusyMinis Admin</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex w-full lg:w-auto">
            <div className="flex space-x-6">
              <Link
                href="/admin/driver-form"
                className="text-white hover:bg-stone-600 rounded-lg px-4 py-2 transition-colors"
              >
                Driver Form
              </Link>
              <Link
                href="/admin/drivers"
                className="text-white hover:bg-stone-600 rounded-lg px-4 py-2 transition-colors"
              >
                Drivers
              </Link>
              <Link
                href="/admin/verify-users"
                className="text-white hover:bg-stone-600 rounded-lg px-4 py-2 transition-colors"
              >
                Verify Users
              </Link>
              <Link
                href="/admin/schedule"
                className="text-white hover:bg-stone-600 rounded-lg px-4 py-2 transition-colors"
              >
                Schedule
              </Link>
              <Link
                href="/"
                className="text-white hover:bg-stone-600 rounded-lg px-4 py-2 transition-colors"
              >
                Sign Out
              </Link>
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
