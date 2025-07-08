"use client"

import { useState } from "react"
import { useAccount, useWriteContract, useReadContract } from "wagmi"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CONTRACTS, CROWDFUNDING_ABI, FUND_TOKEN_ABI } from "@/lib/contracts"
import { parseEther } from "@/lib/web3"
import { toast } from "react-hot-toast"
import { Shield, Settings, BarChart3, AlertTriangle } from "lucide-react"

export function AdminPanel() {
  const { address, isConnected } = useAccount()
  const [newClaimFee, setNewClaimFee] = useState("")
  const [newPlatformFee, setNewPlatformFee] = useState("")

  const { writeContract, isPending } = useWriteContract()

  // Check if user is admin (contract owner)
  const { data: isAdmin } = useReadContract({
    address: CONTRACTS.CROWDFUNDING as `0x${string}`,
    abi: CROWDFUNDING_ABI,
    functionName: "owner",
    query: { enabled: !!address },
  })

  const { data: maintenanceMode } = useReadContract({
    address: CONTRACTS.CROWDFUNDING as `0x${string}`,
    abi: CROWDFUNDING_ABI,
    functionName: "maintenanceMode",
  })

  const { data: claimFee } = useReadContract({
    address: CONTRACTS.FUND_TOKEN as `0x${string}`,
    abi: FUND_TOKEN_ABI,
    functionName: "claimFee",
  })

  const { data: platformFeePercent } = useReadContract({
    address: CONTRACTS.CROWDFUNDING as `0x${string}`,
    abi: CROWDFUNDING_ABI,
    functionName: "platformFeePercent",
  })

  const isOwner = isAdmin && address && isAdmin.toLowerCase() === address.toLowerCase()

  const handleToggleMaintenance = async () => {
    if (!isConnected || !isOwner) {
      toast.error("Admin access required")
      return
    }

    try {
      await writeContract({
        address: CONTRACTS.CROWDFUNDING as `0x${string}`,
        abi: CROWDFUNDING_ABI,
        functionName: "toggleMaintenanceMode",
      })
      toast.success("Maintenance mode toggled!")
    } catch (error) {
      console.error("Toggle failed:", error)
      toast.error("Failed to toggle maintenance mode")
    }
  }

  const handleUpdateClaimFee = async () => {
    if (!isConnected || !isOwner || !newClaimFee) {
      toast.error("Admin access required and valid fee amount")
      return
    }

    try {
      await writeContract({
        address: CONTRACTS.FUND_TOKEN as `0x${string}`,
        abi: FUND_TOKEN_ABI,
        functionName: "setClaimFee",
        args: [parseEther(newClaimFee)],
      })
      toast.success("Claim fee updated!")
      setNewClaimFee("")
    } catch (error) {
      console.error("Update failed:", error)
      toast.error("Failed to update claim fee")
    }
  }

  const handleUpdatePlatformFee = async () => {
    if (!isConnected || !isOwner || !newPlatformFee) {
      toast.error("Admin access required and valid fee percentage")
      return
    }

    try {
      const feePercent = Math.floor(Number.parseFloat(newPlatformFee) * 100) // Convert to basis points
      await writeContract({
        address: CONTRACTS.CROWDFUNDING as `0x${string}`,
        abi: CROWDFUNDING_ABI,
        functionName: "setPlatformFee",
        args: [BigInt(feePercent)],
      })
      toast.success("Platform fee updated!")
      setNewPlatformFee("")
    } catch (error) {
      console.error("Update failed:", error)
      toast.error("Failed to update platform fee")
    }
  }

  const handleEmergencyWithdraw = async () => {
    if (!isConnected || !isOwner) {
      toast.error("Admin access required")
      return
    }

    if (!confirm("Are you sure you want to perform emergency withdrawal? This action cannot be undone.")) {
      return
    }

    try {
      await writeContract({
        address: CONTRACTS.FUND_TOKEN as `0x${string}`,
        abi: FUND_TOKEN_ABI,
        functionName: "emergencyWithdraw",
      })
      toast.success("Emergency withdrawal completed!")
    } catch (error) {
      console.error("Emergency withdrawal failed:", error)
      toast.error("Emergency withdrawal failed")
    }
  }

  if (!isConnected) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Admin Panel
          </CardTitle>
          <CardDescription>Connect your wallet to access admin features</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Please connect your wallet to continue</p>
        </CardContent>
      </Card>
    )
  }

  if (!isOwner) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Admin Panel
          </CardTitle>
          <CardDescription>Access restricted to contract owner</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
            <p className="text-muted-foreground">You don't have admin privileges for this contract.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Admin Panel
          </CardTitle>
          <CardDescription>Manage platform settings and monitor system health</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="emergency" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Emergency
              </TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="space-y-6">
              <div className="grid gap-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Maintenance Mode</h3>
                    <p className="text-sm text-muted-foreground">
                      {maintenanceMode ? "Platform is currently in maintenance mode" : "Platform is operational"}
                    </p>
                  </div>
                  <Switch checked={!!maintenanceMode} onCheckedChange={handleToggleMaintenance} disabled={isPending} />
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="claimFee">Update Claim Fee (ETH)</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="claimFee"
                        type="number"
                        placeholder={claimFee ? (Number(claimFee) / 1e18).toString() : "0.0001"}
                        value={newClaimFee}
                        onChange={(e) => setNewClaimFee(e.target.value)}
                        step="0.0001"
                        min="0"
                      />
                      <Button onClick={handleUpdateClaimFee} disabled={isPending || !newClaimFee}>
                        Update
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Current: {claimFee ? (Number(claimFee) / 1e18).toFixed(4) : "0.0001"} ETH
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="platformFee">Update Platform Fee (%)</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="platformFee"
                        type="number"
                        placeholder={platformFeePercent ? (Number(platformFeePercent) / 100).toString() : "2.5"}
                        value={newPlatformFee}
                        onChange={(e) => setNewPlatformFee(e.target.value)}
                        step="0.1"
                        min="0"
                        max="10"
                      />
                      <Button onClick={handleUpdatePlatformFee} disabled={isPending || !newPlatformFee}>
                        Update
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Current: {platformFeePercent ? (Number(platformFeePercent) / 100).toFixed(1) : "2.5"}%
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Platform Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Campaigns</span>
                        <span className="font-semibold">--</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Active Campaigns</span>
                        <span className="font-semibold">--</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Raised</span>
                        <span className="font-semibold">-- ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Platform Fees</span>
                        <span className="font-semibold">-- ETH</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Token Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Claims</span>
                        <span className="font-semibold">--</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tokens Claimed</span>
                        <span className="font-semibold">-- FUND</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Claim Fees</span>
                        <span className="font-semibold">-- ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Active Claimers</span>
                        <span className="font-semibold">--</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="emergency" className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                  <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">Emergency Actions</h3>
                  <p className="text-sm text-red-600 dark:text-red-300 mb-4">
                    These actions should only be used in emergency situations. They cannot be undone.
                  </p>
                  <Button
                    onClick={handleEmergencyWithdraw}
                    disabled={isPending}
                    variant="destructive"
                    className="w-full"
                  >
                    Emergency Withdraw All Funds
                  </Button>
                </div>

                <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">System Health</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Contract Status</span>
                      <span className="text-green-600 dark:text-green-400">✓ Operational</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Maintenance Mode</span>
                      <span
                        className={
                          maintenanceMode ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                        }
                      >
                        {maintenanceMode ? "✗ Enabled" : "✓ Disabled"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Treasury Connection</span>
                      <span className="text-green-600 dark:text-green-400">✓ Connected</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}
