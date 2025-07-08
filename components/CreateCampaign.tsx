"use client"

import type React from "react"

import { useState } from "react"
import { useAccount, useWriteContract } from "wagmi"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CONTRACTS, CROWDFUNDING_ABI } from "@/lib/contracts"
import { parseEther } from "@/lib/web3"
import { toast } from "react-hot-toast"
import { Plus, Target, Calendar, FileText } from "lucide-react"

interface CreateCampaignProps {
  onCampaignCreated?: () => void
}

export function CreateCampaign({ onCampaignCreated }: CreateCampaignProps) {
  const { address, isConnected } = useAccount()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    duration: "",
  })

  const { writeContract, isPending } = useWriteContract()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected || !address) {
      toast.error("Please connect your wallet")
      return
    }

    if (!formData.title || !formData.description || !formData.goal || !formData.duration) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      const goalInWei = parseEther(formData.goal)
      const durationInDays = Number.parseInt(formData.duration)

      await writeContract({
        address: CONTRACTS.CROWDFUNDING as `0x${string}`,
        abi: CROWDFUNDING_ABI,
        functionName: "createCampaign",
        args: [formData.title, formData.description, goalInWei, BigInt(durationInDays)],
      })

      toast.success("Campaign created successfully! 🎉")
      setFormData({ title: "", description: "", goal: "", duration: "" })
      setIsOpen(false)
      onCampaignCreated?.()
    } catch (error) {
      console.error("Campaign creation failed:", error)
      toast.error("Campaign creation failed. Please try again.")
    }
  }

  if (!isOpen) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          disabled={!isConnected}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
      <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Create New Campaign
          </CardTitle>
          <CardDescription>Launch your crowdfunding campaign and start raising funds</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Campaign Title
              </Label>
              <Input
                id="title"
                placeholder="Enter your campaign title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your campaign, what you're building, and why people should support you..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goal" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Funding Goal (ETH)
                </Label>
                <Input
                  id="goal"
                  type="number"
                  placeholder="1.0"
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  step="0.001"
                  min="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Duration (Days)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="30"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  min="1"
                  max="365"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                {isPending ? "Creating..." : "Create Campaign"}
              </Button>
              <Button type="button" onClick={() => setIsOpen(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
