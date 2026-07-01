"""
Parmana Client.

Main entry point for the Parmana Python SDK.
"""

from __future__ import annotations

from parmana.api.execution_api import ExecutionApi
from parmana.api.policy_api import PolicyApi
from parmana.api.receipt_api import ReceiptApi
from parmana.api.replay_api import ReplayApi
from parmana.api.transaction_api import TransactionApi
from parmana.api.trust_record_api import TrustRecordApi
from parmana.api.verification_api import VerificationApi

from parmana.transport.http_transport import HttpTransport
from parmana.version import __version__


class ParmanaClient:
    """
    Parmana SDK Client.

    Parmana ensures AI executes only policy-compliant actions.

    Example
    -------
    >>> client = ParmanaClient(
    ...     endpoint="http://localhost:3000",
    ... )

    >>> trust_record = client.execution.execute(transaction)

    >>> verification = client.verification.verify(
    ...     transaction.business_transaction_id,
    ... )
    """

    DEFAULT_TIMEOUT = 30

    def __init__(
        self,
        *,
        endpoint: str,
        timeout: int = DEFAULT_TIMEOUT,
        debug: bool = False,
    ) -> None:
        """
        Create a Parmana SDK client.

        Parameters
        ----------
        endpoint:
            Base URL of the Parmana Runtime.

        timeout:
            HTTP timeout in seconds.

        debug:
            Enable request/response logging.
        """

        self._transport = HttpTransport(
            endpoint=endpoint,
            timeout=timeout,
            debug=debug,
        )

        #
        # APIs
        #

        self.execution = ExecutionApi(
            self._transport,
        )

        self.verification = VerificationApi(
            self._transport,
        )

        self.replay = ReplayApi(
            self._transport,
        )

        self.receipt = ReceiptApi(
            self._transport,
        )

        self.transactions = TransactionApi(
            self._transport,
        )

        self.trust_records = TrustRecordApi(
            self._transport,
        )

        self.policy = PolicyApi(
            self._transport,
        )

    @property
    def endpoint(self) -> str:
        """
        Parmana Runtime endpoint.
        """
        return self._transport.endpoint

    @property
    def version(self) -> str:
        """
        Parmana SDK version.
        """
        return __version__

    def __repr__(self) -> str:
        return (
            f"{self.__class__.__name__}("
            f"endpoint='{self.endpoint}', "
            f"version='{self.version}')"
        )