import LegalLayout from "@/components/LegalLayout";

export const metadata = {
  title: "Terms of Service — Flexter",
};

export default function TermsOfServicePage() {
  return (
    <LegalLayout title="Terms of Service" updated="21 July 2026">
      <div>
        <p>
          These terms govern your use of this website and any order placed
          with Flexter. By placing an order, you agree to them.
        </p>
      </div>

      <div>
        <h2>Products</h2>
        <p>
          We currently sell one product: the Flexter Compression Tee, priced
          at ₹1,499. We reserve the right to update pricing, availability,
          or sizing at any time; the price shown at checkout is the price
          you pay.
        </p>
      </div>

      <div>
        <h2>Orders and payment</h2>
        <p>
          All orders are prepaid — cash on delivery is not available.
          Payments are processed securely through Razorpay. An order is
          confirmed only once payment has been successfully verified.
        </p>
      </div>

      <div>
        <h2>Shipping</h2>
        <p>
          Orders ship within 2–4 business days. We ship across India. Once
          your order is dispatched, delivery timing depends on your
          location and the courier partner.
        </p>
      </div>

      <div>
        <h2>Returns and refunds</h2>
        <p>
          Returns and refunds are covered by our{" "}
          <a href="/refund-policy">Refund &amp; Return Policy</a>: a full
          refund is available within 7 days of delivery, no questions
          asked. After 7 days, we&apos;re unable to offer a return, refund,
          or replacement.
        </p>
      </div>

      <div>
        <h2>Product use</h2>
        <p>
          The Flexter Compression Tee is athletic apparel intended for
          general fitness and everyday wear. Follow the care instructions
          on the product page to maintain the fabric&apos;s compression and
          durability.
        </p>
      </div>

      <div>
        <h2>Limitation of liability</h2>
        <p>
          Flexter is not liable for indirect or incidental damages arising
          from the use of our products or website, to the extent permitted
          by law.
        </p>
      </div>

      <div>
        <h2>Changes to these terms</h2>
        <p>
          We may update these terms from time to time. The date at the top
          of this page reflects the latest revision.
        </p>
      </div>

      <div>
        <h2>Contact</h2>
        <p>
          Questions about these terms — email{" "}
          <a href="mailto:info@flexter.in">info@flexter.in</a>.
        </p>
      </div>
    </LegalLayout>
  );
}
