import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import Pricing from "./components/Pricing";
import Languages from "./components/Languages";
import Footer from "./components/Footer";

export default function HomePage() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col">
      <NavBar />
      <main className="flex-grow">
        <Hero />
        <Pricing />
        <Languages />
      </main>
      <Footer />
    </div>
  );
}
