import ProductShowcase from "@/components/ProductShowcase";
import SpecsSection from "@/components/SpecsSection";
import FaqSection from "@/components/FaqSection";

export const metadata = {
  title: "Flexter Compression Tee — ₹1,499",
  description:
    "Four-way stretch compression tee in jet black. Sweat-wicking, flatlock seams, printed Flexter mark.",
};

export default function ProductPage() {
  return (
    <main className="pt-16">
      <ProductShowcase />
      <SpecsSection />
      <FaqSection />
    </main>
  );
}
