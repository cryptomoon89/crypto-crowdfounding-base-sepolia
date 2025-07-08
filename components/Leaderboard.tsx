"use client"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, TrendingUp } from "lucide-react"

export function Leaderboard() {
  // This would typically fetch real leaderboard data
  // For demo purposes, we'll show a mock leaderboard
  const mockLeaderboard = [
    { address: "0x1234...5678", totalContributed: "5.2", totalRaised: "12.8", campaigns: 3 },
    { address: "0x2345...6789", totalContributed: "3.8", totalRaised: "8.4", campaigns: 2 },
    { address: "0x3456...7890", totalContributed: "2.1", totalRaised: "6.2", campaigns: 1 },
    { address: "0x4567...8901", totalContributed: "1.9", totalRaised: "4.1", campaigns: 2 },
    { address: "0x5678...9012", totalContributed: "1.5", totalRaised: "3.3", campaigns: 1 },
  ]

  const getIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 2:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <TrendingUp className="h-5 w-5 text-blue-500" />
    }
  }

  const getBadgeVariant = (index: number) => {
    switch (index) {
      case 0:
        return "default"
      case 1:
        return "secondary"
      case 2:
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Leaderboard
          </CardTitle>
          <CardDescription>Top contributors and campaign creators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockLeaderboard.map((user, index) => (
              <motion.div
                key={user.address}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/20 dark:hover:to-blue-900/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Badge variant={getBadgeVariant(index)} className="flex items-center gap-1">
                    {getIcon(index)}#{index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium">{user.address}</p>
                    <p className="text-sm text-muted-foreground">{user.campaigns} campaigns</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{user.totalRaised} ETH raised</p>
                  <p className="text-sm text-muted-foreground">{user.totalContributed} ETH contributed</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
