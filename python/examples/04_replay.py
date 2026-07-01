"""
Example 04

Replay a Business Transaction.
"""

from __future__ import annotations

import json
from dataclasses import asdict

from parmana import ParmanaClient


def main() -> None:

    client = ParmanaClient(
        endpoint="http://localhost:3000",
    )

    result = client.replay.replay(
        "550e8400-e29b-41d4-a716-446655440000",
    )

    print(
        json.dumps(
            asdict(result),
            indent=2,
        )
    )


if __name__ == "__main__":
    main()