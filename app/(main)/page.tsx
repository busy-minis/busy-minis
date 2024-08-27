import Hero from "../components/Home/Hero";
import HowItWorks from "../components/Home/HowItWorks";
import WhatWeOffer from "../components/Home/WhatWeOffer";
import WhyChooseUs from "../components/Home/WhyChooseUs";
import Footer from "../components/ui/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <WhyChooseUs />
      <HowItWorks />
      <WhatWeOffer />
      {/* <CTA /> */}
      <Footer />
    </main>
  );
}
