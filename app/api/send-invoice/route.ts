import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import InvoiceEmail from "@/src/app/emails/InvoiceEmail";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    if (!process.env.EMAIL_FROM) {
      throw new Error("Missing EMAIL_FROM env var");
    }
    const replyTo = process.env.EMAIL_REPLY_TO || "support@taxandinvoice.com";

    const body = await req.json();

    // Items akzeptieren wir als Array ODER als JSON-String:
    const items =
      Array.isArray(body.items)
        ? body.items
        : typeof body.items === "string"
          ? JSON.parse(body.items)
          : [];

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,            // -> "Tax & Invoice <no-reply@taxandinvoice.com>"
      to: [body.customerEmail],                // Empfänger
      reply_to: replyTo,                       // Antworten an Support
      subject: body.title || `Invoice INV0${body.invoiceID}`,
      // React Email Komponente:
      react: InvoiceEmail({
        invoiceID: body.invoiceID,
        items,
        amount: Number(body.amount || 0),
        issuerName: body.issuerName,
        accountNumber: body.accountNumber,
        currency: body.currency || "€",
      }) as React.ReactElement,
      // Optional: BCC an dich selbst
      // bcc: ["invoices@taxandinvoice.com"],
      // Optional: List-Unsubscribe Header (für Massenmails):
      // headers: { "List-Unsubscribe": "<mailto:unsubscribe@taxandinvoice.com>" },
    });

    if (error) {
      return NextResponse.json({ message: "Email not sent!", error }, { status: 500 });
    }

    return NextResponse.json({ message: "Email delivered!", id: data?.id }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Email not sent!", error: error?.message }, { status: 500 });
  }
}
