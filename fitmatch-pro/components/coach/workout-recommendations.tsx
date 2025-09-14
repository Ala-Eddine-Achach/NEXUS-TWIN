"use client"

import { useApp } from "@/contexts/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, Clock, Zap, Plus } from "lucide-react"

export function WorkoutRecommendations() {
  const { state } = useApp()

  // Default workout recommendations if no AI coach data
  const defaultWorkouts = {
    activity_suggestions: {
      primary_workout: {
        type: "Pilates",
        duration: 60,
        intensity: "Low",
        specific_exercises: ["Pilates Roll-Up", "Pilates Hundred", "Single Leg Stretch", "Plank Hold"],
      },
      supplementary_activities: [
        {
          activity: "Yoga",
          duration: 30,
          benefits: "Improved flexibility and relaxation",
        },
        {
          activity: "Walking",
          duration: 45,
          benefits: "Low-impact cardiovascular health",
        },
      ],
      rest_recommendations: {
        active_recovery_type: "Stretching",
        duration: 15,
      },
    },
  }

  const coachData = state.aiCoachData || defaultWorkouts
  const workoutSuggestions = coachData.activity_suggestions

  const getIntensityColor = (intensity: string) => {
    switch (intensity?.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "medium":
      case "moderate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const handleStartWorkout = (workout: any) => {
    // In a real app, this would start a workout session
    console.log("Starting workout:", workout)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Workout Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Workout */}
        {workoutSuggestions?.primary_workout && (
          <div className="p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold text-lg">{workoutSuggestions.primary_workout.type}</h4>
                <p className="text-sm text-muted-foreground">Recommended primary workout</p>
              </div>
              <Button size="sm" onClick={() => handleStartWorkout(workoutSuggestions.primary_workout)}>
                <Plus className="h-4 w-4 mr-2" />
                Start Workout
              </Button>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{workoutSuggestions.primary_workout.duration} min</span>
              </div>
              <Badge className={getIntensityColor(workoutSuggestions.primary_workout.intensity)}>
                {workoutSuggestions.primary_workout.intensity} Intensity
              </Badge>
            </div>

            {workoutSuggestions.primary_workout.specific_exercises && (
              <div>
                <h5 className="font-medium mb-2">Specific Exercises:</h5>
                <div className="grid gap-2 md:grid-cols-2">
                  {workoutSuggestions.primary_workout.specific_exercises.map((exercise: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 rounded bg-background/50">
                      <Zap className="h-3 w-3 text-primary" />
                      <span className="text-sm">{exercise}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Supplementary Activities */}
        {workoutSuggestions?.supplementary_activities && (
          <div>
            <h4 className="font-medium mb-3">Supplementary Activities</h4>
            <div className="grid gap-3 md:grid-cols-2">
              {workoutSuggestions.supplementary_activities.map((activity: any, index: number) => (
                <Card key={index} className="border-muted">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">{activity.activity}</h5>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {activity.duration} min
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.benefits}</p>
                    <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent">
                      Add to Schedule
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Rest Recommendations */}
        {workoutSuggestions?.rest_recommendations && (
          <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                  <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h5 className="font-medium">Active Recovery</h5>
                  <p className="text-sm text-muted-foreground">
                    {workoutSuggestions.rest_recommendations.active_recovery_type} for{" "}
                    {workoutSuggestions.rest_recommendations.duration} minutes
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}
