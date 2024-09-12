import type { Metadata } from "next";

import "./globals.css";
import "@fontsource-variable/inter";
import "@fontsource/poppins/200.css";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "@fontsource/poppins/900.css";
import "@fontsource/chicle";

export const metadata: Metadata = {
  title: "Busy Minis",
  description:
    "Busy Minis is a transportation service tailored specifically for children, catering to the needs of busy families in the South Atlanta Area. Currently servicing the Coweta, Fayette, and Clayton counties of Georgia. Our services include transportation to and from tutoring sessions, summer camps, extracurricular activities, religious events, job interviews, Carowinds amusement park, birthday parties, and customized routes designed to fit individual family needsWe prioritize safety by ensuring our drivers are certified, trained, and equipped with the necessary skills to handle the transportation needs of children, including CPR and First Aid certification. Each ride is accompanied by a trained Shuttle Aid to provide additional assistance and support",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="  bg-neutral-100 text-neutral-900">{children}</body>
    </html>
  );
}
