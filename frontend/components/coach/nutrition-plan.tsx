"use client"

import { useApp } from "@/contexts/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Utensils, Droplets, Pill, Plus } from "lucide-react"

export function NutritionPlan() {
  const { state } = useApp()

  // Default nutrition plan if no AI coach data
  const defaultNutrition = {
    nutrition_plan: {
      meal_suggestions: [
        {
          meal_type: "Breakfast",
          target_calories: 400,
          macro_breakdown: {
            protein: 25,
            carbs: 45,
            fat: 30,
          },
          food_suggestions: ["Greek Yogurt with Berries", "Oatmeal with Nuts", "Protein Smoothie"],
        },
        {
          meal_type: "Lunch",
          target_calories: 500,
          macro_breakdown: {
            protein: 30,
            carbs: 40,
            fat: 30,
          },
          food_suggestions: ["Grilled Chicken Salad", "Quinoa Bowl", "Avocado Toast"],
        },
        {
          meal_type: "Dinner",
          target_calories: 450,
          macro_breakdown: {
            protein: 35,
            carbs: 35,
            fat: 30,
          },
          food_suggestions: ["Salmon with Vegetables", "Lean Beef Stir-fry", "Tofu Buddha Bowl"],
        },
      ],
      hydration_targets: {
        water_intake_ml: 2500,
        timing_suggestions: [
          "Drink a glass of water upon waking up",
          "Have water before each meal",
          "Carry a water bottle throughout the day",
        ],
      },
      supplement_recommendations: [
        {
          supplement_type: "Omega-3 Fish Oil",
          timing: "With breakfast",
          rationale: "Supports heart health and brain function",
        },
        {
          supplement_type: "Vitamin D3",
          timing: "With lunch",
          rationale: "Supports bone health and immune function",
        },
      ],
    },
  }

  const coachData = state.aiCoachData || defaultNutrition
  const nutritionPlan = coachData.nutrition_plan

  const handleAddMeal = (meal: any) => {
    // In a real app, this would add the meal to the nutrition tracker
    console.log("Adding meal:", meal)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Utensils className="h-5 w-5 text-primary" />
          Nutrition Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Meal Suggestions */}
        {nutritionPlan?.meal_suggestions && (
          <div>
            <h4 className="font-medium mb-4">Meal Suggestions</h4>
            <div className="grid gap-4 md:grid-cols-3">
              {nutritionPlan.meal_suggestions.map((meal: any, index: number) => (
                <Card key={index} className="border-muted">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium">{meal.meal_type}</h5>
                      <Badge variant="secondary">{meal.target_calories} cal</Badge>
                    </div>

                    {/* Macro Breakdown */}
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground mb-2">Macro Breakdown:</p>
                      <div className="flex gap-2">
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs">
                          P: {meal.macro_breakdown.protein}%
                        </Badge>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                          C: {meal.macro_breakdown.carbs}%
                        </Badge>
                        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs">
                          F: {meal.macro_breakdown.fat}%
                        </Badge>
                      </div>
                    </div>

                    {/* Food Suggestions */}
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground mb-2">Suggested Foods:</p>
                      <div className="space-y-1">
                        {meal.food_suggestions.slice(0, 2).map((food: string, foodIndex: number) => (
                          <p key={foodIndex} className="text-xs">
                            • {food}
                          </p>
                        ))}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={() => handleAddMeal(meal)}
                    >
                      <Plus className="h-3 w-3 mr-2" />
                      Add to Plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Hydration Targets */}
        {nutritionPlan?.hydration_targets && (
          <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                  <Droplets className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h5 className="font-medium">Hydration Goal</h5>
                  <p className="text-sm text-muted-foreground">
                    {nutritionPlan.hydration_targets.water_intake_ml}ml daily
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                {nutritionPlan.hydration_targets.timing_suggestions.map((tip: string, index: number) => (
                  <p key={index} className="text-xs text-muted-foreground">
                    • {tip}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Supplement Recommendations */}
        {nutritionPlan?.supplement_recommendations && (
          <div>
            <h4 className="font-medium mb-3">Supplement Recommendations</h4>
            <div className="grid gap-3 md:grid-cols-2">
              {nutritionPlan.supplement_recommendations.map((supplement: any, index: number) => (
                <Card key={index} className="border-muted">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900">
                        <Pill className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{supplement.supplement_type}</h5>
                        <p className="text-xs text-muted-foreground mb-1">{supplement.timing}</p>
                        <p className="text-xs text-muted-foreground">{supplement.rationale}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
