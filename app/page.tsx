"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LanguageSelector } from "@/components/language-selector"
import { CheckCircleIcon, Globe2Icon, ShieldIcon, SparklesIcon } from "@/components/simple-icons"
import { useLanguage } from "@/hooks/use-language"
import { PremiumAvatarMarketplace } from "@/components/premium-avatar-marketplace"

export default function HomePage() {
  const { t } = useLanguage()
  const [referralCode, setReferralCode] = useState<string>("")
  const [isVerified] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const params = new URLSearchParams(window.location.search)
    const refCode = params.get("ref")
    if (refCode) {
      setReferralCode(refCode)
    }
  }, [])

  const handleAvatarPurchase = async (avatarId: string, price: number) => {
    console.log("[v0] Avatar comprado:", avatarId, "Precio:", price)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background cyber-grid particles-bg relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] animate-pulse delay-2000" />
      </div>

      <header className="glass-morphism sticky top-0 z-50 border-b border-border/40 scan-line">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 depth-3d">
            <div className="relative">
              <Globe2Icon className="h-8 w-8 text-primary neon-glow" />
              <div className="absolute inset-0 blur-xl bg-primary/50 -z-10" />
            </div>
            <h1 className="text-2xl font-bold holographic-text">id_XmutH</h1>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 relative z-10">
        <section className="text-center mb-16 floating-3d">
          <Badge className="mb-6 glass-morphism neon-border shimmer" variant="outline">
            <ShieldIcon className="h-4 w-4 mr-2" />
            {t("premiumCollection")}
          </Badge>

          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
            <span className="holographic-text neon-glow">{t("futureOfDigitalIdentity")}</span>
          </h2>

          <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto mb-8 text-pretty leading-relaxed">
            {t("exclusiveAvatarsWithAdvancedTech")}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge className="glass-morphism px-4 py-2 text-sm">
              <SparklesIcon className="h-4 w-4 mr-2" />
              Holographic Design
            </Badge>
            <Badge className="glass-morphism px-4 py-2 text-sm">
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              AI-Powered
            </Badge>
            <Badge className="glass-morphism px-4 py-2 text-sm">
              <Globe2Icon className="h-4 w-4 mr-2" />
              Web3 Ready
            </Badge>
          </div>
        </section>

        <Card className="mb-12 glass-card depth-3d glow-pulse border-primary/30">
          <CardContent className="flex items-center gap-4 p-8">
            <div className="relative">
              <CheckCircleIcon className="h-12 w-12 text-primary" />
              <div className="absolute inset-0 blur-2xl bg-primary/60 animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-xl text-foreground mb-1">{t("verifiedUser")}</p>
              <p className="text-sm text-foreground/70">{t("fullAccessToMarketplace")}</p>
            </div>
            <Badge variant="secondary" className="font-mono text-xs glass-morphism px-4 py-2 shimmer">
              id_XmutH™ Verified
            </Badge>
          </CardContent>
        </Card>

        <div className="mb-16">
          <PremiumAvatarMarketplace isVerified={isVerified} onPurchase={handleAvatarPurchase} />
        </div>

        <section className="mb-16">
          <h3 className="text-4xl font-bold text-center mb-12">
            <span className="holographic-text">{t("nextGenFeatures")}</span>
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-card depth-3d liquid-motion hover:scale-105 transition-transform duration-500">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 glow-pulse">
                  <ShieldIcon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h4 className="text-2xl font-bold text-foreground">{t("quantumSecurity")}</h4>
                <p className="text-foreground/70 leading-relaxed">{t("quantumSecurityDesc")}</p>
              </CardContent>
            </Card>

            <Card className="glass-card depth-3d liquid-motion hover:scale-105 transition-transform duration-500 delay-100">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center mb-6 glow-pulse">
                  <SparklesIcon className="h-8 w-8 text-secondary-foreground" />
                </div>
                <h4 className="text-2xl font-bold text-foreground">{t("aiGenerated")}</h4>
                <p className="text-foreground/70 leading-relaxed">{t("aiGeneratedDesc")}</p>
              </CardContent>
            </Card>

            <Card className="glass-card depth-3d liquid-motion hover:scale-105 transition-transform duration-500 delay-200">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center mb-6 glow-pulse">
                  <Globe2Icon className="h-8 w-8 text-accent-foreground" />
                </div>
                <h4 className="text-2xl font-bold text-foreground">{t("metaverseReady")}</h4>
                <p className="text-foreground/70 leading-relaxed">{t("metaverseReadyDesc")}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-16">
          <Card className="glass-card border-none overflow-hidden">
            <CardContent className="p-12">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div className="space-y-2">
                  <div className="text-5xl font-bold holographic-text neon-glow">1M+</div>
                  <div className="text-sm text-foreground/60 uppercase tracking-wider">Active Users</div>
                </div>
                <div className="space-y-2">
                  <div className="text-5xl font-bold holographic-text neon-glow">500K+</div>
                  <div className="text-sm text-foreground/60 uppercase tracking-wider">Avatars Sold</div>
                </div>
                <div className="space-y-2">
                  <div className="text-5xl font-bold holographic-text neon-glow">$10M+</div>
                  <div className="text-sm text-foreground/60 uppercase tracking-wider">Trading Volume</div>
                </div>
                <div className="space-y-2">
                  <div className="text-5xl font-bold holographic-text neon-glow">99.9%</div>
                  <div className="text-sm text-foreground/60 uppercase tracking-wider">Uptime</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="glass-morphism border-t border-border/40 py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-foreground/60 mb-2">
            © 2025 <span className="holographic-text font-bold">id_XmutH™</span> Premium Avatar Marketplace
          </p>
          <p className="text-xs text-foreground/40">Powered by Advanced AI & Blockchain Technology</p>
        </div>
      </footer>
    </div>
  )
}
