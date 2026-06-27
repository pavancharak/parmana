import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

/**
 * Creates the configured Supabase client.
 */
export class SupabaseClientFactory {

  static create(): SupabaseClient {

    const url =
      process.env.SUPABASE_URL;

    const key =
      process.env.SUPABASE_SERVICE_ROLE_KEY ??
      process.env.SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error(
        "Supabase configuration is missing."
      );
    }

    return createClient(
      url,
      key
    );

  }

}