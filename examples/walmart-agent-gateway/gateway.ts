/**
 * What the connector endpoint needs from a vendor run agent gateway, and
 * a mock of it.
 *
 * Walmart's Agent Gateway is an MCP server in beta. Its tool names and
 * schemas are not public, so this file does not guess them. It names the
 * two operations the endpoint relies on, quote and place order, and the
 * guarantees it needs from each. A real client is an MCP client that maps
 * these onto Walmart's tools once they are known; nothing else in the
 * endpoint changes.
 */

export interface CartItem {
  readonly itemId: string;
  readonly quantity: number;
}

export interface Quote {
  readonly quoteId: string;
  readonly total: number;
  readonly currency: string;
}

export interface PlacedOrder {
  readonly orderId: string;
  readonly total: number;
}

export interface AgentGateway {
  /**
   * Prices the items now. Places nothing.
   */
  quote(items: readonly CartItem[]): Promise<Quote>;

  /**
   * Places the order at the quoted price. `idempotencyKey` must make a
   * repeat return the first order, never a second one. Whether Walmart's
   * gateway accepts such a key is one of the open questions in README.md.
   */
  placeOrder(input: {
    readonly quoteId: string;
    readonly idempotencyKey: string;
  }): Promise<PlacedOrder>;
}

/**
 * An in-memory stand in for the vendor's gateway, for tests and local
 * runs. Prices are fixed per item; `priceIncrease` and `failNextPlace`
 * simulate a price change after approval and a lost answer.
 */
export class MockAgentGateway implements AgentGateway {
  readonly orders = new Map<string, PlacedOrder>();
  priceIncrease = 0;
  failNextPlace: "timeout" | null = null;

  private readonly quotes = new Map<string, number>();
  private nextQuote = 1;

  constructor(private readonly prices: Readonly<Record<string, number>>) {}

  async quote(items: readonly CartItem[]): Promise<Quote> {
    let total = 0;

    for (const item of items) {
      const price = this.prices[item.itemId];

      if (price === undefined) {
        throw new Error(`Unknown item ${item.itemId}.`);
      }

      total += price * item.quantity;
    }

    total = Math.round((total + this.priceIncrease) * 100) / 100;
    const quoteId = `Q-${this.nextQuote++}`;
    this.quotes.set(quoteId, total);

    return { quoteId, total, currency: "USD" };
  }

  async placeOrder(input: {
    readonly quoteId: string;
    readonly idempotencyKey: string;
  }): Promise<PlacedOrder> {
    const existing = this.orders.get(input.idempotencyKey);

    if (existing !== undefined) {
      return existing;
    }

    const total = this.quotes.get(input.quoteId);

    if (total === undefined) {
      throw new Error(`Unknown quote ${input.quoteId}.`);
    }

    const order = { orderId: `WM-${this.orders.size + 1}`, total };
    this.orders.set(input.idempotencyKey, order);

    if (this.failNextPlace === "timeout") {
      // The order exists, but the answer is lost on the way back.
      this.failNextPlace = null;
      throw new Error("timeout");
    }

    return order;
  }
}
