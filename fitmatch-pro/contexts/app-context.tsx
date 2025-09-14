"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { UserProfile, HistoricalData, HealthAnalytics } from "@/lib/types"
import { StorageService } from "@/lib/storage-service"
import { ApiService } from "@/lib/api-service"

interface AppState {
  userProfile: UserProfile | null
  historicalData: HistoricalData | null
  healthAnalytics: HealthAnalytics | null
  aiCoachData: any | null
  locationData: any | null
  isLoading: boolean
  error: string | null
}

type AppAction =
  | { type: "SET_USER_PROFILE"; payload: UserProfile | null }
  | { type: "SET_HISTORICAL_DATA"; payload: HistoricalData | null }
  | { type: "SET_HEALTH_ANALYTICS"; payload: HealthAnalytics | null }
  | { type: "SET_AI_COACH_DATA"; payload: any | null }
  | { type: "SET_LOCATION_DATA"; payload: any | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "CLEAR_ERROR" }
  | { type: "UPDATE_HISTORICAL_DATA"; payload: any } // Add action for data updates

const initialState: AppState = {
  userProfile: null,
  historicalData: null,
  healthAnalytics: null,
  aiCoachData: null,
  locationData: null,
  isLoading: false,
  error: null,
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_USER_PROFILE":
      return { ...state, userProfile: action.payload }
    case "SET_HISTORICAL_DATA":
      return { ...state, historicalData: action.payload }
    case "SET_HEALTH_ANALYTICS":
      return { ...state, healthAnalytics: action.payload }
    case "SET_AI_COACH_DATA":
      return { ...state, aiCoachData: action.payload }
    case "SET_LOCATION_DATA":
      return { ...state, locationData: action.payload }
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false }
    case "CLEAR_ERROR":
      return { ...state, error: null }
    case "UPDATE_HISTORICAL_DATA":
      if (!state.historicalData) return state
      const updatedData = { ...state.historicalData }
      const updates = action.payload

      // Merge detected activities (prevent duplicates)
      if (updates.detected_activities) {
        const existingActivities = updatedData.activities || []
        const newActivities = updates.detected_activities.filter((newActivity: any) => {
          // Only add if not duplicate (check by activity_type, duration, and timestamp)
          return !existingActivities.some((existing: any) =>
            existing.activity_type === newActivity.activity_type &&
            existing.duration === newActivity.duration &&
            existing.timestamp === newActivity.timestamp
          )
        })
        updatedData.activities = [...existingActivities, ...newActivities]
        console.log("[v0] 🏃 Added new activities:", newActivities)
      }

      // Merge nutrition intake (prevent duplicates)
      if (updates.nutrition_intake) {
        const existingNutrition = updatedData.nutrition || []
        const newNutrition = updates.nutrition_intake.filter((newMeal: any) => {
          // Only add if not duplicate (check by meal_type and estimated_calories)
          return !existingNutrition.some((existing: any) =>
            existing.meal_type === newMeal.meal_type &&
            existing.estimated_calories === newMeal.estimated_calories
          )
        })
        updatedData.nutrition = [...existingNutrition, ...newNutrition]
        console.log("[v0] 🍽️ Added new nutrition:", newNutrition)
      }

      // Merge health measurements (prevent duplicates)
      if (updates.health_measurements) {
        const existingMeasurements = updatedData.measurements || []
        const newMeasurements = updates.health_measurements.filter((newMeasurement: any) => {
          // Convert AI Coach format to standard format and check for duplicates
          const measurementType = newMeasurement.measurement_type?.toLowerCase()
          const measurementValue = newMeasurement.value

          // Check if this measurement already exists (handle both formats)
          return !existingMeasurements.some((existing: any) => {
            // Check against original format (e.g., {weight: 66.7, date: "2025-07-30"})
            if (measurementType === 'weight' && existing.weight === measurementValue) return true
            if (measurementType === 'body_fat' && existing.body_fat === measurementValue) return true
            if (measurementType === 'muscle_mass' && existing.muscle_mass === measurementValue) return true
            if (measurementType === 'bmi' && existing.bmi === measurementValue) return true

            // Check against AI Coach format (e.g., {measurement_type: "Weight", value: 65.3})
            if (existing.measurement_type === newMeasurement.measurement_type &&
              existing.value === newMeasurement.value) return true

            return false
          })
        }).map((measurement: any) => ({
          // Normalize to consistent format
          ...measurement,
          date: measurement.date || new Date().toISOString().split('T')[0],
          timestamp: measurement.timestamp || new Date().toISOString()
        }))

        if (newMeasurements.length > 0) {
          updatedData.measurements = [...existingMeasurements, ...newMeasurements]
          console.log("[v0] 📏 Added new measurements:", newMeasurements)
        } else {
          console.log("[v0] 📏 No new measurements to add (all were duplicates)")
        }
      }

      // Update mood indicators
      if (updates.mood_indicators) {
        // Remove this as mood_indicators doesn't exist in HistoricalData type
      }

      return { ...state, historicalData: updatedData }
    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
  actions: {
    updateUserProfile: (profile: UserProfile) => void
    updateHistoricalData: (data: HistoricalData | any) => void // Allow both full data and updates
    updateHealthAnalytics: (analytics: HealthAnalytics) => void
    updateCoachAdvice: (coachData: any) => void
    updateWeatherData: (weatherData: any) => void
    refreshHealthAnalytics: () => Promise<void>
    refreshAICoachData: () => Promise<void>
    updateLocation: (lat: number, lng: number) => Promise<void>
    clearAllData: () => void
    saveAllData: () => void
    cleanDuplicateData: () => void
    debugAICoachData: () => void
  }
} | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load data from localStorage on mount
  useEffect(() => {
    const loadStoredData = () => {
      try {
        console.log("[v0] 💾 Loading data from localStorage...")
        const userProfile = StorageService.getUserProfile()
        const historicalData = StorageService.getHistoricalData()
        const healthAnalytics = StorageService.getHealthAnalytics()
        const aiCoachData = StorageService.getAICoachData()
        const locationData = StorageService.getLocationData()

        if (userProfile) {
          console.log("[v0] 👤 Restored user profile:", userProfile)
          dispatch({ type: "SET_USER_PROFILE", payload: userProfile })
        }
        if (historicalData) {
          console.log("[v0] 📊 Restored historical data:", historicalData)
          dispatch({ type: "SET_HISTORICAL_DATA", payload: historicalData })
        }
        if (healthAnalytics) {
          console.log("[v0] 🧠 Restored health analytics:", healthAnalytics)
          dispatch({ type: "SET_HEALTH_ANALYTICS", payload: healthAnalytics })
        }
        if (aiCoachData) {
          console.log("[v0] 🤖 Restored AI coach data:", aiCoachData)
          dispatch({ type: "SET_AI_COACH_DATA", payload: aiCoachData })
        }
        if (locationData) {
          console.log("[v0] 📍 Restored location data:", locationData)
          dispatch({ type: "SET_LOCATION_DATA", payload: locationData })
        }
        console.log("[v0] ✅ Data restoration complete")
      } catch (error) {
        console.error("[v0] ❌ Error loading stored data:", error)
      }
    }

    loadStoredData()
  }, [])

  // Auto-save state changes to localStorage every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      console.log("[v0] 🔄 Auto-saving state to localStorage...")
      if (state.userProfile) StorageService.saveUserProfile(state.userProfile)
      if (state.historicalData) StorageService.saveHistoricalData(state.historicalData)
      if (state.healthAnalytics) StorageService.saveHealthAnalytics(state.healthAnalytics)
      if (state.aiCoachData) StorageService.saveAICoachData(state.aiCoachData)
      if (state.locationData) StorageService.saveLocationData(state.locationData)
      console.log("[v0] ✅ Auto-save completed")
    }, 30000) // 30 seconds

    return () => clearInterval(autoSaveInterval)
  }, [state])

  // Save state when page is about to unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log("[v0] 💾 Saving state before page unload...")
      if (state.userProfile) StorageService.saveUserProfile(state.userProfile)
      if (state.historicalData) StorageService.saveHistoricalData(state.historicalData)
      if (state.healthAnalytics) StorageService.saveHealthAnalytics(state.healthAnalytics)
      if (state.aiCoachData) StorageService.saveAICoachData(state.aiCoachData)
      if (state.locationData) StorageService.saveLocationData(state.locationData)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [state])

  const actions = {
    updateUserProfile: (profile: UserProfile) => {
      console.log("[v0] 💾 Saving user profile:", profile)
      StorageService.saveUserProfile(profile)
      dispatch({ type: "SET_USER_PROFILE", payload: profile })
    },

    updateHistoricalData: (data: HistoricalData | any) => {
      console.log("[v0] 💾 Updating historical data:", data)
      // Check if this is a full HistoricalData object or incremental updates
      if (data.measurements || data.nutrition || data.activities || data.workouts || data.sleep || data.heart_rate) {
        // Full historical data object
        console.log("[v0] 📊 Saving complete historical data")
        StorageService.saveHistoricalData(data)
        dispatch({ type: "SET_HISTORICAL_DATA", payload: data })
      } else {
        // Incremental updates from chatbot
        console.log("[v0] Processing incremental data updates:", data)
        dispatch({ type: "UPDATE_HISTORICAL_DATA", payload: data })

        // Save updated data to storage
        if (state.historicalData) {
          const updatedData = { ...state.historicalData }

          if (data.detected_activities) {
            updatedData.activities = [...(updatedData.activities || []), ...data.detected_activities]
          }
          if (data.nutrition_intake) {
            updatedData.nutrition = [...(updatedData.nutrition || []), ...data.nutrition_intake]
          }
          if (data.health_measurements) {
            updatedData.measurements = [...(updatedData.measurements || []), ...data.health_measurements]
          }
          // Remove mood_indicators as it doesn't exist in HistoricalData type

          console.log("[v0] 💾 Saving updated historical data to localStorage")
          StorageService.saveHistoricalData(updatedData)
        }
      }
    },

    updateHealthAnalytics: (analytics: HealthAnalytics) => {
      console.log("[v0] 💾 Saving health analytics:", analytics)
      StorageService.saveHealthAnalytics(analytics)
      dispatch({ type: "SET_HEALTH_ANALYTICS", payload: analytics })
    },

    updateCoachAdvice: (coachData: any) => {
      console.log("[v0] 💾 Saving AI coach data:", coachData)

      // Process data_updates if present
      if (coachData.data_updates) {
        console.log("[v0] 🔄 Processing data_updates from AI coach:", coachData.data_updates)

        // Update historical data with new activities/measurements
        if (coachData.data_updates.detected_activities && coachData.data_updates.detected_activities.length > 0) {
          console.log("[v0] 🏃 Processing detected activities:", coachData.data_updates.detected_activities)

          // Filter out activities with null/missing data
          const validActivities = coachData.data_updates.detected_activities.filter((activity: any) =>
            activity.activity_type && activity.activity_type !== null
          ).map((activity: any) => ({
            ...activity,
            date: activity.timestamp || activity.date || new Date().toISOString().split('T')[0],
            duration: activity.duration || 30, // Default duration if missing
            intensity: activity.intensity || "Medium", // Default intensity if missing
            calories_burned: activity.calories_burned || 0,
            heart_rate_avg: activity.heart_rate_avg || 0
          }))

          if (validActivities.length > 0) {
            console.log("[v0] ✅ Adding valid activities to historical data:", validActivities)

            // Add to historical data immediately
            if (state.historicalData) {
              const updatedHistoricalData = {
                ...state.historicalData,
                activities: [...(state.historicalData.activities || []), ...validActivities]
              }
              StorageService.saveHistoricalData(updatedHistoricalData)
              dispatch({ type: "SET_HISTORICAL_DATA", payload: updatedHistoricalData })
            }
          }
        }

        // Process other data updates
        dispatch({ type: "UPDATE_HISTORICAL_DATA", payload: coachData.data_updates })
      }

      // Save the coach data
      StorageService.saveAICoachData(coachData)
      dispatch({ type: "SET_AI_COACH_DATA", payload: coachData })
    },

    updateWeatherData: (weatherData: any) => {
      console.log("[v0] 💾 Saving location data:", weatherData)
      StorageService.saveLocationData(weatherData)
      dispatch({ type: "SET_LOCATION_DATA", payload: weatherData })
    },

    refreshHealthAnalytics: async () => {
      if (!state.userProfile || !state.historicalData) return

      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "CLEAR_ERROR" }) // Clear previous errors

      try {
        console.log("[v0] Calling health analytics API")
        const analytics = await ApiService.getHealthAnalytics(state.userProfile, state.historicalData)
        console.log("[v0] Health analytics API success:", analytics)
        StorageService.saveHealthAnalytics(analytics)
        dispatch({ type: "SET_HEALTH_ANALYTICS", payload: analytics })
      } catch (error) {
        console.log("[v0] Health analytics API error:", error)
        const errorMessage =
          error instanceof Error && error.message.includes("Failed to fetch")
            ? "Cannot connect to health analytics service. Using offline data."
            : "Failed to fetch health analytics"
        dispatch({ type: "SET_ERROR", payload: errorMessage })
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },

    refreshAICoachData: async () => {
      if (!state.userProfile || !state.historicalData) return

      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "CLEAR_ERROR" })

      try {
        console.log("[v0] Calling AI coach API")
        const coachData = await ApiService.getAICoachAdvice(
          state.userProfile,
          state.historicalData,
          undefined,
          state.locationData, // Include location data from /location endpoint
        )
        console.log("[v0] AI coach API success:", coachData)
        StorageService.saveAICoachData(coachData)
        dispatch({ type: "SET_AI_COACH_DATA", payload: coachData })
      } catch (error) {
        console.log("[v0] AI coach API error:", error)
        const errorMessage =
          error instanceof Error && error.message.includes("Failed to fetch")
            ? "Cannot connect to AI coach service. Using offline recommendations."
            : "Failed to fetch AI coach data"
        dispatch({ type: "SET_ERROR", payload: errorMessage })
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },

    updateLocation: async (lat: number, lng: number) => {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "CLEAR_ERROR" }) // Clear previous errors

      try {
        console.log("[v0] Calling location API")
        const locationData = await ApiService.getLocationData({ latitude: lat, longitude: lng })
        console.log("[v0] Location API success:", locationData)
        console.log("[v0] 💾 Saving location data to localStorage")
        StorageService.saveLocationData(locationData)
        dispatch({ type: "SET_LOCATION_DATA", payload: locationData })
      } catch (error) {
        console.log("[v0] Location API error:", error)
        const errorMessage =
          error instanceof Error && error.message.includes("Failed to fetch")
            ? "Cannot connect to location service. Location features unavailable."
            : "Failed to fetch location data"
        dispatch({ type: "SET_ERROR", payload: errorMessage })
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },

    // Clear all stored data (for testing or reset)
    clearAllData: () => {
      console.log("[v0] 🗑️ Clearing all stored data")
      StorageService.clearAll()
      dispatch({ type: "SET_USER_PROFILE", payload: null })
      dispatch({ type: "SET_HISTORICAL_DATA", payload: null })
      dispatch({ type: "SET_HEALTH_ANALYTICS", payload: null })
      dispatch({ type: "SET_AI_COACH_DATA", payload: null })
      dispatch({ type: "SET_LOCATION_DATA", payload: null })
      console.log("[v0] ✅ All data cleared")
    },

    // Manual save all current state to localStorage
    saveAllData: () => {
      console.log("[v0] 💾 Manual save of all current state")
      if (state.userProfile) StorageService.saveUserProfile(state.userProfile)
      if (state.historicalData) StorageService.saveHistoricalData(state.historicalData)
      if (state.healthAnalytics) StorageService.saveHealthAnalytics(state.healthAnalytics)
      if (state.aiCoachData) StorageService.saveAICoachData(state.aiCoachData)
      if (state.locationData) StorageService.saveLocationData(state.locationData)
      console.log("[v0] ✅ All data saved successfully")
    },

    // Clean duplicate data from historical data
    cleanDuplicateData: () => {
      if (!state.historicalData) return

      console.log("[v0] 🧹 Cleaning duplicate data...")
      const cleanedData = { ...state.historicalData }

      // Remove duplicate activities
      const uniqueActivities = cleanedData.activities.filter((activity, index, self) =>
        index === self.findIndex(a =>
          a.activity_type === activity.activity_type &&
          a.duration === activity.duration &&
          a.date === activity.date
        )
      )

      // Remove duplicate nutrition entries
      const uniqueNutrition = cleanedData.nutrition.filter((meal, index, self) =>
        index === self.findIndex(m =>
          m.meal_type === meal.meal_type &&
          m.calories === meal.calories &&
          m.date === meal.date
        )
      )

      // Remove duplicate measurements (handle both formats)
      const uniqueMeasurements = cleanedData.measurements.filter((measurement: any, index: number, self: any[]) => {
        return index === self.findIndex((m: any) => {
          // Handle original format comparison
          if (m.weight && measurement.weight && m.date && measurement.date) {
            return m.weight === measurement.weight && m.date === measurement.date
          }

          // Handle AI Coach format comparison
          if (m.measurement_type && measurement.measurement_type && m.value && measurement.value) {
            return m.measurement_type === measurement.measurement_type &&
              m.value === measurement.value
          }

          // Cross-format comparison (AI format vs original format)
          if (measurement.measurement_type && m.weight) {
            const measurementType = measurement.measurement_type.toLowerCase()
            if (measurementType === 'weight' && m.weight === measurement.value) return true
          }
          if (m.measurement_type && measurement.weight) {
            const mType = m.measurement_type.toLowerCase()
            if (mType === 'weight' && measurement.weight === m.value) return true
          }

          return false
        })
      })

      cleanedData.activities = uniqueActivities
      cleanedData.nutrition = uniqueNutrition
      cleanedData.measurements = uniqueMeasurements

      console.log("[v0] 🧹 Removed duplicates - Activities:", cleanedData.activities.length, "Nutrition:", cleanedData.nutrition.length, "Measurements:", cleanedData.measurements.length)

      StorageService.saveHistoricalData(cleanedData)
      dispatch({ type: "SET_HISTORICAL_DATA", payload: cleanedData })
    },

    // Debug function to check current AI coach data
    debugAICoachData: () => {
      console.log("[v0] 🔍 Current AI Coach Data:", state.aiCoachData)
      console.log("[v0] 🔍 Current Historical Data:", state.historicalData)
      console.log("[v0] 🔍 localStorage AI Coach Data:", StorageService.getAICoachData())
      console.log("[v0] 🔍 localStorage Historical Data:", StorageService.getHistoricalData())

      if (state.aiCoachData?.activity_suggestions?.primary_workout) {
        console.log("[v0] 🎯 Primary Workout Suggestion:", state.aiCoachData.activity_suggestions.primary_workout)
      }

      if (state.aiCoachData?.data_updates?.detected_activities) {
        console.log("[v0] 🏃 Detected Activities:", state.aiCoachData.data_updates.detected_activities)
      }
    },
  }

  return <AppContext.Provider value={{ state, dispatch, actions }}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
