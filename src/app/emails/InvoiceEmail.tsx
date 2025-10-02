import * as React from "react";
import {
  Html, Head, Preview, Body, Container, Section,
  Heading, Text, Hr
} from "@react-email/components";

type Item = {
  description?: string;
  quantity: number;
  unitPrice?: number;
  // Falls dein Frontend andere Felder schickt (z. B. cost/price), fangen wir das unten ab.
  cost?: number;   // alias unitPrice
  price?: number;  // alias quantity*unitPrice
};

type Props = {
  invoiceID: string | number;
  items: Item[];
  amount: number;
  issuerName: string;
  accountNumber: string;
  currency: string; // z. B. "€", "$", "£"
};

export default function InvoiceEmail({
  invoiceID,
  items,
  amount,
  issuerName,
  accountNumber,
  currency,
}: Props) {
  // Fallbacks für Item-Felder
  const normalize = (it: Item) => {
    const qty = Number(it.quantity ?? 0);
    const unit = it.unitPrice ?? it.cost ?? 0;
    const total = it.price ?? qty * (unit || 0);
    return { desc: it.description ?? "Item", qty, unit, total };
  };
  const safeItems = Array.isArray(items) ? items.map(normalize) : [];

  return (
    <Html>
      <Head />
      <Preview>Invoice INV0{String(invoiceID)} from {issuerName}</Preview>
      <Body style={{ backgroundColor: "#ffffff", fontFamily: "Inter, Arial" }}>
        <Container style={{ padding: "24px" }}>
          <Section>
            <Heading as="h2" style={{ color: "#2563EB", margin: 0 }}>
              Purchase Invoice from {issuerName}
            </Heading>
                <Text style={{ margin: "8px 0", opacity: 0.8 }}>
                  Invoice No: INV0{String(invoiceID)}
                </Text>
            <Heading as="h3" style={{ marginTop: 24, marginBottom: 6 }}>Payment Details</Heading>
            <Text style={{ margin: "2px 0" }}>Account Name: {issuerName}</Text>
            <Text style={{ margin: "2px 0" }}>Account Number: {accountNumber}</Text>
            <Text style={{ margin: "2px 0" }}>
              Total Amount: {currency}{Number(amount).toLocaleString()}
            </Text>
            <Hr style={{ margin: "16px 0" }} />
            <Heading as="h3" style={{ marginTop: 0, marginBottom: 8 }}>Items</Heading>
            {safeItems.length === 0 ? (
              <Text>No line items provided.</Text>
            ) : (
              safeItems.map((it, idx) => (
                <Text key={idx} style={{ margin: "2px 0" }}>
                  {it.desc} — {it.qty} × {it.unit.toLocaleString()} = {it.total.toLocaleString()}
                </Text>
              ))
            )}
          </Section>
          <Hr style={{ margin: "24px 0" }} />
          <Text style={{ fontSize: 12, color: "#64748B" }}>
            This email was sent by Tax &amp; Invoice. Replies will go to {process.env.EMAIL_REPLY_TO || "support@taxandinvoice.com"}.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
