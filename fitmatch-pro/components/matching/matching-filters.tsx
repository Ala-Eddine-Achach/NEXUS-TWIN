"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Filter, MapPin } from "lucide-react"
import type { MatchingPreferences } from "@/lib/types"
import { SUPPORTED_ACTIVITIES, ACTIVITY_LABELS } from "@/lib/types"

interface MatchingFiltersProps {
  preferences: MatchingPreferences
  onPreferencesChange: (preferences: MatchingPreferences) => void
}

export function MatchingFilters({ preferences, onPreferencesChange }: MatchingFiltersProps) {
  const updatePreferences = (updates: Partial<MatchingPreferences>) => {
    onPreferencesChange({ ...preferences, ...updates })
  }

  const activityOptions = SUPPORTED_ACTIVITIES.map(activity => ({
    id: activity,
    label: ACTIVITY_LABELS[activity]
  }))

  const handleActivityChange = (activityId: string, checked: boolean) => {
    const currentInterests = preferences.activity_interests
    if (checked) {
      updatePreferences({
        activity_interests: [...currentInterests, activityId],
      })
    } else {
      updatePreferences({
        activity_interests: currentInterests.filter((id) => id !== activityId),
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Matching Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Age Range */}
        <div className="space-y-3">
          <Label>
            Age Range: {preferences.age_range[0]} - {preferences.age_range[1]} years
          </Label>
          <Slider
            value={preferences.age_range}
            onValueChange={(value) => updatePreferences({ age_range: value as [number, number] })}
            min={18}
            max={65}
            step={1}
            className="w-full"
          />
        </div>

        {/* Gender Preference */}
        <div className="space-y-2">
          <Label>Gender Preference</Label>
          <Select
            value={preferences.gender_preference}
            onValueChange={(value) => updatePreferences({ gender_preference: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Activity Interests */}
        <div className="space-y-3">
          <Label>Activity Interests</Label>
          <div className="grid gap-3 md:grid-cols-2">
            {activityOptions.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-2">
                <Checkbox
                  id={activity.id}
                  checked={preferences.activity_interests.includes(activity.id)}
                  onCheckedChange={(checked) => handleActivityChange(activity.id, checked as boolean)}
                />
                <Label htmlFor={activity.id} className="text-sm font-normal">
                  {activity.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Intensity Preference */}
        <div className="space-y-2">
          <Label>Intensity Preference</Label>
          <Select
            value={preferences.intensity_preference}
            onValueChange={(value) => updatePreferences({ intensity_preference: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low Intensity</SelectItem>
              <SelectItem value="moderate">Moderate Intensity</SelectItem>
              <SelectItem value="high">High Intensity</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Same City Only Toggle */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="same-city" className="font-medium">Same City Only</Label>
            </div>
            <Switch
              id="same-city"
              checked={preferences["want same city"] || false}
              onCheckedChange={(checked) => updatePreferences({ "want same city": checked })}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Only show matches from your current city
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
