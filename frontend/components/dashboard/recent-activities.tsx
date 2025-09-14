"use client"

import { useApp } from "@/contexts/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Clock, Flame } from "lucide-react"

export function RecentActivities() {
  const { state } = useApp()

  const activities = state.historicalData?.activities || []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.slice(0, 3).map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="space-y-1">
                  <p className="font-medium">{activity.activity_type}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.duration || 0} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="h-3 w-3" />
                      {activity.calories_burned || 0} cal
                    </span>
                  </div>
                </div>
                <Badge
                  variant={
                    activity.intensity === "High"
                      ? "default"
                      : activity.intensity === "Medium" || activity.intensity === "Moderate"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {activity.intensity}
                </Badge>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent activities</p>
              <p className="text-sm">Start tracking your workouts!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
