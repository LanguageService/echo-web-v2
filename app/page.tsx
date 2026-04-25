import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import Pricing from "./components/Pricing";
import Languages from "./components/Languages";
import Footer from "./components/Footer";

export default function HomePage() {
  return (
    <div className="w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <NavBar />
      <Hero />
      <Pricing />
      <Languages />
      <Footer />
    </div>
  );
}
