import DashboardNav from "./DashboardNav";
import SideBar from "./SideBar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <div className="h-screen ">
        <div className="bg-neutral-900 text-white px-20 py-1 ">
          <p className="text-right">Welcome TomJones@gmail.com</p>
        </div>
        <div className="bg-red-700 cursor-pointer text-white px-20 py-1 ">
          <p className="text-center underline">
            Click here or contact us to schedule an orientation{" "}
          </p>
        </div>
        <main className="flex  h-screen relative">
          <SideBar />
          {/* <div className="bg-neutral-700 absolute top-0 w-full py-36 -z-10"></div> */}
          <aside className="w-[85%] h-full ">
            <div className="absolute top-0"></div>
            <div className="p-8  h-full   ">{children}</div>
          </aside>
        </main>
      </div>{" "}
    </section>
  );
}
