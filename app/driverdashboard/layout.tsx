import { DriverProfile } from "./DriverProfile";
import Navbar from "./NavBar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}

      <div className="flex flex-col lg:flex-row flex-grow bg-gray-300">
        {/* Sidebar - Driver Profile */}
        <aside className="w-full lg:w-1/4 bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 shadow-lg">
          <DriverProfile />
        </aside>

        {/* Main Content - Available Rides */}
        <main className="w-full lg:w-3/4  shadow-lg">
          <Navbar />
          {children}
        </main>
      </div>
    </div>
  );
}
