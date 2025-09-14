"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Info, ExternalLink, Heart, Github, Mail } from "lucide-react"

export function AppSettings() {
  const appVersion = "1.0.0"
  const buildDate = "2025-01-13"

  const handleContactSupport = () => {
    window.open("mailto:support@fitmatchpro.com", "_blank")
  }

  const handleViewSource = () => {
    window.open("https://github.com/fitmatchpro", "_blank")
  }

  const handlePrivacyPolicy = () => {
    window.open("/privacy", "_blank")
  }

  const handleTermsOfService = () => {
    window.open("/terms", "_blank")
  }

  return (
    <div className="space-y-6">
      {/* App Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Info className="h-5 w-5" />
            App Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Version</span>
            <Badge variant="secondary">{appVersion}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Build Date</span>
            <span className="text-sm text-muted-foreground">{buildDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Platform</span>
            <span className="text-sm text-muted-foreground">Web App</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">API Status</span>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Connected</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Support & Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Support & Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" onClick={handleContactSupport} className="w-full justify-start bg-transparent">
            <Mail className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
          <Button variant="outline" onClick={handleViewSource} className="w-full justify-start bg-transparent">
            <Github className="h-4 w-4 mr-2" />
            View Source Code
          </Button>
        </CardContent>
      </Card>

      {/* Legal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Legal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" onClick={handlePrivacyPolicy} className="w-full justify-start bg-transparent">
            <ExternalLink className="h-4 w-4 mr-2" />
            Privacy Policy
          </Button>
          <Button variant="outline" onClick={handleTermsOfService} className="w-full justify-start bg-transparent">
            <ExternalLink className="h-4 w-4 mr-2" />
            Terms of Service
          </Button>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold">FitMatch Pro</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Your intelligent fitness companion with AI coaching, health analytics, and social matching features.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with modern web technologies for the best user experience.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
