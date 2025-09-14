from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
from typing import List, Dict, Optional, Any
import json

router = APIRouter()

class MatchRequest(BaseModel):
    query: str
    candidates: list

class MatchingSystem:
    """
    Enhanced matching system that works with user profiles and candidate data
    """
    
    def __init__(self):
        self.default_weights = {
            "fitness_level": 0.15,
            "energy_level": 0.15,
            "recovery_index": 0.15,
            "readiness_score": 0.15,
            "activity_interests": 0.20,
            "intensity_preference": 0.10,
            "suggestion_type": 0.05,
            "duration": 0.05,
        }
    
    def create_user_dataframe(self, user_profile: Dict, candidates: List[Dict]) -> pd.DataFrame:
        """
        Convert user profile and candidates into a unified DataFrame for processing
        """
        # Extract preferences and current activity suggestion
        preferences = user_profile.get("preferences", {})
        current_activity = user_profile.get("current_activity_suggestion", {})
        
        # Convert user profile to candidate format
        user_data = {
            "user_id": user_profile.get("user_id", "target_user"),
            "age": user_profile.get("age", 25),
            "gender": user_profile.get("gender", "any"),
            "fitness_level": user_profile.get("fitness_level", "intermediate").lower(),
            "energy_level": user_profile.get("current_metrics", {}).get("energy_level", 75.0),
            "recovery_index": user_profile.get("current_metrics", {}).get("recovery_index", 75.0),
            "readiness_score": user_profile.get("current_metrics", {}).get("readiness_score", 75.0),
            "activity_interests": ", ".join(preferences.get("activity_interests", [])),
            "city": user_profile.get("city", "unknown"),
            "gender_preference": preferences.get("gender_preference", "any"),
            "age_range_min": preferences.get("age_range", [18, 65])[0],
            "age_range_max": preferences.get("age_range", [18, 65])[1],
            "same_city": preferences.get("want same city", True),
            "same_suggestion": True,  # Default for current activity matching
            "intensity_preference": preferences.get("intensity_preference", "moderate"),
            "suggestion_type": current_activity.get("type", "workout"),
            "suggestion_intensity": current_activity.get("intensity", "moderate"),
            "duration": current_activity.get("duration", 30)
        }
        
        # Normalize candidate data to match expected format
        normalized_candidates = []
        for candidate in candidates:
            # Handle both nested and flat structures for metrics
            if isinstance(candidate.get("current_metrics"), dict):
                energy_level = candidate["current_metrics"].get("energy_level", candidate.get("energy_level", 75.0))
                recovery_index = candidate["current_metrics"].get("recovery_index", candidate.get("recovery_index", 75.0))
                readiness_score = candidate["current_metrics"].get("readiness_score", candidate.get("readiness_score", 75.0))
            else:
                energy_level = candidate.get("energy_level", 75.0)
                recovery_index = candidate.get("recovery_index", 75.0)
                readiness_score = candidate.get("readiness_score", 75.0)
            
            # Handle activity interests as both list and string
            activity_interests = candidate.get("activity_interests", candidate.get("interests", []))
            if isinstance(activity_interests, str):
                activity_interests_str = activity_interests
            elif isinstance(activity_interests, list):
                activity_interests_str = ", ".join(activity_interests)
            else:
                activity_interests_str = ""
            
            normalized_candidate = {
                "user_id": candidate.get("user_id", f"candidate_{len(normalized_candidates)}"),
                "age": candidate.get("age", 25),
                "gender": candidate.get("gender", "any"),
                "fitness_level": candidate.get("fitness_level", "intermediate").lower(),
                "energy_level": float(energy_level) if energy_level else 75.0,
                "recovery_index": float(recovery_index) if recovery_index else 75.0,
                "readiness_score": float(readiness_score) if readiness_score else 75.0,
                "activity_interests": activity_interests_str,
                "city": candidate.get("city", "unknown"),
                "gender_preference": candidate.get("gender_preference", "any"),
                "age_range_min": candidate.get("age_range_min", 18),
                "age_range_max": candidate.get("age_range_max", 65),
                "same_city": candidate.get("same_city", True),
                "same_suggestion": candidate.get("same_suggestion", True),
                "intensity_preference": candidate.get("intensity_preference", "moderate"),
                "suggestion_type": candidate.get("suggestion_type", "workout"),
                "suggestion_intensity": candidate.get("suggestion_intensity", "moderate"),
                "duration": candidate.get("duration", 30),
                "availability": candidate.get("availability", "flexible")
            }
            normalized_candidates.append(normalized_candidate)
        
        # Combine user and candidates into single DataFrame
        all_data = [user_data] + normalized_candidates
        return pd.DataFrame(all_data)

    def filter_by_city(self, df: pd.DataFrame, user_id: str, same_city: bool = True) -> pd.DataFrame:
        """Filter candidates by city preference"""
        if not same_city:
            return df
            
        user_row = df[df["user_id"] == user_id]
        if user_row.empty or "city" not in df.columns:
            return pd.DataFrame()
            
        user_city = user_row.iloc[0]["city"]
        user_same_city_pref = user_row.iloc[0]["same_city"]
        
        if user_same_city_pref:
            return df[df["city"] == user_city]
        return df

    def filter_by_age(self, df: pd.DataFrame, user_id: str) -> pd.DataFrame:
        """Filter candidates by age compatibility"""
        user_row = df[df["user_id"] == user_id]
        required_columns = ["age", "age_range_min", "age_range_max"]
        
        if user_row.empty or not all(col in df.columns for col in required_columns):
            return df
            
        # Get user's age preferences
        user_age_min = user_row.iloc[0]["age_range_min"]
        user_age_max = user_row.iloc[0]["age_range_max"]
        
        if pd.isnull(user_age_min) or pd.isnull(user_age_max):
            return df
        
        # Filter candidates based on user's age preference
        # Only keep candidates whose age is within the user's desired range
        age_filtered_df = df[
            (df["age"] >= user_age_min) &
            (df["age"] <= user_age_max)
        ]
        
        return age_filtered_df

    def filter_by_gender(self, df: pd.DataFrame, user_id: str, match_gender: bool = True) -> pd.DataFrame:
        """Filter candidates by gender preference"""
        if not match_gender:
            return df
            
        user_row = df[df["user_id"] == user_id]
        
        if (user_row.empty or "gender" not in df.columns or "gender_preference" not in df.columns):
            return pd.DataFrame()
            
        user_gender = user_row.iloc[0]["gender"]
        user_gender_pref = user_row.iloc[0]["gender_preference"].lower()
        
        if user_gender_pref == "any":
            return df[
                (df["gender_preference"].str.lower() == "any") |
                (df["gender_preference"].str.lower() == user_gender.lower())
            ]
        else:
            return df[
                (df["gender"].str.lower() == user_gender_pref) &
                ((df["gender_preference"].str.lower() == "any") |
                 (df["gender_preference"].str.lower() == user_gender.lower()))
            ]

    def calculate_similarity_score(self, df: pd.DataFrame, user_id: str, weights: Dict = None) -> pd.DataFrame:
        """Calculate similarity scores between user and candidates"""
        if weights is None:
            weights = self.default_weights
            
        user_row = df[df["user_id"] == user_id]
        if user_row.empty:
            return pd.DataFrame()
            
        user_data = user_row.iloc[0]
        similarity_scores = []
        
        for idx, row in df.iterrows():
            if row["user_id"] == user_id:
                continue
                
            total_similarity = 0
            
            # Fitness Level Similarity
            fitness_similarity = 1.0 if user_data["fitness_level"] == row["fitness_level"] else 0.0
            total_similarity += weights["fitness_level"] * fitness_similarity
            
            # Energy Level Similarity
            energy_diff = abs(user_data["energy_level"] - row["energy_level"])
            energy_similarity = max(0, 1 - (energy_diff / 100.0))
            total_similarity += weights["energy_level"] * energy_similarity
            
            # Recovery Index Similarity
            recovery_diff = abs(user_data["recovery_index"] - row["recovery_index"])
            recovery_similarity = max(0, 1 - (recovery_diff / 100.0))
            total_similarity += weights["recovery_index"] * recovery_similarity
            
            # Readiness Score Similarity
            readiness_diff = abs(user_data["readiness_score"] - row["readiness_score"])
            readiness_similarity = max(0, 1 - (readiness_diff / 100.0))
            total_similarity += weights["readiness_score"] * readiness_similarity
            
            # Activity Interests Similarity
            user_interests = set(user_data["activity_interests"].split(", ")) if user_data["activity_interests"] else set()
            other_interests = set(row["activity_interests"].split(", ")) if row["activity_interests"] else set()
            
            intersection = len(user_interests.intersection(other_interests))
            union = len(user_interests.union(other_interests))
            interests_similarity = intersection / union if union > 0 else 0
            total_similarity += weights["activity_interests"] * interests_similarity
            
            # Intensity Preference Similarity
            intensity_similarity = 1.0 if user_data["intensity_preference"] == row["intensity_preference"] else 0.0
            total_similarity += weights["intensity_preference"] * intensity_similarity
            
            # Suggestion Type Similarity
            suggestion_similarity = 1.0 if user_data["suggestion_type"] == row["suggestion_type"] else 0.0
            total_similarity += weights["suggestion_type"] * suggestion_similarity
            
            # Duration Similarity
            duration_diff = abs(user_data["duration"] - row["duration"])
            max_duration_diff = 60
            duration_similarity = max(0, 1 - (duration_diff / max_duration_diff))
            total_similarity += weights["duration"] * duration_similarity
            
            # Calculate shared interests for response
            shared_interests = list(user_interests.intersection(other_interests))
            
            similarity_scores.append({
                "user_id": row["user_id"],
                "compatibility_score": round(total_similarity, 3),
                "shared_interests": shared_interests,
                "fitness_level": row["fitness_level"],
                "age": int(row["age"]),
                "gender": row["gender"],
                "current_readiness": round(row["readiness_score"], 1),
                "energy_level": round(row["energy_level"], 1),
                "recovery_index": round(row["recovery_index"], 1),
                "availability": row.get("availability", "flexible")
            })
            
        results_df = pd.DataFrame(similarity_scores)
        results_df = results_df.sort_values("compatibility_score", ascending=False)
        return results_df

    def find_workout_partners(self, user_profile: Dict, candidates: List[Dict], 
                            preferences: Dict, apply_filters: bool = True, 
                            similarity_threshold: float = 0.5, top_n: int = 10) -> List[Dict]:
        """
        Main matching function that combines filtering and similarity scoring
        """
        # Create unified DataFrame
        df = self.create_user_dataframe(user_profile, candidates)
        user_id = user_profile.get("user_id", "target_user")
        
        # Apply filters based on preferences
        filtered_df = df.copy()
        
        if apply_filters:
            # City filter
            if preferences.get("want same city", True):
                user_city = df[df["user_id"] == user_id]["city"].iloc[0]
                filtered_df = filtered_df[
                    (filtered_df["user_id"] == user_id) |  # Always keep the user
                    (filtered_df["city"] == user_city)  # Filter others by city
                ]
            
            # Age filter - simple filtering by user's preferred age range
            user_age_range = preferences.get("age_range", [18, 65])
            if user_age_range:
                min_age, max_age = user_age_range[0], user_age_range[1]
                # Keep the user in the DataFrame, but filter other candidates
                filtered_df = filtered_df[
                    (filtered_df["user_id"] == user_id) |  # Always keep the user
                    ((filtered_df["age"] >= min_age) & (filtered_df["age"] <= max_age))  # Filter others
                ]
            
            # Gender filter
            user_gender_pref = preferences.get("gender_preference", "any")
            if user_gender_pref != "any":
                # Filter candidates by user's gender preference (user wants this gender)
                filtered_df = filtered_df[
                    (filtered_df["user_id"] == user_id) |  # Always keep the user
                    (filtered_df["gender"].str.lower() == user_gender_pref.lower())  # Filter others
                ]
        
        # Calculate similarity scores
        if len(filtered_df) > 1:
            similarity_results = self.calculate_similarity_score(filtered_df, user_id)
            
            # Check if similarity_results is empty or doesn't have the expected column
            if similarity_results.empty or 'compatibility_score' not in similarity_results.columns:
                return []
            
            # Apply similarity threshold
            similarity_results = similarity_results[
                similarity_results["compatibility_score"] >= similarity_threshold
            ]
            
            # Limit to top N results
            similarity_results = similarity_results.head(top_n)
            
            # Convert to list of dictionaries for API response
            return similarity_results.to_dict('records')
        else:
            return []

