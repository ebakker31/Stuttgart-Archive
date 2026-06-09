"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createVehicle, type CreateVehicleState } from "@/app/app/garage/new/actions";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OWNERSHIP_STATUSES } from "@/lib/brand";
import { Info } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" variant="accent" size="lg" disabled={pending}>{pending ? "Saving…" : "Add to garage"}</Button>;
}

export function AddVehicleForm() {
  const [state, action] = useFormState<CreateVehicleState, FormData>(createVehicle, {});

  return (
    <form action={action} className="space-y-5">
      {state.notice && (
        <div className="flex items-start gap-2 rounded-md border border-oxblood/25 bg-oxblood/5 p-3 text-sm text-oxblood">
          <Info className="mt-0.5 h-4 w-4 shrink-0" /> {state.notice}
        </div>
      )}
      {state.error && <p className="text-sm text-oxblood">{state.error}</p>}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="year" label="Year" placeholder="2018" />
        <Field name="model" label="Model" placeholder="911 Carrera S" required />
        <Field name="trim" label="Trim" placeholder="Carrera S" />
        <Field name="generation" label="Generation" placeholder="991.2" />
        <Field name="exterior_color" label="Exterior color" placeholder="GT Silver Metallic" />
        <Field name="interior_color" label="Interior color" placeholder="Black" />
        <Field name="mileage" label="Mileage" placeholder="18450" />
        <Field name="transmission" label="Transmission" placeholder="7-speed PDK" />
        <Field name="vin" label="VIN (kept private)" placeholder="WP0AB2A9…" />
        <div>
          <Label htmlFor="ownership_status">Ownership status</Label>
          <select id="ownership_status" name="ownership_status" className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background/60 px-3 text-sm">
            {OWNERSHIP_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton />
        <Button href="/app/garage" variant="ghost">Cancel</Button>
      </div>
      <p className="text-xs text-muted-foreground">New vehicles are private by default. The VIN is hidden on public pages unless you opt in.</p>
    </form>
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
