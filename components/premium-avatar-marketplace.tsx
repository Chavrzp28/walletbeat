"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  SparklesIcon,
  TrendingUpIcon,
  LockIcon,
  CheckIcon,
  ZapIcon,
  CrownIcon,
  FlameIcon,
} from "@/components/simple-icons"
import { useLanguage } from "@/hooks/use-language"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import type { JSX } from "react"

interface Avatar {
  id: string
  name: string
  nameEs: string
  tier: "legendary" | "epic" | "rare"
  basePrice: number
  currentPrice: number
  salesCount: number
  gradient: string
  glowColor: string
  icon: string
}

interface PremiumAvatarMarketplaceProps {
  isVerified: boolean
  onPurchase?: (avatarId: string, price: number) => void
}

const AvatarSVG = ({ id, className }: { id: string; className?: string }) => {
  const avatars: Record<string, JSX.Element> = {
    "quantum-nexus": (
      <svg viewBox="0 0 200 200" className={className}>
        <defs>
          <linearGradient id="quantum-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#FFD700", stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: "#FFA500", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#FF8C00", stopOpacity: 1 }} />
          </linearGradient>
          <filter id="quantum-glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="quantum-shine">
            <stop offset="0%" style={{ stopColor: "#FFFFFF", stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: "#FFD700", stopOpacity: 0 }} />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="90" fill="url(#quantum-grad)" filter="url(#quantum-glow)">
          <animate attributeName="r" values="88;92;88" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="100" cy="100" r="70" fill="none" stroke="url(#quantum-shine)" strokeWidth="2">
          <animate attributeName="r" values="65;75;65" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.5;1" dur="3s" repeatCount="indefinite" />
        </circle>
        <path
          d="M100,30 L130,80 L115,85 L100,60 L85,85 L70,80 Z"
          fill="#FFF"
          opacity="0.9"
          transform="rotate(0 100 100)"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 100 100"
            to="360 100 100"
            dur="8s"
            repeatCount="indefinite"
          />
        </path>
        <circle cx="100" cy="100" r="15" fill="#FFF" opacity="0.95">
          <animate attributeName="opacity" values="0.95;0.6;0.95" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x="100" y="185" textAnchor="middle" fill="#FFD700" fontSize="8" fontWeight="bold" opacity="0.4">
          id_XmutH™
        </text>
      </svg>
    ),
    "cyber-sovereign": (
      <svg viewBox="0 0 200 200" className={className}>
        <defs>
          <linearGradient id="cyber-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#C0C0C0", stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: "#E8E8E8", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#A0A0A0", stopOpacity: 1 }} />
          </linearGradient>
          <filter id="cyber-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <polygon
          points="100,20 170,60 170,140 100,180 30,140 30,60"
          fill="url(#cyber-grad)"
          filter="url(#cyber-glow)"
          strokeWidth="3"
          stroke="#FFF"
        >
          <animate attributeName="opacity" values="1;0.8;1" dur="2s" repeatCount="indefinite" />
        </polygon>
        <polygon points="100,40 150,70 150,130 100,160 50,130 50,70" fill="none" stroke="#00FFFF" strokeWidth="2">
          <animate attributeName="stroke-opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
        </polygon>
        <circle cx="100" cy="100" r="25" fill="#00FFFF" opacity="0.6">
          <animate attributeName="r" values="20;30;20" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="100" cy="100" r="12" fill="#FFF" />
        <text x="100" y="195" textAnchor="middle" fill="#C0C0C0" fontSize="8" fontWeight="bold" opacity="0.4">
          id_XmutH™
        </text>
      </svg>
    ),
    "hologram-emperor": (
      <svg viewBox="0 0 200 200" className={className}>
        <defs>
          <linearGradient id="holo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#B87333", stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: "#CD7F32", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#996515", stopOpacity: 1 }} />
          </linearGradient>
          <filter id="holo-glow">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect x="30" y="30" width="140" height="140" rx="20" fill="url(#holo-grad)" filter="url(#holo-glow)">
          <animate attributeName="opacity" values="1;0.85;1" dur="2s" repeatCount="indefinite" />
        </rect>
        <rect x="50" y="50" width="100" height="100" rx="10" fill="none" stroke="#FFD700" strokeWidth="2">
          <animate attributeName="stroke-opacity" values="1;0.4;1" dur="1.8s" repeatCount="indefinite" />
        </rect>
        <circle cx="100" cy="100" r="30" fill="#FFD700" opacity="0.3">
          <animate attributeName="r" values="25;35;25" dur="3s" repeatCount="indefinite" />
        </circle>
        <path d="M100,70 L115,100 L100,100 L100,130 L85,100 L100,100 Z" fill="#FFF" opacity="0.9" />
        <text x="100" y="195" textAnchor="middle" fill="#B87333" fontSize="8" fontWeight="bold" opacity="0.4">
          id_XmutH™
        </text>
      </svg>
    ),
    "plasma-titan": (
      <svg viewBox="0 0 200 200" className={className}>
        <defs>
          <linearGradient id="plasma-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#9C27B0", stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: "#E91E63", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#F06292", stopOpacity: 1 }} />
          </linearGradient>
          <filter id="plasma-glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx="100" cy="100" r="85" fill="url(#plasma-grad)" filter="url(#plasma-glow)">
          <animate attributeName="r" values="83;88;83" dur="2.2s" repeatCount="indefinite" />
        </circle>
        <path d="M100,30 Q130,100 100,170 Q70,100 100,30" fill="none" stroke="#FF00FF" strokeWidth="3" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
        </path>
        <path d="M30,100 Q100,130 170,100 Q100,70 30,100" fill="none" stroke="#FF00FF" strokeWidth="3" opacity="0.8">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
        </path>
        <circle cx="100" cy="100" r="20" fill="#FFF" opacity="0.9">
          <animate attributeName="r" values="18;22;18" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <text x="100" y="190" textAnchor="middle" fill="#E91E63" fontSize="8" fontWeight="bold" opacity="0.4">
          id_XmutH™
        </text>
      </svg>
    ),
    "neon-overlord": (
      <svg viewBox="0 0 200 200" className={className}>
        <defs>
          <linearGradient id="neon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#7B2CBF", stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: "#C77DFF", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#9D4EDD", stopOpacity: 1 }} />
          </linearGradient>
          <filter id="neon-glow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <polygon points="100,15 185,60 185,140 100,185 15,140 15,60" fill="url(#neon-grad)" filter="url(#neon-glow)">
          <animate attributeName="opacity" values="1;0.75;1" dur="2.5s" repeatCount="indefinite" />
        </polygon>
        <polygon points="100,35 165,75 165,125 100,165 35,125 35,75" fill="none" stroke="#FF00FF" strokeWidth="2">
          <animate attributeName="stroke-opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
        </polygon>
        <circle cx="100" cy="100" r="35" fill="#FF00FF" opacity="0.5">
          <animate attributeName="r" values="30;40;30" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0.2;0.5" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="100" cy="100" r="18" fill="#FFF" opacity="0.95" />
        <text x="100" y="195" textAnchor="middle" fill="#C77DFF" fontSize="8" fontWeight="bold" opacity="0.4">
          id_XmutH™
        </text>
      </svg>
    ),
    "chrome-vanguard": (
      <svg viewBox="0 0 200 200" className={className}>
        <defs>
          <linearGradient id="chrome-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#E100FF", stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: "#FF00E5", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#C800D9", stopOpacity: 1 }} />
          </linearGradient>
          <filter id="chrome-glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect x="25" y="25" width="150" height="150" rx="15" fill="url(#chrome-grad)" filter="url(#chrome-glow)">
          <animate attributeName="opacity" values="1;0.8;1" dur="2.3s" repeatCount="indefinite" />
        </rect>
        <rect x="45" y="45" width="110" height="110" rx="10" fill="none" stroke="#00FFFF" strokeWidth="2">
          <animate attributeName="stroke-opacity" values="1;0.5;1" dur="1.7s" repeatCount="indefinite" />
        </rect>
        <circle cx="100" cy="100" r="28" fill="#00FFFF" opacity="0.4">
          <animate attributeName="r" values="25;32;25" dur="2.8s" repeatCount="indefinite" />
        </circle>
        <rect x="85" y="85" width="30" height="30" rx="5" fill="#FFF" opacity="0.9" />
        <text x="100" y="193" textAnchor="middle" fill="#E100FF" fontSize="8" fontWeight="bold" opacity="0.4">
          id_XmutH™
        </text>
      </svg>
    ),
    "fusion-apex": (
      <svg viewBox="0 0 200 200" className={className}>
        <defs>
          <linearGradient id="fusion-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#00CED1", stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: "#1E90FF", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#4169E1", stopOpacity: 1 }} />
          </linearGradient>
          <filter id="fusion-glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx="100" cy="100" r="88" fill="url(#fusion-grad)" filter="url(#fusion-glow)">
          <animate attributeName="r" values="86;90;86" dur="2.1s" repeatCount="indefinite" />
        </circle>
        <circle cx="100" cy="100" r="65" fill="none" stroke="#00FFFF" strokeWidth="2">
          <animate attributeName="stroke-opacity" values="1;0.4;1" dur="1.9s" repeatCount="indefinite" />
          <animate attributeName="r" values="63;68;63" dur="1.9s" repeatCount="indefinite" />
        </circle>
        <path d="M100,50 L120,90 L100,85 L80,90 Z" fill="#FFF" opacity="0.9" transform="rotate(0 100 100)">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 100 100"
            to="360 100 100"
            dur="6s"
            repeatCount="indefinite"
          />
        </path>
        <circle cx="100" cy="100" r="16" fill="#FFF" opacity="0.95" />
        <text x="100" y="188" textAnchor="middle" fill="#00CED1" fontSize="8" fontWeight="bold" opacity="0.4">
          id_XmutH™
        </text>
      </svg>
    ),
    "volt-prime": (
      <svg viewBox="0 0 200 200" className={className}>
        <defs>
          <linearGradient id="volt-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#00E5FF", stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: "#00B8D4", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#0097A7", stopOpacity: 1 }} />
          </linearGradient>
          <filter id="volt-glow">
            <feGaussianBlur stdDeviation="4.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <polygon points="100,20 180,70 180,130 100,180 20,130 20,70" fill="url(#volt-grad)" filter="url(#volt-glow)">
          <animate attributeName="opacity" values="1;0.8;1" dur="2.4s" repeatCount="indefinite" />
        </polygon>
        <polygon points="100,45 155,80 155,120 100,155 45,120 45,80" fill="none" stroke="#FFFF00" strokeWidth="2">
          <animate attributeName="stroke-opacity" values="1;0.5;1" dur="1.6s" repeatCount="indefinite" />
        </polygon>
        <path d="M100,70 L110,95 L95,95 L105,120 L85,95 L100,95 Z" fill="#FFF" opacity="0.95" />
        <text x="100" y="193" textAnchor="middle" fill="#00E5FF" fontSize="8" fontWeight="bold" opacity="0.4">
          id_XmutH™
        </text>
      </svg>
    ),
    "pulse-guardian": (
      <svg viewBox="0 0 200 200" className={className}>
        <defs>
          <linearGradient id="pulse-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#0080FF", stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: "#0099FF", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#00B3FF", stopOpacity: 1 }} />
          </linearGradient>
          <filter id="pulse-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect x="30" y="30" width="140" height="140" rx="25" fill="url(#pulse-grad)" filter="url(#pulse-glow)">
          <animate attributeName="opacity" values="1;0.85;1" dur="2s" repeatCount="indefinite" />
        </rect>
        <rect x="50" y="50" width="100" height="100" rx="15" fill="none" stroke="#00FFAA" strokeWidth="2">
          <animate attributeName="stroke-opacity" values="1;0.4;1" dur="2.2s" repeatCount="indefinite" />
        </rect>
        <circle cx="100" cy="100" r="32" fill="#00FFAA" opacity="0.4">
          <animate attributeName="r" values="28;36;28" dur="2.6s" repeatCount="indefinite" />
        </circle>
        <circle cx="100" cy="100" r="18" fill="#FFF" opacity="0.95">
          <animate attributeName="opacity" values="0.95;0.7;0.95" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <text x="100" y="192" textAnchor="middle" fill="#0080FF" fontSize="8" fontWeight="bold" opacity="0.4">
          id_XmutH™
        </text>
      </svg>
    ),
  }

  return avatars[id] || <div>Avatar not found</div>
}

export function PremiumAvatarMarketplace({ isVerified, onPurchase }: PremiumAvatarMarketplaceProps) {
  const { t, language } = useLanguage()
  const { toast } = useToast()
  const [avatars, setAvatars] = useState<Avatar[]>([])
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const [isPurchasing, setIsPurchasing] = useState(false)

  useEffect(() => {
    loadAvatars()
    const interval = setInterval(loadAvatars, 10000)
    return () => clearInterval(interval)
  }, [])

  const loadAvatars = async () => {
    try {
      const response = await fetch("/api/avatars/list")
      if (response.ok) {
        const data = await response.json()
        setAvatars(data.avatars)
      }
    } catch (error) {
      console.error("[v0] Error cargando avatares:", error)
    }
  }

  const handlePurchase = async (avatar: Avatar) => {
    if (!isVerified) {
      toast({
        title: t("verificationRequired"),
        description: t("verificationRequiredDesc"),
        variant: "destructive",
      })
      return
    }

    setIsPurchasing(true)
    try {
      const response = await fetch("/api/avatars/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          avatarId: avatar.id,
          price: avatar.currentPrice,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setSelectedAvatar(avatar.id)
        onPurchase?.(avatar.id, avatar.currentPrice)

        toast({
          title: t("avatarPurchased"),
          description: t("avatarPurchasedDesc"),
        })

        loadAvatars()
      } else {
        throw new Error("Purchase failed")
      }
    } catch (error) {
      console.error("[v0] Error comprando avatar:", error)
      toast({
        title: t("purchaseError"),
        description: t("purchaseErrorDesc"),
        variant: "destructive",
      })
    } finally {
      setIsPurchasing(false)
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "legendary":
        return <CrownIcon className="h-4 w-4" />
      case "epic":
        return <FlameIcon className="h-4 w-4" />
      case "rare":
        return <ZapIcon className="h-4 w-4" />
      default:
        return <SparklesIcon className="h-4 w-4" />
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "legendary":
        return "from-amber-500 via-yellow-400 to-orange-500"
      case "epic":
        return "from-purple-500 via-fuchsia-500 to-pink-500"
      case "rare":
        return "from-cyan-500 via-blue-500 to-indigo-500"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case "legendary":
        return "bg-gradient-to-r from-amber-500 to-orange-500"
      case "epic":
        return "bg-gradient-to-r from-purple-500 to-pink-500"
      case "rare":
        return "bg-gradient-to-r from-cyan-500 to-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <SparklesIcon className="h-6 w-6 text-primary animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {t("premiumAvatarMarketplace")}
          </h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">{t("avatarMarketplaceDesc")}</p>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="font-mono">
            id_XmutH™
          </Badge>
          <span>{t("exclusiveCollection")}</span>
        </div>
      </div>

      {!isVerified && (
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="flex items-center gap-4 p-6">
            <LockIcon className="h-8 w-8 text-amber-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-foreground">{t("avatarsLocked")}</p>
              <p className="text-sm text-muted-foreground">{t("avatarsLockedDesc")}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {avatars.map((avatar) => {
          const isOwned = selectedAvatar === avatar.id
          const priceIncrease = ((avatar.currentPrice - avatar.basePrice) / avatar.basePrice) * 100

          return (
            <Card
              key={avatar.id}
              className={cn(
                "relative overflow-hidden transition-all duration-300 hover:scale-105",
                isOwned && "ring-2 ring-primary",
                !isVerified && "opacity-60",
              )}
            >
              {/* Tier Badge */}
              <div className="absolute top-4 right-4 z-10">
                <Badge className={cn("text-white border-0", getTierBadgeColor(avatar.tier))}>
                  {getTierIcon(avatar.tier)}
                  <span className="ml-1 uppercase text-xs font-bold">{avatar.tier}</span>
                </Badge>
              </div>

              <div className="relative h-48 flex items-center justify-center bg-gradient-to-br from-black/80 via-gray-900 to-black/90 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent animate-pulse" />
                </div>
                <AvatarSVG id={avatar.id} className="w-32 h-32 drop-shadow-2xl" />
                <div className="absolute bottom-2 left-2 text-white/30 text-xs font-mono font-bold">id_XmutH™</div>
              </div>

              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{language === "es" ? avatar.nameEs : avatar.name}</span>
                  {isOwned && <CheckIcon className="h-5 w-5 text-primary" />}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <TrendingUpIcon className="h-3 w-3" />
                  <span className="text-xs">
                    {avatar.salesCount} {t("sales")}
                  </span>
                  {priceIncrease > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      +{priceIncrease.toFixed(0)}%
                    </Badge>
                  )}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-2xl font-bold text-foreground">${avatar.currentPrice.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground line-through">${avatar.basePrice.toFixed(2)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">{t("dynamicPricing")}</div>
                  </div>
                </div>

                <Button
                  onClick={() => handlePurchase(avatar)}
                  disabled={!isVerified || isPurchasing || isOwned}
                  className="w-full"
                  variant={isOwned ? "outline" : "default"}
                >
                  {isOwned ? (
                    <>
                      <CheckIcon className="mr-2 h-4 w-4" />
                      {t("owned")}
                    </>
                  ) : !isVerified ? (
                    <>
                      <LockIcon className="mr-2 h-4 w-4" />
                      {t("verifyToUnlock")}
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="mr-2 h-4 w-4" />
                      {t("purchase")}
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">{t("exclusiveToIdXmutH")}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <SparklesIcon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">{t("dynamicPricingExplained")}</h3>
              <p className="text-sm text-muted-foreground">{t("dynamicPricingDesc")}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
