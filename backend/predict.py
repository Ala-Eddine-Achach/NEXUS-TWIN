from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class PredictRequest(BaseModel):
    data: dict

from fastapi import Request

@router.post("/predict")
async def predict_endpoint(request: Request):
    body = await request.json()
    # Validate required keys
    if "user_profile" not in body or "historical_data" not in body:
        return {"error": "Missing 'user_profile' or 'historical_data' in request body"}

    # Here you would pass the data to your ML model (to be set later)
    # For now, return dummy values between 0 and 100
    result = {
        "Energy Level": 75,
        "Recovery Index": 68,
        "Readiness Score": 80
    }
    return result
