import DriverBarServer from "./components/DriverBarServer";
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen ">
      <DriverBarServer /> {children}
    </div>
  );
}
