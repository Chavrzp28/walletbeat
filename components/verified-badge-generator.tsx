"use client"

import { useRef, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Share2, CheckCircle2, Sparkles } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { useToast } from "@/hooks/use-toast"

interface VerifiedBadgeGeneratorProps {
  verificationData: any
}

export function VerifiedBadgeGenerator({ verificationData }: VerifiedBadgeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { t, language } = useLanguage()
  const { toast } = useToast()
  const [userName, setUserName] = useState("")
  const [badgeStyle, setBadgeStyle] = useState<"modern" | "classic" | "minimal">("modern")

  useEffect(() => {
    if (canvasRef.current && verificationData) {
      generateBadge()
    }
  }, [verificationData, userName, badgeStyle, language])

  const generateBadge = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 1200
    canvas.height = 630

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (badgeStyle === "modern") {
      drawModernBadge(ctx, canvas)
    } else if (badgeStyle === "classic") {
      drawClassicBadge(ctx, canvas)
    } else {
      drawMinimalBadge(ctx, canvas)
    }
  }

  const drawModernBadge = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, "#8b5cf6")
    gradient.addColorStop(0.5, "#6366f1")
    gradient.addColorStop(1, "#3b82f6")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Decorative circles
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
    ctx.beginPath()
    ctx.arc(100, 100, 150, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(canvas.width - 100, canvas.height - 100, 200, 0, Math.PI * 2)
    ctx.fill()

    // White card in center
    const cardMargin = 80
    ctx.fillStyle = "white"
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)"
    ctx.shadowBlur = 30
    ctx.shadowOffsetY = 10
    roundRect(ctx, cardMargin, cardMargin, canvas.width - cardMargin * 2, canvas.height - cardMargin * 2, 20)
    ctx.fill()
    ctx.shadowBlur = 0
    ctx.shadowOffsetY = 0

    // Shield icon
    const shieldSize = 100
    const shieldX = canvas.width / 2 - shieldSize / 2
    const shieldY = 120
    ctx.fillStyle = "#8b5cf6"
    ctx.beginPath()
    ctx.moveTo(shieldX + shieldSize / 2, shieldY)
    ctx.lineTo(shieldX, shieldY + shieldSize * 0.3)
    ctx.lineTo(shieldX, shieldY + shieldSize * 0.7)
    ctx.lineTo(shieldX + shieldSize / 2, shieldY + shieldSize)
    ctx.lineTo(shieldX + shieldSize, shieldY + shieldSize * 0.7)
    ctx.lineTo(shieldX + shieldSize, shieldY + shieldSize * 0.3)
    ctx.closePath()
    ctx.fill()

    // Checkmark inside shield
    ctx.strokeStyle = "white"
    ctx.lineWidth = 8
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.beginPath()
    ctx.moveTo(shieldX + 30, shieldY + 50)
    ctx.lineTo(shieldX + 45, shieldY + 65)
    ctx.lineTo(shieldX + 70, shieldY + 35)
    ctx.stroke()

    // Title
    ctx.fillStyle = "#1e293b"
    ctx.font = "bold 56px sans-serif"
    ctx.textAlign = "center"
    const title = language === "es" ? "HUMANO VERIFICADO" : "VERIFIED HUMAN"
    ctx.fillText(title, canvas.width / 2, 280)

    // User name or "Your Name"
    ctx.font = "48px sans-serif"
    ctx.fillStyle = "#64748b"
    const displayName = userName || (language === "es" ? "Tu Nombre" : "Your Name")
    ctx.fillText(displayName, canvas.width / 2, 350)

    // World ID text
    ctx.font = "32px sans-serif"
    ctx.fillStyle = "#8b5cf6"
    ctx.fillText("World ID", canvas.width / 2, 410)

    // Verification hash
    ctx.font = "20px monospace"
    ctx.fillStyle = "#94a3b8"
    const hash = verificationData.nullifier_hash?.substring(0, 16) || "0x000000000000"
    ctx.fillText(`ID: ${hash}...`, canvas.width / 2, 470)

    // Date
    ctx.font = "18px sans-serif"
    const date = new Date(verificationData.timestamp).toLocaleDateString(language === "es" ? "es-ES" : "en-US")
    const dateText = language === "es" ? `Verificado: ${date}` : `Verified: ${date}`
    ctx.fillText(dateText, canvas.width / 2, 510)
  }

  const drawClassicBadge = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Classic gold background
    ctx.fillStyle = "#1e293b"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Gold border
    ctx.strokeStyle = "#fbbf24"
    ctx.lineWidth = 20
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80)

    // Inner border
    ctx.strokeStyle = "#f59e0b"
    ctx.lineWidth = 4
    ctx.strokeRect(70, 70, canvas.width - 140, canvas.height - 140)

    // Certificate text
    ctx.fillStyle = "#fbbf24"
    ctx.font = "bold 72px serif"
    ctx.textAlign = "center"
    const certText = language === "es" ? "CERTIFICADO" : "CERTIFICATE"
    ctx.fillText(certText, canvas.width / 2, 150)

    // Subtitle
    ctx.font = "32px serif"
    ctx.fillStyle = "#cbd5e1"
    const subtitle = language === "es" ? "de Verificación de Humanidad" : "of Human Verification"
    ctx.fillText(subtitle, canvas.width / 2, 200)

    // Main text
    ctx.font = "bold 56px serif"
    ctx.fillStyle = "white"
    const mainText = language === "es" ? "Esto certifica que" : "This certifies that"
    ctx.fillText(mainText, canvas.width / 2, 280)

    // Name
    ctx.font = "bold 64px serif"
    ctx.fillStyle = "#fbbf24"
    const displayName = userName || (language === "es" ? "[Tu Nombre]" : "[Your Name]")
    ctx.fillText(displayName, canvas.width / 2, 360)

    // Verified text
    ctx.font = "36px serif"
    ctx.fillStyle = "white"
    const verifiedText =
      language === "es" ? "ha sido verificado como humano único" : "has been verified as a unique human"
    ctx.fillText(verifiedText, canvas.width / 2, 420)

    // World ID badge
    ctx.font = "28px sans-serif"
    ctx.fillStyle = "#8b5cf6"
    ctx.fillText("via World ID Protocol", canvas.width / 2, 480)

    // Date and ID
    ctx.font = "20px monospace"
    ctx.fillStyle = "#94a3b8"
    const date = new Date(verificationData.timestamp).toLocaleDateString(language === "es" ? "es-ES" : "en-US")
    ctx.fillText(date, canvas.width / 2, 540)
    const hash = verificationData.nullifier_hash?.substring(0, 16) || "0x000000000000"
    ctx.fillText(`ID: ${hash}...`, canvas.width / 2, 570)
  }

  const drawMinimalBadge = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // White background
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Simple top accent
    ctx.fillStyle = "#8b5cf6"
    ctx.fillRect(0, 0, canvas.width, 8)

    // Checkmark circle
    const circleSize = 120
    const circleX = canvas.width / 2
    const circleY = 180
    ctx.fillStyle = "#8b5cf6"
    ctx.beginPath()
    ctx.arc(circleX, circleY, circleSize / 2, 0, Math.PI * 2)
    ctx.fill()

    // Checkmark
    ctx.strokeStyle = "white"
    ctx.lineWidth = 12
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.beginPath()
    ctx.moveTo(circleX - 30, circleY)
    ctx.lineTo(circleX - 10, circleY + 20)
    ctx.lineTo(circleX + 30, circleY - 20)
    ctx.stroke()

    // Title
    ctx.fillStyle = "#0f172a"
    ctx.font = "600 64px sans-serif"
    ctx.textAlign = "center"
    const title = language === "es" ? "Verificado" : "Verified"
    ctx.fillText(title, canvas.width / 2, 320)

    // Name
    ctx.font = "48px sans-serif"
    ctx.fillStyle = "#475569"
    const displayName = userName || (language === "es" ? "Tu Nombre" : "Your Name")
    ctx.fillText(displayName, canvas.width / 2, 390)

    // World ID
    ctx.font = "28px sans-serif"
    ctx.fillStyle = "#8b5cf6"
    ctx.fillText("World ID", canvas.width / 2, 440)

    // Divider line
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(300, 480)
    ctx.lineTo(canvas.width - 300, 480)
    ctx.stroke()

    // Footer info
    ctx.font = "20px monospace"
    ctx.fillStyle = "#94a3b8"
    const hash = verificationData.nullifier_hash?.substring(0, 20) || "0x0000000000000000"
    ctx.fillText(hash, canvas.width / 2, 530)
    const date = new Date(verificationData.timestamp).toLocaleDateString(language === "es" ? "es-ES" : "en-US")
    ctx.fillText(date, canvas.width / 2, 570)
  }

  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
  ) => {
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
  }

  const downloadBadge = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    const fileName = userName
      ? `world-id-verified-${userName.replace(/\s+/g, "-").toLowerCase()}.png`
      : "world-id-verified-badge.png"
    link.download = fileName
    link.href = canvas.toDataURL("image/png")
    link.click()

    toast({
      title: t("badgeDownloaded"),
      description: t("badgeDownloadedDesc"),
    })
  }

  const shareBadge = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.toBlob(async (blob) => {
      if (!blob) return

      const file = new File([blob], "world-id-verified.png", { type: "image/png" })

      if (navigator.share && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: t("shareTitle"),
            text: t("shareText"),
          })
          toast({
            title: t("badgeShared"),
            description: t("badgeSharedDesc"),
          })
        } catch (err) {
          console.error("[v0] Error sharing:", err)
        }
      } else {
        downloadBadge()
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>{t("badgeGenerator")}</CardTitle>
        </div>
        <CardDescription>{t("badgeGeneratorDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Name Input */}
        <div className="space-y-2">
          <Label htmlFor="userName">{t("yourName")}</Label>
          <Input
            id="userName"
            placeholder={language === "es" ? "Ingresa tu nombre" : "Enter your name"}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            maxLength={50}
          />
        </div>

        {/* Style Selector */}
        <div className="space-y-2">
          <Label>{t("badgeStyle")}</Label>
          <div className="flex gap-2">
            <Button
              variant={badgeStyle === "modern" ? "default" : "outline"}
              size="sm"
              onClick={() => setBadgeStyle("modern")}
            >
              {t("styleModern")}
            </Button>
            <Button
              variant={badgeStyle === "classic" ? "default" : "outline"}
              size="sm"
              onClick={() => setBadgeStyle("classic")}
            >
              {t("styleClassic")}
            </Button>
            <Button
              variant={badgeStyle === "minimal" ? "default" : "outline"}
              size="sm"
              onClick={() => setBadgeStyle("minimal")}
            >
              {t("styleMinimal")}
            </Button>
          </div>
        </div>

        {/* Canvas Preview */}
        <div className="space-y-2">
          <Label>{t("preview")}</Label>
          <div className="border rounded-lg overflow-hidden bg-muted">
            <canvas ref={canvasRef} className="w-full h-auto" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={downloadBadge} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            {t("download")}
          </Button>
          <Button onClick={shareBadge} variant="outline" className="flex-1 bg-transparent">
            <Share2 className="h-4 w-4 mr-2" />
            {t("share")}
          </Button>
        </div>

        <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg">
          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">{t("badgeTip")}</p>
        </div>
      </CardContent>
    </Card>
  )
}
