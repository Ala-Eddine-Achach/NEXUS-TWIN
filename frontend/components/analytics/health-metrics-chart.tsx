"use client"

import { useApp } from "@/contexts/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from "recharts"

export function HealthMetricsChart() {
  const { state } = useApp()

  // Generate comprehensive health metrics data
  const getHealthMetricsData = () => {
    if (!state.historicalData?.measurements?.length) {
      console.log("[v0] No measurements data available - using sample data")
      // Sample data for demonstration
      return [
        { date: "Jan", weight: 65.3, bodyFat: 18.1, muscleMass: 62.8, bmi: 28.0 },
        { date: "Feb", weight: 65.8, bodyFat: 17.9, muscleMass: 63.2, bmi: 28.2 },
        { date: "Mar", weight: 66.1, bodyFat: 17.7, muscleMass: 63.5, bmi: 28.3 },
        { date: "Apr", weight: 66.4, bodyFat: 17.5, muscleMass: 63.8, bmi: 28.4 },
        { date: "May", weight: 66.7, bodyFat: 17.3, muscleMass: 64.1, bmi: 28.5 },
        { date: "Jun", weight: 67.0, bodyFat: 17.1, muscleMass: 64.4, bmi: 28.6 },
      ]
    }

    console.log("[v0] Using real measurements data:", state.historicalData.measurements.length, "entries")

    return state.historicalData.measurements
      .filter((measurement: any) => {
        // Handle both data formats: original {weight, body_fat, ...} and AI format {measurement_type, value}
        return measurement.weight !== undefined || measurement.measurement_type !== undefined
      })
      .map((measurement: any, index: number) => {
        // Handle mixed data formats
        if (measurement.weight !== undefined) {
          // Original format
          return {
            date: new Date(measurement.date || Date.now()).toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
            weight: measurement.weight || 0,
            bodyFat: measurement.body_fat || 0,
            muscleMass: measurement.muscle_mass || 0,
            bmi: measurement.bmi || 0,
          }
        } else if (measurement.measurement_type === "Weight") {
          // AI Coach format - create a basic entry
          return {
            date: new Date(measurement.date || measurement.timestamp || Date.now()).toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
            weight: measurement.value || 0,
            bodyFat: 0,
            muscleMass: 0,
            bmi: 0,
          }
        }
        return null
      })
      .filter(Boolean) // Remove null entries
      .slice(-10) // Show last 10 measurements
  }

  const healthData = getHealthMetricsData()

  const chartConfig = {
    weight: {
      label: "Weight (kg)",
      color: "hsl(var(--chart-1))",
    },
    bodyFat: {
      label: "Body Fat (%)",
      color: "hsl(var(--chart-2))",
    },
    muscleMass: {
      label: "Muscle Mass (kg)",
      color: "hsl(var(--chart-3))",
    },
    bmi: {
      label: "BMI",
      color: "hsl(var(--chart-4))",
    },
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Weight & BMI Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Weight & BMI Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthData}>
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="var(--color-chart-1)"
                  strokeWidth={3}
                  dot={{ fill: "var(--color-chart-1)", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="bmi"
                  stroke="var(--color-chart-4)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "var(--color-chart-4)", strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Body Composition Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Body Composition</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthData}>
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="muscleMass"
                  stackId="1"
                  stroke="var(--color-chart-3)"
                  fill="var(--color-chart-3)"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="bodyFat"
                  stackId="2"
                  stroke="var(--color-chart-2)"
                  fill="var(--color-chart-2)"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
