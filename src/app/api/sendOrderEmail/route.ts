export const runtime = "nodejs";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// 1. DEFINE THE INTERFACES HERE (OUTSIDE THE FUNCTION)
// Define the structure of a single item in the order
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

// Define the expected structure of the entire request body
interface OrderRequest {
    items: OrderItem[];
    total: number;
    email: string;
}

export async function POST(request: Request) {
  
  // 2. TYPE THE REQUEST BODY WHEN PARSING IT
  // This resolves the initial 'any' error for the destructured variables.
  const { items, total, email }: OrderRequest = await request.json();

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Order Confirmation - NutriFit Store",
      text: `
Your order has been confirmed! 🛍️

Items:
${items.map((i) => `${i.name} x${i.quantity} - ₹${i.price}`).join("\n")}

Total: ₹${total}

Your order will be delivered soon.
Please pay when it is delivered. 💵
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}