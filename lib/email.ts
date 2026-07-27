import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// TODO: replace with an address on a domain you've verified in Resend
// (Settings → Domains). Sending from an unverified domain will fail or
// land in spam.
const FROM_ADDRESS = "Flexter <orders@flexter.in>";

type OrderItem = { size: string; qty: number; price: number };

export async function sendOrderConfirmationEmail(order: {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  amount: number; // paise
  paymentMethod: "cod" | "prepaid";
  shippingAddress: { address: string; city: string; state: string; pincode: string };
}) {
  const { id, customerName, customerEmail, items, amount, paymentMethod, shippingAddress } = order;

  const rupees = (amount / 100).toLocaleString("en-IN");
  const orderRef = id.slice(-8).toUpperCase();

  const itemsHtml = items
    .map(
      (i) => `
        <tr>
          <td style="padding:8px 0;color:#e5e5e0;font-size:14px;">Size ${i.size} × ${i.qty}</td>
          <td style="padding:8px 0;color:#e5e5e0;font-size:14px;text-align:right;">₹${(i.price * i.qty).toLocaleString("en-IN")}</td>
        </tr>`
    )
    .join("");

  const html = `
  <div style="background:#0a0a0b;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <div style="max-width:480px;margin:0 auto;">
      <p style="color:#f2f2ef;font-weight:700;letter-spacing:0.05em;font-size:14px;margin-bottom:24px;">FLEXTER</p>
      <h1 style="color:#f2f2ef;font-size:22px;margin:0 0 8px;">Order confirmed.</h1>
      <p style="color:#9a9a97;font-size:14px;margin:0 0 24px;">
        Hi ${customerName}, thanks for your order (#${orderRef}).
        ${
          paymentMethod === "cod"
            ? "Keep the amount ready — you'll pay in cash when it's delivered."
            : "We've received your payment and your tee is being prepared."
        }
      </p>

      <table style="width:100%;border-collapse:collapse;border-top:1px solid #262626;border-bottom:1px solid #262626;margin-bottom:16px;">
        ${itemsHtml}
        <tr>
          <td style="padding:12px 0 0;color:#f2f2ef;font-size:14px;font-weight:600;">Total</td>
          <td style="padding:12px 0 0;color:#f2f2ef;font-size:14px;font-weight:600;text-align:right;">₹${rupees}</td>
        </tr>
      </table>

      <p style="color:#9a9a97;font-size:12px;line-height:1.6;margin:0;">
        Shipping to:<br/>
        ${shippingAddress.address}<br/>
        ${shippingAddress.city}, ${shippingAddress.state} – ${shippingAddress.pincode}
      </p>

      <p style="color:#5a5a57;font-size:11px;margin-top:32px;">
        © ${new Date().getFullYear()} Flexter. One tee. Zero compromise.
      </p>
    </div>
  </div>`;

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: customerEmail,
      subject: `Order confirmed — #${orderRef}`,
      html,
    });
  } catch (err) {
    // Don't let an email failure fail the order — it's already placed.
    console.error("Failed to send order confirmation email:", err);
  }
}