import Curtain from "@/components/Curtain";
import MotionProvider from "@/components/MotionProvider";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Concierge from "@/components/Concierge";
import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import Landscape from "@/components/Landscape";
import Materials from "@/components/Materials";
import Configurations from "@/components/Configurations";
import FloorPlans from "@/components/FloorPlans";
import DayAt from "@/components/DayAt";
import Amenities from "@/components/Amenities";
import Gallery from "@/components/Gallery";
import Location from "@/components/Location";
import Trust from "@/components/Trust";
import QuestionsNoScript from "@/components/QuestionsNoScript";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

/**
 * The journey, in the order a buyer actually travels it:
 * discover, understand, explore, compare, visualise, trust, enquire.
 *
 * Chapter numbers are printed in the sections themselves and run 01 to 09,
 * so the page reads as one document rather than a stack of components.
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
        <Statement />
        <Landscape />
        <Materials />
        <Configurations />
        <FloorPlans />
        <DayAt />
        <Amenities />
        <Gallery />
        <Location />
        <Trust />
        <QuestionsNoScript />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
