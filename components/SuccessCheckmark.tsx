"use client"

import { motion } from "framer-motion"

interface SuccessCheckmarkProps {
  isVisible: boolean
  size?: number
}

export function SuccessCheckmark({ isVisible, size = 56 }: SuccessCheckmarkProps) {
  if (!isVisible) return null

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="flex items-center justify-center"
    >
      <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 52 52">
        <circle className="checkmark__circle" fill="none" cx="26" cy="26" r="25" />
        <path className="checkmark__check" fill="none" d="m14.1 27.2l7.1 7.2 16.7-16.8" />
      </svg>
    </motion.div>
  )
}
