import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";

export function tryCreateAdminClient(): SupabaseClient | null {
  try {
    return createAdminClient();
  } catch {
    return null;
  }
}

