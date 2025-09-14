// API service for FitMatch Pro endpoints
import type {
  UserProfile,
  HistoricalData,
  HealthAnalytics,
  WeatherResponse,
  MatchedUser,
  MatchingPreferences,
  LocationData,
} from "./types"

const API_BASE_URL = "http://localhost:8000"
const REQUEST_TIMEOUT = 10000 // 10 seconds

const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = REQUEST_TIMEOUT) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout - server may be unavailable")
    }
    if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
      throw new Error("CORS_ERROR: API server unavailable or CORS not configured")
    }
    throw error
  }
}

export class ApiService {
  private static isCorsError(error: Error): boolean {
    return (
      error.message.includes("CORS_ERROR") ||
      error.message.includes("Failed to fetch") ||
      error.message.includes("Network request failed") ||
      error.message.includes("ERR_FAILED") ||
      error.message.includes("blocked by CORS policy")
    )
  }

  private static createFallbackResponse(type: string) {
    console.log(`[v0] Using fallback data for ${type} due to API unavailability`)

    switch (type) {
      case "health":
        return {
          health_score: 75,
          recommendations: ["Stay hydrated", "Get adequate sleep", "Maintain regular exercise"],
          risk_factors: ["API server unavailable - using offline mode"],
          predicted_metrics: {
            energy_level: 75,
            recovery_index: 80,
            readiness_score: 78,
          },
        }
      case "coach":
        return {
          advice_response:
            "I'm currently offline, but here are some general fitness tips: Stay consistent with your workouts, focus on proper form, and listen to your body for rest days.",
          data_updates: {},
          activity_suggestions: ["30-minute walk", "Bodyweight exercises", "Stretching routine"],
          nutrition_plan: ["Eat balanced meals", "Stay hydrated", "Include protein in each meal"],
          behavioral_insights: ["Consistency is key", "Progress over perfection", "Rest is part of training"],
        }
      case "location":
        return {
          weather: "offline, 22°C",
          season: "unknown",
          location: {
            latitude: 40.7831,
            longitude: -73.9712,
            city: "New York" // City nested under location object
          },
          available_locations: [
            {
              name: "Central Park",
              type: "park",
              lat: 40.7831,
              lon: -73.9712
            },
            {
              name: "Local Gym",
              type: "fitness_centre",
              lat: 40.7831,
              lon: -73.9712
            }
          ]
        }
      case "matching":
        return {
          matched_users: [
            {
              user_id: "user_sample_001",
              compatibility_score: 0.92,
              shared_interests: ["running", "yoga", "strength_training"],
              fitness_level: "intermediate",
              age: 28,
              gender: "female",
              current_readiness: 85,
              availability: "available",
              location: {
                city: "New York",
                distance_km: 2.1
              }
            },
            {
              user_id: "user_sample_002",
              compatibility_score: 0.87,
              shared_interests: ["pilates", "hiking"],
              fitness_level: "beginner",
              age: 32,
              gender: "male",
              current_readiness: 78,
              availability: "available",
              location: {
                city: "New York",
                distance_km: 5.3
              }
            }
          ],
        }
      default:
        return null
    }
  }

