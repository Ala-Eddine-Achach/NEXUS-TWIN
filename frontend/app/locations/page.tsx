"use client"

import { useState, useEffect } from "react"
import { useApp } from "@/contexts/app-context"
import { Navigation } from "@/components/navigation"
import { LocationHeader } from "@/components/locations/location-header"
import { WeatherCard } from "@/components/locations/weather-card"
import { NearbyLocations } from "@/components/locations/nearby-locations"
import { LocationMap } from "@/components/locations/location-map"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, RefreshCw } from "lucide-react"

export default function LocationsPage() {
  const { state, actions } = useApp()
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const handleGetLocation = () => {
    setIsGettingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
          actions.updateLocation(latitude, longitude)
          setIsGettingLocation(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          // Use default NYC location for demo
          const defaultLocation = { lat: 40.785091, lng: -73.968285 }
          setUserLocation(defaultLocation)
          actions.updateLocation(defaultLocation.lat, defaultLocation.lng)
          setIsGettingLocation(false)
        },
      )
    } else {
      // Use default location if geolocation is not supported
      const defaultLocation = { lat: 40.785091, lng: -73.968285 }
      setUserLocation(defaultLocation)
      actions.updateLocation(defaultLocation.lat, defaultLocation.lng)
      setIsGettingLocation(false)
    }
  }

  // Auto-get location on component mount
  useEffect(() => {
    if (!state.locationData && !userLocation) {
      console.log("[LocationsPage] No location data found, triggering location update...")
      handleGetLocation()
    } else if (state.locationData) {
      console.log("[LocationsPage] Existing location data:", JSON.stringify(state.locationData, null, 2))
    }
  }, [])

  if (state.isLoading && !state.locationData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
        <LocationHeader />

        {!state.locationData && !userLocation ? (
          <Card className="mt-6">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Enable Location</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Allow location access to discover nearby fitness venues, check weather conditions, and get personalized
                recommendations.
              </p>
              <Button onClick={handleGetLocation} disabled={isGettingLocation}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isGettingLocation ? "animate-spin" : ""}`} />
                {isGettingLocation ? "Getting Location..." : "Get My Location"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6 mt-6">
            {/* Weather Information */}
            <WeatherCard />

            {/* Map and Nearby Locations */}
            <div className="grid gap-6 lg:grid-cols-2">
              <LocationMap userLocation={userLocation} />
              <NearbyLocations />
            </div>
          </div>
        )}
      </div>

      <Navigation />
    </div>
  )
}
