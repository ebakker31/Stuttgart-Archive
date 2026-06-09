import { NextRequest, NextResponse } from "next/server";
import { generateBillOfSalePdf } from "@/lib/pdf/bill-of-sale";

export const dynamic = "force-dynamic";

/** GET /api/bill-of-sale/pdf?sellerName=...&buyerName=...&year=... → downloads a PDF. */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const num = (k: string) => {
    const v = q.get(k);
    return v ? Number(v.replace(/[^\d.]/g, "")) || v : undefined;
  };

  const pdf = await generateBillOfSalePdf({
    sellerName: q.get("sellerName") || "",
    sellerAddress: q.get("sellerAddress") || "",
    buyerName: q.get("buyerName") || "",
    buyerAddress: q.get("buyerAddress") || "",
    year: q.get("year") || "",
    make: q.get("make") || "Porsche",
    model: q.get("model") || "",
    vin: q.get("vin") || "",
    mileage: num("mileage"),
    color: q.get("color") || "",
    salePrice: num("salePrice"),
    saleDate: q.get("saleDate") || "",
    location: q.get("location") || "",
    asIs: q.get("asIs") !== "false",
  });

  return new NextResponse(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="bill-of-sale.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
