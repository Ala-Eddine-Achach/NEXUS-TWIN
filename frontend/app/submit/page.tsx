"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Dumbbell } from "lucide-react"

export default function SubmissionPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        age: "",
        activity_level: "",
        fitness_goals: "",
        message: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {}

        if (!formData.name.trim()) {
            newErrors.name = "Name is required"
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        }

        if (!formData.age.trim()) {
            newErrors.age = "Age is required"
        } else if (isNaN(Number(formData.age)) || Number(formData.age) < 1 || Number(formData.age) > 120) {
            newErrors.age = "Please enter a valid age (1-120)"
        }

        if (!formData.activity_level) {
            newErrors.activity_level = "Activity level is required"
        }

        if (!formData.fitness_goals.trim()) {
            newErrors.fitness_goals = "Fitness goals are required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: "",
            }))
        }
    }

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            activity_level: value,
        }))

        if (errors.activity_level) {
            setErrors(prev => ({
                ...prev,
                activity_level: "",
            }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            // Simulate form submission
            console.log("[v0] 📝 Form submission:", formData)
            await new Promise(resolve => setTimeout(resolve, 2000))

            setIsSubmitted(true)
            console.log("[v0] ✅ Form submitted successfully")

        } catch (error) {
            console.error("[v0] ❌ Form submission error:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            age: "",
            activity_level: "",
            fitness_goals: "",
            message: "",
        })
        setIsSubmitted(false)
        setErrors({})
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
                <Card className="w-full max-w-md shadow-lg border-0">
                    <CardContent className="text-center p-8">
                        <div className="mb-6">
                            <CheckCircle className="mx-auto text-green-500" size={64} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
                        <p className="text-gray-600 mb-6">
                            Your fitness profile has been submitted successfully. We'll be in touch soon!
                        </p>
                        <Button onClick={resetForm} className="w-full">
                            Submit Another Form
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
            <div className="container mx-auto max-w-2xl py-8">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-primary text-primary-foreground p-3 rounded-xl">
                            <Dumbbell size={32} />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">FitMatch Pro</h1>
                    <p className="text-gray-600">Share your fitness profile with us</p>
                </div>

                <Card className="shadow-lg border-0">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Fitness Profile Submission</CardTitle>
                        <CardDescription className="text-center">
                            Tell us about your fitness journey and goals
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={errors.name ? "border-red-500" : ""}
                                        disabled={isLoading}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address *</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={errors.email ? "border-red-500" : ""}
                                        disabled={isLoading}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500">{errors.email}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="age">Age *</Label>
                                    <Input
                                        id="age"
                                        name="age"
                                        type="number"
                                        placeholder="Enter your age"
                                        value={formData.age}
                                        onChange={handleInputChange}
                                        className={errors.age ? "border-red-500" : ""}
                                        disabled={isLoading}
                                        min="1"
                                        max="120"
                                    />
                                    {errors.age && (
                                        <p className="text-sm text-red-500">{errors.age}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="activity_level">Activity Level *</Label>
                                    <Select value={formData.activity_level} onValueChange={handleSelectChange} disabled={isLoading}>
                                        <SelectTrigger className={errors.activity_level ? "border-red-500" : ""}>
                                            <SelectValue placeholder="Select activity level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sedentary">Sedentary (Little/no exercise)</SelectItem>
                                            <SelectItem value="lightly_active">Lightly Active (1-3 days/week)</SelectItem>
                                            <SelectItem value="moderately_active">Moderately Active (3-5 days/week)</SelectItem>
                                            <SelectItem value="very_active">Very Active (6-7 days/week)</SelectItem>
                                            <SelectItem value="extremely_active">Extremely Active (Very intense exercise)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.activity_level && (
                                        <p className="text-sm text-red-500">{errors.activity_level}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fitness_goals">Fitness Goals *</Label>
                                <Input
                                    id="fitness_goals"
                                    name="fitness_goals"
                                    type="text"
                                    placeholder="e.g., Weight loss, Muscle gain, Endurance, Flexibility"
                                    value={formData.fitness_goals}
                                    onChange={handleInputChange}
                                    className={errors.fitness_goals ? "border-red-500" : ""}
                                    disabled={isLoading}
                                />
                                {errors.fitness_goals && (
                                    <p className="text-sm text-red-500">{errors.fitness_goals}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Additional Message (Optional)</Label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    placeholder="Tell us more about your fitness journey, challenges, or specific needs..."
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    rows={4}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <LoadingSpinner className="mr-2" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Profile"
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-500">
                                * Required fields
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}