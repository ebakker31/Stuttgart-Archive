import type { Metadata } from "next";
import { ArchiveLabel } from "@/components/ui/misc";
import { AddVehicleForm } from "@/components/app/add-vehicle-form";

export const metadata: Metadata = { title: "Add a vehicle" };

export default function NewVehiclePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <ArchiveLabel>New archive file</ArchiveLabel>
      <h1 className="mt-2 display text-4xl">Add a Porsche.</h1>
      <p className="mt-2 text-muted-foreground">Start with the basics — you can add documents, photos, and history next.</p>
      <div className="mt-8"><AddVehicleForm /></div>
    </div>
  );
}
