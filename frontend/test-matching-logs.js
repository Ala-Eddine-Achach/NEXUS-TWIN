// Test script to show the matching API logging structure
// This demonstrates what the console output looks like

console.group("🤝 MATCHING API - 2025-09-14T10:30:45.123Z")

console.group("📥 INPUT DATA")
console.log("👤 User Profile:", JSON.stringify({
    user_id: "user_000001",
    age: 21,
    gender: "Male",
    fitness_level: "Intermediate",
    height: 175,
    weight: 70
}, null, 2))

console.log("🎯 Preferences:", JSON.stringify({
    age_range: [18, 30],
    gender_preference: "any",
    activity_interests: ["pilates", "cardio", "strength_training"],
    intensity_preference: "moderate",
    "want same city": true
}, null, 2))

console.log("💪 Current Activity Suggestion:", JSON.stringify({
    type: "strength_training", // Fixed from 'dancing'
    duration: 35,
    intensity: "moderate" // Fixed from 'medium'
}, null, 2))

console.log("📍 Location Data:", JSON.stringify({
    location: {
        city: "ariana"
    }
}, null, 2))
console.groupEnd()

console.log("🌐 API Endpoint:", "http://localhost:3001/api/match")

console.group("📤 REQUEST PAYLOAD")
console.log("Raw Request Body:", JSON.stringify({
    user_profile: {
        user_id: "user_000001",
        age: 21,
        gender: "Male",
        fitness_level: "Intermediate",
        city: "ariana",
        current_metrics: {
            energy_level: 82.1,
            recovery_index: 88.7,
            readiness_score: 84.9
        }
    },
    preferences: {
        "want same city": true,
        age_range: [18, 30],
        gender_preference: "any",
        activity_interests: ["pilates", "cardio", "strength_training"],
        intensity_preference: "moderate"
    },
    current_activity_suggestion: {
        type: "strength_training",
        duration: 35,
        intensity: "moderate"
    }
}, null, 2))

console.log("\n📋 CLEAN API STRUCTURE:")
console.log(`{
  "user_profile": {
    "user_id": "user_000001",
    "age": 21,
    "gender": "Male",
    "fitness_level": "Intermediate",
    "city": "ariana",
    "current_metrics": {
      "energy_level": 82.1,
      "recovery_index": 88.7,
      "readiness_score": 84.9
    }
  },
  "preferences": {
    "want same city": true,
    "age_range": [18, 30],
    "gender_preference": "any",
    "activity_interests": ["pilates", "cardio", "strength_training"],
    "intensity_preference": "moderate"
  },
  "current_activity_suggestion": {
    "type": "strength_training",
    "duration": 35,
    "intensity": "moderate"
  }
}`)
console.groupEnd()

console.group("📥 RESPONSE DATA")
console.log("✅ Raw Response:", JSON.stringify({
    matched_users: [
        {
            user_id: "user_000043",
            compatibility_score: 0.87,
            shared_interests: ["pilates", "strength_training"],
            fitness_level: "intermediate",
            age: 23,
            gender: "Female",
            current_readiness: 79.3,
            availability: "today_evening"
        },
        {
            user_id: "user_000156",
            compatibility_score: 0.82,
            shared_interests: ["cardio", "strength_training"],
            fitness_level: "intermediate",
            age: 25,
            gender: "Male",
            current_readiness: 85.1,
            availability: "tomorrow_morning"
        }
    ]
}, null, 2))

console.log("⚡ Response Time: 245ms")
console.log("👥 Matches Found: 2")
console.log("🏆 Top Match:", {
    user_id: "user_000043",
    compatibility_score: 0.87,
    shared_interests: ["pilates", "strength_training"]
})
console.groupEnd()

console.groupEnd() // Close main group

console.log("\n🔍 WHERE TO FIND THESE LOGS:")
console.log("1. Open browser DevTools (F12)")
console.log("2. Go to Console tab")
console.log("3. Click 'Find New Matches' button in the app")
console.log("4. Look for the grouped logs starting with '🤝 MATCHING API'")
console.log("5. The logs are organized in collapsible groups for easy reading")