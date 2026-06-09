import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { config } from "@/lib/config";

/**
 * Server-side Supabase clients.
 *
 * - getServerSupabase(): RLS-scoped client bound to the user's auth cookie.
 * - getAdminSupabase(): service-role client for trusted server tasks
 *   (webhooks, entitlement grants, seed). NEVER import into client components.
 *
 * Both return `null` when Supabase is not configured, so callers can degrade
 * to demo/mock data instead of crashing.
 */

export function getServerSupabase(): SupabaseClient | null {
  if (!config.supabase.enabled) return null;
  const cookieStore = cookies();
  return createServerClient(config.supabase.url, config.supabase.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options as any));
        } catch {
          // Called from a Server Component — safe to ignore; middleware refreshes.
        }
      },
    },
  });
}

export function getAdminSupabase(): SupabaseClient | null {
  if (!config.supabase.url || !config.supabase.serviceKey) return null;
  return createClient(config.supabase.url, config.supabase.serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
