import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Creates configured Supabase clients.
 */
export class SupabaseClientFactory {
  static create(): SupabaseClient {
    const url = process.env.SUPABASE_URL;

    const key =
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;

    if (!url) {
      throw new Error("SUPABASE_URL is not configured.");
    }

    if (!key) {
      throw new Error("Supabase key is not configured.");
    }

    return createClient(url, key);
  }
}
