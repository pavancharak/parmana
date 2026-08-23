"""
Three fraud-simulation agents, each bounded by a signed authorization
token from an external authority (see authority_signer.py).

The key property demonstrated here: an agent cannot exceed the operation
count written into its own signed token. The enforcement isn't "the agent
promises to behave" — it's a hard check against a number that came from
outside the agent and that the agent cannot rewrite.
"""

import json
import random
import string
import time
import uuid
from pathlib import Path

import authority_signer as auth

ROOT = Path(__file__).resolve().parent.parent
TOKENS_DIR = ROOT / "tokens"

random.seed(42)

FIRST_NAMES = ["Alex", "Jordan", "Sam", "Taylor", "Morgan", "Casey", "Riley", "Jamie", "Drew", "Skyler"]
LAST_NAMES = ["Chen", "Patel", "Garcia", "Smith", "Kim", "Nguyen", "Brown", "Diaz", "Müller", "Kowalski"]
MERCHANTS = ["QuickMart", "StreamFlix", "CloudHost", "UrbanCafe", "TechBazaar", "FreshGrocer", "TravelEasy", "GameVault"]
CURRENCIES = ["USD", "EUR", "GBP", "INR", "JPY"]


class TokenLimitExceeded(Exception):
    pass


class BoundedAgent:
    """Base class: every agent must hold a signed token and cannot act
    past its max_operations. Every action is appended to an execution log
    that is written to disk for inspection."""

    def __init__(self, agent_id: str, action: str, requested_operations: int):
        self.agent_id = agent_id
        self.requested_operations = requested_operations
        # The agent ASKS for `requested_operations`; the authority decides
        # what to actually grant. Here the authority grants exactly what's
        # asked (a real deployment might grant less), but the point is the
        # grant is external and signed, not self-declared.
        self.token = auth.issue_agent_token(agent_id, action, requested_operations)
        self.executed = 0
        self.log = []

    def _check_and_count(self):
        if self.executed >= self.token["max_operations"]:
            raise TokenLimitExceeded(
                f"{self.agent_id} attempted to exceed authorized limit "
                f"of {self.token['max_operations']} operations"
            )
        self.executed += 1

    def _record(self, event: dict):
        self.log.append({"seq": self.executed, "timestamp": time.time(), **event})

    def write_log(self):
        path = TOKENS_DIR / f"{self.agent_id}_execution_log.json"
        path.write_text(
            json.dumps(
                {
                    "agent_id": self.agent_id,
                    "token_record_id": self.token["record_id"],
                    "authorized_max": self.token["max_operations"],
                    "actually_executed": self.executed,
                    "within_bounds": self.executed <= self.token["max_operations"],
                    "signature_verifies": auth.verify_record(dict(self.token), "authority"),
                    "events": self.log,
                },
                indent=2,
            )
        )


def _tx_id(prefix):
    return f"{prefix}_{uuid.uuid4().hex[:10]}"


# ---------------------------------------------------------------------------
# Agent 1: Fake Identity Maker
# ---------------------------------------------------------------------------
class FakeIdentityAgent(BoundedAgent):
    """Fabricates synthetic identities whose spending history is
    statistically shaped to resemble a real customer's, then generates a
    handful of transactions per identity. Hard to catch because each
    individual transaction looks ordinary; the tell is that the *identity
    itself* has no history before it suddenly appears."""

    def __init__(self, max_identities: int = 10):
        super().__init__("agent1_fake_identity", "generate_fake_identities", max_identities)

    def run(self, seed_profiles, tx_per_identity=(4, 8)):
        transactions = []
        for seed in seed_profiles[: self.token["max_operations"]]:
            self._check_and_count()
            fake_name = f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"
            fake_id = f"cust_fake_{uuid.uuid4().hex[:8]}"
            n_tx = random.randint(*tx_per_identity)
            base_amount = seed["avg_amount"] * random.uniform(0.85, 1.15)
            for _ in range(n_tx):
                tx = {
                    "transaction_id": _tx_id("tx"),
                    "customer_id": fake_id,
                    "customer_name": fake_name,
                    "amount": round(max(1.0, random.gauss(base_amount, base_amount * 0.15)), 2),
                    "currency": seed.get("currency", "USD"),
                    "merchant": random.choice(MERCHANTS),
                    "hour_of_day": seed.get("typical_hour", random.randint(8, 22)),
                    "seconds_since_prev_tx": round(random.uniform(3600, 86400), 1),
                    "location_mismatch_km": round(random.uniform(0, 15), 1),
                    "pattern_similarity": round(random.uniform(0.75, 0.97), 3),
                    "ai_generated_signal": round(random.uniform(0.10, 0.45), 3),
                    "is_fraud": 1,
                    "attack_type": "fake_identity",
                    "generated_by": self.agent_id,
                    "token_record_id": self.token["record_id"],
                }
                transactions.append(tx)
            self._record({"event": "fake_identity_created", "fake_customer_id": fake_id, "tx_generated": n_tx})
        self.write_log()
        return transactions


