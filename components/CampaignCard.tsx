"use client"

import { useState } from "react"
import { useAccount, useWriteContract } from "wagmi"
import { parseEther } from "viem"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CONTRACTS, CROWDFUNDING_ABI } from "@/lib/contracts"
import { formatEther } from "@/lib/web3"
import { toast } from "react-hot-toast"
import { Calendar, User, TrendingUp } from "lucide-react"

interface Campaign {
  id: number
  title: string
  description: string
  owner: string
  goal: bigint
  deadline: bigint
  amountRaised: bigint
  goalReached: boolean
  active: boolean
  createdAt: bigint
}

interface CampaignCardProps {
  campaign: Campaign
  onContribute?: () => void
}

export function CampaignCard({ campaign, onContribute }: CampaignCardProps) {
  const { address, isConnected } = useAccount()
  const [contributionAmount, setContributionAmount] = useState("")
  const [isContributing, setIsContributing] = useState(false)

  const { writeContract, isPending } = useWriteContract()

  const progress = (Number(campaign.amountRaised) / Number(campaign.goal)) * 100
  const daysLeft = Math.max(0, Math.ceil((Number(campaign.deadline) - Date.now() / 1000) / 86400))
  const isExpired = Date.now() / 1000 > Number(campaign.deadline)

  const handleContribute = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet")
      return
    }

    if (!contributionAmount || Number.parseFloat(contributionAmount) <= 0) {
      toast.error("Please enter a valid contribution amount")
      return
    }

    try {
      await writeContract({
        address: CONTRACTS.CROWDFUNDING as `0x${string}`,
        abi: CROWDFUNDING_ABI,
        functionName: "contribute",
        args: [BigInt(campaign.id)],
        value: parseEther(contributionAmount),
      })

      toast.success("Contribution successful! 🎉")
      setContributionAmount("")
      setIsContributing(false)
      onContribute?.()
    } catch (error) {
      console.error("Contribution failed:", error)
      toast.error("Contribution failed. Please try again.")
    }
  }

  const getBadgeVariant = () => {
    if (campaign.goalReached) return "default"
    if (isExpired) return "destructive"
    if (daysLeft <= 3) return "secondary"
    return "outline"
  }

  const getBadgeText = () => {
    if (campaign.goalReached) return "Goal Reached"
    if (isExpired) return "Expired"
    if (daysLeft <= 3) return "Ending Soon"
    return "Active"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-2 hover:border-purple-200 dark:hover:border-purple-700 transition-colors">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg font-bold line-clamp-2">{campaign.title}</CardTitle>
              <CardDescription className="line-clamp-3 mt-2">{campaign.description}</CardDescription>
            </div>
            <Badge variant={getBadgeVariant()} className="ml-2">
              {getBadgeText()}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold">{progress.toFixed(1)}%</span>
            </div>
            <Progress value={Math.min(progress, 100)} className="h-2" />
            <div className="flex justify-between text-sm">
              <span>{formatEther(campaign.amountRaised)} ETH raised</span>
              <span className="text-muted-foreground">of {formatEther(campaign.goal)} ETH</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{daysLeft} days left</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">
                {campaign.owner.slice(0, 6)}...{campaign.owner.slice(-4)}
              </span>
            </div>
          </div>

          {!isExpired && !campaign.goalReached && (
            <div className="space-y-3">
              {!isContributing ? (
                <Button
                  onClick={() => setIsContributing(true)}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  disabled={!isConnected}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Contribute
                </Button>
              ) : (
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Amount in ETH"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    step="0.001"
                    min="0"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleContribute}
                      disabled={isPending}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    >
                      {isPending ? "Contributing..." : "Confirm"}
                    </Button>
                    <Button onClick={() => setIsContributing(false)} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {campaign.goalReached && (
            <div className="text-center">
              <Badge variant="default" className="bg-green-500">
                🎉 Goal Achieved!
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
