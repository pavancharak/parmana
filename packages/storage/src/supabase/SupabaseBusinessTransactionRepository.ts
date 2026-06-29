import type { BusinessTransactionRepository } from "@parmana/shared";

export class SupabaseBusinessTransactionRepository implements BusinessTransactionRepository {
  constructor(private client: any) {}

  async create(input: any) {
    return input;
  }

  async exists(businessTransactionId: string) {
    return false;
  }

  async list() {
    return [];
  }

  async findById(businessTransactionId: string) {
    return null;
  }
}