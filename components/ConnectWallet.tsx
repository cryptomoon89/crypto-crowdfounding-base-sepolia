"use client"

import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Wallet, Copy, ExternalLink, LogOut, ChevronDown } from "lucide-react"
import { toast } from "react-hot-toast"

export function ConnectWallet() {
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast.success("Address copied to clipboard!")
    }
  }

  const openExplorer = () => {
    if (address) {
      window.open(`https://sepolia.basescan.org/address/${address}`, "_blank")
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getConnectorIcon = (connectorId: string) => {
    switch (connectorId) {
      case "metaMask":
        return "🦊"
      case "coinbaseWalletSDK":
        return "🔵"
      case "injected":
        return "💼"
      default:
        return <Wallet className="h-4 w-4" />
    }
  }

  const getConnectorName = (connector: any) => {
    if (connector.id === "metaMask") return "MetaMask"
    if (connector.id === "coinbaseWalletSDK") return "Coinbase Wallet"
    if (connector.id === "injected") return "Browser Wallet"
    return connector.name
  }

  if (!isConnected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold shadow-lg glow-animation"
            disabled={isPending}
          >
            <Wallet className="h-4 w-4 mr-2" />
            {isPending ? "Connecting..." : "Connect Wallet"}
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-orange-500/20">
          {connectors.map((connector) => (
            <DropdownMenuItem
              key={connector.id}
              onClick={() => connect({ connector })}
              className="cursor-pointer flex items-center gap-3 text-white hover:bg-orange-500/20"
              disabled={isPending}
            >
              <span className="text-lg">{getConnectorIcon(connector.id)}</span>
              <span>{getConnectorName(connector)}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm border-orange-500/30 text-white hover:bg-gray-700/80"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          {formatAddress(address!)}
          {chain?.id === 84532 && (
            <Badge variant="secondary" className="text-xs bg-orange-500/20 text-orange-300 border-orange-500/30">
              Base Sepolia
            </Badge>
          )}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-orange-500/20">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium text-white">Connected Wallet</p>
          <p className="text-xs text-gray-400">{formatAddress(address!)}</p>
        </div>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem onClick={copyAddress} className="cursor-pointer text-white hover:bg-orange-500/20">
          <Copy className="h-4 w-4 mr-2" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem onClick={openExplorer} className="cursor-pointer text-white hover:bg-orange-500/20">
          <ExternalLink className="h-4 w-4 mr-2" />
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem onClick={() => disconnect()} className="cursor-pointer text-red-400 hover:bg-red-500/20">
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
