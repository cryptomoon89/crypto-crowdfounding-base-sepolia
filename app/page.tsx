"use client"

import { useState } from "react"
import { useAccount, useReadContract } from "wagmi"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ConnectWallet } from "@/components/ConnectWallet"
import { ThemeToggle } from "@/components/ThemeToggle"
import { TokenClaim } from "@/components/TokenClaim"
import { CampaignCard } from "@/components/CampaignCard"
import { CreateCampaign } from "@/components/CreateCampaign"
import { Leaderboard } from "@/components/Leaderboard"
import { SuperchainLogo } from "@/components/SuperchainLogo"
import { ModernAnimations } from "@/components/ModernAnimations"
import { SecurityShield } from "@/components/SecurityShield"
import { AntiSybilSystem } from "@/components/AntiSybilSystem"
import { CONTRACTS, CROWDFUNDING_ABI } from "@/lib/contracts"
import { Search, Shield, Users, Star, TrendingUp, Award, Zap, Lock, Eye } from "lucide-react"
import { TransactionHistory } from "@/components/TransactionHistory"
import { AdminPanel } from "@/components/AdminPanel"

export default function HomePage() {
  const { address } = useAccount()
  const [searchTerm, setSearchTerm] = useState("")
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [showAdminPanel, setShowAdminPanel] = useState(false)

  const { data: campaigns, refetch } = useReadContract({
    address: CONTRACTS.CROWDFUNDING as `0x${string}`,
    abi: CROWDFUNDING_ABI,
    functionName: "getActiveCampaigns",
    query: { enabled: !!CONTRACTS.CROWDFUNDING },
  })

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1)
    refetch()
  }

  const filteredCampaigns =
    campaigns?.filter(
      (campaign: any) =>
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <ModernAnimations />
      <SecurityShield />
      <AntiSybilSystem address={address} />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-blue-500/20 bg-black/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <SuperchainLogo size={48} />
            <div>
              <h1 className="text-2xl font-bold gradient-text-superchain hologram-text">CryptoFund</h1>
              <p className="text-xs text-blue-400">Superchain Base Network</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-400 font-medium">SECURE</span>
            </div>
            <ThemeToggle />
            <ConnectWallet />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <div className="w-72 h-72 mx-auto mb-8 quantum-float">
              <SuperchainLogo size={288} />
            </div>
            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-6 gradient-text-superchain glitch-superchain hologram-text"
              data-text="Superchain Crowdfunding"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Superchain Crowdfunding
            </motion.h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Next-generation decentralized crowdfunding on{" "}
              <span className="text-blue-400 font-semibold">Base Superchain</span>
              with advanced security, anti-sybil protection, and quantum-resistant technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-superchain text-white font-bold shadow-lg text-lg px-8 py-3">
                <Zap className="h-5 w-5 mr-2" />
                Launch Project
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 border-blue-500 text-blue-400 hover:bg-blue-500/10 bg-transparent"
              >
                <Shield className="h-5 w-5 mr-2" />
                Security Features
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 gradient-text-superchain hologram-text">Advanced Security</h2>
            <p className="text-gray-300 max-w-3xl mx-auto text-lg">
              Military-grade security with AI-powered threat detection and quantum-resistant encryption
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center p-8 rounded-2xl card-superchain"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center superchain-glow">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-blue-400">Anti-Sybil Protection</h3>
              <p className="text-gray-300 leading-relaxed">
                Advanced AI algorithms detect and prevent sybil attacks, ensuring authentic user participation.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center p-8 rounded-2xl card-superchain"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center pulse-superchain">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-blue-400">Quantum Encryption</h3>
              <p className="text-gray-300 leading-relaxed">
                Future-proof security with quantum-resistant cryptography protecting all transactions.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center p-8 rounded-2xl card-superchain"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-cyan-500 to-green-500 rounded-2xl flex items-center justify-center quantum-float">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-blue-400">Real-time Monitoring</h3>
              <p className="text-gray-300 leading-relaxed">
                24/7 threat detection with instant response to suspicious activities and hack attempts.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 relative">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center p-6 rounded-2xl card-superchain"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center superchain-glow">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold gradient-text-superchain mb-2">1,234</h3>
              <p className="text-gray-400">Secure Campaigns</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center p-6 rounded-2xl card-superchain"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center pulse-superchain">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold gradient-text-superchain mb-2">567</h3>
              <p className="text-gray-400">Verified Projects</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center p-6 rounded-2xl card-superchain"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-cyan-500 to-green-500 rounded-xl flex items-center justify-center quantum-float">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold gradient-text-superchain mb-2">8,901</h3>
              <p className="text-gray-400">Protected Users</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center p-6 rounded-2xl card-superchain"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center superchain-glow">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold gradient-text-superchain mb-2">234 ETH</h3>
              <p className="text-gray-400">Secured Funds</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Token Claim Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 gradient-text-superchain hologram-text">Secure Token Mining</h2>
            <p className="text-gray-300 text-lg">
              Mine tokens with advanced security validation and anti-fraud protection
            </p>
          </div>
          <TokenClaim />
        </div>
      </section>

      {/* Campaigns Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2 gradient-text-superchain hologram-text">Verified Campaigns</h2>
              <p className="text-gray-300 text-lg">Discover security-audited and verified projects</p>
            </div>
            <div className="flex gap-4 mt-6 md:mt-0">
              <TransactionHistory />
              <Button
                variant="outline"
                onClick={() => setShowAdminPanel(!showAdminPanel)}
                className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
              >
                <Shield className="h-4 w-4 mr-2" />
                Security Panel
              </Button>
              <CreateCampaign onCampaignCreated={handleRefresh} />
            </div>
          </div>

          <div className="mb-8">
            <div className="relative max-w-md mx-auto md:mx-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
              <Input
                placeholder="Search verified campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-lg bg-gray-900/80 backdrop-blur-sm border-blue-500/30 text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCampaigns.length > 0 ? (
              filteredCampaigns.map((campaign: any, index: number) => (
                <CampaignCard key={campaign.id} campaign={campaign} onContribute={handleRefresh} />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center quantum-float">
                  <Shield className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-blue-400">No verified campaigns found</h3>
                <p className="text-gray-300 mb-6 text-lg">
                  {searchTerm ? "Try adjusting your search terms" : "Be the first to create a secure campaign!"}
                </p>
                {!searchTerm && <CreateCampaign onCampaignCreated={handleRefresh} />}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 gradient-text-superchain hologram-text">Security Leaderboard</h2>
            <p className="text-gray-300 text-lg">Top verified contributors and secure campaign creators</p>
          </div>
          <Leaderboard />
        </div>
      </section>

      {showAdminPanel && (
        <section className="py-20 px-4 relative">
          <div className="container mx-auto">
            <AdminPanel />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-16 px-4 bg-gray-900/50 backdrop-blur-sm border-t border-blue-500/20 relative">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <SuperchainLogo size={48} />
                <div>
                  <h3 className="text-2xl font-bold gradient-text-superchain">CryptoFund</h3>
                  <p className="text-xs text-blue-400">Superchain Base Network</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Next-generation decentralized crowdfunding platform with military-grade security and quantum-resistant
                technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-lg text-blue-400">Platform</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-blue-400 cursor-pointer transition-colors">Secure Campaigns</li>
                <li className="hover:text-blue-400 cursor-pointer transition-colors">Verified Projects</li>
                <li className="hover:text-blue-400 cursor-pointer transition-colors">Token Mining</li>
                <li className="hover:text-blue-400 cursor-pointer transition-colors">Security Dashboard</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-lg text-blue-400">Security</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-blue-400 cursor-pointer transition-colors">Anti-Sybil Protection</li>
                <li className="hover:text-blue-400 cursor-pointer transition-colors">Quantum Encryption</li>
                <li className="hover:text-blue-400 cursor-pointer transition-colors">Threat Detection</li>
                <li className="hover:text-blue-400 cursor-pointer transition-colors">Security Audits</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-lg text-blue-400">Network</h4>
              <ul className="space-y-3 text-gray-400">
                <li>Base Sepolia Testnet</li>
                <li>Chain ID: 84532</li>
                <li>RPC: sepolia.base.org</li>
                <li>Explorer: sepolia.basescan.org</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-500/20 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; 2024 CryptoFund Superchain. Built with{" "}
              <span className="text-blue-400">quantum-resistant security</span>. Ready for secure decentralized launch.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
