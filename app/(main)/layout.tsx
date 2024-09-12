import Footer from "./components/ui/Footer";
import NavBar from "./components/ui/NavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
