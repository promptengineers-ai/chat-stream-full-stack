import json

from starlette.testclient import TestClient

from main import app

client = TestClient(app)

def disabled(f):
    def _decorator():
        print(f.__name__ + ' has been disabled')
    return _decorator

def get_test_token():
    data = {
        "email": "john@smith.com",
        "password": "test1234"
    }
    headers = {
        "Content-Type": "application/json",
    }
    response = client.post("/auth/login", json=data, headers=headers)
    json_str = json.loads(response.content)
    return json_str['token']