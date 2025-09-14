import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Nexus Twin - Sign In",
    description: "Sign in to your Nexus Twin account and continue your fitness journey",
}

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="min-h-screen bg-background">
            {children}
        </div>
    )
}