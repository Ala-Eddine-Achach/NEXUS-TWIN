// Core data types for FitMatch Pro
export interface UserProfile {
  user_id: string
  age: number
  gender: string
  height: number
  weight: number
  fitness_level: string
}

export interface HealthMeasurement {
  date: string
  weight: number
  body_fat: number
  muscle_mass: number
  bmi: number
}

export interface NutritionEntry {
  date: string
  meal_type: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  water_intake: number
}

export interface Activity {
  date: string
  activity_type: string
  duration: number
  calories_burned: number
  intensity: string
  heart_rate_avg: number
}

export interface Workout {
  date: string
  workout_type: string
  duration: number
  calories_burned: number
  heart_rate_avg: number
  rest_time: number
}

export interface SleepData {
  date: string
  total_sleep: number
  deep_sleep: number
  sleep_efficiency: number
  resting_heart_rate: number
}

export interface HeartRateData {
  date_time: string
  value: number
  zone: string
  context: string
}

export interface HistoricalData {
  measurements: HealthMeasurement[]
  nutrition: NutritionEntry[]
  activities: Activity[]
  workouts: Workout[]
  sleep: SleepData[]
  heart_rate: HeartRateData[]
}

export interface HealthAnalytics {
  energy_level: number
  recovery_index: number
  readiness_score: number
}

export interface LocationData {
  latitude: number
  longitude: number
  city?: string
}

export interface AvailableLocation {
  name: string
  type: string
  lat: number
  lon: number
}

export interface WeatherResponse {
  weather: string
  season: string
  location: LocationData
  available_locations: AvailableLocation[]
}

export interface MatchedUser {
  user_id: string
  compatibility_score: number
  shared_interests: string[]
  fitness_level: string
  age: number
  gender: string
  current_readiness: number
  availability: string
  location?: {
    city: string
    distance_km: number
  }
}

// Centralized list of supported activities - used everywhere
export const SUPPORTED_ACTIVITIES = [
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
] as const

export type SupportedActivity = typeof SUPPORTED_ACTIVITIES[number]

// Activity display labels for UI
export const ACTIVITY_LABELS: Record<SupportedActivity, string> = {
  swimming: 'Swimming',
  running: 'Running',
  cycling: 'Cycling',
  strength_training: 'Strength Training',
  yoga: 'Yoga',
  pilates: 'Pilates',
  cardio: 'Cardio',
  boxing: 'Boxing',
  hiking: 'Hiking',
  dancing: 'Dancing'
}

// Function to force LLM to choose from supported activities
export function mapToSupportedActivity(activity: string): SupportedActivity {
  const normalized = activity.toLowerCase().replace(/[^a-z]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '')

  // Direct matches
  if (SUPPORTED_ACTIVITIES.includes(normalized as SupportedActivity)) {
    return normalized as SupportedActivity
  }

  // Force mapping for common variations
  const mappings: Record<string, SupportedActivity> = {
    'swim': 'swimming',
    'run': 'running',
    'jog': 'running',
    'jogging': 'running',
    'bike': 'cycling',
    'biking': 'cycling',
    'weight': 'strength_training',
    'weights': 'strength_training',
    'lifting': 'strength_training',
    'gym': 'strength_training',
    'bodyweight': 'strength_training',
    'resistance': 'strength_training',
    'walk': 'cardio',
    'walking': 'cardio',
    'aerobic': 'cardio',
    'aerobics': 'cardio',
    'stretch': 'yoga',
    'stretching': 'yoga',
    'flexibility': 'yoga',
    'dance': 'dancing',
    'hike': 'hiking',
    'trekking': 'hiking',
    'climb': 'hiking',
    'climbing': 'hiking'
  }

  if (mappings[normalized]) {
    return mappings[normalized]
  }

  // Default fallback
  return 'cardio'
}

// New simplified matching request structure
export interface MatchingRequest {
  user_id: string
  age: number
  gender: string // "Male", "Female"
  city: string
  fitness_level: string // "Beginner", "Intermediate", "Advanced"
  energy_level: number // 0-100
  recovery_index: number // 0-100
  readiness_score: number // 0-100
  activity_interests: string[] // ["yoga", "cycling", "cardio", etc.]
  intensity_preference: string // "low", "moderate", "high"
  suggestion_type: string // "yoga", "cardio", "strength_training", etc.
  duration: number // workout duration in minutes
  preferences: {
    age_range_min: number
    age_range_max: number
    gender_preference: string // "male", "female", "any"
    same_suggestion: boolean
    same_city: boolean
  }
}

// Keep the old interface for backward compatibility during transition
export interface MatchingPreferences {
  age_range: [number, number]
  gender_preference: string
  activity_interests: string[]
  intensity_preference: string
  "want same city"?: boolean // Preference for same city matching
}
