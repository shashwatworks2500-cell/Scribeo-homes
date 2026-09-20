import Curtain from "@/components/Curtain";
import MotionProvider from "@/components/MotionProvider";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Concierge from "@/components/Concierge";
import Hero from "@/components/Hero";
import Glance from "@/components/Glance";
import Statement from "@/components/Statement";
import Landscape from "@/components/Landscape";
import Principles from "@/components/Principles";
import Materials from "@/components/Materials";
import Configurations from "@/components/Configurations";
import FloorPlans from "@/components/FloorPlans";
import Compare from "@/components/Compare";
import DayAt from "@/components/DayAt";
import Amenities from "@/components/Amenities";
import Gallery from "@/components/Gallery";
import Location from "@/components/Location";
import Around from "@/components/Around";
import Specs from "@/components/Specs";
import Faq from "@/components/Faq";
import Trust from "@/components/Trust";
import Closer from "@/components/Closer";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

/**
 * The journey, in the order a buyer actually travels it:
 * discover, understand, explore, compare, visualise, trust, enquire.
 *
 * Chapter numbers are printed in the sections themselves and run 01 to 16,
 * so the page reads as one document rather than a stack of components. The
 * closing invitation carries no number: it is the end of the argument, not
 * another part of it.
 */
export default function Page() {
  return (
    <>
      <Curtain />
      <MotionProvider />
      <Cursor />
      <Nav />
      <Concierge />
      <div id="top" />
      <main id="main">
        <Hero />
        <Glance />
        <Statement />
        <Landscape />
        <Principles />
        <Materials />
        <Configurations />
        <FloorPlans />
        <Compare />
        <DayAt />
        <Amenities />
        <Gallery />
        <Location />
        <Around />
        <Specs />
        <Faq />
        <Trust />
        <Closer />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
