import { NavBar } from "./components/ui/NavBar";
import Hero from "./components/Home/Hero";
import Steps from "./components/Steps";
import Footer from "./components/ui/Footer";
import HowItWorks from "./components/Home/HowItWorks";
import WhatWeOffer from "./components/Home/WhatWeOffer";
import WhyChooseUs from "./components/Home/WhyChooseUs";
export default function Home() {
  return (
    <main>
      <NavBar />
      <Hero />
      <WhyChooseUs />
      <HowItWorks />
      <WhatWeOffer />
      <Steps />
      <Footer />
    </main>
  );
}
