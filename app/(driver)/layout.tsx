import DriverBarServer from "../components/ui/DriverBarServer";
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen ">
      {" "}
      <DriverBarServer /> {children}
    </div>
  );
}
