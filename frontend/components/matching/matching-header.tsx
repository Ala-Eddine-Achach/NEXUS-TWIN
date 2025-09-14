"use client"

import { useApp } from "@/contexts/app-context"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Heart, Zap } from "lucide-react"

export function MatchingHeader() {
  const { state } = useApp()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Find Partners
          </h1>
          <p className="text-muted-foreground mt-1">Connect with like-minded fitness enthusiasts</p>
        </div>
      </div>

      {state.healthAnalytics && (
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-primary/10">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Your Readiness Score</p>
              <p className="text-sm text-muted-foreground">
                Based on your current energy and recovery levels, you're ready for moderate to high intensity workouts.
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                <Zap className="h-3 w-3 mr-1" />
                {state.healthAnalytics.readiness_score}/100
              </Badge>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
