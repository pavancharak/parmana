import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export class SupabaseClientFactory {
  static create(): SupabaseClient {
    const url = process.env.SUPABASE_URL!;
    const key =
      process.env.SUPABASE_SERVICE_ROLE_KEY ??
      process.env.SUPABASE_ANON_KEY!;

    return createClient(url, key);
  }
}