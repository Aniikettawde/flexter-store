import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export function orderConfirmationEmail(order: {
  customer_name: string;
  order_number: string;
  amount: number;
  cod_charge?: number | null;
  items: { size: string; qty: number; price: number }[];
  shipping_address: { address: string; city: string; state: string; pincode: string };
}) {
  const itemRows = order.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 0;">Size ${i.size} × ${i.qty}</td>
          <td style="padding:8px 0; text-align:right;">₹${(i.price * i.qty).toLocaleString("en-IN")}</td>
        </tr>`
    )
    .join("");

  const codChargeRow =
    order.cod_charge && order.cod_charge > 0
      ? `<tr>
          <td style="padding:8px 0; color:#666;">COD charges</td>
          <td style="padding:8px 0; text-align:right; color:#666;">₹${(order.cod_charge / 100).toLocaleString("en-IN")}</td>
        </tr>`
      : "";

  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color:#111;">
      <h2 style="letter-spacing: 0.05em;">FLEXTER</h2>
      <p>Hi ${order.customer_name},</p>
      <p>Your order is confirmed. Here are the details:</p>
      <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
        ${itemRows}
        ${codChargeRow}
        <tr>
          <td style="padding-top:12px; font-weight:bold; border-top: ${order.cod_charge ? "1px solid #ddd" : "none"};">Total</td>
          <td style="padding-top:12px; text-align:right; font-weight:bold; border-top: ${order.cod_charge ? "1px solid #ddd" : "none"};">
            ₹${(order.amount / 100).toLocaleString("en-IN")}
          </td>
        </tr>
      </table>
      <p style="margin-top:24px;"><strong>Shipping to:</strong><br/>
        ${order.shipping_address.address}<br/>
        ${order.shipping_address.city}, ${order.shipping_address.state} - ${order.shipping_address.pincode}
      </p>
      <p style="margin-top:24px; font-size:12px; color:#666;">
        Order number: <strong>${order.order_number}</strong><br/>
        Quote this number if you need to reach us about this order.
      </p>
    </div>
  `;
}