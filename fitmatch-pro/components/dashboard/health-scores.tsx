"use client"

import { useEffect, useState } from "react"
import { useApp } from "@/contexts/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { RefreshCw, TrendingUp, Battery, Shield, AlertCircle } from "lucide-react"

export function HealthScores() {
  const { state, actions } = useApp()
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false)

  useEffect(() => {
    console.log("[v0] HealthScores useEffect triggered", {
      hasUserProfile: !!state.userProfile,
      hasHistoricalData: !!state.historicalData,
      hasHealthAnalytics: !!state.healthAnalytics,
      hasAttemptedFetch,
      isLoading: state.isLoading,
      error: state.error,
    })

    // Only attempt fetch once when conditions are met and we haven't tried yet
    if (state.userProfile && state.historicalData && !state.healthAnalytics && !hasAttemptedFetch && !state.isLoading) {
      console.log("[v0] Attempting to fetch health analytics")
      setHasAttemptedFetch(true)
      actions.refreshHealthAnalytics()
    }
  }, [state.userProfile, state.historicalData, state.healthAnalytics, hasAttemptedFetch, state.isLoading, actions])

  const handleRefresh = () => {
    console.log("[v0] Manual refresh triggered")
    setHasAttemptedFetch(true)
    actions.refreshHealthAnalytics()
  }

  const scores = state.healthAnalytics || {
    "Energy Level": 75,
    "Recovery Index": 68,
    "Readiness Score": 80,
  }

  const scoreCards = [
    {
      title: "Energy Level",
      value: scores["Energy Level"] || 75,
      icon: Battery,
      color: "text-yellow-500",
      description: "Current energy status",
    },
    {
      title: "Recovery Index",
      value: scores["Recovery Index"] || 68,
      icon: Shield,
      color: "text-blue-500",
      description: "Recovery from workouts",
    },
    {
      title: "Readiness Score",
      value: scores["Readiness Score"] || 80,
      icon: TrendingUp,
      color: "text-green-500",
      description: "Ready for activity",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Health Scores</CardTitle>
        <div className="flex items-center gap-2">
          {state.error && (
            <div className="flex items-center gap-1 text-amber-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs">Using offline data</span>
            </div>
          )}
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={state.isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${state.isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          {scoreCards.map((score) => {
            const Icon = score.icon
            return (
              <div key={score.title} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${score.color}`} />
                  <div>
                    <p className="font-medium">{score.title}</p>
                    <p className="text-sm text-muted-foreground">{score.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Score</span>
                    <span className="font-medium">{score.value}/100</span>
                  </div>
                  <Progress value={score.value} className="h-2" />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
