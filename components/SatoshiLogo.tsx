"use client"

import { motion } from "framer-motion"

export function SatoshiLogo({ size = 64 }: { size?: number }) {
  return (
    <motion.div
      className="relative"
      animate={{
        rotate: [0, 360],
      }}
      transition={{
        duration: 20,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
    >
      <div
        className="rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 p-2 shadow-lg"
        style={{ width: size, height: size }}
      >
        <motion.div
          className="w-full h-full rounded-full bg-black flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <span className="text-orange-500 font-bold" style={{ fontSize: size * 0.3 }}>
            ₿
          </span>
        </motion.div>
      </div>
      <motion.div
        className="absolute -inset-2 rounded-full bg-gradient-to-r from-orange-500/20 to-yellow-500/20"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  )
}
