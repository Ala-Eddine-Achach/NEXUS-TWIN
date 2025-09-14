"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { MessageCircle, Heart, User, Clock, Zap, MapPin } from "lucide-react"
import type { MatchedUser } from "@/lib/types"

interface MatchedUsersProps {
  matches: MatchedUser[]
}

export function MatchedUsers({ matches }: MatchedUsersProps) {
  const [likedUsers, setLikedUsers] = useState<Set<string>>(new Set())

  const handleLike = (userId: string) => {
    setLikedUsers((prev) => new Set([...prev, userId]))
  }

  const handleMessage = (userId: string) => {
    // In a real app, this would open a chat interface
    console.log("Opening chat with user:", userId)
  }

  const getCompatibilityColor = (score: number) => {
    if (score >= 0.8) return "text-green-600 dark:text-green-400"
    if (score >= 0.6) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getReadinessColor = (readiness: number) => {
    if (readiness >= 80) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    if (readiness >= 60) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  }

  const getFitnessLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "intermediate":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "advanced":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const formatAvailability = (availability: string) => {
    return availability.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Matched Partners ({matches.length})</h2>
        <Badge variant="secondary">{matches.length} found</Badge>
      </div>

      <div className="grid gap-4">
        {matches.map((user) => (
          <Card key={user.user_id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{user.user_id}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{user.age} years</Badge>
                      <Badge variant="outline">{user.gender}</Badge>
                      <Badge className={getFitnessLevelColor(user.fitness_level)}>{user.fitness_level}</Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getCompatibilityColor(user.compatibility_score)}`}>
                    {Math.round(user.compatibility_score * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Match</div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Compatibility Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Compatibility Score</span>
                  <span className="font-medium">{Math.round(user.compatibility_score * 100)}%</span>
                </div>
                <Progress value={user.compatibility_score * 100} className="h-2" />
              </div>

              {/* Shared Interests */}
              <div>
                <p className="text-sm font-medium mb-2">Shared Interests</p>
                <div className="flex flex-wrap gap-2">
                  {user.shared_interests.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {interest.replace(/_/g, " ")}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid gap-3 md:grid-cols-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Readiness:</span>
                  <Badge className={getReadinessColor(user.current_readiness)} variant="outline">
                    {user.current_readiness}/100
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Available:</span>
                  <span className="text-sm font-medium">{formatAvailability(user.availability)}</span>
                </div>
                {user.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.location.city}</span>
                    <span className="text-xs text-muted-foreground">({user.location.distance_km}km)</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant={likedUsers.has(user.user_id) ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => handleLike(user.user_id)}
                  disabled={likedUsers.has(user.user_id)}
                >
                  <Heart className={`h-4 w-4 mr-2 ${likedUsers.has(user.user_id) ? "fill-current" : ""}`} />
                  {likedUsers.has(user.user_id) ? "Liked" : "Like"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => handleMessage(user.user_id)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
