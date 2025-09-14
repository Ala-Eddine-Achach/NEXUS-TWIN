"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Clock, Zap } from "lucide-react"

interface CurrentActivityProps {
  activity: {
    type: string
    duration: number
    intensity: string
  }
}

export function CurrentActivity({ activity }: CurrentActivityProps) {
  const getIntensityColor = (intensity: string) => {
    switch (intensity.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "moderate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Suggested Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h4 className="font-semibold text-lg capitalize">{activity.type.replace(/_/g, " ")}</h4>
          <p className="text-sm text-muted-foreground">AI recommended based on your current readiness</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{activity.duration} min</span>
          </div>
          <Badge className={getIntensityColor(activity.intensity)}>
            <Zap className="h-3 w-3 mr-1" />
            {activity.intensity} intensity
          </Badge>
        </div>

        <div className="p-3 rounded-lg bg-background/50 border">
          <p className="text-xs text-muted-foreground">
            Partners will be matched based on this activity suggestion and your current fitness readiness.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
