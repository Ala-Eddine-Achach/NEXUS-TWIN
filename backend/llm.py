from fastapi import APIRouter
from pydantic import BaseModel
import requests
import json

router = APIRouter()

API_URL = "https://openrouter.ai/api/v1/chat/completions"
API_KEY = "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"

class LLMRequest(BaseModel):
        input_json: dict

def build_prompt(input_json):
    possible_activities = [
        'swimming',
        'running',
        'cycling',
        'strength_training',
        'yoga',
        'pilates',
        'cardio',
        'boxing',
        'hiking',
        'dancing'
    ]
    return f"""
You are an Intelligent Health Advisor LLM. Your purpose is to provide personalized health advice and generate daily activity/nutrition recommendations.
When predicting or suggesting activities, use only the following possible activity types:
{possible_activities}
Always output valid JSON with the following structure:
{{
    "advice_response": "...",
    "data_updates": {{
        "detected_activities": [{{"activity_type": "...", "duration": ..., "intensity": "...", "timestamp": "..."}}],
        "nutrition_intake": [{{"meal_type": "...", "estimated_calories": ..., "food_items": ["..."]}}],
        "health_measurements": [{{"measurement_type": "...", "value": ..., "confidence_score": ...}}],
        "mood_indicators": {{"stress_level": ..., "energy_perception": ..., "motivation_score": ...}}
    }},
    "activity_suggestions": {{
        "primary_workout": {{"type": "...", "duration": ..., "intensity": "...", "specific_exercises": ["..."]}},
        "supplementary_activities": [{{"activity": "...", "duration": ..., "benefits": "..."}},],
        "rest_recommendations": {{"active_recovery_type": "...", "duration": ...}}
    }},
    "nutrition_plan": {{
        "meal_suggestions": [{{"meal_type": "...", "target_calories": ..., "macro_breakdown": {{}}, "food_suggestions": ["..."]}}],
        "hydration_targets": {{"water_intake_ml": ..., "timing_suggestions": ["..."]}},
        "supplement_recommendations": [{{"supplement_type": "...", "timing": "...", "rationale": "..."}},]
    }},
    "behavioral_insights": {{
        "motivation_message": "...",
        "habit_formation_tip": "...",
        "progress_celebration": "..."
    }}
}}

LOGIC RESTRICTIONS FOR ALL FIELDS:
- For every top-level field (advice_response, data_updates, activity_suggestions, nutrition_plan, behavioral_insights): Only use information explicitly and fully provided in the user's last message. Do NOT infer, guess, or use historical data for any field unless the field is specifically meant to summarize or analyze history.
- For advice_response: Only summarize or respond to the user's last message. Do not reference historical data unless the message asks for it.
- For activity_suggestions: Only suggest activities if the user's last message provides enough context or clearly requests them. Do not invent or infer missing details except for estimating duration or intensity if not provided.
- For nutrition_plan: Only suggest meals, hydration, or supplements if the user's last message provides relevant context. You may estimate missing calories or macro values if not provided.
- For behavioral_insights: Only provide insights if the user's last message provides relevant context. Do not invent or infer missing details.

LOGIC RESTRICTIONS FOR data_updates FIELDS:
- detected_activities: Only include activities if the user's last message clearly requests or describes them and explicitly provides all required details (activity_type, duration, intensity, timestamp). If duration or intensity is missing, you may estimate reasonable values based on activity type and context. If the user's last message does not request or describe any activity, leave detected_activities empty.
- nutrition_intake: Only include nutrition entries if the user's last message explicitly provides all required details (meal_type, estimated_calories, food_items). If estimated_calories is missing, you may estimate a reasonable value based on meal_type and context.
- health_measurements: Only include measurements if the user's last message explicitly provides all required details (measurement_type, value, confidence_score). If any detail is missing, do not include the entry.
- mood_indicators: Only include mood indicators if the user's last message explicitly provides all required details (stress_level, energy_perception, motivation_score). If any detail is missing, set the value to null or leave it out.

STRICT MODE: For all fields, ONLY use information explicitly and fully provided in the user's last message. Do NOT infer, guess, or use historical data for these fields. Exception: You may estimate missing values for duration, intensity, or calories if not provided, but only for those fields. If the user's last message does not mention all other required details, leave those fields empty or null. Do not fill in missing details from other parts of the input.
Use only data from the provided input. Never include fallback, error, or non-JSON text.

Input:
{json.dumps(input_json, indent=2)}
"""

def get_health_advice(input_json):
        prompt = build_prompt(input_json)
        headers = {
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json"
        }
        payload = {
                "model": "openai/gpt-3.5-turbo",
                "messages": [{"role": "user", "content": prompt}],
                "response_format": {"type": "json_object"}
        }
        response = requests.post(API_URL, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]

from fastapi import Request
import json

@router.post("/llm")
async def llm_endpoint(request: Request):
    body = await request.json()
    input_json = body.get("input_json")
    if input_json is None:
        return {"error": "Missing 'input_json' in request body"}
    result_str = get_health_advice(input_json)
    try:
        result_json = json.loads(result_str)
    except Exception as e:
        return {"error": f"LLM response is not valid JSON: {e}", "raw": result_str}
    return result_json
