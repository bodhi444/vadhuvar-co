import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Introduction from "@/components/Introduction";
import SelectedWorks from "@/components/SelectedWorks";
import Services from "@/components/Services";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Navigation />
      
      <main>
        <Hero />
        <Introduction />
        <SelectedWorks />
        
        {/* Fullscreen Visual Break */}
        <section className="full-bleed" style={{ height: "100vh", position: "relative" }}>
          <Image 
            src="/works/hero/hero-2.jpg"
            alt="Vadhuvar Co. Cinematic Moment"
            fill
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center", backgroundAttachment: "fixed" }}
          />
        </section>
        
        <Services />
      </main>

      <Footer />
    </>
  );
}
