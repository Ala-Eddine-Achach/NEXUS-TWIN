from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime
import requests

router = APIRouter()

class LocationRequest(BaseModel):
    latitude: float
    longitude: float

def get_weather(lat, lon):
    url = f"https://api.met.no/weatherapi/locationforecast/2.0/compact?lat={lat}&lon={lon}"
    headers = {"User-Agent": "your_email@example.com"}
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        timeseries = data["properties"]["timeseries"][0]
        details = timeseries["data"]["instant"]["details"]
        temp = details.get("air_temperature", "N/A")
        symbol = timeseries["data"].get("next_1_hours", {}).get("summary", {}).get("symbol_code", "unknown")
        return f"{symbol}, {temp}°C"
    except Exception as e:
        print(f"[ERROR] MET Norway Weather API: {e}")
        return "unknown"

def get_season(lat, date=None):
    if date is None:
        date = datetime.utcnow()
    month = date.month
    if lat >= 0:
        if month in [12, 1, 2]:
            return "winter"
        elif month in [3, 4, 5]:
            return "spring"
        elif month in [6, 7, 8]:
            return "summer"
        else:
            return "autumn"
    else:
        if month in [12, 1, 2]:
            return "summer"
        elif month in [3, 4, 5]:
            return "autumn"
        elif month in [6, 7, 8]:
            return "winter"
        else:
            return "spring"

def get_nearby_fitness_places(lat, lon, radius=1000):
    tags = [
        'leisure=fitness_centre',
        'leisure=park',
        'leisure=pitch',
        'leisure=swimming_pool',
        'leisure=track',
        'natural=beach_resort',
        'natural=beach',
    ]
    query = f"""
    [out:json];
    (
      node[{tags[0]}](around:{radius},{lat},{lon});
      node[{tags[1]}](around:{radius},{lat},{lon});
      node[{tags[2]}](around:{radius},{lat},{lon});
      node[{tags[3]}](around:{radius},{lat},{lon});
      node[{tags[4]}](around:{radius},{lat},{lon});
      node[{tags[5]}](around:{radius},{lat},{lon});
      node[{tags[6]}](around:{radius},{lat},{lon});
    );
    out center;
    """
    url = "https://overpass-api.de/api/interpreter"
    results = []
    try:
        response = requests.post(url, data={'data': query}, timeout=30)
        response.raise_for_status()
        try:
            data = response.json()
        except Exception as e:
            print(f"[ERROR] Could not decode Overpass API response as JSON: {e}\nResponse text: {response.text[:200]}")
            data = {"elements": []}
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] Overpass API request failed: {e}")
        data = {"elements": []}
    for element in data.get("elements", []):
        name = element.get("tags", {}).get("name", "Unknown")
        if name != "Unknown":
            tags = element.get("tags", {})
            place_type = None
            for k, v in tags.items():
                if k == "leisure" or k == "natural":
                    place_type = v
            place = {
                "name": name,
                "type": place_type if place_type else "other",
                "lat": element.get("lat"),
                "lon": element.get("lon"),
            }
            results.append(place)
    available_locations = []
    shown_types = set()
    shown_count = 0
    for p in results:
        if shown_count >= 8:
            break
        type_count = sum(1 for x in available_locations if x['type'] == p['type'])
        if type_count < 2:
            available_locations.append(p)
            shown_count += 1
    weather = get_weather(lat, lon)
    season = get_season(lat)
    location = {"latitude": lat, "longitude": lon}
    # Reverse geocoding to get city name
    city = "Unknown"
    try:
        geocode_url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}&zoom=14&addressdetails=1&accept-language=en"
        geocode_headers = {"User-Agent": "NeurobytesApp/1.0 (neurobytes@example.com)"}
        geocode_resp = requests.get(geocode_url, headers=geocode_headers, timeout=15)
        geocode_resp.raise_for_status()
        geocode_data = geocode_resp.json()
        
        print(f"[DEBUG] Geocoding response: {geocode_data}")  # Debug print
        
        if "address" in geocode_data:
            address = geocode_data["address"]
            # Try multiple address fields in order of preference
            city = (address.get("city") or 
                   address.get("town") or 
                   address.get("municipality") or 
                   address.get("village") or 
                   address.get("suburb") or 
                   address.get("neighbourhood") or 
                   address.get("county") or 
                   address.get("state_district") or 
                   address.get("state") or 
                   "Unknown")
            print(f"[DEBUG] Extracted city: {city}")  # Debug print
        else:
            # Fallback: try to extract from display_name
            display_name = geocode_data.get("display_name", "")
            if display_name:
                # Split by comma and take the first meaningful part
                parts = [part.strip() for part in display_name.split(",")]
                for part in parts:
                    if part and not part.isdigit() and len(part) > 2:
                        city = part
                        break
                print(f"[DEBUG] Extracted city from display_name: {city}")  # Debug print
    except Exception as e:
        print(f"[ERROR] Reverse geocoding failed: {e}")
        city = "Unknown"
    return {
        "weather": weather,
        "season": season,
        "location": location,
        "city": city,
        "available_locations": available_locations
    }

from fastapi import Request

@router.post("/location")
async def location_endpoint(request: Request):
    body = await request.json()
    latitude = body.get("latitude")
    longitude = body.get("longitude")
    if latitude is None or longitude is None:
        return {"error": "Missing latitude or longitude in request body"}
    result = get_nearby_fitness_places(latitude, longitude, radius=2000)
    return result
