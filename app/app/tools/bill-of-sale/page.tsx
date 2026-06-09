import type { Metadata } from "next";
import { ArchiveLabel } from "@/components/ui/misc";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Bill of Sale generator" };

/** Server-rendered form that GETs the PDF route (browser downloads the result). */
export default function BillOfSalePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <ArchiveLabel>Seller tools</ArchiveLabel>
      <h1 className="mt-2 display text-4xl">Bill of Sale generator.</h1>
      <p className="mt-2 text-muted-foreground">Fill in the details and download a clean, signable bill of sale.</p>

      <Card className="mt-8">
        <CardContent className="p-6">
          <form action="/api/bill-of-sale/pdf" method="get" target="_blank" className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="sellerName" label="Seller name" required />
              <Field name="buyerName" label="Buyer name" required />
              <Field name="sellerAddress" label="Seller address" />
              <Field name="buyerAddress" label="Buyer address" />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field name="year" label="Year" placeholder="1991" />
              <Field name="model" label="Model" placeholder="911 Carrera" />
              <Field name="color" label="Color" placeholder="Grand Prix White" />
              <Field name="vin" label="VIN" />
              <Field name="mileage" label="Mileage" placeholder="68400" />
              <Field name="salePrice" label="Sale price ($)" placeholder="74500" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="saleDate" label="Date of sale" placeholder="YYYY-MM-DD" />
              <Field name="location" label="Location (city, state)" />
            </div>
            <Button type="submit" variant="accent" size="lg">Download bill of sale (PDF)</Button>
            <p className="text-xs text-muted-foreground">
              Convenience template only — Stuttgart Archive is not a party to the sale and this is not legal
              advice. Confirm your state's requirements before completing a sale.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ name, label, placeholder, required }: { name: string; label: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <Label htmlFor={name}>{label}{required && <span className="text-oxblood"> *</span>}</Label>
      <Input id={name} name={name} placeholder={placeholder} required={required} className="mt-1.5" />
    </div>
  );
}
