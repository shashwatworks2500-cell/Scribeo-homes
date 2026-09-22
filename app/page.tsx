import MotionProvider from "@/components/MotionProvider";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Concierge from "@/components/Concierge";
import MobileBar from "@/components/MobileBar";
import Hero from "@/components/Hero";
import Glance from "@/components/Glance";
import Intro from "@/components/Intro";
import Residences from "@/components/Residences";
import FloorPlans from "@/components/FloorPlans";
import Amenities from "@/components/Amenities";
import Gallery from "@/components/Gallery";
import Location from "@/components/Location";
import Specs from "@/components/Specs";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

/**
 * Nine sections, each answering one question.
 *
 *   Hero            what is this?
 *   At a glance     what are the facts?
 *   Introduction    what does it feel like?
 *   Residences      what can I buy?
 *   Floor plans     what does each home look like?
 *   Amenities       what do I get?
 *   Location        where is it?
 *   Specifications  what exactly is included?
 *   Questions       what else should I know?
 *   Visit           what do I do next?
 *
 * There were sixteen. A landscape chapter, four materials, six principles,
 * a day in five hours, a neighbourhood read as a week, a comparison table
 * and a separate gallery all answered "what is it like?" over and over.
 * Nothing factual was lost — it moved into the glance, the residence
 * panels, the specifications and the questions, where a buyer looks for it.
 */
export default function Page() {
  return (
    <>
      <MotionProvider />
      <Cursor />
      <Nav />
      <Concierge />
      <div id="top" />
      <main id="main">
        <Hero />
        <Glance />
        <Intro />
        <Residences />
        <FloorPlans />
        <Amenities />
        <Gallery />
        <Location />
        <Specs />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