  // Location & Weather Service
  static async getLocationData(location: LocationData): Promise<WeatherResponse> {
    try {
      console.log("[v0] 📍 Location API - INPUT:", JSON.stringify(location, null, 2))
      console.log("[v0] Making location API request to:", `${API_BASE_URL}/location`)

      const requestBody = {
        latitude: location.latitude,
        longitude: location.longitude,
      }
      console.log("[v0] 📤 Location API - REQUEST BODY:", JSON.stringify(requestBody, null, 2))

      const response = await fetchWithTimeout(`${API_BASE_URL}/location`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        console.error("[v0] ❌ Location API - ERROR RESPONSE:", response.status, response.statusText)
        throw new Error(`Location API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("[v0] ✅ Location API - OUTPUT:", JSON.stringify(data, null, 2))
      console.log("[v0] Location API response received successfully")
      return data
    } catch (error) {
      const err = error as Error
      console.log("[v0] 🚫 Location API - ERROR:", err.message)
      if (this.isCorsError(err)) {
        console.log("[v0] Location API CORS error - using fallback data")
        const fallbackData = this.createFallbackResponse("location")
        console.log("[v0] 📦 Location API - FALLBACK OUTPUT:", JSON.stringify(fallbackData, null, 2))
        return fallbackData as any
      } else {
        console.error("[v0] Location API error:", error)
      }
      throw error
    }
  }

  private static getLastTwoDaysData(historicalData: HistoricalData) {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const twoDaysAgo = new Date(today)
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

    // Helper function to get data for a specific day
    const getDataForDay = (targetDate: Date) => {
      const dateStr = targetDate.toISOString().split('T')[0]

      // Find sleep data for the day
      const sleepData = (historicalData.sleep || []).find(item =>
        item.date === dateStr
      )

      // Find heart rate data for the day (using date_time field)
      const heartRateData = (historicalData.heart_rate || []).find(item =>
        item.date_time?.startsWith(dateStr)
      )

      // Find nutrition data for the day
      const nutritionData = (historicalData.nutrition || []).filter(item =>
        item.date === dateStr
      )

      // Find measurements for the day
      const measurementData = (historicalData.measurements || []).find(item =>
        item.date === dateStr
      )

      // Find activities for the day
      const activityData = (historicalData.activities || []).filter(item =>
        item.date === dateStr
      )

      // Calculate totals from nutrition data
      const totalProtein = nutritionData.reduce((sum, item) => sum + (item.protein || 0), 0)
      const totalCarbs = nutritionData.reduce((sum, item) => sum + (item.carbs || 0), 0)
      const totalFat = nutritionData.reduce((sum, item) => sum + (item.fat || 0), 0)
      const totalCalories = nutritionData.reduce((sum, item) => sum + (item.calories || 0), 0)

      // Calculate calories burned from activities
      const totalCaloriesBurned = activityData.reduce((sum, item) => sum + (item.calories_burned || 0), 0)

      // Determine overall intensity from activities
      const intensities = activityData.map(item => item.intensity || 'Low').filter(Boolean)
      const avgIntensity = intensities.length > 0 ?
        intensities.includes('High') ? 'High' :
          intensities.includes('Moderate') ? 'Moderate' : 'Low' : 'Low'

      return {
        total_sleep: sleepData?.total_sleep || 7.5,
        deep_sleep: sleepData?.deep_sleep || 1.8,
        resting_heart_rate: sleepData?.resting_heart_rate || heartRateData?.value || 58,
        calories: totalCalories || 2200,
        calories_burned: totalCaloriesBurned || 2400,
        protein: Math.round(totalProtein) || 110,
        carbs: Math.round(totalCarbs) || 250,
        fat: Math.round(totalFat) || 75,
        intensity: avgIntensity,
        value: measurementData?.weight || 65
      }
    }

    const dayTMinus2Data = getDataForDay(twoDaysAgo)
    const dayTMinus1Data = getDataForDay(yesterday)

    console.log("[v0] 📅 Formatted last 2 days data:")
    console.log("[v0] Day T-2 (two days ago):", JSON.stringify(dayTMinus2Data, null, 2))
    console.log("[v0] Day T-1 (yesterday):", JSON.stringify(dayTMinus1Data, null, 2))

    return {
      day_t_minus_2: dayTMinus2Data,
      day_t_minus_1: dayTMinus1Data
    }
  }

  // Health Analytics Service
  static async getHealthAnalytics(userProfile: UserProfile, historicalData: HistoricalData): Promise<HealthAnalytics> {
    try {
      console.log("[v0] 🧠 Health Analytics API - INPUT:")
      console.log("[v0] 👤 User Profile:", JSON.stringify(userProfile, null, 2))
      console.log("[v0] 📊 Historical Data:", JSON.stringify(historicalData, null, 2))
      console.log("[v0] Making health analytics API request to:", `${API_BASE_URL}/predict`)

      const lastTwoDaysData = this.getLastTwoDaysData(historicalData)
      console.log("[v0] 📅 Last 2 days data (NEW FORMAT):", JSON.stringify(lastTwoDaysData, null, 2))

      // Verify the structure matches the expected format
      console.log("[v0] 🔍 STRUCTURE VERIFICATION:")
      console.log("  ✓ Has day_t_minus_2:", !!lastTwoDaysData.day_t_minus_2)
      console.log("  ✓ Has day_t_minus_1:", !!lastTwoDaysData.day_t_minus_1)
      console.log("  ✓ T-2 total_sleep:", lastTwoDaysData.day_t_minus_2?.total_sleep)
      console.log("  ✓ T-1 total_sleep:", lastTwoDaysData.day_t_minus_1?.total_sleep)
      console.log("  ✓ T-2 calories:", lastTwoDaysData.day_t_minus_2?.calories)
      console.log("  ✓ T-1 calories:", lastTwoDaysData.day_t_minus_1?.calories)

      const requestBody = {
        day_t_minus_2: lastTwoDaysData.day_t_minus_2,
        day_t_minus_1: lastTwoDaysData.day_t_minus_1,
      }
      console.log("[v0] 📤 Health Analytics API - REQUEST BODY:", JSON.stringify(requestBody, null, 2))

      const response = await fetchWithTimeout(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        console.error("[v0] ❌ Health Analytics API - ERROR RESPONSE:", response.status, response.statusText)
        throw new Error(`Health Analytics API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("[v0] ✅ Health Analytics API - OUTPUT:", JSON.stringify(data, null, 2))
      console.log("[v0] Health analytics API response received successfully")
      return data
    } catch (error) {
      const err = error as Error
      console.log("[v0] 🚫 Health Analytics API - ERROR:", err.message)
      if (this.isCorsError(err)) {
        console.log("[v0] Health Analytics API CORS error - using offline fallback")
        const fallbackData = this.createFallbackResponse("health")
        console.log("[v0] 📦 Health Analytics API - FALLBACK OUTPUT:", JSON.stringify(fallbackData, null, 2))
        return fallbackData as any
      } else {
        console.error("[v0] Health Analytics API error:", error)
      }
      throw error
    }
  }

  // AI Health Coach Service
  static async getAICoachAdvice(
    userProfile: UserProfile,
    historicalData: HistoricalData,
    userMessage?: string,
    locationData?: any,
    chatHistory?: any[]
  ) {
    try {
      console.log("[v0] 🤖 AI Coach API - INPUT:")
      console.log("[v0] 👤 User Profile:", JSON.stringify(userProfile, null, 2))
      console.log("[v0] 📊 Historical Data:", JSON.stringify(historicalData, null, 2))
      console.log("[v0] 💬 User Message:", userMessage || "No message")
      console.log("[v0] 📍 Location Data:", JSON.stringify(locationData, null, 2))
      console.log("[v0] 💭 Chat History:", JSON.stringify(chatHistory, null, 2))
      console.log("[v0] Making AI coach API request to:", `${API_BASE_URL}/llm`)

      const requestBody = {
        input_json: {
          user_profile: userProfile,
          historical_data: historicalData,
          user_message: userMessage || "Give me general fitness recommendations",
          location_data: locationData, // Add location data from /location endpoint
          chat_history: chatHistory || [], // Add chat history for context
        },
      }

      console.log("[v0] 📤 AI Coach API - REQUEST BODY:", JSON.stringify(requestBody, null, 2))
      console.log("[v0] LLM request includes location data:", !!locationData)

      const response = await fetchWithTimeout(`${API_BASE_URL}/llm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        console.error("[v0] ❌ AI Coach API - ERROR RESPONSE:", response.status, response.statusText)
        throw new Error(`AI Coach API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("[v0] ✅ AI Coach API - OUTPUT:", JSON.stringify(data, null, 2))
      console.log("[v0] AI coach API response received successfully")
      return data
    } catch (error) {
      const err = error as Error
      console.log("[v0] 🚫 AI Coach API - ERROR:", err.message)
      if (this.isCorsError(err)) {
        console.log("[v0] AI Coach API CORS error - using offline fallback")
        const fallbackData = this.createFallbackResponse("coach")
        console.log("[v0] 📦 AI Coach API - FALLBACK OUTPUT:", JSON.stringify(fallbackData, null, 2))
        return fallbackData
      } else {
        console.error("[v0] AI Coach API error:", error)
      }
      throw error
    }
  }

  // Social Matching Service
  static async getMatches(
    userProfile: UserProfile,
    preferences: MatchingPreferences,
    currentActivitySuggestion: any,
    locationData?: any,
  ): Promise<{ matched_users: MatchedUser[] }> {
    const startTime = performance.now()
    const timestamp = new Date().toISOString()

    console.group(`🤝 MATCHING API - ${timestamp}`)

    try {
      console.group("📥 INPUT DATA")
      console.log("👤 User Profile:", JSON.stringify(userProfile, null, 2))
      console.log("🎯 Preferences:", JSON.stringify(preferences, null, 2))
      console.log("💪 Current Activity Suggestion:", JSON.stringify(currentActivitySuggestion, null, 2))
      console.log("📍 Location Data:", JSON.stringify(locationData, null, 2))
      console.groupEnd()

      console.log("🌐 API Endpoint:", `${API_BASE_URL}/match`)

      // HYBRID APPROACH: Send old nested format to API (for server compatibility)
      // but log the new clean format for debugging
      console.log("🌍 Location data analysis:")
      console.log("  Raw locationData:", JSON.stringify(locationData, null, 2))
      console.log("  locationData?.location?.city:", locationData?.location?.city)
      console.log("  locationData?.city:", locationData?.city)

      const extractedCity = locationData?.location?.city || locationData?.city || "Unknown"
      console.log("  Final extracted city:", extractedCity)

      const requestBody = {
        user_profile: {
          user_id: userProfile.user_id,
          age: userProfile.age,
          gender: userProfile.gender,
          fitness_level: userProfile.fitness_level,
          city: extractedCity,
          current_metrics: {
            energy_level: 82.1,
            recovery_index: 88.7,
            readiness_score: 84.9,
          }
        },
        preferences: {
          "want same city": preferences["want same city"] || false,
          age_range: preferences.age_range,
          gender_preference: preferences.gender_preference,
          activity_interests: preferences.activity_interests,
          intensity_preference: preferences.intensity_preference
        },
        current_activity_suggestion: {
          type: currentActivitySuggestion?.originalActivity || currentActivitySuggestion?.type || "strength_training",
          duration: currentActivitySuggestion?.duration || 30,
          intensity: currentActivitySuggestion?.intensity || "moderate"
        }
      }

      // NEW CLEAN FORMAT FOR FUTURE USE
      const cleanRequestBody = {
        user_id: userProfile.user_id,
        age: userProfile.age,
        gender: userProfile.gender,
        city: extractedCity,
        fitness_level: userProfile.fitness_level,
        energy_level: 82.1,
        recovery_index: 88.7,
        readiness_score: 84.9,
        activity_interests: preferences.activity_interests,
        intensity_preference: preferences.intensity_preference,
        suggestion_type: currentActivitySuggestion?.originalActivity || currentActivitySuggestion?.type || "strength_training",
        duration: currentActivitySuggestion?.duration || 30,
        preferences: {
          age_range_min: preferences.age_range[0],
          age_range_max: preferences.age_range[1],
          gender_preference: preferences.gender_preference,
          same_suggestion: true,
          same_city: preferences["want same city"] || false
        }
      }

      console.group("📤 REQUEST PAYLOAD")
      console.log("🔄 CURRENT (Nested) - Sent to API:", JSON.stringify(requestBody, null, 2))
      console.log("\n🚀 FUTURE (Clean Flattened) - For Reference:")
      console.log(JSON.stringify(cleanRequestBody, null, 2))
      console.log("\n📋 CLEAN FLATTENED STRUCTURE:")
      console.log(`{
  "user_id": "${userProfile.user_id}",
  "age": ${userProfile.age},
  "gender": "${userProfile.gender}",
  "city": "${extractedCity}",
  "fitness_level": "${userProfile.fitness_level}",
  "energy_level": 82.1,
  "recovery_index": 88.7,
  "readiness_score": 84.9,
  "activity_interests": ${JSON.stringify(preferences.activity_interests)},
  "intensity_preference": "${preferences.intensity_preference}",
  "suggestion_type": "${currentActivitySuggestion?.originalActivity || currentActivitySuggestion?.type || "strength_training"}",
  "duration": ${currentActivitySuggestion?.duration || 30},
  "preferences": {
    "age_range_min": ${preferences.age_range[0]},
    "age_range_max": ${preferences.age_range[1]},
    "gender_preference": "${preferences.gender_preference}",
    "same_suggestion": true,
    "same_city": ${preferences["want same city"] || false}
  }
}`)
      console.groupEnd()

      const response = await fetchWithTimeout(`${API_BASE_URL}/match`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        console.error("❌ API ERROR:", response.status, response.statusText)
        throw new Error(`Matching API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const endTime = performance.now()

      console.group("📥 RESPONSE DATA")
      console.log("✅ Raw Response:", JSON.stringify(data, null, 2))
      console.log(`⚡ Response Time: ${Math.round(endTime - startTime)}ms`)
      console.log(`👥 Matches Found: ${data.matched_users?.length || 0}`)
      if (data.matched_users?.length > 0) {
        console.log("🏆 Top Match:", {
          user_id: data.matched_users[0].user_id,
          compatibility_score: data.matched_users[0].compatibility_score,
          shared_interests: data.matched_users[0].shared_interests
        })
      }
      console.groupEnd()

      console.groupEnd() // Close main group
      return data
    } catch (error) {
      const err = error as Error
      const endTime = performance.now()

      console.group("🚫 ERROR HANDLING")
      console.error("Error Message:", err.message)
      console.log(`⏱️ Failed After: ${Math.round(endTime - startTime)}ms`)

      if (this.isCorsError(err)) {
        console.log("🔄 Using CORS fallback data")
        const fallbackData = this.createFallbackResponse("matching") as { matched_users: MatchedUser[] }
        console.log("📦 Fallback Response:", JSON.stringify(fallbackData, null, 2))
        console.log(`👥 Fallback Matches: ${fallbackData.matched_users?.length || 0}`)
        console.groupEnd()
        console.groupEnd() // Close main group
        return fallbackData
      } else {
        console.error("💥 Unhandled Error:", error)
        console.groupEnd()
        console.groupEnd() // Close main group
      }
      throw error
    }
  }
}
