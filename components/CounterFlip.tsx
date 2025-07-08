"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface CounterFlipProps {
  value: number
  duration?: number
}

export function CounterFlip({ value, duration = 1000 }: CounterFlipProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)

  useEffect(() => {
    if (value !== displayValue) {
      setIsFlipping(true)
      const timer = setTimeout(() => {
        setDisplayValue(value)
        setIsFlipping(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [value, displayValue])

  return (
    <motion.div
      className="inline-block"
      animate={isFlipping ? { rotateX: [-90, 0] } : {}}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {displayValue.toLocaleString()}
    </motion.div>
  )
}
