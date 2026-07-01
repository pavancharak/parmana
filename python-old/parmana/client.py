"""
Parmana Python SDK Client.
"""

from .runtime import Runtime
from .verification import VerificationService


class ParmanaClient:
    """
    Primary SDK entry point.
    """

    def __init__(self) -> None:
        self.runtime = Runtime()
        self.verification = VerificationService()

    def execute(self, transaction):
        """
        Execute a BusinessTransaction.
        """
        return self.runtime.execute(transaction)

    def verify(self, trust_record):
        """
        Verify an Execution Trust Record.
        """
        return self.verification.verify(trust_record)