# Initialize the matching system
matching_system = MatchingSystem()

@router.post("/match")
async def match_endpoint(request: Request):
    """
    Enhanced matching endpoint that uses the existing matching logic
    """
    try:
        body = await request.json()
        
        # Validate required keys
        required_fields = ["user_profile"]
        missing_fields = [field for field in required_fields if field not in body]
        
        if missing_fields:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required fields: {', '.join(missing_fields)}"
            )
        
        # Extract data from request
        user_profile = body["user_profile"]
        preferences = user_profile.get("preferences", {})  # Nested in user_profile now
        candidates = body.get("candidates", [])  # List of candidate users

        # Optional parameters
        apply_filters = body.get("apply_filters", True)
        similarity_threshold = body.get("similarity_threshold", 0.3)
        top_n = body.get("top_n", 10)

        # If no candidates provided, try to load from CSV
        if not candidates:
            import os
            import pandas as pd
            csv_path = body.get("csv_path", "test_data.csv")
            if os.path.exists(csv_path):
                df = pd.read_csv(csv_path)
                # Convert DataFrame rows to candidate dicts
                candidates = df.fillna("").to_dict(orient="records")
            else:
                return {
                    "matched_users": [],
                    "message": f"No candidates provided and CSV file '{csv_path}' not found"
                }

        # Find workout partners using the matching system
        matched_users = matching_system.find_workout_partners(
            user_profile=user_profile,
            candidates=candidates,
            preferences=preferences,
            apply_filters=apply_filters,
            similarity_threshold=similarity_threshold,
            top_n=top_n
        )

        # Remove duplicate availability assignment since it's now handled in similarity scoring
        return {
            "matched_users": matched_users,
            "total_matches": len(matched_users),
            "filters_applied": apply_filters,
            "similarity_threshold": similarity_threshold
        }
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON in request body")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# Health check endpoint
@router.get("/health")
async def health_check():
    """Health check endpoint for the matching service"""
    return {"status": "healthy", "service": "workout_matching"}
