# FootballIQ — European Player Market Value Predictor API

FastAPI backend serving machine learning predictions for European football player valuations based on performance metrics and league metadata.

---

## 📁 Project Directory Structure

```
laliga/
├── app/
│   ├── __init__.py         # Package initializer
│   ├── main.py             # FastAPI app, endpoints, CORS & error handling
│   ├── models.py           # Pydantic request & response schemas
│   └── predictor.py        # ML Model predictor service wrapper
├── eda_plots/              # EDA visualization charts
├── model_results/          # Cross-validation comparison results
├── all_player_profiles.csv # Raw profiles data
├── all_player_stats.csv    # Raw stats data
├── cleaned_player_data.csv # Merged & preprocessed dataset
├── footballiq_best_model.joblib # Serialized ML pipeline model
├── requirements.txt        # Python dependencies
└── README.md               # API Documentation
```

---

## 🚀 How to Run the API Server

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Start the Server with Uvicorn
Run the following command from the project root directory:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## 📖 API Documentation & Swagger UI

Once the server is running, interactive API documentation is available in your browser:
* **Interactive Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
* **ReDoc Documentation:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 🔌 API Endpoints Summary

### 1. Root Information
* **Endpoint:** `GET /`
* **Response:**
  ```json
  {
    "name": "FootballIQ Market Value Predictor API",
    "version": "1.0.0",
    "status": "online",
    "documentation": "/docs"
  }
  ```

### 2. Health Check
* **Endpoint:** `GET /health`
* **Response:**
  ```json
  {
    "status": "healthy",
    "model_loaded": true,
    "model_path": "c:\\Users\\Rayan Das\\Desktop\\laliga\\footballiq_best_model.joblib"
  }
  ```

### 3. Predict Player Market Value
* **Endpoint:** `POST /api/v1/predict`
* **Sample Request Payload:**
  ```json
  {
    "league": "Premier League",
    "position": "F",
    "minutes_played": 2200,
    "appearances": 26,
    "matches_started": 24,
    "rating": 7.4,
    "goals": 14,
    "assists": 6,
    "expected_goals": 13.2,
    "expected_assists": 5.1,
    "total_shots": 68,
    "shots_on_target": 28,
    "tackles": 18,
    "interceptions": 8,
    "saves": 0,
    "yellow_cards": 3,
    "red_cards": 0
  }
  ```
* **Sample Response Payload:**
  ```json
  {
    "predicted_market_value_euros": 48250000.0,
    "formatted_market_value": "€48,250,000.00",
    "status": "success"
  }
  ```
