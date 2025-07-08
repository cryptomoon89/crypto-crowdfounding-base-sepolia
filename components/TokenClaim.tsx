"use client"

import { useState, useEffect } from "react"
import { useAccount, useWriteContract, useReadContract } from "wagmi"
import { parseEther } from "viem"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CONTRACTS, FUND_TOKEN_ABI } from "@/lib/contracts"
import { formatTimeRemaining } from "@/lib/web3"
import { toast } from "react-hot-toast"
import Confetti from "react-confetti"
import { EthRain } from "./EthRain"
import { SuccessCheckmark } from "./SuccessCheckmark"

export function TokenClaim() {
  const { address, isConnected } = useAccount()
  const [referrer, setReferrer] = useState("")
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showEthRain, setShowEthRain] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const { writeContract, isPending } = useWriteContract()

  const { data: canClaim } = useReadContract({
    address: CONTRACTS.FUND_TOKEN as `0x${string}`,
    abi: FUND_TOKEN_ABI,
    functionName: "canClaim",
    args: [address],
    query: { enabled: !!address },
  })

  const { data: timeUntilClaim } = useReadContract({
    address: CONTRACTS.FUND_TOKEN as `0x${string}`,
    abi: FUND_TOKEN_ABI,
    functionName: "getTimeUntilNextClaim",
    args: [address],
    query: { enabled: !!address },
  })

  const { data: balance } = useReadContract({
    address: CONTRACTS.FUND_TOKEN as `0x${string}`,
    abi: FUND_TOKEN_ABI,
    functionName: "balanceOf",
    args: [address],
    query: { enabled: !!address },
  })

  const { data: totalClaimed } = useReadContract({
    address: CONTRACTS.FUND_TOKEN as `0x${string}`,
    abi: FUND_TOKEN_ABI,
    functionName: "totalClaimed",
    args: [address],
    query: { enabled: !!address },
  })

  const { data: claimFee } = useReadContract({
    address: CONTRACTS.FUND_TOKEN as `0x${string}`,
    abi: FUND_TOKEN_ABI,
    functionName: "claimFee",
  })

  useEffect(() => {
    if (timeUntilClaim) {
      setTimeRemaining(Number(timeUntilClaim))
      const interval = setInterval(() => {
        setTimeRemaining((prev) => Math.max(0, prev - 1))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timeUntilClaim])

  const handleClaim = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet")
      return
    }

    try {
      await writeContract({
        address: CONTRACTS.FUND_TOKEN as `0x${string}`,
        abi: FUND_TOKEN_ABI,
        functionName: "claimTokens",
        args: [referrer || "0x0000000000000000000000000000000000000000"],
        value: claimFee || parseEther("0.0001"),
      })

      // Trigger all success animations
      setShowSuccess(true)
      setShowConfetti(true)
      setShowEthRain(true)

      setTimeout(() => {
        setShowSuccess(false)
        setShowConfetti(false)
        setShowEthRain(false)
      }, 5000)

      toast.success("Tokens claimed successfully! 🎉")
    } catch (error) {
      console.error("Claim failed:", error)
      toast.error("Claim failed. Please try again.")
    }
  }

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Token Claim</CardTitle>
          <CardDescription>Connect your wallet to claim FUND tokens</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Please connect your wallet to continue</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      <EthRain isActive={showEthRain} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🪙</span>
              Daily Token Claim
            </CardTitle>
            <CardDescription>Claim 10 FUND tokens every 24 hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {showSuccess && (
              <div className="flex justify-center">
                <SuccessCheckmark isVisible={showSuccess} />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">Your Balance</Label>
                <p className="font-semibold">{balance ? (Number(balance) / 1e18).toFixed(2) : "0"} FUND</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Total Claimed</Label>
                <p className="font-semibold">{totalClaimed ? (Number(totalClaimed) / 1e18).toFixed(0) : "0"} FUND</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="referrer">Referrer Address (Optional)</Label>
              <Input id="referrer" placeholder="0x..." value={referrer} onChange={(e) => setReferrer(e.target.value)} />
              <p className="text-xs text-muted-foreground">Enter a referrer address to give them bonus tokens</p>
            </div>

            <div className="text-center">
              {canClaim ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleClaim}
                    disabled={isPending}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 pulse-glow-animation"
                  >
                    {isPending
                      ? "Claiming..."
                      : `Claim 10 FUND (${claimFee ? (Number(claimFee) / 1e18).toFixed(4) : "0.0001"} ETH fee)`}
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-2">
                  <Button disabled className="w-full">
                    Next claim in: {formatTimeRemaining(timeRemaining)}
                  </Button>
                  <motion.div
                    className="w-full bg-gray-200 rounded-full h-2"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                  >
                    <motion.div
                      className="progress-bar h-2 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${Math.max(0, 100 - (timeRemaining / 86400) * 100)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.div>
                </div>
              )}
            </div>

            <div className="text-xs text-center text-muted-foreground">
              <p>Fee goes to platform treasury</p>
              <p>Referrers get 10% bonus tokens</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  )
}
