import Image from "next/image";
import { NavBar } from "./components/NavBar";
import Hero from "./components/Hero";
import Schedule from "./components/Schedule";
import Steps from "./components/Steps";
import { RevealBento } from "./components/Info";
import Footer from "./components/Footer";
export default function Home() {
  return (
    <main>
      <NavBar />
      <Hero />
      {/* <Schedule /> */}
      <Steps />
      <Footer />
    </main>
  );
}
