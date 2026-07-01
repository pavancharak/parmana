"""
Example 08

List Business Transactions.
"""

from __future__ import annotations

import json
from dataclasses import asdict

from parmana import ParmanaClient


def main() -> None:

    client = ParmanaClient(
        endpoint="http://localhost:3000",
    )

    transactions = client.transactions.list()

    print(f"Found {len(transactions)} transaction(s)\n")

    for transaction in transactions:
        print(
            json.dumps(
                asdict(transaction),
                indent=2,
                default=str,
            )
        )


if __name__ == "__main__":
    main()