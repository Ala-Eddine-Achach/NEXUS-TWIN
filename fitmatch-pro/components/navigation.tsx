"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, Activity, Brain, Users, MapPin, Settings, Menu, X } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Analytics", href: "/analytics", icon: Activity },
  { name: "AI Coach", href: "/coach", icon: Brain },
  { name: "Matching", href: "/matching", icon: Users },
  { name: "Locations", href: "/locations", icon: MapPin },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-background/80 backdrop-blur-sm"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm">
          <nav className="flex flex-col items-center justify-center h-full space-y-8">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 text-lg font-medium transition-colors",
                    pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-6 w-6" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      )}

      {/* Desktop navigation */}
      <nav className="hidden md:flex fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <div className="flex items-center space-x-1 bg-card/80 backdrop-blur-sm border rounded-full p-2 shadow-lg">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={pathname === item.href ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "rounded-full h-10 w-10 p-0",
                    pathname === item.href && "bg-primary text-primary-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">{item.name}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
