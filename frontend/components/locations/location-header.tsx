"use client"

import { useApp } from "@/contexts/app-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, RefreshCw, Navigation2 } from "lucide-react"

export function LocationHeader() {
  const { state, actions } = useApp()

  // Debug: Log location data structure
  console.log("[LocationHeader] Current locationData:", JSON.stringify(state.locationData, null, 2))

  const handleRefreshLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          actions.updateLocation(latitude, longitude)
        },
        (error) => {
          console.error("Error getting location:", error)
          // Force use of fallback data with city
          actions.updateLocation(40.7831, -73.9712) // NYC coordinates to trigger fallback
        },
      )
    } else {
      // Force use of fallback data with city
      actions.updateLocation(40.7831, -73.9712) // NYC coordinates to trigger fallback
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance flex items-center gap-3">
            <MapPin className="h-8 w-8 text-primary" />
            Locations
          </h1>
          <p className="text-muted-foreground mt-1">Discover nearby fitness venues and check weather conditions</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefreshLocation} disabled={state.isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${state.isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {state.locationData && (
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-primary/10">
              <Navigation2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Current Location</p>
              <p className="text-sm text-muted-foreground">
                {/* Try multiple possible city locations in the data structure */}
                {state.locationData.location?.city ||
                  state.locationData.city ||
                  (typeof state.locationData.location?.latitude === "number" && typeof state.locationData.location?.longitude === "number"
                    ? `${state.locationData.location.latitude.toFixed(4)}, ${state.locationData.location.longitude.toFixed(4)}`
                    : "Location unavailable")}
              </p>
            </div>
            <Badge variant="secondary" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              {state.locationData.available_locations?.length || 0} venues found
            </Badge>
          </div>
        </Card>
      )}
    </div>
  )
}
