"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, ExternalLink, Clock, CheckCircle, XCircle } from "lucide-react"

interface Transaction {
  id: string
  type: "claim" | "contribute" | "create" | "withdraw" | "refund"
  amount: string
  hash: string
  timestamp: number
  status: "pending" | "success" | "failed"
  campaignId?: number
  campaignTitle?: string
}

export function TransactionHistory() {
  const { address, isConnected } = useAccount()
  const [isOpen, setIsOpen] = useState(false)

  // Mock transaction data - in a real app, this would come from indexing events
  const mockTransactions: Transaction[] = [
    {
      id: "1",
      type: "claim",
      amount: "10",
      hash: "0x1234567890abcdef1234567890abcdef12345678",
      timestamp: Date.now() - 3600000,
      status: "success",
    },
    {
      id: "2",
      type: "contribute",
      amount: "0.5",
      hash: "0x2345678901bcdef12345678901bcdef123456789",
      timestamp: Date.now() - 7200000,
      status: "success",
      campaignId: 1,
      campaignTitle: "DeFi Innovation Project",
    },
    {
      id: "3",
      type: "create",
      amount: "0",
      hash: "0x3456789012cdef123456789012cdef1234567890",
      timestamp: Date.now() - 86400000,
      status: "success",
      campaignId: 2,
      campaignTitle: "My Awesome Campaign",
    },
  ]

  const getTransactionIcon = (type: string, status: string) => {
    if (status === "pending") return <Clock className="h-4 w-4 text-yellow-500" />
    if (status === "failed") return <XCircle className="h-4 w-4 text-red-500" />

    switch (type) {
      case "claim":
        return <span className="text-lg">🪙</span>
      case "contribute":
        return <span className="text-lg">💰</span>
      case "create":
        return <span className="text-lg">🚀</span>
      case "withdraw":
        return <span className="text-lg">💸</span>
      case "refund":
        return <span className="text-lg">↩️</span>
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const getTransactionDescription = (tx: Transaction) => {
    switch (tx.type) {
      case "claim":
        return `Claimed ${tx.amount} FUND tokens`
      case "contribute":
        return `Contributed ${tx.amount} ETH to ${tx.campaignTitle || `Campaign #${tx.campaignId}`}`
      case "create":
        return `Created campaign: ${tx.campaignTitle || `Campaign #${tx.campaignId}`}`
      case "withdraw":
        return `Withdrew ${tx.amount} ETH from campaign`
      case "refund":
        return `Received refund of ${tx.amount} ETH`
      default:
        return "Unknown transaction"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "success":
        return <Badge variant="default">Success</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Less than an hour ago"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString()
  }

  if (!isConnected) {
    return (
      <Button variant="outline" disabled>
        <History className="h-4 w-4 mr-2" />
        Transaction History
      </Button>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <History className="h-4 w-4 mr-2" />
          Transaction History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Transaction History
          </DialogTitle>
          <DialogDescription>Your recent transactions on the platform</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            {mockTransactions.length > 0 ? (
              mockTransactions.map((tx, index) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">{getTransactionIcon(tx.type, tx.status)}</div>
                          <div className="flex-1">
                            <p className="font-medium">{getTransactionDescription(tx)}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-sm text-muted-foreground">{formatTimestamp(tx.timestamp)}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 text-xs"
                                onClick={() => window.open(`https://sepolia.basescan.org/tx/${tx.hash}`, "_blank")}
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View on Explorer
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(tx.status)}
                          {tx.amount !== "0" && (
                            <p className="text-sm font-medium mt-1">
                              {tx.type === "claim" ? `${tx.amount} FUND` : `${tx.amount} ETH`}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <History className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
                <p className="text-muted-foreground">
                  Your transaction history will appear here once you start using the platform.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
