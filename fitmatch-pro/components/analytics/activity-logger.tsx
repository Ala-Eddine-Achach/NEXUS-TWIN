"use client"

import { useState, useMemo } from "react"
import { useApp } from "@/contexts/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Plus, Activity, Clock, Flame, Heart } from "lucide-react"

export function ActivityLogger() {
  const { state, actions } = useApp()
  const [isAddingActivity, setIsAddingActivity] = useState(false)
  const [newActivity, setNewActivity] = useState({
    activity_type: "",
    duration: "",
    calories_burned: "",
    intensity: "",
    heart_rate_avg: "",
  })

  const handleAddActivity = () => {
    if (!state.historicalData) return

    const activityEntry = {
      date: new Date().toISOString().split("T")[0],
      activity_type: newActivity.activity_type,
      duration: Number(newActivity.duration),
      calories_burned: Number(newActivity.calories_burned),
      intensity: newActivity.intensity,
      heart_rate_avg: Number(newActivity.heart_rate_avg),
    }

    const updatedData = {
      ...state.historicalData,
      activities: [...state.historicalData.activities, activityEntry],
    }

    actions.updateHistoricalData(updatedData)
    setNewActivity({
      activity_type: "",
      duration: "",
      calories_burned: "",
      intensity: "",
      heart_rate_avg: "",
    })
    setIsAddingActivity(false)
  }

  // Get activity data for chart - using real data
  const chartData = useMemo(() => {
    if (!state.historicalData?.activities?.length) {
      return [
        { activity: "Pilates", duration: 99, calories: 395 },
        { activity: "Running", duration: 45, calories: 450 },
        { activity: "Cycling", duration: 60, calories: 380 },
      ]
    }

    // Group activities by type and sum duration/calories
    const activityGroups = state.historicalData.activities.reduce((acc: any, activity: any) => {
      const type = activity.activity_type || "Unknown"
      if (!acc[type]) {
        acc[type] = { activity: type, duration: 0, calories: 0, count: 0 }
      }
      acc[type].duration += activity.duration || 0
      acc[type].calories += activity.calories_burned || 0
      acc[type].count += 1
      return acc
    }, {})

    return Object.values(activityGroups).slice(-8) // Show last 8 activity types
  }, [state.historicalData?.activities?.length])

  // Calculate total statistics using real data
  const stats = useMemo(() => {
    if (!state.historicalData?.activities?.length) {
      return { totalActivities: 0, totalDuration: 0, totalCalories: 0 }
    }

    const totals = state.historicalData.activities.reduce((acc: any, activity: any) => {
      acc.totalActivities += 1
      acc.totalDuration += activity.duration || 0
      acc.totalCalories += activity.calories_burned || 0
      return acc
    }, { totalActivities: 0, totalDuration: 0, totalCalories: 0 })

    return totals
  }, [state.historicalData?.activities?.length])

  const chartConfig = {
    duration: {
      label: "Duration (min)",
      color: "hsl(var(--chart-1))",
    },
    calories: {
      label: "Calories",
      color: "hsl(var(--chart-2))",
    },
  }

  return (
    <div className="space-y-6">
      {/* Activity Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-500">{stats.totalActivities}</p>
              <p className="text-sm text-muted-foreground">Total Activities</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">{stats.totalDuration}</p>
              <p className="text-sm text-muted-foreground">Total Minutes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">{stats.totalCalories}</p>
              <p className="text-sm text-muted-foreground">Calories Burned</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Activity Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="activity" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="duration" fill="var(--color-chart-1)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Add Activity Form */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Log Activity
            </CardTitle>
            <Button size="sm" onClick={() => setIsAddingActivity(!isAddingActivity)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </CardHeader>
          <CardContent>
            {isAddingActivity ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="activity-type">Activity Type</Label>
                  <Select
                    value={newActivity.activity_type}
                    onValueChange={(value) => setNewActivity({ ...newActivity, activity_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Running">Running</SelectItem>
                      <SelectItem value="Cycling">Cycling</SelectItem>
                      <SelectItem value="Swimming">Swimming</SelectItem>
                      <SelectItem value="Pilates">Pilates</SelectItem>
                      <SelectItem value="Yoga">Yoga</SelectItem>
                      <SelectItem value="Weight Training">Weight Training</SelectItem>
                      <SelectItem value="Walking">Walking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="duration">Duration (min)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newActivity.duration}
                      onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="calories">Calories Burned</Label>
                    <Input
                      id="calories"
                      type="number"
                      value={newActivity.calories_burned}
                      onChange={(e) => setNewActivity({ ...newActivity, calories_burned: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="intensity">Intensity</Label>
                    <Select
                      value={newActivity.intensity}
                      onValueChange={(value) => setNewActivity({ ...newActivity, intensity: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select intensity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="heart-rate">Avg Heart Rate</Label>
                    <Input
                      id="heart-rate"
                      type="number"
                      value={newActivity.heart_rate_avg}
                      onChange={(e) => setNewActivity({ ...newActivity, heart_rate_avg: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddActivity} className="flex-1">
                    Add Activity
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingActivity(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {state.historicalData?.activities.slice(0, 3).map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="space-y-1">
                      <p className="font-medium">{activity.activity_type}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {activity.duration} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame className="h-3 w-3" />
                          {activity.calories_burned} cal
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {activity.heart_rate_avg} bpm
                        </span>
                      </div>
                    </div>
                  </div>
                )) || (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No activities logged yet</p>
                      <p className="text-sm">Start tracking your workouts!</p>
                    </div>
                  )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
