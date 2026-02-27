"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, Gift } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function ReferralStats() {
  const { t } = useLanguage()

  const stats = [
    {
      title: t("totalReferrals"),
      value: "248",
      description: t("verifiedUsers"),
      icon: Users,
    },
    {
      title: t("totalEarnings"),
      value: "$1,847",
      description: t("fromReferrals"),
      icon: TrendingUp,
    },
    {
      title: t("totalRewards"),
      value: "$284",
      description: t("bonusEarned"),
      icon: Gift,
    },
  ]

  return (
    <section>
      <h2 className="text-3xl font-bold mb-6 text-foreground">{t("yourStats")}</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
