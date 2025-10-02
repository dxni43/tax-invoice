"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useReactToPrint } from "react-to-print";

// Typen grob (passe sie an dein Schema an)
type Invoice = {
  id: number;
  customer_id: string;
  title: string;
  items: string; // JSON-stringified
  total_amount: string | number;
  created_at: string | null;
};
type Customer = { name?: string; email?: string; address?: string };
type BankInfo = { account_name?: string; currency?: string };

function formatAmount(cur: string | undefined, amount: number | string | undefined) {
  const a = Number(amount ?? 0);
  return `${cur ?? ""}${a.toLocaleString()}`;
}

function formatDateString(s: string | null | undefined) {
  if (!s) return "—";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
}

const InvoiceTable = ({ itemList }: { itemList: any[] }) => (
  <div className="mt-6">
    <table className="w-full text-sm">
      <thead className="text-left border-b">
        <tr>
          <th className="py-2">Description</th>
          <th className="py-2">Qty</th>
          <th className="py-2">Unit</th>
          <th className="py-2">Total</th>
        </tr>
      </thead>
      <tbody>
        {itemList.length === 0 ? (
          <tr><td colSpan={4} className="py-6 text-gray-500">No items</td></tr>
        ) : itemList.map((it, i) => (
          <tr key={i} className="border-b last:border-0">
            <td className="py-2">{it.description}</td>
            <td className="py-2">{it.quantity}</td>
            <td className="py-2">{Number(it.unitPrice).toLocaleString()}</td>
            <td className="py-2">{Number(it.quantity * it.unitPrice).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

type PrintProps = {
  id: string;
  customer?: Customer;
  invoice?: Invoice;
  bankInfo?: BankInfo;
};

// Druck-Komponente
const ComponentToPrint = forwardRef<HTMLDivElement, PrintProps>((props, ref) => {
  const { id, customer, invoice, bankInfo } = props;
  const items = invoice?.items ? JSON.parse(invoice.items) : [];
  return (
    <div className="w-full px-2 py-8" ref={ref}>
      <div className="lg:w-2/3 w-full mx-auto shadow border rounded min-h-[75vh] p-5 bg-white">
        <header className="w-full flex items-start gap-4 justify-between">
          <div className="w-4/5">
            <h2 className="text-lg font-semibold mb-3">INVOICE #{id}</h2>
            <section className="mb-6">
              <p className="opacity-60">Issuer Name: {bankInfo?.account_name ?? "—"}</p>
              <p className="opacity-60">Date: {formatDateString(invoice?.created_at ?? null)}</p>
            </section>
            <h2 className="text-lg font-semibold mb-2">TO:</h2>
            <section className="mb-6">
              <p className="opacity-60">Name: {invoice?.customer_id ?? "—"}</p>
              <p className="opacity-60">Address: {customer?.address ?? "—"}</p>
              <p className="opacity-60">Email: {customer?.email ?? "—"}</p>
            </section>
          </div>
          <div className="w-1/5 flex flex-col items-end">
            <p className="font-extrabold text-2xl">
              {formatAmount(bankInfo?.currency, invoice?.total_amount)}
            </p>
            <p className="text-sm opacity-60">Total Amount</p>
          </div>
        </header>

        <div className="mt-4">
          <p className="opacity-60">Subject:</p>
          <h2 className="text-lg font-semibold">{invoice?.title ?? "—"}</h2>
        </div>

        <InvoiceTable itemList={items} />
      </div>
    </div>
  );
});
ComponentToPrint.displayName = "ComponentToPrint";

export default function InvoicePage() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const componentRef = useRef<HTMLDivElement>(null);

  const [invoice, setInvoice] = useState<Invoice>();
  const [customer, setCustomer] = useState<Customer>();
  const [bankInfo, setBankInfo] = useState<BankInfo>();

  // DEV-Hinweis: Für lokale Tests ohne Whop-Token kannst du ?userID=... an die URL anhängen.
  const userID = search.get("userID") ?? undefined;

  useEffect(() => {
    const id = params.id;
    if (!id) return;

    // 1) Invoice
    fetch(`/api/invoices/single?id=${id}${userID ? `&userID=${encodeURIComponent(userID)}` : ""}`)
      .then(r => r.json())
      .then(d => setInvoice(d?.invoice?.[0])) // getSingleInvoice liefert Array
      .catch(() => {});

    // 2) Bank Info
    fetch(`/api/bank-info${userID ? `?userID=${encodeURIComponent(userID)}` : ""}`)
      .then(r => r.json())
      .then(d => setBankInfo(d?.bankInfo?.[0]))
      .catch(() => {});

    // 3) Customer (optional): wenn du einen /api/customers/single baust, hier abrufen
    // fetch(`/api/customers/single?name=${encodeURIComponent(invoice?.customer_id ?? "")}${userID ? `&userID=${encodeURIComponent(userID)}` : ""}`)
    //   .then(r => r.json()).then(d => setCustomer(d?.customer)).catch(() => {});
  }, [params, userID]);

  const handlePrint = useReactToPrint({
    documentTitle: `Invoice-${params.id}`,
    content: () => componentRef.current,
  });

  const handleSendInvoice = async () => {
    // TODO: Hier später Resend integrieren (PDF-Link oder HTML versenden)
    alert("Send Invoice (not connected yet)");
  };

  return (
    <main className="w-full min-h-screen bg-gray-50">
      <section className="w-full flex p-4 items-center justify-center gap-3 mb-3">
        <button className="px-4 py-2 text-white bg-blue-600 rounded-md" onClick={handlePrint}>
          Download
        </button>
        <button className="px-4 py-2 text-white bg-green-600 rounded-md" onClick={handleSendInvoice}>
          Send Invoice
        </button>
      </section>

      <ComponentToPrint
        ref={componentRef}
        id={params.id}
        customer={customer}
        bankInfo={bankInfo}
        invoice={invoice}
      />
    </main>
  );
}
