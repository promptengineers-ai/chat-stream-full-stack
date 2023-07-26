from starlette.testclient import TestClient

from main import app

client = TestClient(app)

def test_ping():
    response = client.get("/status")
    # print(response.json())
    assert response.status_code == 200
    assert "version" in response.json()