"use client"

import { useState } from "react"
import { useApp } from "@/contexts/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Plus, Utensils } from "lucide-react"

export function NutritionTracker() {
  const { state, actions } = useApp()
  const [isAddingMeal, setIsAddingMeal] = useState(false)
  const [newMeal, setNewMeal] = useState({
    meal_type: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    fiber: "",
    water_intake: "",
  })

  const handleAddMeal = () => {
    if (!state.historicalData) return

    const mealEntry = {
      date: new Date().toISOString().split("T")[0],
      meal_type: newMeal.meal_type,
      calories: Number(newMeal.calories),
      protein: Number(newMeal.protein),
      carbs: Number(newMeal.carbs),
      fat: Number(newMeal.fat),
      fiber: Number(newMeal.fiber),
      water_intake: Number(newMeal.water_intake),
    }

    const updatedData = {
      ...state.historicalData,
      nutrition: [...state.historicalData.nutrition, mealEntry],
    }

    actions.updateHistoricalData(updatedData)
    setNewMeal({
      meal_type: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      fiber: "",
      water_intake: "",
    })
    setIsAddingMeal(false)
  }

  // Calculate nutrition totals
  const getNutritionTotals = () => {
    if (!state.historicalData?.nutrition.length) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    }

    return state.historicalData.nutrition.reduce(
      (totals, meal) => ({
        calories: totals.calories + meal.calories,
        protein: totals.protein + meal.protein,
        carbs: totals.carbs + meal.carbs,
        fat: totals.fat + meal.fat,
        fiber: totals.fiber + meal.fiber,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    )
  }

  const totals = getNutritionTotals()
  // Helper to safely render nutrition values
  const safeValue = (value: number, suffix = "") => isNaN(value) ? "N/A" : `${value}${suffix}`

  // Macro distribution data for pie chart
  const macroData = [
    { name: "Protein", value: totals.protein, color: "hsl(var(--chart-1))" },
    { name: "Carbs", value: totals.carbs, color: "hsl(var(--chart-2))" },
    { name: "Fat", value: totals.fat, color: "hsl(var(--chart-3))" },
  ]

  return (
    <div className="space-y-6">
      {/* Nutrition Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">{safeValue(totals.calories)}</p>
              <p className="text-sm text-muted-foreground">Calories</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-500">{safeValue(totals.protein, "g")}</p>
              <p className="text-sm text-muted-foreground">Protein</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">{safeValue(totals.carbs, "g")}</p>
              <p className="text-sm text-muted-foreground">Carbs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-500">{safeValue(totals.fat, "g")}</p>
              <p className="text-sm text-muted-foreground">Fat</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-500">{safeValue(totals.fiber, "g")}</p>
              <p className="text-sm text-muted-foreground">Fiber</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Macro Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Macro Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Add Meal Form */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Log Meal
            </CardTitle>
            <Button size="sm" onClick={() => setIsAddingMeal(!isAddingMeal)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Meal
            </Button>
          </CardHeader>
          <CardContent>
            {isAddingMeal ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="meal-type">Meal Type</Label>
                  <Select
                    value={newMeal.meal_type}
                    onValueChange={(value) => setNewMeal({ ...newMeal, meal_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select meal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Breakfast">Breakfast</SelectItem>
                      <SelectItem value="Lunch">Lunch</SelectItem>
                      <SelectItem value="Dinner">Dinner</SelectItem>
                      <SelectItem value="Snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="calories">Calories</Label>
                    <Input
                      id="calories"
                      type="number"
                      value={newMeal.calories}
                      onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="protein">Protein (g)</Label>
                    <Input
                      id="protein"
                      type="number"
                      value={newMeal.protein}
                      onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="carbs">Carbs (g)</Label>
                    <Input
                      id="carbs"
                      type="number"
                      value={newMeal.carbs}
                      onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fat">Fat (g)</Label>
                    <Input
                      id="fat"
                      type="number"
                      value={newMeal.fat}
                      onChange={(e) => setNewMeal({ ...newMeal, fat: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddMeal} className="flex-1">
                    Add Meal
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingMeal(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {state.historicalData?.nutrition.slice(0, 3).map((meal, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{meal.meal_type}</p>
                      <p className="text-sm text-muted-foreground">{meal.calories} calories</p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>P: {meal.protein}g</p>
                      <p>C: {meal.carbs}g</p>
                      <p>F: {meal.fat}g</p>
                    </div>
                  </div>
                )) || (
                    <div className="text-center py-8 text-muted-foreground">
                      <Utensils className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No meals logged yet</p>
                      <p className="text-sm">Start tracking your nutrition!</p>
                    </div>
                  )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
