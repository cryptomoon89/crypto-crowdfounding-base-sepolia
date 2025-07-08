"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Shield, Lock, Eye, AlertTriangle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SecurityEvent {
  id: string
  type: "sybil_detected" | "hack_attempt" | "suspicious_activity" | "security_check"
  timestamp: number
  address: string
  severity: "low" | "medium" | "high" | "critical"
  blocked: boolean
}

export function SecurityShield() {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [isActive, setIsActive] = useState(true)
  const [threatLevel, setThreatLevel] = useState<"safe" | "warning" | "danger">("safe")

  useEffect(() => {
    // Simulate security monitoring
    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        // 10% chance of security event
        const event: SecurityEvent = {
          id: Math.random().toString(36).substr(2, 9),
          type: ["sybil_detected", "hack_attempt", "suspicious_activity", "security_check"][
            Math.floor(Math.random() * 4)
          ] as any,
          timestamp: Date.now(),
          address: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
          severity: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)] as any,
          blocked: Math.random() > 0.3,
        }

        setSecurityEvents((prev) => [event, ...prev.slice(0, 4)])

        // Update threat level based on recent events
        const recentEvents = securityEvents.slice(0, 3)
        const criticalEvents = recentEvents.filter((e) => e.severity === "critical").length
        const highEvents = recentEvents.filter((e) => e.severity === "high").length

        if (criticalEvents > 0) {
          setThreatLevel("danger")
        } else if (highEvents > 1) {
          setThreatLevel("warning")
        } else {
          setThreatLevel("safe")
        }
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [securityEvents])

  const getEventIcon = (type: string) => {
    switch (type) {
      case "sybil_detected":
        return <Eye className="h-4 w-4" />
      case "hack_attempt":
        return <AlertTriangle className="h-4 w-4" />
      case "suspicious_activity":
        return <Shield className="h-4 w-4" />
      case "security_check":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Lock className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-400 bg-red-500/20 border-red-500/30"
      case "high":
        return "text-orange-400 bg-orange-500/20 border-orange-500/30"
      case "medium":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30"
      case "low":
        return "text-green-400 bg-green-500/20 border-green-500/30"
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/30"
    }
  }

  const getThreatLevelColor = () => {
    switch (threatLevel) {
      case "danger":
        return "from-red-500 to-orange-500"
      case "warning":
        return "from-yellow-500 to-orange-500"
      case "safe":
        return "from-green-500 to-blue-500"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <Card className="w-80 bg-gray-900/95 backdrop-blur-sm border-blue-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <motion.div
              animate={{
                rotate: isActive ? [0, 360] : 0,
                scale: isActive ? [1, 1.1, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: isActive ? Number.POSITIVE_INFINITY : 0,
                ease: "linear",
              }}
            >
              <Shield className={`h-5 w-5 bg-gradient-to-r ${getThreatLevelColor()} bg-clip-text text-transparent`} />
            </motion.div>
            <span className="text-white">Security Shield</span>
            <Badge className={`ml-auto ${getSeverityColor(threatLevel)}`}>{threatLevel.toUpperCase()}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Anti-Sybil & Hack Protection</span>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="w-2 h-2 bg-green-500 rounded-full"
            />
          </div>

          {securityEvents.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs text-gray-400 mb-2">Recent Security Events:</div>
              {securityEvents.slice(0, 3).map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 p-2 rounded bg-gray-800/50 text-xs"
                >
                  <div className={getSeverityColor(event.severity)}>{getEventIcon(event.type)}</div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{event.type.replace(/_/g, " ").toUpperCase()}</div>
                    <div className="text-gray-400">{event.address}</div>
                  </div>
                  {event.blocked && (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">BLOCKED</Badge>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center p-2 bg-green-500/10 rounded border border-green-500/20">
              <div className="text-green-400 font-bold">99.9%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
            <div className="text-center p-2 bg-blue-500/10 rounded border border-blue-500/20">
              <div className="text-blue-400 font-bold">256-bit</div>
              <div className="text-gray-400">Encryption</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
