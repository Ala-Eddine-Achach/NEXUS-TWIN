"use client"

import { useApp } from "@/contexts/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Map, MapPin, Dumbbell, TreePine, Building } from "lucide-react"

interface LocationMapProps {
  userLocation: { lat: number; lng: number } | null
}

export function LocationMap({ userLocation }: LocationMapProps) {
  const { state } = useApp()

  const getLocationIcon = (type: string) => {
    switch (type) {
      case "fitness_centre":
        return <Dumbbell className="h-4 w-4 text-orange-500" />
      case "park":
        return <TreePine className="h-4 w-4 text-green-500" />
      case "pitch":
        return <Building className="h-4 w-4 text-blue-500" />
      default:
        return <MapPin className="h-4 w-4 text-gray-500" />
    }
  }

  const getLocationColor = (type: string) => {
    switch (type) {
      case "fitness_centre":
        return "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950"
      case "park":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
      case "pitch":
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950"
      default:
        return "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Map className="h-5 w-5" />
          Location Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Map Placeholder */}
        <div className="relative h-64 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-950 dark:to-green-950 rounded-lg border overflow-hidden">
          {/* User Location */}
          {userLocation && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                <div className="absolute -top-1 -left-1 w-6 h-6 bg-primary/20 rounded-full animate-ping"></div>
              </div>
            </div>
          )}

          {/* Nearby Locations */}
          {state.locationData?.available_locations?.slice(0, 5).map((location, index) => (
            <div
              key={index}
              className="absolute"
              style={{
                top: `${20 + index * 15}%`,
                left: `${15 + index * 20}%`,
              }}
            >
              <div className={`p-1 rounded-full border-2 border-white shadow-lg ${getLocationColor(location.type)}`}>
                {getLocationIcon(location.type)}
              </div>
            </div>
          ))}

          {/* Map Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>

          {/* Map Info */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Interactive Map</p>
                  <p className="text-xs text-muted-foreground">
                    {state.locationData?.available_locations?.length || 0} locations nearby
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Live
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Map Legend */}
        <div className="mt-4 p-3 rounded-lg bg-muted/50">
          <h4 className="font-medium text-sm mb-2">Legend</h4>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-xs">Your Location</span>
            </div>
            <div className="flex items-center gap-2">
              <Dumbbell className="h-3 w-3 text-orange-500" />
              <span className="text-xs">Fitness Centers</span>
            </div>
            <div className="flex items-center gap-2">
              <TreePine className="h-3 w-3 text-green-500" />
              <span className="text-xs">Parks</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="h-3 w-3 text-blue-500" />
              <span className="text-xs">Sports Pitches</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
