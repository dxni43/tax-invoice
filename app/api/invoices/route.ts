import { NextRequest, NextResponse } from "next/server";
import { createInvoice, getUserInvoices } from "@/src/app/db/actions";
import { z } from "zod";

export const runtime = "nodejs";

const LineItem = z.object({
  description: z.string().min(1),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
});
const CreateInvoiceSchema = z.object({
  customer: z.string().min(1),
  title: z.string().min(1),
  items: z.array(LineItem),
  total: z.number().nonnegative(),
});

async function resolveOwnerId(req: NextRequest): Promise<string> {
  try {
    const { requireWhopContext } = await import("@/src/lib/whop-auth");
    const ctx = await requireWhopContext(req.headers);
    return ctx.userId;
  } catch {
    const userID = req.nextUrl.searchParams.get("userID");
    if (!userID) throw new Error("Missing user ID. Open inside Whop or pass ?userID= for local testing.");
    return userID;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateInvoiceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid payload", errors: parsed.error.flatten() },
        { status: 422 }
      );
    }
    const ownerId = await resolveOwnerId(req);
    await createInvoice({
      user_id: ownerId,
      customer_id: parsed.data.customer,
      title: parsed.data.title,
      total_amount: parsed.data.total,
      items: JSON.stringify(parsed.data.items),
    });
    return NextResponse.json({ message: "New Invoice Created!" }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: "An error occurred", error: err?.message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const ownerId = await resolveOwnerId(req);
    const invoices = await getUserInvoices(ownerId);
    return NextResponse.json({ message: "Invoices retrieved successfully!", invoices }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: "An error occurred", error: err?.message }, { status: 400 });
  }
}
