# Example: orders through Walmart's Agent Gateway, under Parmana

An example connector that lets an agent place an order through a vendor run agent gateway, Walmart's, only when
Parmana has released it. It is built on the external connector path (ADR-0013, the
[Connect any external system](../../docs/site/guides/connect-any-external-system.mdx) guide), so Parmana's code does
not change.

**Status: example, tested against a mock only.** Walmart's real gateway is not called. Its tool names and schemas are
not public yet, and calling it needs access to Walmart's beta. Nothing here is claimed in `docs/CLAIMS.md`.

## What is known about Walmart's gateway

From Walmart's announcement on 21 October 2026 and press coverage (sources below). We could not open Walmart's own
pages from the authoring environment, so check them.

- An MCP server, in beta "for companies and developers". Approved agents search Walmart and Sam's Club and place
  orders.
- The first time an agent shops, Walmart creates an Agent Profile for it; the customer links it by signing into their
  Walmart account. Agent Profiles were announced for November 2026.
- By default the customer approves each order. Walmart may ask for an extra approval even within a spending limit.
- Agents never see card data and cannot add or change payment methods. They may not act beyond the shopper's intent,
  and agents that break the terms are blocked. The beta page reportedly lists rate limits and category restrictions.

## How the example works

```
agent -> POST /execute -> Parmana -> signed release -> this endpoint -> quote, place order -> Walmart Agent Gateway
```

Parmana applies the policy and checks the signed approval; the endpoint holds the Walmart account link.

1. The agent asks Parmana for `walmart:place-order` with `cartId`, `items` and `maxTotal`.
2. `policy.json` (`walmart-purchase` 1.0.0) approves only with a person's signed approval for that `cartId`, covering
   that `maxTotal`, and refuses any order above 500.
3. Parmana releases the approved request to the endpoint as a signed release.
4. `endpoint.ts` verifies the release, asks the gateway for a quote, refuses if the quoted total is above the approved
   `maxTotal`, and otherwise places the order with the `businessTransactionId` as the idempotency key.

The endpoint, not the agent, holds the Walmart account link. An agent that held it could check out at Walmart
directly and skip Parmana.

Only ordering goes through Parmana. Parmana requires a person's approval for every action, so searching the catalogue
through it would make every lookup wait for a person; searches stay outside it.

## What the endpoint guards against

| Case                                           | What the endpoint does                                                           | Test                                |
| ---------------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------- |
| An approved order within the maximum           | Places it once and answers with the order id                                     | places the order once               |
| Parmana sends the same release again           | Answers with the first answer; places nothing more                               | answers a repeated release          |
| The price rose after approval                  | Refuses with the quoted and approved totals; places nothing                      | refuses when the price rose         |
| The gateway's answer is lost (timeout)         | Answers 502 (Parmana records an unknown outcome) and refuses any resend with 409 | answers 502 when the answer is lost |
| Malformed `items` or `maxTotal`                | Refuses without calling the gateway                                              | refuses malformed parameters        |
| A release for another capability, or a forgery | Refuses; places nothing                                                          | another capability; cannot verify   |
| A release made for another endpoint            | Refuses                                                                          | made for another endpoint           |

The releases in the tests are signed by the real server code (`GatewayExternalAdapter`), as
`scripts/generate-external-release-fixture.ts` does. Run them with:

```bash
npm run build
npx vitest run examples/walmart-agent-gateway
```

## Files

| File                                  | Purpose                                                                                        |
| ------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `policy.json`                         | `walmart-purchase` 1.0.0. Passes `PolicyValidator` (tested).                                   |
| `endpoint.ts`                         | The endpoint logic, independent of any HTTP framework: give it the body, send what it returns. |
| `gateway.ts`                          | The two operations the endpoint needs from the vendor (quote, place order), and a mock.        |
| `test/walmart-order-endpoint.test.ts` | The cases above.                                                                               |

## Open questions only Walmart can answer

These decide whether and how `gateway.ts` gets a real client.

1. **Access.** Admission to the beta, for the account that will own the Agent Profile.
2. **Tools.** The MCP tool names and schemas. In particular, whether there is a quote step before an order is placed;
   without one, the endpoint cannot refuse a price above the approved maximum before ordering.
3. **Idempotency.** Whether placing an order accepts a key that makes a repeat return the first order. Without one, a
   lost answer can only be resolved by a person checking the account.
4. **Sign in.** How the account link works for a server side client, and how long it lasts.
5. **Who may connect.** Whether a company's own server side agent is allowed, or only consumer assistants.
6. **Terms and limits.** The full agent terms, rate limits and category restrictions, and how the endpoint must
   identify itself as an agent.

## Two approvals

With Walmart's default settings an order needs two approvals: Parmana's signed approval first, then the customer's
approval in Walmart. To rely on Parmana's alone, set a spending limit on the Agent Profile at or above the policy's
500, so Walmart's own approval is not asked within it. Walmart says it may still ask.

## Sources

- [Walmart: Making It Possible for Agents to Shop on Behalf of Customers](https://corporate.walmart.com/news/2026/10/Making-It-Possible-for-Agents-to-Shop-on-Behalf-of-Customers)
- [TechCrunch: While Amazon blocks AI agents, Walmart rolls out the welcome mat](https://techcrunch.com/2026/10/21/while-amazon-blocks-ai-agents-walmart-rolls-out-the-welcome-mat/)
- [PYMNTS: Walmart Opens Doors for AI Agents That Obey Strict Rules](https://www.pymnts.com/news/retail/2026/walmart-opens-doors-for-ai-agents-that-obey-strict-rules/)
- [Unite.AI: Walmart Introduces Agent Profiles, Gateway for AI Shopping Agents](https://www.unite.ai/walmart-introduces-agent-profiles-gateway-for-ai-shopping-agents/)
- Blog: [Vendor run agent gateways and Parmana: what each answers](https://blog.parmanasystems.com/2026/10/22/vendor-run-agent-gateways-compared/)
