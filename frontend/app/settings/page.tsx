"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { SettingsHeader } from "@/components/settings/settings-header"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { DataManagement } from "@/components/settings/data-management"
import { PreferencesSettings } from "@/components/settings/preferences-settings"
import { AppSettings } from "@/components/settings/app-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
        <SettingsHeader />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="app">App</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6 mt-6">
            <ProfileSettings />
          </TabsContent>

          <TabsContent value="data" className="space-y-6 mt-6">
            <DataManagement />
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6 mt-6">
            <PreferencesSettings />
          </TabsContent>

          <TabsContent value="app" className="space-y-6 mt-6">
            <AppSettings />
          </TabsContent>
        </Tabs>
      </div>

      <Navigation />
    </div>
  )
}
