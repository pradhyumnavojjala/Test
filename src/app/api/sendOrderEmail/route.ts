import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { items, total, email } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // your Gmail
        pass: process.env.GMAIL_PASS, // your app password
      },
    });

    const orderList = items
      .map((item: any) => `${item.name} x${item.quantity} - ₹${item.price}`)
      .join("\n");

    // Email to customer
    const customerMail = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "✅ NutriFit Order Confirmation",
      text: `Hi there! 👋

Your order has been confirmed successfully. Here’s a summary:

${orderList}

Total Amount: ₹${total}

Your order will be delivered soon.
Please pay upon delivery. 💵

Thank you for shopping with NutriFit 💪
— Team NutriFit`,
    };

    // Email to you (the owner)
    const ownerMail = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // 👈 same email (you)
      subject: "📦 New NutriFit Order Received",
      text: `Hey Owner 👑,

You just received a new order!

Customer Email: ${email}

Items Ordered:
${orderList}

Total: ₹${total}

Time to process and deliver this order 🚚`,
    };

    // Send both emails
    await transporter.sendMail(customerMail);
    await transporter.sendMail(ownerMail);

    return NextResponse.json({ message: "Emails sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
