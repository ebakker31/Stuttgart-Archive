import { NextRequest, NextResponse } from "next/server";
import { stripeProvider } from "@/lib/payments/stripe";
import { getAppSession } from "@/lib/app-data";
import { config } from "@/lib/config";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const session = await getAppSession();

  const result = await stripeProvider.createCheckoutSession({
    organizationId: session.organizationId ?? "demo",
    userId: session.userId ?? "demo",
    email: session.email ?? undefined,
    plan: body.plan || undefined,
    product: body.product || undefined,
    vehicleId: body.vehicleId || undefined,
    successUrl: `${config.appUrl}/app/billing?success=1`,
    cancelUrl: `${config.appUrl}/app/billing?canceled=1`,
  });

  return NextResponse.json(result);
}
