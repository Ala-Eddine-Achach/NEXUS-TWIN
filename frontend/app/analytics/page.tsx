"use client"

import { useState, useEffect } from "react"
import { useApp } from "@/contexts/app-context"
import { Navigation } from "@/components/navigation"
import { AnalyticsHeader } from "@/components/analytics/analytics-header"
import { HealthMetricsChart } from "@/components/analytics/health-metrics-chart"
import { NutritionTracker } from "@/components/analytics/nutrition-tracker"
import { ActivityLogger } from "@/components/analytics/activity-logger"
import { SleepAnalytics } from "@/components/analytics/sleep-analytics"
import { HeartRateMonitor } from "@/components/analytics/heart-rate-monitor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function AnalyticsPage() {
  const { state, actions } = useApp()
  const [activeTab, setActiveTab] = useState("overview")

  // Refresh analytics data when the page loads
  useEffect(() => {
    console.log("[v0] Analytics page loaded - refreshing data...")

    // Only refresh if we have user profile and historical data
    if (state.userProfile && state.historicalData) {
      console.log("[v0] Refreshing health analytics...")
      actions.refreshHealthAnalytics()
    } else {
      console.log("[v0] Missing user profile or historical data - skipping analytics refresh")
    }
  }, [state.userProfile, state.historicalData]) // Removed actions from dependencies

  if (!state.userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="ml-4">Loading user data...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
        <AnalyticsHeader />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="sleep">Sleep</TabsTrigger>
            <TabsTrigger value="heart">Heart</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <HealthMetricsChart />
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-6 mt-6">
            <NutritionTracker />
          </TabsContent>

          <TabsContent value="activity" className="space-y-6 mt-6">
            <ActivityLogger />
          </TabsContent>

          <TabsContent value="sleep" className="space-y-6 mt-6">
            <SleepAnalytics />
          </TabsContent>

          <TabsContent value="heart" className="space-y-6 mt-6">
            <HeartRateMonitor />
          </TabsContent>
        </Tabs>
      </div>

      <Navigation />
    </div>
  )
}
