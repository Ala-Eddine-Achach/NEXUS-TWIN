"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    avatar?: string
}

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (data: RegisterData) => Promise<void>
    logout: () => void
}

interface RegisterData {
    firstName: string
    lastName: string
    email: string
    password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Initialize auth state from localStorage on mount
    useEffect(() => {
        console.log("AuthProvider initializing...")
        const storedUser = localStorage.getItem("nexus_twin_user")
        console.log("Stored user:", storedUser)
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser)
                console.log("Parsed user:", parsedUser)
                setUser(parsedUser)
            } catch (error) {
                console.error("Failed to parse stored user data:", error)
                localStorage.removeItem("nexus_twin_user")
            }
        }
        setIsLoading(false)
        console.log("AuthProvider initialization complete")
    }, [])

    const login = async (email: string, password: string): Promise<void> => {
        setIsLoading(true)
        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            const mockUser: User = {
                id: "1",
                email,
                firstName: email.split("@")[0],
                lastName: "User",
                avatar: `https://ui-avatars.com/api/?name=${email.split("@")[0]}&background=16a34a&color=fff`
            }

            setUser(mockUser)
            localStorage.setItem("nexus_twin_user", JSON.stringify(mockUser))
        } catch (error) {
            throw new Error("Login failed. Please check your credentials.")
        } finally {
            setIsLoading(false)
        }
    }

    const register = async (data: RegisterData): Promise<void> => {
        setIsLoading(true)
        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            const mockUser: User = {
                id: Date.now().toString(),
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                avatar: `https://ui-avatars.com/api/?name=${data.firstName}+${data.lastName}&background=16a34a&color=fff`
            }

            setUser(mockUser)
            localStorage.setItem("nexus_twin_user", JSON.stringify(mockUser))
        } catch (error) {
            throw new Error("Registration failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => {
        console.log("Logging out...")
        setUser(null)
        localStorage.removeItem("nexus_twin_user")
        // Force redirect to auth page
        window.location.href = "/auth"
    }

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}