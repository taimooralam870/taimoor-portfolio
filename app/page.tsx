import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Lab from "@/components/Lab";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Process from "@/components/Process";
import Stack from "@/components/Stack";
import Contact from "@/components/Contact";
import CommandPalette from "@/components/CommandPalette";
import Toaster from "@/components/Toaster";
import EasterEgg from "@/components/EasterEgg";
import { profile } from "@/lib/data";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Chakwal", addressRegion: "Punjab", addressCountry: "PK" },
  sameAs: [profile.linkedin],
  knowsAbout: ["Shopify Plus", "Liquid", "Conversion rate optimization", "A/B testing", "Shopify Functions"],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <SmoothScroll />
      <Preloader />
      <Cursor />
      <Nav />
      <main className="overflow-x-clip">
        <Hero />
        <Marquee />
        <About />
        <Lab />
        <Services />
        <Projects />
        <Process />
        <Stack />
        <Contact />
      </main>
      <CommandPalette />
      <Toaster />
      <EasterEgg />
      <div className="grain" aria-hidden />
    </>
  );
}
