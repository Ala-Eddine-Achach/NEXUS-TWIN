from fastapi import APIRouter
from pydantic import BaseModel
from fastapi import Request
import os
import joblib
import pandas as pd

router = APIRouter()

class PredictRequest(BaseModel):
    data: dict

def safe_float(value, default=0.0):
    try:
        return float(value)
    except (TypeError, ValueError):
        return default

def prepare_input_features_complete(input_data):
    day_t_minus_2 = input_data['day_t_minus_2']
    day_t_minus_1 = input_data['day_t_minus_1']
    features = {}
    intensity_map = {"Low": 0.3, "Moderate": 0.6, "High": 1.0}
    features['t2_total_sleep'] = safe_float(day_t_minus_2.get('total_sleep', 7))
    features['t2_deep_sleep'] = safe_float(day_t_minus_2.get('deep_sleep', 1.5))
    features['t2_resting_heart_rate'] = safe_float(day_t_minus_2.get('resting_heart_rate', 70))
    features['t2_calories'] = safe_float(day_t_minus_2.get('calories', 2000))
    features['t2_calories_burned'] = safe_float(day_t_minus_2.get('calories_burned', 2000))
    features['t2_protein'] = safe_float(day_t_minus_2.get('protein', 100))
    features['t2_carbs'] = safe_float(day_t_minus_2.get('carbs', 200))
    features['t2_fat'] = safe_float(day_t_minus_2.get('fat', 70))
    features['t2_intensity'] = intensity_map.get(day_t_minus_2.get('intensity', 'Low'), 0.3)
    features['t2_hrv'] = safe_float(day_t_minus_2.get('value', 50))
    features['t1_total_sleep'] = safe_float(day_t_minus_1.get('total_sleep', 7))
    features['t1_deep_sleep'] = safe_float(day_t_minus_1.get('deep_sleep', 1.5))
    features['t1_resting_heart_rate'] = safe_float(day_t_minus_1.get('resting_heart_rate', 70))
    features['t1_calories'] = safe_float(day_t_minus_1.get('calories', 2000))
    features['t1_calories_burned'] = safe_float(day_t_minus_1.get('calories_burned', 2000))
    features['t1_protein'] = safe_float(day_t_minus_1.get('protein', 100))
    features['t1_carbs'] = safe_float(day_t_minus_1.get('carbs', 200))
    features['t1_fat'] = safe_float(day_t_minus_1.get('fat', 70))
    features['t1_intensity'] = intensity_map.get(day_t_minus_1.get('intensity', 'Low'), 0.3)
    features['t1_hrv'] = safe_float(day_t_minus_1.get('value', 50))
    features['avg_sleep'] = (features['t2_total_sleep'] + features['t1_total_sleep']) / 2
    features['sleep_trend'] = features['t1_total_sleep'] - features['t2_total_sleep']
    features['sleep_consistency'] = abs(features['t1_total_sleep'] - features['t2_total_sleep'])
    t2_deep_ratio = features['t2_deep_sleep'] / max(features['t2_total_sleep'], 0.1)
    t1_deep_ratio = features['t1_deep_sleep'] / max(features['t1_total_sleep'], 0.1)
    features['avg_deep_sleep_ratio'] = (t2_deep_ratio + t1_deep_ratio) / 2
    features['deep_sleep_ratio_trend'] = t1_deep_ratio - t2_deep_ratio
    features['avg_rhr'] = (features['t2_resting_heart_rate'] + features['t1_resting_heart_rate']) / 2
    features['rhr_trend'] = features['t1_resting_heart_rate'] - features['t2_resting_heart_rate']
    features['avg_hrv'] = (features['t2_hrv'] + features['t1_hrv']) / 2
    features['hrv_trend'] = features['t1_hrv'] - features['t2_hrv']
    t2_net_cal = features['t2_calories'] - features['t2_calories_burned']
    t1_net_cal = features['t1_calories'] - features['t1_calories_burned']
    features['avg_net_calories'] = (t2_net_cal + t1_net_cal) / 2
    features['net_calories_trend'] = t1_net_cal - t2_net_cal
    features['avg_intensity'] = (features['t2_intensity'] + features['t1_intensity']) / 2
    features['intensity_trend'] = features['t1_intensity'] - features['t2_intensity']
    features['avg_protein'] = (features['t2_protein'] + features['t1_protein']) / 2
    features['protein_trend'] = features['t1_protein'] - features['t2_protein']
    features['avg_carbs'] = (features['t2_carbs'] + features['t1_carbs']) / 2
    features['carbs_trend'] = features['t1_carbs'] - features['t2_carbs']
    features['avg_fat'] = (features['t2_fat'] + features['t1_fat']) / 2
    features['fat_trend'] = features['t1_fat'] - features['t2_fat']
    for day_prefix, protein, carbs, fat in [('t2', features['t2_protein'], features['t2_carbs'], features['t2_fat']),
                                           ('t1', features['t1_protein'], features['t1_carbs'], features['t1_fat'])]:
        total_macro_cals = 4 * protein + 4 * carbs + 9 * fat
        if total_macro_cals > 0:
            features[f'{day_prefix}_carb_ratio'] = (4 * carbs) / total_macro_cals
            features[f'{day_prefix}_protein_ratio'] = (4 * protein) / total_macro_cals
            features[f'{day_prefix}_fat_ratio'] = (9 * fat) / total_macro_cals
        else:
            features[f'{day_prefix}_carb_ratio'] = 0.5
            features[f'{day_prefix}_protein_ratio'] = 0.25
            features[f'{day_prefix}_fat_ratio'] = 0.25
    return features

def predict_with_xgboost(input_data, model_dir="xgboost_models"):
    feature_cols_path = os.path.join(model_dir, 'feature_columns.pkl')
    feature_cols = joblib.load(feature_cols_path)
    features = prepare_input_features_complete(input_data)
    feature_df = pd.DataFrame([features])
    for col in feature_cols:
        if col not in feature_df.columns:
            feature_df[col] = 0
    feature_df = feature_df[feature_cols]
    predictions = {}
    target_names = {
        'target_energy': 'Energy Level',
        'target_recovery': 'Recovery Index',
        'target_readiness': 'Readiness Score'
    }
    for target in ['target_energy', 'target_recovery', 'target_readiness']:
        model_path = os.path.join(model_dir, f'xgboost_{target}.pkl')
        if os.path.exists(model_path):
            model = joblib.load(model_path)
            pred = model.predict(feature_df)[0]
            predictions[target_names[target]] = float(pred)
        else:
            predictions[target_names[target]] = None
    return predictions

@router.post("/predict")
async def predict_endpoint(request: Request):
    input_data = await request.json()
    try:
        preds = predict_with_xgboost(input_data,model_dir="./models/xgboost_models")
        return preds
    except Exception as e:
        return {"error": str(e)}
