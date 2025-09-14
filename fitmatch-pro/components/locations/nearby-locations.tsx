"use client"

import { useState } from "react"
import { useApp } from "@/contexts/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Navigation, Search, Dumbbell, TreePine, Building } from "lucide-react"
import type { AvailableLocation } from "@/lib/types"

export function NearbyLocations() {
  const { state } = useApp()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  if (!state.locationData?.available_locations) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No locations found</p>
        </CardContent>
      </Card>
    )
  }

  const locations = state.locationData.available_locations

  // Filter locations based on search and type
  const filteredLocations = locations.filter((location) => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || location.type === filterType
    return matchesSearch && matchesType
  })

  const getLocationIcon = (type: string) => {
    switch (type) {
      case "fitness_centre":
        return <Dumbbell className="h-5 w-5 text-orange-500" />
      case "park":
        return <TreePine className="h-5 w-5 text-green-500" />
      case "pitch":
        return <Building className="h-5 w-5 text-blue-500" />
      default:
        return <MapPin className="h-5 w-5 text-gray-500" />
    }
  }

  const getLocationTypeColor = (type: string) => {
    switch (type) {
      case "fitness_centre":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "park":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pitch":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const formatLocationType = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c // Distance in kilometers
    return d.toFixed(1)
  }

  const handleGetDirections = (location: AvailableLocation) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lon}`
    window.open(url, "_blank")
  }

  const userLat = state.locationData.location.latitude
  const userLon = state.locationData.location.longitude

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Nearby Locations ({filteredLocations.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="fitness_centre">Fitness Centers</SelectItem>
              <SelectItem value="park">Parks</SelectItem>
              <SelectItem value="pitch">Sports Pitches</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Locations List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredLocations.map((location, index) => (
            <Card key={index} className="border-muted">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    {getLocationIcon(location.type)}
                    <div className="flex-1">
                      <h4 className="font-medium">{location.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getLocationTypeColor(location.type)} variant="outline">
                          {formatLocationType(location.type)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {calculateDistance(userLat, userLon, location.lat, location.lon)} km away
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleGetDirections(location)}
                  >
                    <Navigation className="h-3 w-3 mr-2" />
                    Directions
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Search className="h-3 w-3 mr-2" />
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredLocations.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No locations found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
