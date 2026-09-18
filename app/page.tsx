import MotionProvider from "@/components/MotionProvider";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import Architecture from "@/components/Architecture";
import Residence from "@/components/Residence";
import Landscape from "@/components/Landscape";
import Lifestyle from "@/components/Lifestyle";
import Location from "@/components/Location";
import Details from "@/components/Details";
import Enquire from "@/components/Enquire";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>
      <MotionProvider />
      <Nav />
      <div id="top" />
      <main id="main">
        <Hero />
        <Statement />
        <Architecture />
        <Residence />
        <Landscape />
        <Lifestyle />
        <Location />
        <Details />
        <Enquire />
      </main>
      <Footer />
    </>
  );
}
