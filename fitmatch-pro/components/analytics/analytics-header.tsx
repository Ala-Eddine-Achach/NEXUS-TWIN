"use client"

import { useApp } from "@/contexts/app-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Download, RefreshCw } from "lucide-react"

export function AnalyticsHeader() {
  const { state, actions } = useApp()

  const handleRefreshAnalytics = () => {
    actions.refreshHealthAnalytics()
  }

  const handleExportData = () => {
    // Export functionality
    const data = {
      userProfile: state.userProfile,
      historicalData: state.historicalData,
      healthAnalytics: state.healthAnalytics,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "fitmatch-data.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Health Analytics</h1>
          <p className="text-muted-foreground mt-1">Track your progress and insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefreshAnalytics} disabled={state.isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${state.isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {state.healthAnalytics && (
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <div className="flex gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Energy Level</p>
                <Badge variant="secondary">{state.healthAnalytics.energy_level}/100</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Recovery Index</p>
                <Badge variant="secondary">{state.healthAnalytics.recovery_index}/100</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Readiness Score</p>
                <Badge variant="secondary">{state.healthAnalytics.readiness_score}/100</Badge>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
