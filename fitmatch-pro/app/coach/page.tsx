"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useApp } from "@/contexts/app-context"
import { Navigation } from "@/components/navigation"
import { CoachHeader } from "@/components/coach/coach-header"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Brain, Send, User, Bot, Activity, Utensils, Heart } from "lucide-react"
import { ApiService } from "@/lib/api-service"
import { StorageService } from "@/lib/storage-service"

interface ChatMessage {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  data_updates?: any
  recommendations?: {
    activity_suggestions?: any
    nutrition_plan?: any
    behavioral_insights?: any
  }
}

export default function CoachPage() {
  const { state, actions } = useApp()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)

  // Helper function to update messages and save to localStorage
  const updateMessages = (updater: (prev: ChatMessage[]) => ChatMessage[]) => {
    setMessages((prev) => {
      const newMessages = updater(prev)
      StorageService.saveChatMessages(newMessages)
      return newMessages
    })
  }

  useEffect(() => {
    if (!hasInitialized && state.userProfile) {
      setHasInitialized(true)

      // Try to load persisted chat messages first
      const persistedMessages = StorageService.getChatMessages()

      if (persistedMessages && persistedMessages.length > 0) {
        console.log("[v0] 💬 Loading persisted chat messages:", persistedMessages.length)
        setMessages(persistedMessages)
      } else {
        // Create welcome message if no persisted messages
        const welcomeMessage: ChatMessage = {
          id: Date.now().toString(),
          type: "assistant",
          content: `Hi! I'm your AI fitness coach. I can help you with workout recommendations, nutrition advice, and track your progress. What would you like to discuss today?`,
          timestamp: new Date(),
        }
        const initialMessages = [welcomeMessage]
        setMessages(initialMessages)
        StorageService.saveChatMessages(initialMessages)
      }
    }
  }, [state.userProfile, hasInitialized])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    }

    updateMessages((prev) => {
      // Keep only last 6 messages maximum (3 user + 3 assistant pairs)
      const updatedMessages = [...prev, userMessage]
      if (updatedMessages.length > 6) {
        console.log("[v0] 💬 Trimming chat history to last 6 messages")
        return updatedMessages.slice(-6)
      }
      return updatedMessages
    })
    setInputMessage("")
    setIsLoading(true)

    try {
      console.log("[v0] Sending message to AI coach:", inputMessage)

      // Prepare chat history for context (last 5 messages before current)
      const chatHistory = messages.slice(-5).map(msg => ({
        role: msg.type === "user" ? "user" : "assistant",
        content: msg.content,
        timestamp: msg.timestamp.toISOString()
      }))

      console.log("[v0] 💬 Sending chat history to LLM:", chatHistory)

      const response = await ApiService.getAICoachAdvice(
        state.userProfile!,
        state.historicalData!,
        inputMessage.trim(),
        state.locationData, // Include location data from /location endpoint
        chatHistory // Pass chat history
      )

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response.advice_response || "I understand. Let me help you with that.",
        timestamp: new Date(),
        data_updates: response.data_updates,
        recommendations: {
          activity_suggestions: response.activity_suggestions,
          nutrition_plan: response.nutrition_plan,
          behavioral_insights: response.behavioral_insights,
        },
      }

      updateMessages((prev) => [...prev, assistantMessage])

      // Update AI coach data in context with the full response
      console.log("[v0] 🤖 Updating AI coach data with full response")
      actions.updateCoachAdvice(response)

      if (response.data_updates) {
        console.log("[v0] Processing data updates from AI coach:", response.data_updates)
        // This is now handled in updateCoachAdvice, but keeping for backward compatibility
        actions.updateHistoricalData(response.data_updates)
      }
    } catch (error) {
      console.log("[v0] AI coach error:", error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          "I'm having trouble connecting right now. Let me give you some general fitness advice based on your profile instead.",
        timestamp: new Date(),
      }
      updateMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!state.userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col">
        <CoachHeader />

        <Card className="mt-6 flex-1 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              AI Fitness Coach
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <ScrollArea className="flex-1 px-4 pb-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-3">
                    {/* Message bubble */}
                    <div className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                      {message.type === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-blue-600" />
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>

                      {message.type === "user" && (
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>

                    {message.type === "assistant" && message.recommendations && (
                      <div className="ml-11 space-y-3">
                        {message.recommendations.activity_suggestions && (
                          <Card className="border-green-200 bg-green-50">
                            <CardContent className="p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Activity className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium text-green-800">Workout Suggestion</span>
                              </div>
                              <p className="text-sm text-green-700">
                                {message.recommendations.activity_suggestions.primary_workout?.type} -{" "}
                                {message.recommendations.activity_suggestions.primary_workout?.duration} minutes
                              </p>
                            </CardContent>
                          </Card>
                        )}

                        {message.recommendations.nutrition_plan && (
                          <Card className="border-orange-200 bg-orange-50">
                            <CardContent className="p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Utensils className="h-4 w-4 text-orange-600" />
                                <span className="text-sm font-medium text-orange-800">Nutrition Tip</span>
                              </div>
                              <p className="text-sm text-orange-700">
                                Target: {message.recommendations.nutrition_plan.hydration_targets?.water_intake_ml}ml
                                water daily
                              </p>
                            </CardContent>
                          </Card>
                        )}

                        {message.recommendations.behavioral_insights && (
                          <Card className="border-purple-200 bg-purple-50">
                            <CardContent className="p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Heart className="h-4 w-4 text-purple-600" />
                                <span className="text-sm font-medium text-purple-800">Motivation</span>
                              </div>
                              <p className="text-sm text-purple-700">
                                {message.recommendations.behavioral_insights.motivation_message}
                              </p>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="bg-gray-100 rounded-lg px-4 py-2">
                      <LoadingSpinner size="sm" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about workouts, nutrition, or your progress..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isLoading} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="pb-24 md:pb-6">
        <Navigation />
      </div>
    </div>
  )
}
