"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Shield, AlertTriangle, CheckCircle, Eye, Clock } from "lucide-react"

interface SybilCheck {
  address: string
  riskScore: number
  checks: {
    accountAge: boolean
    transactionHistory: boolean
    behaviorPattern: boolean
    networkAnalysis: boolean
    reputationScore: boolean
  }
  status: "safe" | "suspicious" | "blocked"
  lastChecked: number
}

export function AntiSybilSystem({ address }: { address?: string }) {
  const [sybilCheck, setSybilCheck] = useState<SybilCheck | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    if (address) {
      performSybilCheck(address)
    }
  }, [address])

  const performSybilCheck = async (userAddress: string) => {
    setIsChecking(true)

    // Simulate comprehensive sybil detection
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const checks = {
      accountAge: Math.random() > 0.2, // 80% pass rate
      transactionHistory: Math.random() > 0.3, // 70% pass rate
      behaviorPattern: Math.random() > 0.1, // 90% pass rate
      networkAnalysis: Math.random() > 0.25, // 75% pass rate
      reputationScore: Math.random() > 0.15, // 85% pass rate
    }

    const passedChecks = Object.values(checks).filter(Boolean).length
    const riskScore = Math.max(0, 100 - passedChecks * 20 + Math.random() * 10)

    let status: "safe" | "suspicious" | "blocked" = "safe"
    if (riskScore > 70) status = "blocked"
    else if (riskScore > 40) status = "suspicious"

    setSybilCheck({
      address: userAddress,
      riskScore,
      checks,
      status,
      lastChecked: Date.now(),
    })

    setIsChecking(false)
  }

  if (!address) return null

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed top-20 right-4 z-40">
      <div className="bg-gray-900/95 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4 w-72">
        <div className="flex items-center gap-2 mb-3">
          <motion.div
            animate={isChecking ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: isChecking ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
          >
            <Eye className="h-5 w-5 text-blue-400" />
          </motion.div>
          <span className="text-white font-semibold">Anti-Sybil Scanner</span>
        </div>

        {isChecking ? (
          <div className="text-center py-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              className="text-blue-400 mb-2"
            >
              <Shield className="h-8 w-8 mx-auto" />
            </motion.div>
            <div className="text-gray-300">Analyzing account...</div>
          </div>
        ) : sybilCheck ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Risk Score:</span>
              <div className="flex items-center gap-2">
                <div
                  className={`w-16 h-2 rounded-full ${
                    sybilCheck.riskScore > 70
                      ? "bg-red-500"
                      : sybilCheck.riskScore > 40
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                >
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${sybilCheck.riskScore}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <span
                  className={`text-sm font-bold ${
                    sybilCheck.riskScore > 70
                      ? "text-red-400"
                      : sybilCheck.riskScore > 40
                        ? "text-yellow-400"
                        : "text-green-400"
                  }`}
                >
                  {sybilCheck.riskScore.toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="space-y-1">
              {Object.entries(sybilCheck.checks).map(([check, passed]) => (
                <div key={check} className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 capitalize">{check.replace(/([A-Z])/g, " $1").toLowerCase()}</span>
                  {passed ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  )}
                </div>
              ))}
            </div>

            <div
              className={`p-2 rounded text-center text-sm font-semibold ${
                sybilCheck.status === "safe"
                  ? "bg-green-500/20 text-green-400"
                  : sybilCheck.status === "suspicious"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-red-500/20 text-red-400"
              }`}
            >
              {sybilCheck.status.toUpperCase()}
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              Last checked: {new Date(sybilCheck.lastChecked).toLocaleTimeString()}
            </div>
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}
