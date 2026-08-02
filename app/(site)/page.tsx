import Hero from "@/components/Hero";
import ProductShowcase from "@/components/ProductShowcase";
import SpecsSection from "@/components/SpecsSection";
import ReviewsSection from "@/components/ReviewsSection";
import FaqSection from "@/components/FaqSection";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ProductShowcase />
      <SpecsSection />
      <ReviewsSection />
      <FaqSection />
    </main>
  );
}