"use client"

import { useApp } from "@/contexts/app-context"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Calendar } from "lucide-react"

export function DashboardHeader() {
  const { state } = useApp()
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Welcome back!</h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <Calendar className="h-4 w-4" />
            {currentDate}
          </p>
        </div>
        {state.userProfile && (
          <Card className="p-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{state.userProfile.user_id}</p>
                <Badge variant="secondary" className="text-xs">
                  {state.userProfile.fitness_level}
                </Badge>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
