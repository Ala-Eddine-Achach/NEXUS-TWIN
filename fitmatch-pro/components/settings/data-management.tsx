"use client"

import type React from "react"

import { useState } from "react"
import { useApp } from "@/contexts/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { StorageService } from "@/lib/storage-service"
import { Download, Upload, Trash2, Database, FileText, AlertTriangle } from "lucide-react"

export function DataManagement() {
  const { state, actions } = useApp()
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const getStorageInfo = () => {
    const data = {
      userProfile: state.userProfile,
      historicalData: state.historicalData,
      healthAnalytics: state.healthAnalytics,
      aiCoachData: state.aiCoachData,
      locationData: state.locationData,
    }

    const dataSize = JSON.stringify(data).length
    const categories = Object.entries(data).filter(([_, value]) => value !== null).length

    return { dataSize, categories, totalCategories: 5 }
  }

  const storageInfo = getStorageInfo()

  const handleExportData = () => {
    setIsExporting(true)
    try {
      const data = {
        userProfile: state.userProfile,
        historicalData: state.historicalData,
        healthAnalytics: state.healthAnalytics,
        aiCoachData: state.aiCoachData,
        locationData: state.locationData,
        exportDate: new Date().toISOString(),
        version: "1.0",
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `fitmatch-data-${new Date().toISOString().split("T")[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)

        if (data.userProfile) actions.updateUserProfile(data.userProfile)
        if (data.historicalData) actions.updateHistoricalData(data.historicalData)

        // Store other data directly
        if (data.healthAnalytics) StorageService.saveHealthAnalytics(data.healthAnalytics)
        if (data.aiCoachData) StorageService.saveAICoachData(data.aiCoachData)
        if (data.locationData) StorageService.saveLocationData(data.locationData)

        // Refresh the page to load imported data
        window.location.reload()
      } catch (error) {
        console.error("Import failed:", error)
      } finally {
        setIsImporting(false)
      }
    }
    reader.readAsText(file)
  }

  const handleClearAllData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      StorageService.clearAllData()
      window.location.reload()
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  return (
    <div className="space-y-6">
      {/* Storage Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Database className="h-5 w-5" />
            Storage Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Data Categories</p>
              <p className="text-sm text-muted-foreground">
                {storageInfo.categories} of {storageInfo.totalCategories} categories have data
              </p>
            </div>
            <Badge variant="secondary">{formatBytes(storageInfo.dataSize)}</Badge>
          </div>

          <Progress value={(storageInfo.categories / storageInfo.totalCategories) * 100} className="h-2" />

          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-center justify-between p-2 rounded bg-muted/50">
              <span className="text-sm">User Profile</span>
              <Badge variant={state.userProfile ? "default" : "outline"}>{state.userProfile ? "Set" : "Empty"}</Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-muted/50">
              <span className="text-sm">Historical Data</span>
              <Badge variant={state.historicalData ? "default" : "outline"}>
                {state.historicalData ? "Available" : "Empty"}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-muted/50">
              <span className="text-sm">Health Analytics</span>
              <Badge variant={state.healthAnalytics ? "default" : "outline"}>
                {state.healthAnalytics ? "Available" : "Empty"}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-muted/50">
              <span className="text-sm">AI Coach Data</span>
              <Badge variant={state.aiCoachData ? "default" : "outline"}>
                {state.aiCoachData ? "Available" : "Empty"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Export/Import */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Export Data</h4>
              <p className="text-sm text-muted-foreground">
                Download all your data as a JSON file for backup or transfer.
              </p>
              <Button onClick={handleExportData} disabled={isExporting} className="w-full">
                <Download className={`h-4 w-4 mr-2 ${isExporting ? "animate-bounce" : ""}`} />
                {isExporting ? "Exporting..." : "Export Data"}
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Import Data</h4>
              <p className="text-sm text-muted-foreground">
                Upload a previously exported JSON file to restore your data.
              </p>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  disabled={isImporting}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button disabled={isImporting} className="w-full">
                  <Upload className={`h-4 w-4 mr-2 ${isImporting ? "animate-bounce" : ""}`} />
                  {isImporting ? "Importing..." : "Import Data"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-red-600 dark:text-red-400">Clear All Data</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Permanently delete all stored data including profile, analytics, and preferences. This action cannot be
              undone.
            </p>
            <Button variant="destructive" onClick={handleClearAllData}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
