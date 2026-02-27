"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSignIcon, UsersIcon, TrendingUpIcon, EyeIcon, SparklesIcon } from "@/components/simple-icons"
import { useLanguage } from "@/hooks/use-language"

export function OwnerDashboard() {
  const { t } = useLanguage()
  const [stats, setStats] = useState({
    totalVerifications: 0,
    totalEarnings: 0,
    todayVerifications: 0,
    conversionRate: 0,
    avatarSales: 0,
    avatarRevenue: 0,
  })

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch("/api/owner/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("[v0] Error cargando estadísticas:", error)
      }
    }

    loadStats()
    const interval = setInterval(loadStats, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="mb-16">
      <div className="flex items-center gap-2 mb-6">
        <EyeIcon className="h-6 w-6 text-primary" />
        <h3 className="text-2xl font-bold text-foreground">{t("ownerDashboard")}</h3>
        <Badge variant="secondary">{t("adminOnly")}</Badge>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4" />
              {t("totalVerifications")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalVerifications}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +{stats.todayVerifications} {t("today")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <DollarSignIcon className="h-4 w-4" />
              {t("totalEarnings")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">${stats.totalEarnings}</div>
            <p className="text-xs text-muted-foreground mt-1">{t("estimatedValue")}</p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 bg-purple-500/5">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <SparklesIcon className="h-4 w-4 text-purple-500" />
              Avatar Sales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.avatarSales}</div>
            <p className="text-xs text-muted-foreground mt-1">${stats.avatarRevenue.toFixed(2)} revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <TrendingUpIcon className="h-4 w-4" />
              {t("conversionRate")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">{t("visitorsToVerified")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <DollarSignIcon className="h-4 w-4" />
              {t("avgPerUser")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              ${stats.totalVerifications > 0 ? (stats.totalEarnings / stats.totalVerifications).toFixed(2) : "0.00"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{t("perVerification")}</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <DollarSignIcon className="h-4 w-4 text-primary" />
              Total Revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              ${(stats.totalEarnings + stats.avatarRevenue).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Verifications + Avatars</p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
