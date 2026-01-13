import NavBar from "./Components/NavBar";
import Hero from "./Components/Hero";
import Pricing from "./Components/Pricing";
import Languages from "./Components/Languages";
import Footer from "./Components/Footer";

export default function HomePage() {
  return (
    <>
      <div className="w-full bg-gray-50 text-gray-900">
        <NavBar />
        <Hero />
        <Pricing />
        <Languages />
        <Footer />
      </div>
    </>
  );
}
