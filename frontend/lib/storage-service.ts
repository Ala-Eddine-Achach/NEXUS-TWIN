// Local storage service for FitMatch Pro
import type { UserProfile, HistoricalData, HealthAnalytics } from "./types"

export class StorageService {
  private static readonly KEYS = {
    USER_PROFILE: "fitmatch_user_profile",
    HISTORICAL_DATA: "fitmatch_historical_data",
    HEALTH_ANALYTICS: "fitmatch_health_analytics",
    AI_COACH_DATA: "fitmatch_ai_coach_data",
    LOCATION_DATA: "fitmatch_location_data",
    PREFERENCES: "fitmatch_preferences",
    CHAT_MESSAGES: "fitmatch_chat_messages",
  }

  // User Profile
  static saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(this.KEYS.USER_PROFILE, JSON.stringify(profile))
  }

  static getUserProfile(): UserProfile | null {
    const data = localStorage.getItem(this.KEYS.USER_PROFILE)
    return data ? JSON.parse(data) : null
  }

  // Historical Data
  static saveHistoricalData(data: HistoricalData): void {
    localStorage.setItem(this.KEYS.HISTORICAL_DATA, JSON.stringify(data))
  }

  static getHistoricalData(): HistoricalData | null {
    const data = localStorage.getItem(this.KEYS.HISTORICAL_DATA)
    return data ? JSON.parse(data) : null
  }

  // Health Analytics
  static saveHealthAnalytics(analytics: HealthAnalytics): void {
    localStorage.setItem(this.KEYS.HEALTH_ANALYTICS, JSON.stringify(analytics))
  }

  static getHealthAnalytics(): HealthAnalytics | null {
    const data = localStorage.getItem(this.KEYS.HEALTH_ANALYTICS)
    return data ? JSON.parse(data) : null
  }

  // AI Coach Data
  static saveAICoachData(coachData: any): void {
    localStorage.setItem(this.KEYS.AI_COACH_DATA, JSON.stringify(coachData))
  }

  static getAICoachData(): any | null {
    const data = localStorage.getItem(this.KEYS.AI_COACH_DATA)
    return data ? JSON.parse(data) : null
  }

  // Location Data
  static saveLocationData(locationData: any): void {
    localStorage.setItem(this.KEYS.LOCATION_DATA, JSON.stringify(locationData))
  }

  static getLocationData(): any | null {
    const data = localStorage.getItem(this.KEYS.LOCATION_DATA)
    return data ? JSON.parse(data) : null
  }

  // User Preferences
  static savePreferences(preferences: any): void {
    localStorage.setItem(this.KEYS.PREFERENCES, JSON.stringify(preferences))
  }

  static getPreferences(): any | null {
    const data = localStorage.getItem(this.KEYS.PREFERENCES)
    return data ? JSON.parse(data) : null
  }

  // Chat Messages
  static saveChatMessages(messages: any[]): void {
    // Convert Date objects to ISO strings for storage
    const serializedMessages = messages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : msg.timestamp
    }))
    localStorage.setItem(this.KEYS.CHAT_MESSAGES, JSON.stringify(serializedMessages))
  }

  static getChatMessages(): any[] | null {
    const data = localStorage.getItem(this.KEYS.CHAT_MESSAGES)
    if (!data) return null

    // Convert ISO strings back to Date objects
    const messages = JSON.parse(data)
    return messages.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }))
  }

  // Clear all data
  static clearAll(): void {
    console.log("[v0] 🗑️ StorageService: Clearing all localStorage data")
    Object.values(this.KEYS).forEach((key) => {
      localStorage.removeItem(key)
      console.log(`[v0] Removed: ${key}`)
    })
  }

  // Get storage info for debugging
  static getStorageInfo(): any {
    const info: any = {}
    Object.entries(this.KEYS).forEach(([name, key]) => {
      const data = localStorage.getItem(key)
      info[name] = {
        key,
        hasData: !!data,
        size: data ? data.length : 0,
      }
    })
    return info
  }
}
