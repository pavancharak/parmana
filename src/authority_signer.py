"""
External Authority — signs decisions and authorization tokens.

This module simulates an authority that lives OUTSIDE the fraud agents and
OUTSIDE the fraud detector. Neither the agents nor the detector hold the
private keys used here. They can only ask this module to sign something;
they cannot forge a signature themselves, and anyone (including a judge)
can verify a signature later using only the matching public key file in
tokens/.

Two independent keypairs are used on purpose, to keep two different kinds
of authority separable:

  - AUTHORITY key: issues agent authorization tokens, and signs the
    detector's block/flag/allow decisions.
  - REVIEWER key: signs human override decisions. A different key means an
    override can never be mistaken for (or forged as) an authority
    decision, and vice versa.
"""

import json
import time
import uuid
from pathlib import Path

from cryptography.hazmat.primitives.asymmetric.ed25519 import (
    Ed25519PrivateKey,
    Ed25519PublicKey,
)
from cryptography.hazmat.primitives import serialization
from cryptography.exceptions import InvalidSignature

ROOT = Path(__file__).resolve().parent.parent
TOKENS_DIR = ROOT / "tokens"
KEYS_DIR = TOKENS_DIR / "keys"
KEYS_DIR.mkdir(parents=True, exist_ok=True)
TOKENS_DIR.mkdir(parents=True, exist_ok=True)


def _canonical(obj: dict) -> bytes:
    """Deterministic byte encoding so signing/verification agree exactly."""
    return json.dumps(obj, sort_keys=True, separators=(",", ":")).encode("utf-8")


def _load_or_create_keypair(name: str):
    priv_path = KEYS_DIR / f"{name}_private.pem"
    pub_path = TOKENS_DIR / f"{name}_public_key.pem"

    if priv_path.exists():
        private_key = serialization.load_pem_private_key(priv_path.read_bytes(), password=None)
    else:
        private_key = Ed25519PrivateKey.generate()
        priv_path.write_bytes(
            private_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.PKCS8,
                encryption_algorithm=serialization.NoEncryption(),
            )
        )
        public_key = private_key.public_key()
        pub_path.write_bytes(
            public_key.public_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PublicFormat.SubjectPublicKeyInfo,
            )
        )

    if not pub_path.exists():
        public_key = private_key.public_key()
        pub_path.write_bytes(
            public_key.public_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PublicFormat.SubjectPublicKeyInfo,
            )
        )

    return private_key


class Signer:
    """A single external-authority identity (its own keypair)."""

    def __init__(self, name: str):
        self.name = name
        self._private_key = _load_or_create_keypair(name)

    def sign_record(self, payload: dict) -> dict:
        """Return payload + signature, envelope-style. Payload is untouched
        (all fields the judge cares about are visible in plaintext); the
        signature only proves *this signer* produced it and it wasn't
        altered afterward."""
        body = dict(payload)
        body.setdefault("record_id", str(uuid.uuid4()))
        body.setdefault("signed_at", time.time())
        body["signer"] = self.name
        signature = self._private_key.sign(_canonical(body))
        return {**body, "signature": signature.hex()}


def verify_record(record: dict, signer_name: str) -> bool:
    """Verify a signed record using ONLY the public key file on disk —
    exactly what a judge would do, with no access to any private key."""
    pub_path = TOKENS_DIR / f"{signer_name}_public_key.pem"
    if not pub_path.exists():
        return False
    public_key: Ed25519PublicKey = serialization.load_pem_public_key(pub_path.read_bytes())

    record = dict(record)
    signature_hex = record.pop("signature", None)
    if signature_hex is None:
        return False
    try:
        public_key.verify(bytes.fromhex(signature_hex), _canonical(record))
        return True
    except InvalidSignature:
        return False


# The two authority identities used throughout this project.
AUTHORITY = Signer("authority")
REVIEWER = Signer("reviewer")


def issue_agent_token(agent_id: str, action: str, max_operations: int, ttl_seconds: int = 3600) -> dict:
    """AUTHORITY issues a signed, bounded permission token to an agent.
    The agent cannot raise max_operations after the fact — any attempt to
    claim a higher number is directly contradicted by this signed file."""
    now = time.time()
    token = AUTHORITY.sign_record(
        {
            "token_type": "agent_authorization",
            "agent_id": agent_id,
            "action": action,
            "max_operations": max_operations,
            "issued_at": now,
            "expires_at": now + ttl_seconds,
        }
    )
    path = TOKENS_DIR / f"{agent_id}_auth_token.json"
    path.write_text(json.dumps(token, indent=2))
    return token


def sign_block_decision(transaction_id: str, score: float, decision: str, reasons: list) -> dict:
    """AUTHORITY signs the detector's block/flag/allow decision. The
    detector proposes; only the authority's signature makes it official."""
    return AUTHORITY.sign_record(
        {
            "record_type": "block_decision",
            "transaction_id": transaction_id,
            "fraud_score": round(float(score), 4),
            "decision": decision,
            "reasons": reasons,
        }
    )


def sign_mandate_decision(mandate_result: dict) -> dict:
    """AUTHORITY signs the Mandate Engine's deterministic policy decision.
    Same pattern as sign_block_decision: the policy engine proposes, only
    the authority's signature makes it official."""
    return AUTHORITY.sign_record(dict(mandate_result))


def sign_combined_decision(transaction_id: str, final_decision: str, detection_decision: str, mandate_decision: str, reason: str) -> dict:
    """AUTHORITY signs the final EXECUTE/BLOCK/NO_EXECUTION verdict. This
    is the 'authority signature' half of the governance invariant:
    execution_gate refuses to execute anything without this exact signed
    record verifying."""
    return AUTHORITY.sign_record(
        {
            "record_type": "combined_decision",
            "transaction_id": transaction_id,
            "final_decision": final_decision,
            "detection_decision": detection_decision,
            "mandate_decision": mandate_decision,
            "reason": reason,
        }
    )


def sign_override(transaction_id: str, original_decision: str, new_decision: str, reviewer_name: str, justification: str) -> dict:
    """REVIEWER (a human, not the detector) signs an override. Uses a
    DIFFERENT key than AUTHORITY, so an override can never be confused
    with, or forged as, an authority block decision."""
    return REVIEWER.sign_record(
        {
            "record_type": "override",
            "transaction_id": transaction_id,
            "original_decision": original_decision,
            "new_decision": new_decision,
            "reviewer_name": reviewer_name,
            "justification": justification,
        }
    )
