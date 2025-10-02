import { NextRequest, NextResponse } from "next/server";
import { updateBankInfo, getUserBankInfo } from "@/src/app/db/actions";
import { z } from "zod";

export const runtime = "nodejs"; // wichtig: keine Edge-Runtime für pg

// Eingabevalidierung
const BankInfoSchema = z.object({
  accountName: z.string().min(1),
  accountNumber: z.union([z.string(), z.number()]),
  bankName: z.string().min(1),
  currency: z.string().min(1),
});

// Holt ownerId bevorzugt aus Whop-Token (serverseitig), sonst ?userID= (nur Dev)
async function resolveOwnerId(req: NextRequest): Promise<string> {
  try {
    const { requireWhopContext } = await import("@/src/lib/whop-auth");
    const ctx = await requireWhopContext(req.headers);
    return ctx.userId; // bevorzugte, sichere Methode
  } catch {
    const userID = req.nextUrl.searchParams.get("userID");
    if (!userID) throw new Error("Missing user ID. Open inside Whop or pass ?userID= for local testing.");
    return userID;
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = BankInfoSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid payload", errors: parsed.error.flatten() },
        { status: 422 }
      );
    }
    const ownerId = await resolveOwnerId(req);
    await updateBankInfo({
      user_id: ownerId,
      bank_name: parsed.data.bankName,
      account_number: Number(parsed.data.accountNumber),
      account_name: parsed.data.accountName,
      currency: parsed.data.currency,
    });
    return NextResponse.json({ message: "Bank Details Updated!" }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: "An error occurred", error: err?.message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const ownerId = await resolveOwnerId(req);
    const bankInfo = await getUserBankInfo(ownerId);
    return NextResponse.json({ message: "Fetched bank details", bankInfo }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: "An error occurred", error: err?.message }, { status: 400 });
  }
}
