"""
Example 03

Verify an Execution Trust Record.
"""

from __future__ import annotations

import json

from parmana import ParmanaClient


def main():

    client = ParmanaClient(
        endpoint="http://localhost:3000",
    )

    verification = client.verification.verify(
        "550e8400-e29b-41d4-a716-446655440000"
    )

    print(
        json.dumps(
            verification.__dict__,
            indent=2,
            default=str,
        )
    )


if __name__ == "__main__":
    main()