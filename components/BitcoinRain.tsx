"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface BitcoinRainProps {
  isActive: boolean
  duration?: number
}

export function BitcoinRain({ isActive, duration = 5000 }: BitcoinRainProps) {
  const [drops, setDrops] = useState<Array<{ id: number; left: number; delay: number; size: number }>>([])

  useEffect(() => {
    if (isActive) {
      const newDrops = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        size: Math.random() * 20 + 20,
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
          className="absolute text-orange-500 font-bold"
          style={{
            left: `${drop.left}%`,
            fontSize: `${drop.size}px`,
            textShadow: "0 0 10px rgba(249, 115, 22, 0.8)",
          }}
          initial={{ y: -100, opacity: 1, rotate: 0 }}
          animate={{ y: window.innerHeight + 100, opacity: 0, rotate: 360 }}
          transition={{ duration: 4, delay: drop.delay, ease: "linear" }}
        >
          ₿
        </motion.div>
      ))}
    </div>
  )
}
