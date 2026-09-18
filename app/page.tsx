import MotionProvider from "@/components/MotionProvider";
import Curtain from "@/components/Curtain";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import Architecture from "@/components/Architecture";
import Residence from "@/components/Residence";
import Interstitial from "@/components/Interstitial";
import Landscape from "@/components/Landscape";
import Lifestyle from "@/components/Lifestyle";
import Location from "@/components/Location";
import Details from "@/components/Details";
import Enquire from "@/components/Enquire";
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
        <Statement />
        <Architecture />
        <Residence />
        <Interstitial />
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
