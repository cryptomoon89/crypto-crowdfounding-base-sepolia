"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true) // Default to dark

  useEffect(() => {
    // Force dark theme
    setIsDark(true)
    document.documentElement.classList.add("dark")
    localStorage.setItem("theme", "dark")
  }, [])

  const toggleTheme = () => {
    if (isDark) {
      setIsDark(false)
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    } else {
      setIsDark(true)
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="bg-gray-800/80 backdrop-blur-sm border-orange-500/30 text-white hover:bg-gray-700/80"
    >
      {isDark ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-orange-500" />}
    </Button>
  )
}
