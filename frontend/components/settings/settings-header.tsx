"use client"

import { useApp } from "@/contexts/app-context"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, Database, User } from "lucide-react"

export function SettingsHeader() {
  const { state } = useApp()

  const getDataStatus = () => {
    let count = 0
    if (state.userProfile) count++
    if (state.historicalData) count++
    if (state.healthAnalytics) count++
    if (state.aiCoachData) count++
    if (state.locationData) count++
    return count
  }

  const dataCount = getDataStatus()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">Manage your profile, data, and app preferences</p>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-full bg-primary/10">
            <Database className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Data Status</p>
            <p className="text-sm text-muted-foreground">{dataCount} data categories stored locally</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              <User className="h-3 w-3 mr-1" />
              {state.userProfile ? "Profile Set" : "No Profile"}
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  )
}
