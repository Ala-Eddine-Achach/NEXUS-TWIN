import React from "react"
import { cn } from "@/lib/utils"

interface NexusTwinLogoProps {
    size?: "sm" | "md" | "lg" | "xl"
    className?: string
}

const sizeMap = {
    sm: { container: "w-12 h-12", heartbeat: "w-6 h-6" },
    md: { container: "w-16 h-16", heartbeat: "w-8 h-8" },
    lg: { container: "w-20 h-20", heartbeat: "w-10 h-10" },
    xl: { container: "w-24 h-24", heartbeat: "w-12 h-12" },
}

export function NexusTwinLogo({ size = "md", className }: NexusTwinLogoProps) {
    const { container, heartbeat } = sizeMap[size]

    return (
        <div className={cn("relative inline-flex items-center justify-center", className)}>
            <div className={cn(
                "relative rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg",
                container
            )}>
                {/* Heartbeat SVG - Simple white heartbeat line */}
                <svg
                    viewBox="0 0 100 40"
                    fill="none"
                    className={cn("text-white", heartbeat)}
                >
                    {/* Heartbeat line path */}
                    <path
                        d="M5 20 L15 20 L18 10 L22 30 L26 5 L30 35 L34 15 L38 25 L42 20 L95 20"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        className="animate-pulse"
                    />
                </svg>

                {/* Subtle pulse animation overlay */}
                <div className="absolute inset-0 rounded-2xl bg-white/10 animate-pulse" />

                {/* Twin indicator dot */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-primary animate-pulse" />
            </div>
        </div>
    )
}