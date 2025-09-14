"use client"

import { useApp } from "@/contexts/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from "recharts"

export function ActivityChart() {
  const { state } = useApp()

  // Generate chart data from historical data
  const getChartData = () => {
    if (!state.historicalData || !state.historicalData.activities.length) {
      // Sample data for demonstration
      return [
        { date: "Mon", calories: 320, duration: 45 },
        { date: "Tue", calories: 280, duration: 35 },
        { date: "Wed", calories: 450, duration: 60 },
        { date: "Thu", calories: 380, duration: 50 },
        { date: "Fri", calories: 520, duration: 75 },
        { date: "Sat", calories: 290, duration: 40 },
        { date: "Sun", calories: 395, duration: 55 },
      ]
    }

    // Transform real data for chart - handle invalid dates
    return state.historicalData.activities.map((activity, index) => {
      const activityDate = new Date(activity.date)
      const dateLabel = isNaN(activityDate.getTime())
        ? `Day ${index + 1}`
        : activityDate.toLocaleDateString("en-US", { weekday: "short" })

      return {
        date: dateLabel,
        calories: activity.calories_burned || 0,
        duration: activity.duration || 0,
      }
    })
  }

  const chartData = getChartData()

  const chartConfig = {
    calories: {
      label: "Calories Burned",
      color: "hsl(var(--chart-1))",
    },
    duration: {
      label: "Duration (min)",
      color: "hsl(var(--chart-2))",
    },
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Calories Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Weekly Calories</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="calories" fill="var(--color-chart-1)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Duration Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Activity Duration</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="duration"
                  stroke="var(--color-chart-2)"
                  strokeWidth={3}
                  dot={{ fill: "var(--color-chart-2)", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
