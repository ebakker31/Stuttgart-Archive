"use server";

import { redirect } from "next/navigation";
import { getAppSession } from "@/lib/app-data";
import { getServerSupabase } from "@/lib/supabase/server";
import { resolveEntitlements, checkVehicleLimit } from "@/lib/payments/entitlements";
import { slugify } from "@/lib/utils";

export interface CreateVehicleState {
  error?: string;
  notice?: string;
}

/**
 * Server action to create a vehicle. Persists to Supabase when configured and
 * within the org's plan limit; in demo mode it explains how to enable real data.
 */
export async function createVehicle(_prev: CreateVehicleState, formData: FormData): Promise<CreateVehicleState> {
  const session = await getAppSession();

  if (session.demo || !session.organizationId) {
    return {
      notice:
        "You're in demo mode. Connect Supabase and sign in to save your own vehicles — see the README for setup.",
    };
  }

  const db = getServerSupabase();
  if (!db) return { notice: "Data storage isn't configured yet." };

  // Enforce plan vehicle limit.
  const ents = await resolveEntitlements(session.organizationId);
  const limit = await checkVehicleLimit(session.organizationId, ents);
  if (!limit.allowed) {
    return { error: `${limit.reason} Upgrade your plan to add more vehicles.` };
  }

  const year = parseInt(String(formData.get("year") || ""), 10);
  const model = String(formData.get("model") || "").trim();
  if (!model) return { error: "Model is required." };

  const slug = `${slugify(`${year || ""}-${model}`)}-${Math.random().toString(36).slice(2, 7)}`;

  const { data, error } = await db
    .from("vehicles")
    .insert({
      organization_id: session.organizationId,
      owner_user_id: session.userId,
      year: Number.isFinite(year) ? year : null,
      make: "Porsche",
      model,
      trim: String(formData.get("trim") || "") || null,
      generation: String(formData.get("generation") || "") || null,
      exterior_color: String(formData.get("exterior_color") || "") || null,
      interior_color: String(formData.get("interior_color") || "") || null,
      mileage: parseInt(String(formData.get("mileage") || ""), 10) || null,
      transmission: String(formData.get("transmission") || "") || null,
      vin_encrypted_or_private: String(formData.get("vin") || "") || null,
      vin_public_mode: "hidden",
      ownership_status: String(formData.get("ownership_status") || "Own"),
      privacy_status: "private",
      public_slug: slug,
      is_demo: false,
    })
    .select("id")
    .single();

  if (error || !data) return { error: error?.message || "Could not create the vehicle." };

  redirect(`/app/vehicles/${data.id}`);
}
