import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase/server";
import { notifyFounder, sendEmail } from "@/lib/email/service";

/**
 * Founding-members waitlist capture. Stores the signup (when Supabase is
 * configured) and sends a confirmation + founder notification. No marketing
 * email is sent without this explicit opt-in.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim();
  const interest = String(body.interest || "").trim();

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  const admin = getAdminSupabase();
  if (admin) {
    await admin.from("leads").insert({
      email, name: null, message: interest ? `Interest: ${interest}` : null,
      consent: true, source: "waitlist", status: "new",
    });
  }

  await notifyFounder("New founding-member signup", `${email}${interest ? ` — ${interest}` : ""}`);
  // Opt-in confirmation (transactional).
  await sendEmail({ to: email, template: "welcome", data: { ctaUrl: process.env.NEXT_PUBLIC_APP_URL || "" } });

  return NextResponse.json({ ok: true });
}
