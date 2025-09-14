import { NexusTwinLogo } from "@/components/ui/nexus-twin-logo"

export default function AuthLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
            <div className="text-center">
                <div className="mb-6">
                    <NexusTwinLogo size="lg" />
                </div>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading Nexus Twin...</p>
            </div>
        </div>
    )
}