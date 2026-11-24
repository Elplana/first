from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

print("="*60)
print("RUNNING FASTAPI BACKEND ENDPOINT TESTS")
print("="*60)

# Test 1: GET /
res_root = client.get("/")
print(f"\n1. GET / Status: {res_root.status_code}")
print(f"   Response: {res_root.json()}")
assert res_root.status_code == 200

# Test 2: GET /health
res_health = client.get("/health")
print(f"\n2. GET /health Status: {res_health.status_code}")
print(f"   Response: {res_health.json()}")
assert res_health.status_code == 200
assert res_health.json()["status"] == "healthy"

# Test 3: POST /api/v1/predict (Premier League Forward)
payload_fw = {
    "league": "Premier League",
    "position": "F",
    "minutes_played": 2500,
    "appearances": 28,
    "matches_started": 25,
    "rating": 7.5,
    "goals": 18,
    "assists": 6,
    "expected_goals": 16.2,
    "expected_assists": 5.1,
    "total_shots": 75,
    "shots_on_target": 32,
    "tackles": 12,
    "interceptions": 5,
    "saves": 0,
    "yellow_cards": 3,
    "red_cards": 0
}

res_pred1 = client.post("/api/v1/predict", json=payload_fw)
print(f"\n3. POST /api/v1/predict (PL Forward) Status: {res_pred1.status_code}")
print(f"   Response: {res_pred1.json()}")
assert res_pred1.status_code == 200
assert "predicted_market_value_euros" in res_pred1.json()

# Test 4: POST /api/v1/predict (LaLiga Midfielder)
payload_mid = {
    "league": "LaLiga",
    "position": "M",
    "minutes_played": 2100,
    "appearances": 25,
    "matches_started": 22,
    "rating": 7.6,
    "goals": 8,
    "assists": 10,
    "expected_goals": 6.8,
    "expected_assists": 9.4,
    "total_shots": 40,
    "shots_on_target": 18,
    "tackles": 45,
    "interceptions": 25,
    "saves": 0,
    "yellow_cards": 4,
    "red_cards": 0
}

res_pred2 = client.post("/api/v1/predict", json=payload_mid)
print(f"\n4. POST /api/v1/predict (LaLiga Midfielder) Status: {res_pred2.status_code}")
print(f"   Response: {res_pred2.json()}")
assert res_pred2.status_code == 200

# Test 5: Validation Error test (Invalid Rating > 10.0)
payload_invalid = {
    "league": "Serie A",
    "position": "D",
    "rating": 15.0  # Invalid rating > 10.0
}
res_invalid = client.post("/api/v1/predict", json=payload_invalid)
print(f"\n5. POST /api/v1/predict (Invalid Payload) Status: {res_invalid.status_code}")
print(f"   Error Detail: {res_invalid.json().get('detail')}")
assert res_invalid.status_code == 422  # Pydantic validation error

print("\n" + "="*60)
print("ALL FASTAPI BACKEND TESTS PASSED SUCCESSFULLY!")
print("="*60)
