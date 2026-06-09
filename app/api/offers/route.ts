import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase/server";
import { notifyFounder } from "@/lib/email/service";
import { formatCurrency } from "@/lib/utils";

/**
 * Buyer offer capture for a for-sale vehicle. Stores the offer (when Supabase is
 * configured) and notifies the seller. No automated acceptance or reply — the
 * seller reviews and responds. The car payment is never processed here.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { name, email, amount, message, vehicle } = body;

  if (!name || !email || !amount) {
    return NextResponse.json({ error: "Name, email, and an offer amount are required." }, { status: 400 });
  }

  const admin = getAdminSupabase();
  if (admin) {
    await admin.from("offers").insert({
      buyer_name: name, buyer_email: email, amount: Number(amount) || 0,
      message: message ?? null, status: "new", source: "public_page",
    });
  }

  await notifyFounder("New offer received", `${name} (${email}) offered ${formatCurrency(Number(amount) || 0)} on ${vehicle ?? "a vehicle"}.`);

  return NextResponse.json({ ok: true });
}
