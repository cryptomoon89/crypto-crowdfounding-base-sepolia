"use client"

import { FinalSystemTest } from "@/components/FinalSystemTest"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { SuperchainLogo } from "@/components/SuperchainLogo"
import { ModernAnimations } from "@/components/ModernAnimations"
import Link from "next/link"

export default function TestPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <ModernAnimations />

      <div className="container mx-auto py-12 px-4 relative z-20">
        <div className="mb-8">
          <Link href="/">
            <Button
              variant="outline"
              className="mb-4 border-blue-500 text-blue-400 hover:bg-blue-500/10 btn-superchain bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <SuperchainLogo size={80} />
            <div>
              <h1 className="text-6xl font-bold gradient-text-superchain hologram-text">Final Validation</h1>
              <p className="text-blue-400 text-xl">Superchain Spectacular Launch Test</p>
            </div>
          </div>
          <p className="text-gray-300 text-lg">
            Ultimate comprehensive testing suite for spectacular blockchain platform launch
          </p>
        </div>
        <FinalSystemTest />
      </div>
    </div>
  )
}
