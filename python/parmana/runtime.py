"""
Runtime facade.

Current SDK placeholder.

Future versions will call the Parmana Runtime API.
"""

from uuid import uuid4
from datetime import datetime

from .models.receipt import Receipt


class Runtime:
    """
    Runtime service.
    """

    def execute(self, transaction):
        """
        Execute a Business Transaction.

        Placeholder implementation.
        """

        return Receipt(
            receipt_id=str(uuid4()),
            business_transaction_id=transaction.business_transaction_id,
            execution_id=None,
            trust_record_hash="pending",
            receipt_hash="pending",
            signature="pending",
            algorithm="Ed25519",
            issued_at=datetime.utcnow(),
        )