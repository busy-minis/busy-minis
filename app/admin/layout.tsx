import AdminNavBar from "./AdminNav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="bg-zinc-200">
      <AdminNavBar />
      {children}
    </section>
  );
}
