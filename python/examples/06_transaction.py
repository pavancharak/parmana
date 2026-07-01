from __future__ import annotations

from parmana import ParmanaClient


def main():

    client = ParmanaClient(
        endpoint="http://localhost:3000",
    )

    transaction = client.transactions.get(
        "3576d714-bbbc-43a2-b337-1e75c8ea73a0"
    )

    print(transaction)


if __name__ == "__main__":
    main()