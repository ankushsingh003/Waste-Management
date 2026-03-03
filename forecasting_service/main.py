from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import uvicorn
from .model import PriceForecaster

app = FastAPI(title="EcoStream Price Forecasting Service", version="1.0.0")
forecaster = PriceForecaster()

class PredictionRequest(BaseModel):
    material_name: str
    historical_prices: List[float] # Last 10 days/weeks

class PredictionResponse(BaseModel):
    material_name: str
    predicted_price: float
    confidence: float
    trend: str # "up", "down", "stable"

@app.on_event("startup")
def startup_event():
    # Attempt to load model, if fails, train a quick mock one
    if not forecaster.load_model():
        print("No model found, training mock model...")
        forecaster.train_mock_model()

@app.get("/")
def read_root():
    return {"service": "Forecasting Service", "status": "active"}

@app.post("/predict", response_model=PredictionResponse)
def predict_price(request: PredictionRequest):
    if len(request.historical_prices) < 10:
        raise HTTPException(status_code=400, detail="At least 10 historical price points are required.")
    
    try:
        # Take the last 10 points
        input_seq = request.historical_prices[-10:]
        predicted_val = forecaster.predict_next(input_seq)
        
        last_val = input_seq[-1]
        trend = "stable"
        if predicted_val > last_val * 1.01:
            trend = "up"
        elif predicted_val < last_val * 0.99:
            trend = "down"
            
        return {
            "material_name": request.material_name,
            "predicted_price": round(predicted_val, 2),
            "confidence": 0.85, # Mock confidence
            "trend": trend
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)
