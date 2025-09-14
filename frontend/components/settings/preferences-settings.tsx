"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { StorageService } from "@/lib/storage-service"
import { Settings, Bell, Shield, Zap } from "lucide-react"

interface Preferences {
  notifications: {
    workoutReminders: boolean
    healthInsights: boolean
    socialMatches: boolean
    weatherAlerts: boolean
  }
  privacy: {
    shareLocation: boolean
    shareHealthData: boolean
    allowMatching: boolean
    publicProfile: boolean
  }
  app: {
    theme: string
    language: string
    units: string
    autoSync: boolean
  }
  coaching: {
    intensity: number
    frequency: string
    focusAreas: string[]
  }
}

export function PreferencesSettings() {
  const [preferences, setPreferences] = useState<Preferences>({
    notifications: {
      workoutReminders: true,
      healthInsights: true,
      socialMatches: false,
      weatherAlerts: true,
    },
    privacy: {
      shareLocation: true,
      shareHealthData: false,
      allowMatching: true,
      publicProfile: false,
    },
    app: {
      theme: "system",
      language: "en",
      units: "metric",
      autoSync: true,
    },
    coaching: {
      intensity: 5,
      frequency: "daily",
      focusAreas: ["fitness", "nutrition"],
    },
  })

  // Load preferences on mount
  useEffect(() => {
    const savedPreferences = StorageService.getPreferences()
    if (savedPreferences) {
      setPreferences(savedPreferences)
    }
  }, [])

  const handleSave = () => {
    StorageService.savePreferences(preferences)
  }

  const updatePreferences = (section: keyof Preferences, updates: any) => {
    setPreferences((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...updates },
    }))
  }

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="workout-reminders">Workout Reminders</Label>
              <p className="text-sm text-muted-foreground">Get notified about scheduled workouts</p>
            </div>
            <Switch
              id="workout-reminders"
              checked={preferences.notifications.workoutReminders}
              onCheckedChange={(checked) => updatePreferences("notifications", { workoutReminders: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="health-insights">Health Insights</Label>
              <p className="text-sm text-muted-foreground">Receive AI-powered health recommendations</p>
            </div>
            <Switch
              id="health-insights"
              checked={preferences.notifications.healthInsights}
              onCheckedChange={(checked) => updatePreferences("notifications", { healthInsights: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="social-matches">Social Matches</Label>
              <p className="text-sm text-muted-foreground">Get notified about new workout partners</p>
            </div>
            <Switch
              id="social-matches"
              checked={preferences.notifications.socialMatches}
              onCheckedChange={(checked) => updatePreferences("notifications", { socialMatches: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="weather-alerts">Weather Alerts</Label>
              <p className="text-sm text-muted-foreground">Weather-based workout recommendations</p>
            </div>
            <Switch
              id="weather-alerts"
              checked={preferences.notifications.weatherAlerts}
              onCheckedChange={(checked) => updatePreferences("notifications", { weatherAlerts: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Sharing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="share-location">Share Location</Label>
              <p className="text-sm text-muted-foreground">Allow location sharing for venue recommendations</p>
            </div>
            <Switch
              id="share-location"
              checked={preferences.privacy.shareLocation}
              onCheckedChange={(checked) => updatePreferences("privacy", { shareLocation: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="share-health">Share Health Data</Label>
              <p className="text-sm text-muted-foreground">Share anonymized health data for research</p>
            </div>
            <Switch
              id="share-health"
              checked={preferences.privacy.shareHealthData}
              onCheckedChange={(checked) => updatePreferences("privacy", { shareHealthData: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="allow-matching">Allow Matching</Label>
              <p className="text-sm text-muted-foreground">Enable social matching with other users</p>
            </div>
            <Switch
              id="allow-matching"
              checked={preferences.privacy.allowMatching}
              onCheckedChange={(checked) => updatePreferences("privacy", { allowMatching: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="public-profile">Public Profile</Label>
              <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
            </div>
            <Switch
              id="public-profile"
              checked={preferences.privacy.publicProfile}
              onCheckedChange={(checked) => updatePreferences("privacy", { publicProfile: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* AI Coaching */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI Coaching Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Coaching Intensity: {preferences.coaching.intensity}/10</Label>
            <Slider
              value={[preferences.coaching.intensity]}
              onValueChange={(value) => updatePreferences("coaching", { intensity: value[0] })}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Higher intensity means more challenging workout recommendations
            </p>
          </div>

          <div className="space-y-2">
            <Label>Coaching Frequency</Label>
            <Select
              value={preferences.coaching.frequency}
              onValueChange={(value) => updatePreferences("coaching", { frequency: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* App Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5" />
            App Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select
                value={preferences.app.theme}
                onValueChange={(value) => updatePreferences("app", { theme: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Units</Label>
              <Select
                value={preferences.app.units}
                onValueChange={(value) => updatePreferences("app", { units: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                  <SelectItem value="imperial">Imperial (lbs, ft)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-sync">Auto Sync</Label>
              <p className="text-sm text-muted-foreground">Automatically sync data with APIs</p>
            </div>
            <Switch
              id="auto-sync"
              checked={preferences.app.autoSync}
              onCheckedChange={(checked) => updatePreferences("app", { autoSync: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Card>
        <CardContent className="p-4">
          <Button onClick={handleSave} className="w-full">
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
