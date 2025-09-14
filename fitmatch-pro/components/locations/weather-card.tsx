"use client"

import { useApp } from "@/contexts/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, Sun, CloudRain, Snowflake, Wind, Thermometer } from "lucide-react"

export function WeatherCard() {
  const { state } = useApp()

  if (!state.locationData) {
    return null
  }

  const { weather, season } = state.locationData

  // Parse weather data - safely handle string or object types
  const weatherString = typeof weather === 'string' ? weather : weather?.condition || 'Unknown'
  const weatherParts = weatherString.split(", ")
  const weatherCondition = weatherParts[0]
  const temperature = weatherParts[1] || 'N/A'

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase()
    if (lowerCondition.includes("clear") || lowerCondition.includes("sunny")) {
      return <Sun className="h-6 w-6 text-yellow-500" />
    }
    if (lowerCondition.includes("rain")) {
      return <CloudRain className="h-6 w-6 text-blue-500" />
    }
    if (lowerCondition.includes("snow")) {
      return <Snowflake className="h-6 w-6 text-blue-300" />
    }
    if (lowerCondition.includes("wind")) {
      return <Wind className="h-6 w-6 text-gray-500" />
    }
    return <Cloud className="h-6 w-6 text-gray-500" />
  }

  const getSeasonColor = (season: string) => {
    switch (season.toLowerCase()) {
      case "spring":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "summer":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "autumn":
      case "fall":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "winter":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getWorkoutRecommendation = (condition: string, temp: string) => {
    const tempValue = Number.parseFloat(temp.replace("°C", ""))
    const lowerCondition = condition.toLowerCase()

    if (lowerCondition.includes("clear") && tempValue > 20) {
      return "Perfect weather for outdoor activities! Try running or cycling."
    }
    if (lowerCondition.includes("rain")) {
      return "Rainy day - great time for indoor workouts like yoga or strength training."
    }
    if (tempValue < 10) {
      return "Cold weather - warm up indoors or try high-intensity workouts."
    }
    if (tempValue > 30) {
      return "Hot weather - stay hydrated and consider early morning or evening workouts."
    }
    return "Good conditions for most outdoor activities. Stay active!"
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getWeatherIcon(weatherCondition)}
            Weather Conditions
          </div>
          {/* Try multiple possible city locations in the data structure */}
          {(state.locationData.location?.city || state.locationData.city) && (
            <Badge variant="secondary" className="text-xs">
              {state.locationData.location?.city || state.locationData.city}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-muted-foreground" />
                <span className="text-2xl font-bold">{temperature}</span>
              </div>
              <Badge className={getSeasonColor(season)} variant="outline">
                {season}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1 capitalize">{weatherCondition.replace(/_/g, " ")}</p>
          </div>
        </div>

        {/* Workout Recommendation */}
        <div className="p-3 rounded-lg bg-background/50 border">
          <h4 className="font-medium text-sm mb-1">Workout Recommendation</h4>
          <p className="text-xs text-muted-foreground">{getWorkoutRecommendation(weatherCondition, temperature)}</p>
        </div>

        {/* Weather Stats */}
        <div className="grid gap-3 md:grid-cols-3">
          <div className="text-center p-2 rounded bg-background/30">
            <p className="text-xs text-muted-foreground">Condition</p>
            <p className="font-medium text-sm capitalize">{weatherCondition.replace(/_/g, " ")}</p>
          </div>
          <div className="text-center p-2 rounded bg-background/30">
            <p className="text-xs text-muted-foreground">Temperature</p>
            <p className="font-medium text-sm">{temperature}</p>
          </div>
          <div className="text-center p-2 rounded bg-background/30">
            <p className="text-xs text-muted-foreground">Season</p>
            <p className="font-medium text-sm capitalize">{season}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