# ---------------------------------------------------------------------------
# Agent 2: Spending Pattern Copier
# ---------------------------------------------------------------------------
class PatternCopierAgent(BoundedAgent):
    """Given a real (stolen) transaction history, replays the same
    amount/timing/merchant *shape* at high velocity — the classic
    card-testing-then-draining pattern. Individually each transaction can
    look normal; the velocity and total volume are the tell."""

    def __init__(self, max_transactions: int = 1000):
        super().__init__("agent2_pattern_copier", "copy_spending_pattern", max_transactions)

    def run(self, stolen_card_histories, target_count: int):
        target_count = min(target_count, self.token["max_operations"])
        transactions = []
        history_idx = 0
        while len(transactions) < target_count:
            history = stolen_card_histories[history_idx % len(stolen_card_histories)]
            history_idx += 1
            self._check_and_count()
            amount = round(max(1.0, random.gauss(history["avg_amount"], history["avg_amount"] * 0.2)), 2)
            # ~35% of the campaign runs "low and slow" to evade velocity
            # checks, spacing transactions out like a genuine customer would.
            evasive = random.random() < 0.35
            tx = {
                "transaction_id": _tx_id("tx"),
                "customer_id": history["customer_id"],
                "customer_name": history.get("customer_name", "Stolen Card Holder"),
                "amount": amount,
                "currency": history.get("currency", "USD"),
                "merchant": random.choice(MERCHANTS),
                "hour_of_day": random.randint(0, 23),
                "seconds_since_prev_tx": round(random.uniform(1800, 25000), 1) if evasive else round(random.uniform(0.5, 45), 2),
                "location_mismatch_km": round(random.uniform(5, 60), 1) if random.random() < 0.7 else round(random.uniform(300, 3000), 1),
                "pattern_similarity": round(random.uniform(0.65, 0.94), 3),
                "ai_generated_signal": round(random.uniform(0.20, 0.55), 3),
                "is_fraud": 1,
                "attack_type": "pattern_copy",
                "generated_by": self.agent_id,
                "token_record_id": self.token["record_id"],
            }
            transactions.append(tx)
            self._record({"event": "pattern_tx_generated", "source_customer": history["customer_id"]})
        self.write_log()
        return transactions


# ---------------------------------------------------------------------------
# Agent 3: Form Breaker
# ---------------------------------------------------------------------------
class FormBreakerAgent(BoundedAgent):
    """Throws malformed / adversarial input at a payment form to probe for
    backend weaknesses — injection payloads, boundary amounts, currency
    mismatches, oversized fields. Loud and easy to catch individually, but
    used to find the one gap that lets later attacks through quietly."""

    PAYLOADS = [
        "' OR '1'='1", "<script>alert(1)</script>", "../../etc/passwd",
        "0" * 40, "-999999.99", "9" * 20 + ".00", "NaN", "Infinity",
        "'; DROP TABLE transactions;--", "‮99.9‮", "0x41414141",
    ]

    def __init__(self, max_attempts: int = 1000):
        super().__init__("agent3_form_breaker", "probe_payment_form", max_attempts)

    def run(self, form_fields, target_count: int):
        target_count = min(target_count, self.token["max_operations"])
        transactions = []
        for _ in range(target_count):
            self._check_and_count()
            field = random.choice(form_fields)
            payload = random.choice(self.PAYLOADS)
            amount_field_hit = field == "amount"
            try:
                amount = abs(float(payload)) if amount_field_hit and payload.replace(".", "", 1).lstrip("-").isdigit() else round(random.uniform(1, 500), 2)
            except ValueError:
                amount = round(random.uniform(1, 500), 2)
            tx = {
                "transaction_id": _tx_id("tx"),
                "customer_id": f"cust_probe_{uuid.uuid4().hex[:8]}",
                "customer_name": "Form Probe",
                "amount": amount,
                "currency": random.choice(CURRENCIES + ["XXX", "???"]),
                "merchant": random.choice(MERCHANTS),
                "hour_of_day": random.randint(0, 23),
                "seconds_since_prev_tx": round(random.uniform(0.1, 5), 2),
                "location_mismatch_km": round(random.uniform(0, 8000), 1),
                "pattern_similarity": round(random.uniform(0.05, 0.4), 3),
                "ai_generated_signal": round(random.uniform(0.6, 0.95), 3),
                "is_fraud": 1,
                "attack_type": "form_break",
                "probed_field": field,
                "payload_sample": payload,
                "generated_by": self.agent_id,
                "token_record_id": self.token["record_id"],
            }
            transactions.append(tx)
            self._record({"event": "malformed_attempt", "field": field})
        self.write_log()
        return transactions


def make_seed_profiles(good_transactions, n=10):
    by_customer = {}
    for tx in good_transactions:
        by_customer.setdefault(tx["customer_id"], []).append(tx)
    customers = list(by_customer.items())[:n]
    seeds = []
    for cust_id, txs in customers:
        amounts = [t["amount"] for t in txs]
        seeds.append(
            {
                "customer_id": cust_id,
                "avg_amount": sum(amounts) / len(amounts),
                "currency": txs[0]["currency"],
                "typical_hour": txs[0]["hour_of_day"],
            }
        )
    return seeds


def make_stolen_card_histories(good_transactions, n=25):
    by_customer = {}
    for tx in good_transactions:
        by_customer.setdefault(tx["customer_id"], []).append(tx)
    customers = list(by_customer.items())[:n]
    histories = []
    for cust_id, txs in customers:
        amounts = [t["amount"] for t in txs]
        histories.append(
            {
                "customer_id": cust_id,
                "customer_name": txs[0].get("customer_name", "Customer"),
                "avg_amount": sum(amounts) / len(amounts),
                "currency": txs[0]["currency"],
            }
        )
    return histories
