"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CoinsIcon, GiftIcon, LockIcon, UnlockIcon } from "@/components/simple-icons"
import { useLanguage } from "@/hooks/use-language"

interface BenefitsDisplayProps {
  isVerified: boolean
}

export function BenefitsDisplay({ isVerified }: BenefitsDisplayProps) {
  const { t } = useLanguage()

  const benefits = [
    {
      icon: CoinsIcon,
      title: t("benefitWldTokens"),
      description: t("benefitWldTokensDesc"),
      locked: !isVerified,
    },
    {
      icon: GiftIcon,
      title: t("benefitAirdrops"),
      description: t("benefitAirdropsDesc"),
      locked: !isVerified,
    },
    {
      icon: GiftIcon,
      title: t("benefitApps"),
      description: t("benefitAppsDesc"),
      locked: !isVerified,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("availableBenefits")}</CardTitle>
        <CardDescription>{t("availableBenefitsDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              benefit.locked ? "border-border bg-muted/30 opacity-60" : "border-primary/20 bg-primary/5"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  benefit.locked ? "bg-muted" : "bg-primary/10"
                }`}
              >
                <benefit.icon className={`h-5 w-5 ${benefit.locked ? "text-muted-foreground" : "text-primary"}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm">{benefit.title}</h4>
                  {benefit.locked ? (
                    <LockIcon className="h-3 w-3 text-muted-foreground" />
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      <UnlockIcon className="h-3 w-3 mr-1" />
                      {t("active")}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          </div>
        ))}

        {!isVerified && (
          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">{t("unlockBenefitsMessage")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
