"use client"

import { useApp } from "@/contexts/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Moon, Clock, Zap, Heart } from "lucide-react"

export function SleepAnalytics() {
  const { state } = useApp()

  // Get sleep data for chart
  const getSleepChartData = () => {
    if (!state.historicalData?.sleep.length) {
      return [
        { date: "Mon", totalSleep: 7.2, deepSleep: 2.5, efficiency: 91.8 },
        { date: "Tue", totalSleep: 6.8, deepSleep: 2.2, efficiency: 88.5 },
        { date: "Wed", totalSleep: 7.5, deepSleep: 2.8, efficiency: 93.2 },
        { date: "Thu", totalSleep: 7.0, deepSleep: 2.4, efficiency: 90.1 },
        { date: "Fri", totalSleep: 6.5, deepSleep: 2.0, efficiency: 85.7 },
        { date: "Sat", totalSleep: 8.2, deepSleep: 3.1, efficiency: 95.4 },
        { date: "Sun", totalSleep: 7.8, deepSleep: 2.9, efficiency: 92.8 },
      ]
    }

    return state.historicalData.sleep.map((sleep) => ({
      date: new Date(sleep.date).toLocaleDateString("en-US", { weekday: "short" }),
      totalSleep: sleep.total_sleep,
      deepSleep: sleep.deep_sleep,
      efficiency: sleep.sleep_efficiency,
    }))
  }

  const sleepData = getSleepChartData()
  const latestSleep = sleepData[sleepData.length - 1] || sleepData[0]

  const chartConfig = {
    totalSleep: {
      label: "Total Sleep (hrs)",
      color: "hsl(var(--chart-1))",
    },
    deepSleep: {
      label: "Deep Sleep (hrs)",
      color: "hsl(var(--chart-2))",
    },
  }

  return (
    <div className="space-y-6">
      {/* Sleep Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-950">
                <Moon className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{latestSleep.totalSleep}h</p>
                <p className="text-sm text-muted-foreground">Total Sleep</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-50 dark:bg-purple-950">
                <Clock className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{latestSleep.deepSleep}h</p>
                <p className="text-sm text-muted-foreground">Deep Sleep</p>
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
                <p className="text-2xl font-bold">{latestSleep.efficiency}%</p>
                <p className="text-sm text-muted-foreground">Efficiency</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-50 dark:bg-red-950">
                <Heart className="h-4 w-4 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">49</p>
                <p className="text-sm text-muted-foreground">Resting HR</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sleep Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Sleep Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sleepData}>
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="totalSleep"
                  stackId="1"
                  stroke="var(--color-chart-1)"
                  fill="var(--color-chart-1)"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="deepSleep"
                  stackId="2"
                  stroke="var(--color-chart-2)"
                  fill="var(--color-chart-2)"
                  fillOpacity={0.8}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
