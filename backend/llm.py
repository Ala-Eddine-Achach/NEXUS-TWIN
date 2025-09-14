from fastapi import APIRouter, Request
from pydantic import BaseModel
import requests
import json

router = APIRouter()

API_URL = "https://openrouter.ai/api/v1/chat/completions"
API_KEY = "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"


class LLMRequest(BaseModel):
    input_json: dict


def build_prompt(input_json):
    """
    Optimized prompt for the Health Advisor LLM with improved structure and clarity.
    """
    possible_activities = [
        "swimming", "running", "cycling", "strength_training", "yoga",
        "pilates", "cardio", "boxing", "hiking", "dancing"
    ]
    
    # Extract key context for better recommendations
    user_message = input_json.get('user_message', '').lower()
    user_profile = input_json.get('user_profile', {})
    location_data = input_json.get('location_data', {})
    
    return f"""# Intelligent Health Advisor

You are an expert health and fitness advisor. Analyze the user data and provide personalized recommendations.

## Core Instructions

### Activity Classification Rules
- **Past Activities (detected_activities)**: Only record if user explicitly states they COMPLETED an activity using past tense
- **Future Suggestions (activity_suggestions)**: Recommend based on user needs and context
- **Approved Activities Only**: {possible_activities}

### Critical Language Detection
- Past tense indicators: "I swam", "I ran", "I did", "I completed", "I finished"
- Future/desire indicators: "I want to", "I plan to", "I will", "I should", "I need to"

### Data Quality Rules
- Only use information explicitly provided in the user's message
- Estimate ONLY: duration, intensity, calories (when missing)
- Leave fields empty/null if required data is missing
- No assumptions or historical data inference

## User Context
- Message: "{input_json.get('user_message', '')}"
- Fitness Level: {user_profile.get('fitness_level', 'Unknown')}
- Weather: {location_data.get('weather', 'Unknown')}
- Location: {location_data.get('city', 'Unknown')}

## Required JSON Output

```json
{{
    "advice_response": "Direct response addressing the user's specific message",
    "data_updates": {{
        "detected_activities": [
            {{
                "activity_type": "string (from approved list)",
                "calories_burned": "number (estimate if needed)",
                "duration": "number (minutes, estimate if needed)",
                "heart_rate_avg": "number or null",
                "intensity": "Low|Medium|High (estimate if needed)",
                "timestamp": "ISO string"
            }}
        ],
        "nutrition_intake": [
            {{
                "meal_type": "Breakfast|Lunch|Dinner|Snack",
                "calories": "number (estimate if needed)",
                "carbs": "number or null",
                "fat": "number or null",
                "protein": "number or null",
                "water_intake": "number (ml) or null",
                "food_items": ["list of foods mentioned"]
            }}
        ],
        "health_measurements": [
            {{
                "measurement_type": "weight|blood_pressure|heart_rate|etc",
                "value": "number",
                "confidence_score": "number (0-1)"
            }}
        ],
        "mood_indicators": {{
            "stress_level": "number (1-10) or null",
            "energy_perception": "number (1-10) or null",
            "motivation_score": "number (1-10) or null"
        }}
    }},
    "activity_suggestions": {{
        "primary_workout": {{
            "type": "string (from approved list)",
            "duration": "number (minutes)",
            "intensity": "Low|Medium|High",
            "specific_exercises": ["list of specific exercises"]
        }},
        "supplementary_activities": [
            {{
                "activity": "string (from approved list)",
                "duration": "number (minutes)",
                "benefits": "string explaining benefits"
            }}
        ],
        "rest_recommendations": {{
            "active_recovery_type": "string",
            "duration": "number (minutes)"
        }}
    }},
    "nutrition_plan": {{
        "meal_suggestions": [
            {{
                "meal_type": "Breakfast|Lunch|Dinner|Snack",
                "target_calories": "number",
                "macro_breakdown": {{
                    "protein": "percentage",
                    "carbs": "percentage",
                    "fat": "percentage"
                }},
                "food_suggestions": ["list of recommended foods"]
            }}
        ],
        "hydration_targets": {{
            "water_intake_ml": "number",
            "timing_suggestions": ["list of timing recommendations"]
        }},
        "supplement_recommendations": [
            {{
                "supplement_type": "string",
                "timing": "string",
                "rationale": "string explaining why"
            }}
        ]
    }},
    "behavioral_insights": {{
        "motivation_message": "Personalized encouraging message",
        "habit_formation_tip": "Practical tip for building habits",
        "progress_celebration": "Recognition of achievements"
    }}
}}
```

## Validation Checklist
✓ Past vs future activities correctly categorized based on verb tense
✓ Only approved activity types used
✓ Required fields populated or set to null appropriately
✓ Advice directly addresses user's message
✓ Recommendations are personalized and contextual
 past activity and nutrition should contain all fields (estimated if needed)

**IMPORTANT**: Respond ONLY with valid JSON. No explanatory text outside the JSON structure.

Input Data:
{json.dumps(input_json, indent=2)}
"""


