"use client"

import { useApp } from "@/contexts/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Heart, Activity, Zap, Target } from "lucide-react"

export function HeartRateMonitor() {
  const { state } = useApp()

  // Generate heart rate data for chart
  const getHeartRateData = () => {
    if (!state.historicalData?.heart_rate.length) {
      // Sample heart rate data throughout the day
      return [
        { time: "6:00", rate: 52, zone: "Resting" },
        { time: "8:00", rate: 68, zone: "Fat Burn" },
        { time: "10:00", rate: 85, zone: "Cardio" },
        { time: "12:00", rate: 72, zone: "Fat Burn" },
        { time: "14:00", rate: 95, zone: "Cardio" },
        { time: "16:00", rate: 78, zone: "Fat Burn" },
        { time: "18:00", rate: 120, zone: "Peak" },
        { time: "20:00", rate: 65, zone: "Fat Burn" },
        { time: "22:00", rate: 58, zone: "Resting" },
      ]
    }

    return state.historicalData.heart_rate.map((hr) => ({
      time: new Date(hr.date_time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      rate: hr.value,
      zone: hr.zone,
    }))
  }

  const heartRateData = getHeartRateData()

  // Calculate heart rate zones
  const getZoneStats = () => {
    const zones = heartRateData.reduce(
      (acc, data) => {
        acc[data.zone] = (acc[data.zone] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(zones).map(([zone, count]) => ({ zone, count }))
  }

  const zoneStats = getZoneStats()

  const chartConfig = {
    rate: {
      label: "Heart Rate (bpm)",
      color: "hsl(var(--chart-1))",
    },
  }

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case "Resting":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      case "Fat Burn":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200"
      case "Cardio":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200"
      case "Peak":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const avgHeartRate = Math.round(heartRateData.reduce((sum, data) => sum + data.rate, 0) / heartRateData.length)
  const maxHeartRate = Math.max(...heartRateData.map((data) => data.rate))
  const minHeartRate = Math.min(...heartRateData.map((data) => data.rate))

  return (
    <div className="space-y-6">
      {/* Heart Rate Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-50 dark:bg-red-950">
                <Heart className="h-4 w-4 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgHeartRate}</p>
                <p className="text-sm text-muted-foreground">Avg BPM</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-orange-50 dark:bg-orange-950">
                <Target className="h-4 w-4 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{maxHeartRate}</p>
                <p className="text-sm text-muted-foreground">Max BPM</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-950">
                <Activity className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{minHeartRate}</p>
                <p className="text-sm text-muted-foreground">Min BPM</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-50 dark:bg-green-950">
                <Zap className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{zoneStats.length}</p>
                <p className="text-sm text-muted-foreground">Zones</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Heart Rate Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Heart Rate Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={heartRateData}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="var(--color-chart-1)"
                    strokeWidth={3}
                    dot={{ fill: "var(--color-chart-1)", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Heart Rate Zones */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Heart Rate Zones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {zoneStats.map((stat) => (
                <div key={stat.zone} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={getZoneColor(stat.zone)}>{stat.zone}</Badge>
                    <span className="text-sm text-muted-foreground">Zone</span>
                  </div>
                  <span className="font-medium">{stat.count} readings</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium mb-2">Zone Definitions</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  <strong>Resting:</strong> 50-60 bpm - Recovery and rest
                </p>
                <p>
                  <strong>Fat Burn:</strong> 60-70 bpm - Light activity
                </p>
                <p>
                  <strong>Cardio:</strong> 70-85 bpm - Moderate exercise
                </p>
                <p>
                  <strong>Peak:</strong> 85+ bpm - High intensity training
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
