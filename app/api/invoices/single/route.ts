import { NextRequest, NextResponse } from "next/server";
import { getSingleInvoice } from "@/src/app/db/actions";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const idStr = req.nextUrl.searchParams.get("id");
    if (!idStr) return NextResponse.json({ message: "Missing id" }, { status: 400 });
    const id = Number(idStr);
    if (!Number.isFinite(id)) return NextResponse.json({ message: "Invalid id" }, { status: 422 });

    const invoice = await getSingleInvoice(id);
    return NextResponse.json({ message: "Invoice retrieved successfully!", invoice }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: "An error occurred", error: err?.message }, { status: 400 });
  }
}
