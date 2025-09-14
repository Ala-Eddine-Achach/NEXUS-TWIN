"use client"

import { useApp } from "@/contexts/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, TrendingUp, Target } from "lucide-react"

export function PersonalizedAdvice() {
  const { state } = useApp()

  // Default advice if no AI coach data
  const defaultAdvice = {
    advice_response:
      "Based on your recent Pilates sessions and current fitness level, I recommend incorporating more cardiovascular exercises to improve your overall endurance. Your consistency with low-intensity workouts is excellent - consider gradually increasing intensity for better results.",
    behavioral_insights: {
      motivation_message: "You're making great progress with your fitness routine! Keep up the consistent effort.",
      habit_formation_tip: "Try scheduling your workouts at the same time each day to build a stronger routine.",
      progress_celebration: "Celebrate your achievements - you've been consistent with your Pilates practice!",
    },
  }

  const coachData = state.aiCoachData || defaultAdvice

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Personalized Advice
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main AI Advice */}
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10 mt-1">
              <MessageSquare className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium mb-2">AI Coach Recommendation</h4>
              <p className="text-sm leading-relaxed">{coachData.advice_response}</p>
            </div>
          </div>
        </div>

        {/* Behavioral Insights */}
        {coachData.behavioral_insights && (
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h5 className="font-medium text-sm mb-1">Motivation</h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {coachData.behavioral_insights.motivation_message}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <h5 className="font-medium text-sm mb-1">Habit Formation</h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {coachData.behavioral_insights.habit_formation_tip}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 dark:border-purple-800">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 mt-1">
                    🎉
                  </Badge>
                  <div>
                    <h5 className="font-medium text-sm mb-1">Celebration</h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {coachData.behavioral_insights.progress_celebration}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
