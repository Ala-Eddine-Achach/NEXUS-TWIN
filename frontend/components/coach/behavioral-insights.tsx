"use client"

import { useApp } from "@/contexts/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, Award, Calendar } from "lucide-react"

export function BehavioralInsights() {
  const { state } = useApp()

  // Default behavioral insights if no AI coach data
  const defaultInsights = {
    data_updates: {
      mood_indicators: {
        stress_level: 3,
        energy_perception: 8,
        motivation_score: 7,
      },
    },
    behavioral_insights: {
      motivation_message: "You're making great progress with your fitness routine! Keep up the consistent effort.",
      habit_formation_tip: "Try scheduling your workouts at the same time each day to build a stronger routine.",
      progress_celebration: "Celebrate your achievements - you've been consistent with your Pilates practice!",
    },
  }

  const coachData = state.aiCoachData || defaultInsights
  const moodData = coachData.data_updates?.mood_indicators
  const insights = coachData.behavioral_insights

  // Calculate overall wellness score
  const getWellnessScore = () => {
    if (!moodData) return 75

    const stressScore = (10 - moodData.stress_level) * 10 // Invert stress (lower is better)
    const energyScore = moodData.energy_perception * 10
    const motivationScore = moodData.motivation_score * 10

    return Math.round((stressScore + energyScore + motivationScore) / 3)
  }

  const wellnessScore = getWellnessScore()

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Behavioral Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Wellness Score Overview */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-semibold">Overall Wellness Score</h4>
              <p className="text-sm text-muted-foreground">Based on your mood and energy indicators</p>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${getScoreColor(wellnessScore)}`}>{wellnessScore}</div>
              <div className="text-sm text-muted-foreground">out of 100</div>
            </div>
          </div>
          <Progress value={wellnessScore} className="h-2" />
        </div>

        {/* Mood Indicators */}
        {moodData && (
          <div>
            <h4 className="font-medium mb-4">Current Mood Indicators</h4>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-red-200 dark:border-red-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-red-500" />
                      <span className="font-medium text-sm">Stress Level</span>
                    </div>
                    <Badge variant="outline">{moodData.stress_level}/10</Badge>
                  </div>
                  <Progress value={moodData.stress_level * 10} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {moodData.stress_level <= 3
                      ? "Low stress"
                      : moodData.stress_level <= 6
                        ? "Moderate stress"
                        : "High stress"}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-sm">Energy Level</span>
                    </div>
                    <Badge variant="outline">{moodData.energy_perception}/10</Badge>
                  </div>
                  <Progress value={moodData.energy_perception * 10} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {moodData.energy_perception >= 8
                      ? "High energy"
                      : moodData.energy_perception >= 5
                        ? "Moderate energy"
                        : "Low energy"}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-sm">Motivation</span>
                    </div>
                    <Badge variant="outline">{moodData.motivation_score}/10</Badge>
                  </div>
                  <Progress value={moodData.motivation_score * 10} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {moodData.motivation_score >= 8
                      ? "Highly motivated"
                      : moodData.motivation_score >= 5
                        ? "Moderately motivated"
                        : "Low motivation"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Behavioral Tips */}
        {insights && (
          <div>
            <h4 className="font-medium mb-4">Behavioral Tips</h4>
            <div className="space-y-3">
              <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-green-500 mt-1" />
                    <div>
                      <h5 className="font-medium text-sm mb-1">Motivation Boost</h5>
                      <p className="text-sm text-muted-foreground">{insights.motivation_message}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-blue-500 mt-1" />
                    <div>
                      <h5 className="font-medium text-sm mb-1">Habit Formation</h5>
                      <p className="text-sm text-muted-foreground">{insights.habit_formation_tip}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-purple-500 mt-1" />
                    <div>
                      <h5 className="font-medium text-sm mb-1">Progress Celebration</h5>
                      <p className="text-sm text-muted-foreground">{insights.progress_celebration}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
