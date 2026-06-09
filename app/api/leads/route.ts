import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase/server";
import { sendEmail, notifyFounder } from "@/lib/email/service";

/**
 * Buyer lead capture. Stores the lead (when Supabase is configured) and sends a
 * transactional notification to the seller. NO automated reply is ever sent to
 * the buyer on the seller's behalf.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { name, email, message, vehicle, publicPageId, consent } = body;

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  const admin = getAdminSupabase();
  if (admin) {
    await admin.from("leads").insert({
      name, email, message: message ?? null, consent: Boolean(consent),
      public_page_id: publicPageId ?? null, source: "public_page", status: "new",
    });
  }

  // Transactional notification (mock-safe).
  await notifyFounder("New buyer lead", `${name} (${email}) inquired about ${vehicle ?? "a vehicle"}.`);

  return NextResponse.json({ ok: true });
}
