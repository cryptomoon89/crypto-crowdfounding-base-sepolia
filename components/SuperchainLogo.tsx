"use client"

import { motion } from "framer-motion"

export function SuperchainLogo({ size = 64 }: { size?: number }) {
  return (
    <motion.div
      className="relative"
      animate={{
        rotate: [0, 360],
      }}
      transition={{
        duration: 30,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
    >
      <div
        className="rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 p-3 shadow-2xl"
        style={{ width: size, height: size }}
      >
        <motion.div
          className="w-full h-full rounded-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center relative overflow-hidden"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {/* Base Logo */}
          <div className="relative z-10">
            <svg
              width={size * 0.5}
              height={size * 0.5}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#gradient1)" stroke="url(#gradient2)" strokeWidth="0.5" />
              <path d="M2 17L12 22L22 17" fill="none" stroke="url(#gradient2)" strokeWidth="1" strokeLinecap="round" />
              <path d="M2 12L12 17L22 12" fill="none" stroke="url(#gradient2)" strokeWidth="1" strokeLinecap="round" />
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="100%" stopColor="#34D399" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Animated particles inside logo */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              background: [
                "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
                "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
                "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>

      {/* Outer glow ring */}
      <motion.div
        className="absolute -inset-3 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Pulse rings */}
      <motion.div
        className="absolute -inset-6 rounded-full border border-blue-500/30"
        animate={{
          scale: [1, 2],
          opacity: [0.5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeOut",
        }}
      />
    </motion.div>
  )
}
