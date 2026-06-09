import { NextRequest, NextResponse } from "next/server";
import { getAppSession, getVehicle } from "@/lib/app-data";
import { demoVehicleToScope } from "@/lib/demo-scope";
import { sellerPacketAgent } from "@/lib/agents/seller-packet-agent";
import { generateSellerPacketPdf } from "@/lib/pdf/seller-packet";
import { FOOTER_DISCLAIMER } from "@/lib/brand";
import { formatMileage } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * GET /api/seller-packet/pdf?vehicle=<id|slug>
 * Generates a real, downloadable seller packet PDF from grounded data only.
 */
export async function GET(req: NextRequest) {
  const vehicleId = req.nextUrl.searchParams.get("vehicle");
  if (!vehicleId) return NextResponse.json({ error: "vehicle is required" }, { status: 400 });

  const session = await getAppSession();
  const v = await getVehicle(session, vehicleId);
  if (!v) return NextResponse.json({ error: "vehicle not found" }, { status: 404 });

  const scope = demoVehicleToScope(v, session.organizationId ?? "demo");
  const packet = await sellerPacketAgent.run(
    { scope },
    { organizationId: session.organizationId ?? "demo", userId: session.userId ?? "demo", vehicleId: v.slug, scope }
  );

  const pdf = await generateSellerPacketPdf({
    title: `${v.year} Porsche ${v.model}${v.trim ? ` ${v.trim}` : ""}`,
    subtitle: `${v.bodyStyle} · ${v.exteriorColor} over ${v.interiorColor} · ${formatMileage(v.mileage)}`,
    archiveNotes: v.archiveNotes,
    specs: [
      ["Year", String(v.year)], ["Generation", v.generation ?? "—"], ["Transmission", v.transmission],
      ["Engine", v.engine], ["Drivetrain", v.drivetrain], ["Mileage", formatMileage(v.mileage)],
      ["Title", v.titleStatus], ["Ownership", v.ownershipStatus], ["Records", `${v.service.length} entries`],
    ],
    sections: packet.output.sections,
    serviceEvents: v.service.map((s) => ({ date: s.date, summary: s.summary, vendor: s.vendor, mileage: s.mileage, cost: s.cost })),
    disclaimer: FOOTER_DISCLAIMER,
    isDemo: session.demo || v.slug.includes("-"),
  });

  const filename = `seller-packet-${v.slug}.pdf`;
  return new NextResponse(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