def get_health_advice(input_json):
    """
    Enhanced health advice function with better error handling and optimization.
    """
    prompt = build_prompt(input_json)
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "openai/gpt-3.5-turbo",
        "messages": [
            {
                "role": "system",
                "content": "You are an expert health advisor. Always respond with valid JSON only. Follow the provided structure exactly."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.7,
        "max_tokens": 2000
    }
    
    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        
        result = response.json()
        content = result["choices"][0]["message"]["content"]
        
        # Validate JSON before returning
        json.loads(content)
        return content
        
    except requests.exceptions.Timeout:
        raise Exception("Request timed out. Please try again.")
    except requests.exceptions.RequestException as e:
        raise Exception(f"API request failed: {str(e)}")
    except json.JSONDecodeError as e:
        raise Exception(f"Invalid JSON response: {str(e)}")
    except KeyError as e:
        raise Exception(f"Unexpected response format: {str(e)}")


@router.post("/llm")
async def llm_endpoint(request: Request):
    """
    Enhanced endpoint with better error handling and response validation.
    """
    try:
        body = await request.json()
        input_json = body.get("input_json")
        
        if input_json is None:
            return {"error": "Missing 'input_json' in request body"}
        
        # Validate required fields
        if not input_json.get("user_message"):
            return {"error": "Missing 'user_message' in input_json"}
        
        result_str = get_health_advice(input_json)
        
        try:
            result_json = json.loads(result_str)
            
            # Basic validation of required top-level fields
            required_fields = [
                "advice_response", "data_updates", "activity_suggestions",
                "nutrition_plan", "behavioral_insights"
            ]
            
            missing_fields = [field for field in required_fields if field not in result_json]
            if missing_fields:
                return {
                    "error": f"LLM response missing required fields: {missing_fields}",
                    "raw": result_str
                }
            
            return result_json
            
        except json.JSONDecodeError as e:
            return {
                "error": f"LLM response is not valid JSON: {e}",
                "raw": result_str
            }
            
    except json.JSONDecodeError:
        return {"error": "Invalid JSON in request body"}
    except Exception as e:
        return {"error": f"Internal server error: {str(e)}"}


# Additional utility function for intent analysis (optional)
def analyze_user_intent(message):
    """
    Simple intent analysis to help with better responses.
    """
    message = message.lower()
    
    # Past activity indicators
    past_indicators = ['did', 'completed', 'finished', 'swam', 'ran', 'ate', 'went', 'worked out']
    if any(word in message for word in past_indicators):
        return "reporting_completed_activity"
    
    # Future/planning indicators
    future_indicators = ['want', 'plan', 'going to', 'will', 'should', 'need to', 'thinking about']
    if any(word in message for word in future_indicators):
        return "seeking_recommendations"
    
    # Health concerns
    concern_indicators = ['tired', 'sore', 'pain', 'hurt', 'sick', 'stressed']
    if any(word in message for word in concern_indicators):
        return "health_concern"
    
    # Goal setting
    goal_indicators = ['goal', 'target', 'aim', 'achieve', 'lose weight', 'gain muscle']
    if any(word in message for word in goal_indicators):
        return "goal_setting"
    
    return "general_inquiry"