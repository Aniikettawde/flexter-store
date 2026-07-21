import LegalLayout from "@/components/LegalLayout";

export const metadata = {
  title: "Privacy Policy — Flexter",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="21 July 2026">
      <div>
        <p>
          This policy explains what information Flexter collects when you
          shop with us, why we collect it, and how it&apos;s used. By using
          this website and placing an order, you agree to the practices
          described here.
        </p>
      </div>

      <div>
        <h2>Information we collect</h2>
        <p>When you place an order, we collect:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Your name, email address, and phone number</li>
          <li>Your shipping address (address, city, state, pincode)</li>
          <li>
            Order details — size, quantity, and amount paid — and payment
            confirmation from our payment processor
          </li>
        </ul>
        <p>
          We do not collect or store your card, UPI, or bank details
          ourselves — payments are handled entirely by Razorpay, our payment
          gateway partner, and their own privacy policy governs how that
          payment data is handled.
        </p>
      </div>

      <div>
        <h2>How we use your information</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>To process and ship your order</li>
          <li>To contact you about your order or a return/refund request</li>
          <li>To comply with tax, accounting, and legal obligations</li>
        </ul>
        <p>
          We do not sell your personal information to third parties, and we
          do not use it for advertising.
        </p>
      </div>

      <div>
        <h2>Where your data is stored</h2>
        <p>
          Order information is stored securely with Supabase, our database
          provider. Payment processing is handled by Razorpay. Both are
          used solely to fulfill and support your order.
        </p>
      </div>

      <div>
        <h2>Cookies</h2>
        <p>
          This site uses your browser&apos;s local storage to remember what&apos;s
          in your shopping bag between visits. We don&apos;t use tracking
          cookies for advertising.
        </p>
      </div>

      <div>
        <h2>Your rights</h2>
        <p>
          You can request a copy of the personal information we hold about
          you, ask us to correct it, or ask us to delete it (where we&apos;re
          not required to keep it for legal or accounting reasons) by
          emailing us.
        </p>
      </div>

      <div>
        <h2>Changes to this policy</h2>
        <p>
          If this policy changes, we&apos;ll update the date at the top of
          this page.
        </p>
      </div>

      <div>
        <h2>Contact</h2>
        <p>
          Questions about this policy or your data — email{" "}
          <a href="mailto:info@flexter.in">info@flexter.in</a>.
        </p>
      </div>
    </LegalLayout>
  );
}
