"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/hooks/use-language"
import { Globe2Icon, ShieldIcon, CoinsIcon, SparklesIcon } from "@/components/simple-icons"

export default function HomePage() {
  const { t } = useLanguage()
  const [referralCode, setReferralCode] = useState<string>("")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const refCode = params.get("ref")
    if (refCode) {
      setReferralCode(refCode)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Globe2Icon className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">id_XmutH Verify</h1>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <Badge className="mb-4" variant="outline">
            <ShieldIcon className="h-3 w-3 mr-1" />
            Beta
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
            World ID Verification Platform
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {t("language") === "es"
              ? "Verifica tu humanidad y desbloquea beneficios exclusivos de Worldcoin"
              : "Verify your humanity and unlock exclusive Worldcoin benefits"}
          </p>
        </section>

        {/* Premium Avatares Preview */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <SparklesIcon className="h-6 w-6 text-primary animate-pulse" />
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {t("language") === "es" ? "Avatares Premium id_XmutH™" : "id_XmutH™ Premium Avatars"}
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("language") === "es"
                ? "Colección exclusiva de avatares futuristas con precios dinámicos"
                : "Exclusive collection of futuristic avatars with dynamic pricing"}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Avatar 1 */}
            <Card className="relative overflow-hidden hover:scale-105 transition-all duration-300">
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">LEGENDARY</Badge>
              </div>
              <div className="h-48 flex items-center justify-center bg-gradient-to-br from-amber-500 via-yellow-400 to-orange-500">
                <div className="text-8xl animate-pulse">👑</div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{t("language") === "es" ? "Rey Cósmico" : "Cosmic King"}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">$49.99</div>
                <Button className="w-full">
                  <SparklesIcon className="mr-2 h-4 w-4" />
                  {t("language") === "es" ? "Comprar" : "Purchase"}
                </Button>
              </CardContent>
            </Card>

            {/* Avatar 2 */}
            <Card className="relative overflow-hidden hover:scale-105 transition-all duration-300">
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">EPIC</Badge>
              </div>
              <div className="h-48 flex items-center justify-center bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500">
                <div className="text-8xl animate-pulse">🔮</div>
              </div>
              <CardHeader>
                <CardTitle>{t("language") === "es" ? "Místico Cuántico" : "Quantum Mystic"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">$29.99</div>
                <Button className="w-full">
                  <SparklesIcon className="mr-2 h-4 w-4" />
                  {t("language") === "es" ? "Comprar" : "Purchase"}
                </Button>
              </CardContent>
            </Card>

            {/* Avatar 3 */}
            <Card className="relative overflow-hidden hover:scale-105 transition-all duration-300">
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0">RARE</Badge>
              </div>
              <div className="h-48 flex items-center justify-center bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500">
                <div className="text-8xl animate-pulse">⚡</div>
              </div>
              <CardHeader>
                <CardTitle>{t("language") === "es" ? "Centinela Neón" : "Neon Sentinel"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">$19.99</div>
                <Button className="w-full">
                  <SparklesIcon className="mr-2 h-4 w-4" />
                  {t("language") === "es" ? "Comprar" : "Purchase"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12">
            {t("language") === "es" ? "Cómo Funciona" : "How It Works"}
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ShieldIcon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t("language") === "es" ? "Verifica tu Identidad" : "Verify Your Identity"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("language") === "es"
                    ? "Usa World ID para verificar que eres un humano único"
                    : "Use World ID to verify you're a unique human"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CoinsIcon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t("language") === "es" ? "Desbloquea Beneficios" : "Unlock Benefits"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("language") === "es"
                    ? "Accede a tokens WLD y rewards exclusivos"
                    : "Access WLD tokens and exclusive rewards"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Globe2Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t("language") === "es" ? "Únete al Ecosistema" : "Join the Ecosystem"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("language") === "es"
                    ? "Participa en apps y servicios verificados"
                    : "Participate in verified apps and services"}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>id_XmutH™ © 2025 - {t("language") === "es" ? "Verificación World ID" : "World ID Verification"}</p>
        </div>
      </footer>
    </div>
  )
}
