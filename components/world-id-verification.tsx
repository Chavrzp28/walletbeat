"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import dynamic from "next/dynamic"
import { ShieldIcon, LoaderIcon, CheckCircleIcon, AlertCircleIcon } from "@/components/simple-icons"
import { useLanguage } from "@/hooks/use-language"
import { useToast } from "@/hooks/use-toast"
import { WorldIdErrorBoundary } from "./world-id-error-boundary"

const IDKitWidget = dynamic(
  () =>
    import("@worldcoin/idkit")
      .then((mod) => {
        console.log("[v0] IDKitWidget loaded successfully")
        return mod.IDKitWidget
      })
      .catch((err) => {
        console.error("[v0] Failed to load IDKitWidget:", err)
        // Return a fallback component instead of throwing
        return () => (
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertDescription className="ml-2">
              Failed to load World ID widget. Please check your internet connection and try again.
            </AlertDescription>
          </Alert>
        )
      }),
  {
    ssr: false,
    loading: () => (
      <Button size="lg" className="w-full" disabled>
        <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
        Loading World ID...
      </Button>
    ),
  }
)

interface WorldIdVerificationProps {
  isVerified: boolean
  referralCode: string
  onVerificationSuccess: (data: any) => void
}

export function WorldIdVerification({ isVerified, referralCode, onVerificationSuccess }: WorldIdVerificationProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVerify = async (proof: any) => {
    console.log("[v0] Starting verification process...")
    setIsVerifying(true)
    setError(null)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const response = await fetch("/api/verify-world-id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          proof,
          referralCode,
        }),
        signal: controller.signal,
      }).catch((err) => {
        clearTimeout(timeoutId)
        console.error("[v0] Fetch error:", err)
        if (err.name === "AbortError") {
          throw new Error("Request timeout - please try again")
        }
        throw new Error("Network request failed - check your connection")
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || `Verification failed with status ${response.status}`)
      }

      const data = await response.json()

      console.log("[v0] Verificación exitosa:", data)

      onVerificationSuccess({
        nullifier_hash: proof.nullifier_hash,
        proof: proof.proof,
        merkle_root: proof.merkle_root,
        verification_level: proof.verification_level,
        referralCode,
        timestamp: new Date().toISOString(),
      })

      toast({
        title: t("verificationSuccess"),
        description: t("verificationSuccessDescription"),
      })
    } catch (err) {
      console.error("[v0] Error de verificación:", err)
      const errorMessage = err instanceof Error ? err.message : t("verificationError")
      setError(errorMessage)
      toast({
        title: t("verificationError"),
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const onSuccess = () => {
    console.log("[v0] Verificación completada con éxito")
  }

  if (isVerified) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5 text-primary" />
            <CardTitle>{t("alreadyVerified")}</CardTitle>
          </div>
          <CardDescription>{t("alreadyVerifiedDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="border-primary/20 bg-primary/5">
            <ShieldIcon className="h-4 w-4 text-primary" />
            <AlertDescription className="ml-2">{t("verifiedBenefitsActive")}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <WorldIdErrorBoundary>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldIcon className="h-5 w-5 text-primary" />
            {t("verifyWithWorldId")}
          </CardTitle>
          <CardDescription>{t("verifyDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {referralCode && (
            <Alert>
              <AlertCircleIcon className="h-4 w-4" />
              <AlertDescription className="ml-2">
                {t("referralActive")}: <code className="font-mono text-primary">{referralCode}</code>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold text-sm">{t("whatYouGet")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{t("benefit1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{t("benefit2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{t("benefit3")}</span>
              </li>
            </ul>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertDescription className="ml-2">{error}</AlertDescription>
            </Alert>
          )}

          <IDKitWidget
            app_id={process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID || "app_staging_0000000000000000"}
            action={process.env.NEXT_PUBLIC_WORLDCOIN_ACTION || "verify-human"}
            verification_level="device"
            handleVerify={handleVerify}
            onSuccess={onSuccess}
          >
            {({ open }: any) => (
              <Button onClick={open} size="lg" className="w-full" disabled={isVerifying}>
                {isVerifying ? (
                  <>
                    <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                    {t("verifying")}
                  </>
                ) : (
                  <>
                    <ShieldIcon className="mr-2 h-4 w-4" />
                    {t("startVerification")}
                  </>
                )}
              </Button>
            )}
          </IDKitWidget>

          <p className="text-xs text-center text-muted-foreground">{t("privacyNote")}</p>
        </CardContent>
      </Card>
    </WorldIdErrorBoundary>
  )
}
