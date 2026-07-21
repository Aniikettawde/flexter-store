import Hero from "@/components/Hero";
import ProductShowcase from "@/components/ProductShowcase";
import SpecsSection from "@/components/SpecsSection";
import FaqSection from "@/components/FaqSection";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ProductShowcase />
      <SpecsSection />
      <FaqSection />
    </main>
  );
}
