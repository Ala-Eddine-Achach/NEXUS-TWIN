"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Users, MapPin, Plus } from "lucide-react"

export function QuickActions() {
  const router = useRouter()

  const actions = [
    {
      title: "Get AI Coaching",
      description: "Personalized workout recommendations",
      icon: Brain,
      href: "/coach",
      color: "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Find Partners",
      description: "Match with workout buddies",
      icon: Users,
      href: "/matching",
      color: "bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400",
    },
    {
      title: "Nearby Locations",
      description: "Discover fitness venues",
      icon: MapPin,
      href: "/locations",
      color: "bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400",
    },
    {
      title: "Log Activity",
      description: "Add manual workout entry",
      icon: Plus,
      href: "/analytics",
      color: "bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.title}
                variant="ghost"
                className="h-auto p-4 justify-start"
                onClick={() => router.push(action.href)}
              >
                <div className={`p-2 rounded-lg mr-3 ${action.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="font-medium">{action.title}</p>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
