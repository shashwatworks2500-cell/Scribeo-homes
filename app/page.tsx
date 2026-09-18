import Curtain from "@/components/Curtain";
import MotionProvider from "@/components/MotionProvider";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Statement from "@/components/Statement";
import Architecture from "@/components/Architecture";
import FloorPlans from "@/components/FloorPlans";
import Amenities from "@/components/Amenities";
import Gallery from "@/components/Gallery";
import Distances from "@/components/Distances";
import Location from "@/components/Location";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>
      <Curtain />
      <MotionProvider />
      <Nav />
      <div id="top" />
      <main id="main">
        <Hero />
        <Pricing />
        <Statement />
        <Architecture />
        <FloorPlans />
        <Amenities />
        <Gallery />
        <Distances />
        <Location />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
