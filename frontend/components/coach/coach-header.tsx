"use client"

import { useApp } from "@/contexts/app-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, RefreshCw, Sparkles } from "lucide-react"

export function CoachHeader() {
  const { state, actions } = useApp()

  const handleRefresh = () => {
    actions.refreshAICoachData()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance flex items-center gap-3">
            <Brain className="h-8 w-8 text-primary" />
            AI Coach
          </h1>
          <p className="text-muted-foreground mt-1">Your personalized fitness companion</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={state.isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${state.isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {state.aiCoachData && (
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium">AI Analysis Complete</p>
              <p className="text-sm text-muted-foreground">
                Based on your recent activity and health metrics, here are your personalized recommendations.
              </p>
            </div>
            <Badge variant="secondary" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              Updated
            </Badge>
          </div>
        </Card>
      )}
    </div>
  )
}
