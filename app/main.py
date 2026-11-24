import os
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.models import PlayerPredictionRequest, PlayerPredictionResponse
from app.predictor import MarketValuePredictor

app = FastAPI(
    title="FootballIQ European Player Market Value API",
    description="Production-ready FastAPI backend serving machine learning predictions for European football player valuations.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits requests from any future frontend (React Native, Next.js, etc.)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model initialization
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "footballiq_best_model.joblib")

try:
    predictor = MarketValuePredictor(MODEL_PATH)
except Exception as e:
    predictor = None
    print(f"Warning: Could not load model file on startup. Error: {e}")


@app.get("/", tags=["General"])
def root():
    return {
        "name": "FootballIQ Market Value Predictor API",
        "version": "1.0.0",
        "status": "online",
        "documentation": "/docs"
    }


@app.get("/health", tags=["General"])
def health_check():
    model_status = predictor is not None and predictor.pipeline is not None
    return {
        "status": "healthy" if model_status else "degraded",
        "model_loaded": model_status,
        "model_path": MODEL_PATH
    }


@app.post(
    "/api/v1/predict",
    response_model=PlayerPredictionResponse,
    status_code=status.HTTP_200_OK,
    tags=["Prediction"]
)
def predict_market_value(request: PlayerPredictionRequest):
    if predictor is None or predictor.pipeline is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ML Model pipeline is not loaded or available."
        )

    try:
        response = predictor.predict(request)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction error: {str(e)}"
        )


@app.exception_handler(Exception)
def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"status": "error", "message": str(exc)}
    )
