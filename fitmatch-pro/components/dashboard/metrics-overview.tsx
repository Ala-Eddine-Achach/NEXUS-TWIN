"use client"

import { useApp } from "@/contexts/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Flame, Clock, Heart } from "lucide-react"

export function MetricsOverview() {
  const { state } = useApp()

  // Calculate metrics from historical data
  const getMetrics = () => {
    if (!state.historicalData) {
      return {
        totalCalories: 0,
        activeMinutes: 0,
        avgHeartRate: 0,
        workoutsThisWeek: 0,
      }
    }

    const totalCalories = state.historicalData.activities.reduce((sum, activity) => sum + (activity.calories_burned || 0), 0)
    const activeMinutes = state.historicalData.activities.reduce((sum, activity) => sum + (activity.duration || 0), 0)

    // Calculate average heart rate more safely
    const heartRateValues = state.historicalData.activities
      .map(activity => activity.heart_rate_avg)
      .filter(hr => hr && !isNaN(hr))

    const avgHeartRate = heartRateValues.length > 0
      ? Math.round(heartRateValues.reduce((sum, hr) => sum + hr, 0) / heartRateValues.length)
      : 0

    const workoutsThisWeek = state.historicalData.workouts.length

    return {
      totalCalories,
      activeMinutes,
      avgHeartRate,
      workoutsThisWeek,
    }
  }

  const metrics = getMetrics()

  const metricCards = [
    {
      title: "Calories Burned",
      value: isNaN(metrics.totalCalories) ? "0" : metrics.totalCalories.toLocaleString(),
      icon: Flame,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
    {
      title: "Active Minutes",
      value: isNaN(metrics.activeMinutes) ? "0" : metrics.activeMinutes.toString(),
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Avg Heart Rate",
      value: isNaN(metrics.avgHeartRate) ? "0 bpm" : `${metrics.avgHeartRate} bpm`,
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950",
    },
    {
      title: "Workouts",
      value: isNaN(metrics.workoutsThisWeek) ? "0" : metrics.workoutsThisWeek.toString(),
      icon: Activity,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metricCards.map((metric) => {
        const Icon = metric.icon
        return (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <div className={`p-2 rounded-full ${metric.bgColor}`}>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
