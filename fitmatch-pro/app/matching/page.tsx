"use client"

import { useState, useEffect } from "react"
import { useApp } from "@/contexts/app-context"
import { Navigation } from "@/components/navigation"
import { MatchingHeader } from "@/components/matching/matching-header"
import { MatchingFilters } from "@/components/matching/matching-filters"
import { MatchedUsers } from "@/components/matching/matched-users"
import { CurrentActivity } from "@/components/matching/current-activity"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Search } from "lucide-react"
import { ApiService } from "@/lib/api-service"
import type { MatchedUser, MatchingPreferences } from "@/lib/types"
import { mapToSupportedActivity } from "@/lib/types"

export default function MatchingPage() {
  const { state } = useApp()
  const [matches, setMatches] = useState<MatchedUser[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false)
  const [preferences, setPreferences] = useState<MatchingPreferences>({
    age_range: [18, 35],
    gender_preference: "any",
    activity_interests: ["swimming", "cardio", "strength_training"], // Use supported activities
    intensity_preference: "moderate",
    "want same city": true, // Default to enabled
  })

  // Current activity suggestion from AI coach (dynamic based on actual recommendations)
  const getCurrentActivitySuggestion = () => {
    // Try to get from AI coach data first
    if (state.aiCoachData?.activity_suggestions?.primary_workout) {
      const primaryWorkout = state.aiCoachData.activity_suggestions.primary_workout
      const intensity = primaryWorkout.intensity?.toLowerCase() || "moderate"

      // Map intensity values to match clean API
      const normalizedIntensity = intensity === 'medium' ? 'moderate' : intensity

      // Use centralized mapping to force LLM to choose from supported activities
      const mappedActivity = mapToSupportedActivity(primaryWorkout.type || "cardio")

      console.log(`🎯 Activity Mapping: "${primaryWorkout.type}" -> "${mappedActivity}" (FORCED from supported list)`)

      return {
        type: mappedActivity,
        originalActivity: mappedActivity, // Now same as type since we force mapping
        activity: mappedActivity,
        duration: primaryWorkout.duration || 35,
        intensity: normalizedIntensity,
      }
    }

    // Fallback to recent activity from historical data
    if (state.historicalData?.activities && state.historicalData.activities.length > 0) {
      const recentActivity = state.historicalData.activities[state.historicalData.activities.length - 1]
      const intensity = recentActivity.intensity?.toLowerCase() || "moderate"

      // Map intensity values to match clean API
      const normalizedIntensity = intensity === 'medium' ? 'moderate' : intensity

      // Use centralized mapping for historical data too
      const mappedActivity = mapToSupportedActivity(recentActivity.activity_type || "cardio")

      return {
        type: mappedActivity,
        originalActivity: mappedActivity,
        activity: mappedActivity,
        duration: recentActivity.duration || 35,
        intensity: normalizedIntensity,
      }
    }

    // Final fallback
    return {
      type: "cardio",
      originalActivity: "cardio",
      activity: "cardio",
      duration: 35,
      intensity: "moderate",
    }
  }

  const currentActivitySuggestion = getCurrentActivitySuggestion()

  // Auto-refresh matches when AI coach data or historical data changes
  useEffect(() => {
    console.log("[v0] 🎯 Current activity suggestion for matching:", currentActivitySuggestion)
    console.log("[v0] 🤖 AI coach data available:", !!state.aiCoachData)
    console.log("[v0] 📊 Historical data available:", !!state.historicalData)
    console.log("[v0] 🔄 AI coach or historical data changed, activity suggestion may have updated")
    // Force re-render to update currentActivitySuggestion
    if (hasAttemptedFetch && matches.length > 0) {
      console.log("[v0] 🔄 Refreshing matches with new activity suggestion")
      // Optionally auto-refresh matches here if desired
      // handleFindMatches()
    }
  }, [state.aiCoachData, state.historicalData])

  const handleFindMatches = async () => {
    if (!state.userProfile) return

    setIsLoading(true)
    setHasError(false)

    const timestamp = new Date().toISOString()
    console.group(`🔍 MATCH SEARCH INITIATED - ${timestamp}`)
    console.log("📍 Location Data:", JSON.stringify(state.locationData, null, 2))
    console.log("� User Profile Available:", !!state.userProfile)
    console.log("🎯 Current Preferences:", JSON.stringify(preferences, null, 2))
    console.log("💪 Activity Suggestion:", JSON.stringify(currentActivitySuggestion, null, 2))

    try {
      const response = await ApiService.getMatches(
        state.userProfile,
        preferences,
        currentActivitySuggestion,
      )
      console.log("✅ Match search completed successfully")
      console.log(`👥 Found ${response.matched_users?.length || 0} matches`)
      console.groupEnd()

      // Handle API response properly
      if (response.matched_users && Array.isArray(response.matched_users)) {
        setMatches(response.matched_users)
      } else {
        console.log("⚠️ Invalid response format, using empty array")
        setMatches([])
      }
      setHasAttemptedFetch(true)
    } catch (error) {
      console.log("❌ Match search failed:", error)
      console.log("🔄 Falling back to offline sample data")
      console.groupEnd()

      setHasError(true)
      setHasAttemptedFetch(true)
      // Use sample data on error
      setMatches([
        {
          user_id: "user_000043",
          compatibility_score: 0.87,
          shared_interests: ["pilates", "strength_training"],
          fitness_level: "intermediate",
          age: 23,
          gender: "Female",
          current_readiness: 79.3,
          availability: "today_evening",
        },
        {
          user_id: "user_000156",
          compatibility_score: 0.82,
          shared_interests: ["cardio", "strength_training"],
          fitness_level: "intermediate",
          age: 25,
          gender: "Male",
          current_readiness: 85.1,
          availability: "tomorrow_morning",
        },
        {
          user_id: "user_000089",
          compatibility_score: 0.75,
          shared_interests: ["pilates", "yoga"],
          fitness_level: "beginner",
          age: 28,
          gender: "Female",
          current_readiness: 72.8,
          availability: "weekend",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (state.userProfile && matches.length === 0 && !hasAttemptedFetch && !isLoading) {
      console.log("[v0] Auto-triggering initial match search")
      handleFindMatches()
    }
  }, [state.userProfile, hasAttemptedFetch])

  if (!state.userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
        <MatchingHeader />

        <div className="grid gap-6 mt-6 lg:grid-cols-3">
          {/* Filters and Current Activity */}
          <div className="space-y-6">
            <CurrentActivity activity={currentActivitySuggestion} />
            <MatchingFilters preferences={preferences} onPreferencesChange={setPreferences} />
            <Card>
              <CardContent className="p-4">
                <Button onClick={handleFindMatches} disabled={isLoading} className="w-full">
                  <Search className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                  {isLoading ? "Finding Matches..." : "Find New Matches"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Matched Users */}
          <div className="lg:col-span-2">
            {hasError && (
              <Card className="mb-4 border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <p className="text-sm text-orange-800">🔄 Using offline data - API server unavailable</p>
                </CardContent>
              </Card>
            )}

            {isLoading && (!matches || matches.length === 0) ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <LoadingSpinner size="lg" />
                  <p className="text-muted-foreground mt-4">Finding your perfect workout partners...</p>
                </CardContent>
              </Card>
            ) : matches && matches.length > 0 ? (
              <MatchedUsers matches={matches} />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Matches Yet</h3>
                  <p className="text-muted-foreground text-center mb-6 max-w-md">
                    Adjust your preferences and search for workout partners who match your fitness goals and schedule.
                  </p>
                  <Button onClick={handleFindMatches}>
                    <Search className="h-4 w-4 mr-2" />
                    Start Matching
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  )
}
