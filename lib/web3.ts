import { createConfig, http } from "wagmi"
import { baseSepolia } from "wagmi/chains"
import { injected, coinbaseWallet, metaMask } from "wagmi/connectors"

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    metaMask(),
    coinbaseWallet({
      appName: "CryptoFund Superchain",
      appLogoUrl: "https://cryptofund.app/logo.png",
    }),
    injected({
      target: "injected",
    }),
  ],
  transports: {
    [baseSepolia.id]: http("https://sepolia.base.org"),
  },
})

export const formatEther = (wei: bigint): string => {
  return (Number(wei) / 1e18).toFixed(4)
}

export const parseEther = (ether: string): bigint => {
  return BigInt(Math.floor(Number.parseFloat(ether) * 1e18))
}

export const formatTimeRemaining = (seconds: number): string => {
  if (seconds <= 0) return "Available now"

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  } else {
    return `${remainingSeconds}s`
  }
}

// Security utilities
export const detectSybilBehavior = (
  address: string,
): Promise<{
  riskScore: number
  flags: string[]
  recommendation: "allow" | "monitor" | "block"
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const riskScore = Math.random() * 100
      const flags = []

      if (riskScore > 70) flags.push("High transaction frequency")
      if (riskScore > 50) flags.push("Suspicious timing patterns")
      if (riskScore > 80) flags.push("Multiple account correlation")

      const recommendation = riskScore > 80 ? "block" : riskScore > 50 ? "monitor" : "allow"

      resolve({ riskScore, flags, recommendation })
    }, 1000)
  })
}

export const validateTransactionSecurity = (
  from: string,
  to: string,
  amount: bigint,
): Promise<{ safe: boolean; warnings: string[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const warnings = []
      let safe = true

      // Check for suspicious amounts
      if (Number(amount) > 1e20) {
        warnings.push("Unusually large transaction amount")
        safe = false
      }

      // Check for known malicious addresses (mock)
      const maliciousAddresses = ["0x0000000000000000000000000000000000000000"]
      if (maliciousAddresses.includes(to.toLowerCase())) {
        warnings.push("Transaction to known malicious address")
        safe = false
      }

      resolve({ safe, warnings })
    }, 500)
  })
}
