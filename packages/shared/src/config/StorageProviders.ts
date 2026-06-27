export const StorageProviders = {
  MEMORY: "memory",
  POSTGRES: "postgres",
  SUPABASE: "supabase",
} as const;

export type StorageProvider =
  typeof StorageProviders[keyof typeof StorageProviders];