"""
Parmana Python SDK

Example 02

Verify Receipt

Demonstrates verification of a Parmana
Execution Trust Receipt.
"""

from datetime import datetime
from uuid import uuid4

from parmana import ParmanaClient

from parmana.models.receipt import Receipt


def main() -> None:
    """
    Verify a Parmana receipt.
    """

    receipt = Receipt(
        receipt_id=str(uuid4()),
        business_transaction_id=str(uuid4()),
        execution_id=str(uuid4()),
        trust_record_hash="9d6e0a0e0f4d2d6b8a1f9f3c5d7e8a9b",
        receipt_hash="b6d5d8f92dcd9dbeea21e1f9a5c91b66",
        signature="ed25519-signature",
        algorithm="Ed25519",
        issued_at=datetime.utcnow(),
    )

    client = ParmanaClient()

    #
    # Placeholder verification.
    #
    verification = client.verification.verify(receipt)

    print()

    print("===================================")
    print("Parmana Receipt Verification")
    print("===================================")

    print(f"Receipt ID          : {receipt.receipt_id}")
    print(f"Transaction ID      : {receipt.business_transaction_id}")
    print(f"Trust Record Hash   : {receipt.trust_record_hash}")

    print()

    print("Verification")

    print("----------------------------")

    print(f"Verification ID : {verification.verification_id}")
    print(f"Status          : {verification.status.value}")
    print(f"Message         : {verification.message}")
    print(f"Verified At     : {verification.verified_at}")

    print()

    print("Receipt verification completed.")

    print("===================================")


if __name__ == "__main__":
    main()