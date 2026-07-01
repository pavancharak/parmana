"""
Example 05

Generate an execution receipt.
"""

from __future__ import annotations

import json
from dataclasses import asdict

from parmana import ParmanaClient


def main() -> None:

    client = ParmanaClient(
        endpoint="http://localhost:3000",
    )

    receipt = client.receipt.generate(
        "3576d714-bbbc-43a2-b337-1e75c8ea73a0",
    )

    print(
        json.dumps(
            asdict(receipt),
            indent=2,
            default=str,
        )
    )


if __name__ == "__main__":
    main()