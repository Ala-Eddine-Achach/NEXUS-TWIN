"use client"

import React, { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { NexusTwinLogo } from "@/components/ui/nexus-twin-logo"
import { Activity, Users, BarChart3, Shield, Zap, Heart } from "lucide-react"

type AuthMode = "login" | "register"

const features = [
  {
    icon: Activity,
    title: "AI-Powered Coaching",
    description: "Get personalized workouts and nutrition plans tailored to your goals"
  },
  {
    icon: Users,
    title: "Smart Matching",
    description: "Connect with workout partners who share your fitness interests"
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Track your progress with detailed health metrics and insights"
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data is secure and only shared with your explicit consent"
  }
]

export default function OnboardingPage() {
  const [authMode, setAuthMode] = useState<AuthMode>("login")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
    // TODO: Redirect to dashboard or handle successful authentication
    console.log("Authentication successful!")
  }

  const switchToLogin = () => setAuthMode("login")
  const switchToRegister = () => setAuthMode("register")

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
        <div className="text-center animate-in fade-in-50 duration-500">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to Nexus Twin!</h1>
          <p className="text-muted-foreground">Redirecting you to your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">

          {/* Left Side - Branding and Features */}
          <div className="space-y-8 animate-in slide-in-from-left-5 duration-700">
            {/* Logo and Brand */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <div className="relative">
                  <NexusTwinLogo size="xl" />
                </div>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                <span className="text-primary">Nexus</span>{" "}
                <span className="text-secondary">Twin</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto lg:mx-0">
                Your AI-powered fitness companion for personalized workouts, health analytics, and social connections.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-border/50 hover:bg-card/40 transition-all duration-300 animate-in fade-in-50 slide-in-from-left-3"
                  style={{
                    animationDelay: `${200 + index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Authentication Forms */}
          <div className="flex justify-center items-center animate-in slide-in-from-right-5 duration-700 delay-200">
            <div className="w-full max-w-md">
              <div className="transition-all duration-500 ease-in-out">
                {authMode === "login" ? (
                  <div className="animate-in fade-in-50 slide-in-from-right-3 duration-300">
                    <LoginForm
                      onSuccess={handleAuthSuccess}
                      onSwitchToRegister={switchToRegister}
                    />
                  </div>
                ) : (
                  <div className="animate-in fade-in-50 slide-in-from-right-3 duration-300">
                    <RegisterForm
                      onSuccess={handleAuthSuccess}
                      onSwitchToLogin={switchToLogin}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-accent/5 rounded-full blur-2xl animate-pulse delay-500" />
      </div>
    </div>
  )
}