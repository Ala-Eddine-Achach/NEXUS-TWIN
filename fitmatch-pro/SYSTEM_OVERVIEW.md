# FitMatch Pro - System Overview

## 🏗️ Core Functionalities

### 1. **Health Analytics Dashboard**
- Real-time health metrics monitoring (heart rate, activity, sleep, nutrition)
- Interactive charts and visualizations using Chart.js
- Health score calculations and progress tracking
- Historical data analysis with 2-day window for predictions

### 2. **AI-Powered Matching System**
- Social fitness partner matching based on preferences and location
- Activity-based filtering with 10 standardized activity types
- Location-aware matching using GPS coordinates
- Real-time availability and proximity matching

### 3. **Interactive Location Services**
- GPS-based location tracking and weather integration
- Interactive maps showing nearby fitness locations
- Weather-aware activity recommendations
- Location-based partner suggestions

### 4. **Personal Settings & Preferences**
- Comprehensive user profile management
- Activity preferences and fitness goals
- Privacy settings and data management controls
- Personalized recommendation settings

## 🤖 AI Models (3 Core Models)

### 1. **Health Prediction Model** (`/predict` endpoint)
- **Purpose**: Analyzes user health data to predict fitness trends and risks
- **Input**: User profile + 2-day historical health data
- **Output**: Health analytics, risk assessments, and improvement suggestions
- **Algorithm**: Machine learning model for health pattern recognition

### 2. **LLM Coach Model** (`/llm` endpoint)
- **Purpose**: Conversational AI fitness coach providing personalized advice
- **Input**: User profile, health data, chat history, location context
- **Output**: Natural language recommendations, workout plans, nutrition advice
- **Algorithm**: Large Language Model with fitness domain expertise

### 3. **Social Matching Model** (`/match` endpoint)
- **Purpose**: Intelligent partner matching for fitness activities
- **Input**: User preferences, activity interests, location data, availability
- **Output**: Ranked list of compatible fitness partners
- **Algorithm**: Multi-factor matching algorithm considering location, interests, and compatibility

## 📡 API Services (4 Core APIs)

### 1. **Location & Weather API** (`/location`)
```typescript
POST /location
Input: { latitude, longitude }
Output: Weather data, nearby locations, environmental conditions
```

### 2. **Health Analytics API** (`/predict`)
```typescript
POST /predict  
Input: { user_profile, historical_data }
Output: Health predictions, risk analysis, improvement metrics
```

### 3. **AI Coach API** (`/llm`)
```typescript
POST /llm
Input: { user_profile, historical_data, user_message, location_data, chat_history }
Output: Personalized fitness advice, workout recommendations, nutrition plans
```

### 4. **Social Matching API** (`/match`)
```typescript
POST /match
Input: { user_profile, preferences, current_activity_suggestion, location_data }
Output: { matched_users: MatchedUser[] }
```

## 🎯 Key Features

### Centralized Activity System
- **10 Standardized Activities**: Running, cycling, swimming, hiking, yoga, pilates, cardio, strength_training, dance, team_sports
- **Activity Mapping**: Automatic conversion from AI suggestions to supported activities
- **Consistent Vocabulary**: Unified activity names across UI, API, and AI models

### Comprehensive Logging
- **Grouped Console Logs**: Organized API request/response logging
- **Performance Timing**: Request duration tracking
- **Error Handling**: CORS fallback system with offline capabilities
- **Debugging**: Structured data inspection for development

### Hybrid API Architecture
- **Server Compatibility**: Sends nested JSON structure to backend
- **Future-Ready**: Logs flat structure for API migration
- **Backwards Compatible**: Maintains existing server contracts while preparing for modernization

## 🔧 Technical Stack
- **Frontend**: React/Next.js with TypeScript
- **UI Components**: Shadcn/ui component library
- **State Management**: React Context API
- **Data Persistence**: Local Storage service
- **API Communication**: Fetch with timeout and error handling
- **Charts**: Chart.js for health analytics visualization