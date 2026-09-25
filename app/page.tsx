import MotionProvider from "@/components/MotionProvider";
import Nav from "@/components/Nav";
import Search from "@/components/Search";
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
 * The journey, in the order the specification sets it:
 *
 *   Hero             land — understand the property
 *   At a glance      the key numbers in five seconds
 *   Setting          feel the place
 *   Architecture     feel the architecture
 *   Inside           feel the rooms
 *   Residences       explore and compare configurations  (#residences)
 *   Floor plans      view a plan
 *   Amenities        what is shared                      (#amenities)
 *   Gallery          see the development
 *   Location         what is around it                   (#location)
 *   Specifications   what exactly is included            (#specifications)
 *   Questions        resolve what is left                (#faq)
 *   Visit            book a site visit                   (#enquire)
 *
 * Search, Residences, Amenities, Location and Enquire are reachable from the
 * header at every point; nothing forces a linear read.
 */
export default function Page() {
  return (
    <>
      <MotionProvider />
      <Nav />
      <Search />
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
