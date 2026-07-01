from parmana import ParmanaClient


def test_client_creation():
    client = ParmanaClient(
        endpoint="http://localhost:3000",
    )

    assert client.endpoint == "http://localhost:3000"