import Side from "./Side";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="min-h-screen  relative">
      <div className="flex h-full">
        {/* Sidebar */}
        <Side />

        {/* Main Content Area */}
        <aside className="flex-1 h-full ">
          <div className=" h-full overflow-auto  p-4">{children}</div>
        </aside>
      </div>
    </section>
  );
}
