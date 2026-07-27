import LegalLayout from "@/components/LegalLayout";

export const metadata = {
  title: "Refund & Return Policy — Flexter",
};

export default function RefundPolicyPage() {
  return (
    <LegalLayout title="Refund & Return Policy" updated="21 July 2026">
      <div>
        <h2>The short version</h2>
        <p>
          You can return your Flexter Compression Tee within{" "}
          <strong>7 days of delivery</strong> for a{" "}
          <strong>full refund, no questions asked</strong>. After 7 days, we
          are unable to offer a return, refund, or replacement.
        </p>
      </div>

      <div>
        <h2>7-day full refund window</h2>
        <p>
          If you&apos;re not happy with your order for any reason, contact us
          within 7 days of the delivery date and we will arrange a full
          refund. You don&apos;t need to give a reason, and you don&apos;t
          need to prove the product is faulty — this window applies whether
          you simply changed your mind, the size doesn&apos;t work for you,
          or anything else.
        </p>
        <p>To be eligible:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>The request must reach us within 7 days of delivery.</li>
          <li>
            The tee should be unworn, unwashed, and with tags attached where
            possible, so it can be returned to stock.
          </li>
        </ul>
      </div>

      <div>
        <h2>After 7 days</h2>
        <p>
          Once 7 days have passed since delivery, we&apos;re unable to offer
          a return, refund, or replacement under any circumstance. We&apos;d
          rather be upfront about this than promise something we can&apos;t
          honor later, so please reach out within the window if anything is
          wrong.
        </p>
      </div>

      <div>
        <h2>How to request a refund</h2>
        <p>
          Email <a href="mailto:info@flexter.in">info@flexter.in</a> with
          your order details within 7 days of delivery. We&apos;ll confirm
          pickup or return instructions and process your refund to the
          original payment method once the return is received.
        </p>
      </div>

      <div>
        <h2>Refund timing</h2>
        <p>
          Once your return is received and inspected, refunds are issued to
          your original payment method via Razorpay. Depending on your bank,
          it can take a few business days for the refund to reflect in your
          account after it&apos;s processed on our end.
        </p>
      </div>

      <div>
        <h2>Questions</h2>
        <p>
          Reach out to <a href="mailto:info@flexter.in">info@flexter.in</a>{" "}
          for anything related to your order, return, or refund.
        </p>
      </div>
    </LegalLayout>
  );
}
