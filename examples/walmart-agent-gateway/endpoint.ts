/**
 * A connector endpoint that places an order through a vendor run agent
 * gateway, Walmart's in this example, only when Parmana has released it.
 *
 * Registered for `walmart:place-order` (docs/site/guides/
 * connect-any-external-system.mdx). Parmana POSTs each approved request
 * here as a signed release. The endpoint holds the Walmart account link;
 * the agent never does, so it cannot reach Walmart's checkout around
 * Parmana.
 *
 * For each release it:
 *
 *   1. verifies the release (signature, audience, expiry);
 *   2. answers a repeat with its first answer, and acts on nothing whose
 *      earlier attempt has an unknown outcome;
 *   3. checks the parameters: cartId, items, maxTotal;
 *   4. asks the gateway for a quote, and refuses if the total is above
 *      the approved maxTotal (the price can move after approval);
 *   5. places the order with the businessTransactionId as idempotency
 *      key. If the answer is lost, the outcome is unknown: it answers 502,
 *      keeps the attempt marked, and never places it again on its own.
 *
 * Parmana records anything but 200 as an unknown outcome
 * (EXECUTION_OUTCOME_UNKNOWN), to be resolved by a person, which is what
 * step 5 needs.
 */

import { verifyParmanaRelease } from "@parmana/sdk";

import type { AgentGateway, CartItem } from "./gateway.js";

export interface EndpointAnswer {
  readonly status: number;
  readonly body: Record<string, unknown>;
}

/**
 * Where the endpoint keeps state, by businessTransactionId. Use a
 * database in production, so a restart cannot place an order twice.
 */
export interface OrderStore {
  /** Final answers: placed, or refused without acting. */
  readonly answers: Map<string, Record<string, unknown>>;
  /** Attempts whose outcome is not known. */
  readonly pending: Set<string>;
}

export interface WalmartOrderEndpointOptions {
  readonly publicKeys: Readonly<Record<string, string>>;
  readonly audience: string;
  readonly gateway: AgentGateway;
  readonly store?: OrderStore;
  readonly now?: () => Date;
}

const MAX_ITEMS = 50;

function parseItems(value: unknown): CartItem[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_ITEMS) {
    return null;
  }

  const items: CartItem[] = [];

  for (const entry of value) {
    if (typeof entry !== "object" || entry === null) return null;
    const { itemId, quantity } = entry as Record<string, unknown>;
    if (typeof itemId !== "string" || itemId.length === 0) return null;
    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 100
    ) {
      return null;
    }
    items.push({ itemId, quantity });
  }

  return items;
}

export function createWalmartOrderEndpoint(
  options: WalmartOrderEndpointOptions,
) {
  const store: OrderStore = options.store ?? {
    answers: new Map(),
    pending: new Set(),
  };

  return async (body: unknown): Promise<EndpointAnswer> => {
    const verification = await verifyParmanaRelease(body, {
      publicKeys: options.publicKeys,
      audience: options.audience,
      isAlreadyExecuted: (id) => store.answers.has(id) || store.pending.has(id),
      ...(options.now !== undefined ? { now: options.now() } : {}),
    });

    if (!verification.valid) {
      return { status: 401, body: { errors: verification.errors } };
    }

    const { release } = verification;
    const id = release.businessTransactionId;

    const first = store.answers.get(id);

    if (first !== undefined) {
      return { status: 200, body: first };
    }

    if (store.pending.has(id)) {
      return {
        status: 409,
        body: {
          errors: [
            "An earlier attempt for this transaction has an unknown outcome. Check the order in Walmart and resolve the intent; the endpoint will not place it again.",
          ],
        },
      };
    }

    const refuse = (reason: string, extra: Record<string, unknown> = {}) => {
      const answer = {
        businessTransactionId: id,
        capability: release.capability,
        success: false,
        result: { reason, ...extra },
      };
      store.answers.set(id, answer);
      return { status: 200, body: answer };
    };

    if (release.capability !== "walmart:place-order") {
      return refuse(
        `This endpoint places Walmart orders only, not ${release.capability}.`,
      );
    }

    const { cartId, items: rawItems, maxTotal } = release.parameters;
    const items = parseItems(rawItems);

    if (
      typeof cartId !== "string" ||
      cartId.length === 0 ||
      items === null ||
      typeof maxTotal !== "number" ||
      !(maxTotal > 0)
    ) {
      return refuse(
        "The release does not name a cartId, between 1 and 50 items with whole quantities, and a maxTotal above 0.",
      );
    }

    let quote;

    try {
      quote = await options.gateway.quote(items);
    } catch {
      // Nothing was placed, so this is a known refusal, not an unknown.
      return refuse("The gateway could not quote these items.");
    }

    if (quote.total > maxTotal) {
      return refuse("The quoted total is above the approved maximum.", {
        quotedTotal: quote.total,
        approvedMaxTotal: maxTotal,
        currency: quote.currency,
      });
    }

    store.pending.add(id);

    let order;

    try {
      order = await options.gateway.placeOrder({
        quoteId: quote.quoteId,
        idempotencyKey: id,
      });
    } catch {
      // Stays pending: the order may exist. Never retried from here.
      return {
        status: 502,
        body: {
          errors: [
            "The gateway did not answer; the order may or may not have been placed. Check it in Walmart before doing anything else.",
          ],
        },
      };
    }

    store.pending.delete(id);

    const answer = {
      businessTransactionId: id,
      capability: release.capability,
      success: true,
      result: {
        orderId: order.orderId,
        total: order.total,
        currency: quote.currency,
        cartId,
      },
      executedAt: new Date().toISOString(),
    };

    store.answers.set(id, answer);

    return { status: 200, body: answer };
  };
}
