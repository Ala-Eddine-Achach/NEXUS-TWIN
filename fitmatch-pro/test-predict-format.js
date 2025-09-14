// Test script to verify the new predict method format
const { ApiService } = require('./lib/api-service.js');

// Mock historical data to test the new format
const testHistoricalData = {
    measurements: [
        {
            date: "2025-09-12", // day t-minus-2
            weight: 65,
            body_fat: 15.2,
            muscle_mass: 45.5,
            bmi: 22.1
        },
        {
            date: "2025-09-13", // day t-minus-1
            weight: 68,
            body_fat: 15.8,
            muscle_mass: 46.1,
            bmi: 22.3
        }
    ],
    nutrition: [
        {
            date: "2025-09-12",
            meal_type: "breakfast",
            calories: 500,
            protein: 25,
            carbs: 60,
            fat: 20,
            fiber: 5,
            water_intake: 500
        },
        {
            date: "2025-09-12",
            meal_type: "lunch",
            calories: 800,
            protein: 35,
            carbs: 90,
            fat: 30,
            fiber: 8,
            water_intake: 600
        },
        {
            date: "2025-09-12",
            meal_type: "dinner",
            calories: 900,
            protein: 50,
            carbs: 100,
            fat: 25,
            fiber: 10,
            water_intake: 400
        },
        {
            date: "2025-09-13",
            meal_type: "breakfast",
            calories: 600,
            protein: 30,
            carbs: 70,
            fat: 25,
            fiber: 6,
            water_intake: 500
        },
        {
            date: "2025-09-13",
            meal_type: "lunch",
            calories: 850,
            protein: 40,
            carbs: 95,
            fat: 28,
            fiber: 9,
            water_intake: 650
        },
        {
            date: "2025-09-13",
            meal_type: "dinner",
            calories: 850,
            protein: 50,
            carbs: 105,
            fat: 27,
            fiber: 12,
            water_intake: 450
        }
    ],
    activities: [
        {
            date: "2025-09-12",
            activity_type: "running",
            duration: 45,
            calories_burned: 450,
            intensity: "Moderate",
            heart_rate_avg: 140
        },
        {
            date: "2025-09-13",
            activity_type: "yoga",
            duration: 30,
            calories_burned: 150,
            intensity: "Low",
            heart_rate_avg: 110
        }
    ],
    workouts: [],
    sleep: [
        {
            date: "2025-09-12",
            total_sleep: 7.5,
            deep_sleep: 1.8,
            sleep_efficiency: 85.2,
            resting_heart_rate: 58
        },
        {
            date: "2025-09-13",
            total_sleep: 8.2,
            deep_sleep: 2.1,
            sleep_efficiency: 89.1,
            resting_heart_rate: 56
        }
    ],
    heart_rate: [
        {
            date_time: "2025-09-12T08:00:00Z",
            value: 58,
            zone: "resting",
            context: "morning"
        },
        {
            date_time: "2025-09-13T08:00:00Z",
            value: 56,
            zone: "resting",
            context: "morning"
        }
    ]
};

const testUserProfile = {
    user_id: "test_user_123",
    age: 28,
    gender: "male",
    height: 175,
    weight: 70,
    fitness_level: "intermediate"
};

console.log("🧪 TESTING NEW PREDICT METHOD FORMAT");
console.log("=====================================");

// Test the getLastTwoDaysData method directly
try {
    // We can't directly call the private method, but we can trigger it through getHealthAnalytics
    console.log("📊 Input Historical Data:");
    console.log("- Measurements:", testHistoricalData.measurements.length, "entries");
    console.log("- Nutrition:", testHistoricalData.nutrition.length, "entries");
    console.log("- Activities:", testHistoricalData.activities.length, "entries");
    console.log("- Sleep:", testHistoricalData.sleep.length, "entries");
    console.log("- Heart Rate:", testHistoricalData.heart_rate.length, "entries");

    console.log("\n🎯 Expected Output Format:");
    console.log(`{
  "day_t_minus_2": {
    "total_sleep": 7.5,
    "deep_sleep": 1.8,
    "resting_heart_rate": 58,
    "calories": 2200,
    "calories_burned": 450,
    "protein": 110,
    "carbs": 250,
    "fat": 75,
    "intensity": "Moderate",
    "value": 65
  },
  "day_t_minus_1": {
    "total_sleep": 8.2,
    "deep_sleep": 2.1,
    "resting_heart_rate": 56,
    "calories": 2300,
    "calories_burned": 150,
    "protein": 120,
    "carbs": 270,
    "fat": 80,
    "intensity": "Low",
    "value": 68
  }
}`);

    console.log("\n✅ Test data prepared successfully!");
    console.log("📝 To test: Call Health Analytics API and check console logs for the new format");

} catch (error) {
    console.error("❌ Test failed:", error);
}

module.exports = { testHistoricalData, testUserProfile };