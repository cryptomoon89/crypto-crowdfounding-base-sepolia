"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface EthRainProps {
  isActive: boolean
  duration?: number
}

export function EthRain({ isActive, duration = 3000 }: EthRainProps) {
  const [drops, setDrops] = useState<Array<{ id: number; left: number; delay: number }>>([])

  useEffect(() => {
    if (isActive) {
      const newDrops = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
      }))
      setDrops(newDrops)

      const timer = setTimeout(() => {
        setDrops([])
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isActive, duration])

  if (!isActive) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {drops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute text-2xl"
          style={{ left: `${drop.left}%` }}
          initial={{ y: -100, opacity: 1, rotate: 0 }}
          animate={{ y: window.innerHeight + 100, opacity: 0, rotate: 360 }}
          transition={{ duration: 3, delay: drop.delay, ease: "linear" }}
        >
          Ξ
        </motion.div>
      ))}
    </div>
  )
}
