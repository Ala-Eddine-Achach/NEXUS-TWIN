"use client"

import { useState, useEffect } from "react"
import { useApp } from "@/contexts/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Save, Edit } from "lucide-react"
import type { UserProfile } from "@/lib/types"

export function ProfileSettings() {
  const { state, actions } = useApp()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<UserProfile>({
    user_id: "",
    age: 25,
    gender: "",
    height: 170,
    weight: 70,
    fitness_level: "",
  })

  // Load profile data when component mounts
  useEffect(() => {
    if (state.userProfile) {
      setProfileData(state.userProfile)
    }
  }, [state.userProfile])

  const handleSave = () => {
    actions.updateUserProfile(profileData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    if (state.userProfile) {
      setProfileData(state.userProfile)
    }
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Profile Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            disabled={!state.userProfile && !isEditing}
          >
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                <User className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{profileData.user_id || "New User"}</h3>
              <p className="text-sm text-muted-foreground">
                {profileData.age} years • {profileData.gender} • {profileData.fitness_level}
              </p>
            </div>
          </div>

          {/* Profile Form */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="user_id">User ID</Label>
              <Input
                id="user_id"
                value={profileData.user_id}
                onChange={(e) => setProfileData({ ...profileData, user_id: e.target.value })}
                disabled={!isEditing}
                placeholder="Enter your user ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={profileData.age}
                onChange={(e) => setProfileData({ ...profileData, age: Number(e.target.value) })}
                disabled={!isEditing}
                placeholder="25"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={profileData.gender}
                onValueChange={(value) => setProfileData({ ...profileData, gender: value })}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fitness_level">Fitness Level</Label>
              <Select
                value={profileData.fitness_level}
                onValueChange={(value) => setProfileData({ ...profileData, fitness_level: value })}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fitness level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={profileData.height}
                onChange={(e) => setProfileData({ ...profileData, height: Number(e.target.value) })}
                disabled={!isEditing}
                placeholder="170"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={profileData.weight}
                onChange={(e) => setProfileData({ ...profileData, weight: Number(e.target.value) })}
                disabled={!isEditing}
                placeholder="70"
              />
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
