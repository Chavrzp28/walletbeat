"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle2, ExternalLink, Copy, Settings, Globe, Shield, Info } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function EnvSetupGuide() {
  const { t, language } = useLanguage()
  const [appId, setAppId] = useState("")
  const [actionName, setActionName] = useState("")
  const [isConfigured, setIsConfigured] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const currentAppId = process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID
    const currentAction = process.env.NEXT_PUBLIC_WORLDCOIN_ACTION

    if (currentAppId && currentAction && !currentAppId.includes("staging")) {
      setIsConfigured(true)
      setAppId(currentAppId)
      setActionName(currentAction)
    }
  }, [])

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const instructions = {
    es: {
      title: "Configuración de World ID",
      subtitle: "Sigue estos pasos para configurar tu aplicación",
      step1: "Crear cuenta en World ID",
      step1Desc: "Primero necesitas crear una cuenta en el Developer Portal de World ID",
      step2: "Crear aplicación",
      step2Desc: "Crea una nueva aplicación en el portal y obtén tu App ID",
      step3: "Configurar variables",
      step3Desc: "Agrega las variables de entorno en v0",
      step4: "Verificar configuración",
      step4Desc: "Confirma que todo funciona correctamente",
      openPortal: "Abrir Developer Portal",
      notConfigured: "Variables de entorno no configuradas",
      notConfiguredDesc:
        "Tu aplicación está usando valores de prueba. Configura tus credenciales reales para producción.",
      configured: "Configuración completa",
      configuredDesc: "Tu aplicación está lista para verificar usuarios con World ID.",
      howToConfigure: "Cómo configurar en v0",
      varInstructions: [
        "Haz clic en el icono de menú en la barra lateral izquierda",
        'Selecciona "Vars" (Variables de entorno)',
        "Haz clic en '+ Add Variable'",
        "Agrega estas dos variables:",
      ],
      testMode: "Modo de Prueba Activo",
      testModeDesc: "Puedes probar la aplicación con valores de desarrollo mientras obtienes tus credenciales reales.",
      currentValues: "Valores actuales",
      recommendedAction: "Acción recomendada",
    },
    en: {
      title: "World ID Setup",
      subtitle: "Follow these steps to configure your application",
      step1: "Create World ID account",
      step1Desc: "First you need to create an account in the World ID Developer Portal",
      step2: "Create application",
      step2Desc: "Create a new application in the portal and get your App ID",
      step3: "Configure variables",
      step3Desc: "Add environment variables in v0",
      step4: "Verify configuration",
      step4Desc: "Confirm everything works correctly",
      openPortal: "Open Developer Portal",
      notConfigured: "Environment variables not configured",
      notConfiguredDesc: "Your app is using test values. Configure your real credentials for production.",
      configured: "Setup complete",
      configuredDesc: "Your application is ready to verify users with World ID.",
      howToConfigure: "How to configure in v0",
      varInstructions: [
        "Click on the menu icon in the left sidebar",
        'Select "Vars" (Environment Variables)',
        "Click '+ Add Variable'",
        "Add these two variables:",
      ],
      testMode: "Test Mode Active",
      testModeDesc: "You can test the application with development values while getting your real credentials.",
      currentValues: "Current values",
      recommendedAction: "Recommended action",
    },
  }

  const i18n = instructions[language as keyof typeof instructions] || instructions.en

  return (
    <Card className="border-orange-500/20 bg-orange-500/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isConfigured ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-orange-500" />
            )}
            <CardTitle>{i18n.title}</CardTitle>
          </div>
          <Badge variant={isConfigured ? "default" : "secondary"}>
            {isConfigured ? i18n.configured : i18n.testMode}
          </Badge>
        </div>
        <CardDescription>{i18n.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isConfigured && (
          <Alert className="border-orange-500/20 bg-orange-500/5">
            <Info className="h-4 w-4 text-orange-500" />
            <AlertTitle className="text-orange-700 dark:text-orange-400">{i18n.notConfigured}</AlertTitle>
            <AlertDescription className="text-orange-600 dark:text-orange-300">
              {i18n.notConfiguredDesc}
            </AlertDescription>
          </Alert>
        )}

        {isConfigured && (
          <Alert className="border-green-500/20 bg-green-500/5">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-700 dark:text-green-400">{i18n.configured}</AlertTitle>
            <AlertDescription className="text-green-600 dark:text-green-300">{i18n.configuredDesc}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="guide" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="guide">
              <Settings className="h-4 w-4 mr-2" />
              {language === "es" ? "Guía" : "Guide"}
            </TabsTrigger>
            <TabsTrigger value="values">
              <Globe className="h-4 w-4 mr-2" />
              {language === "es" ? "Valores" : "Values"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guide" className="space-y-4">
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  1
                </div>
                <div className="space-y-2 flex-1">
                  <h4 className="font-semibold">{i18n.step1}</h4>
                  <p className="text-sm text-muted-foreground">{i18n.step1Desc}</p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://developer.worldcoin.org/" target="_blank" rel="noopener noreferrer">
                      {i18n.openPortal}
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  2
                </div>
                <div className="space-y-2 flex-1">
                  <h4 className="font-semibold">{i18n.step2}</h4>
                  <p className="text-sm text-muted-foreground">{i18n.step2Desc}</p>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      {language === "es" ? "En el portal, crea:" : "In the portal, create:"}
                    </Label>
                    <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
                      <li>{language === "es" ? "Una nueva aplicación" : "A new application"}</li>
                      <li>
                        {language === "es"
                          ? 'Una "Action" con nombre: verify-for-benefits'
                          : 'An "Action" named: verify-for-benefits'}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  3
                </div>
                <div className="space-y-2 flex-1">
                  <h4 className="font-semibold">{i18n.step3}</h4>
                  <p className="text-sm text-muted-foreground">{i18n.step3Desc}</p>

                  <div className="space-y-3 p-4 bg-muted rounded-lg">
                    <h5 className="font-semibold text-sm">{i18n.howToConfigure}</h5>
                    <ol className="space-y-2 text-sm text-muted-foreground">
                      {i18n.varInstructions.map((instruction, idx) => (
                        <li key={idx}>{`${idx + 1}. ${instruction}`}</li>
                      ))}
                    </ol>

                    <div className="space-y-3 mt-4 pt-4 border-t border-border">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <code className="text-xs font-mono bg-background px-2 py-1 rounded">
                            NEXT_PUBLIC_WORLDCOIN_APP_ID
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard("NEXT_PUBLIC_WORLDCOIN_APP_ID", "appId")}
                          >
                            {copied === "appId" ? <CheckCircle2 className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {language === "es" ? "Tu App ID del Developer Portal" : "Your App ID from Developer Portal"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <code className="text-xs font-mono bg-background px-2 py-1 rounded">
                            NEXT_PUBLIC_WORLDCOIN_ACTION
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard("NEXT_PUBLIC_WORLDCOIN_ACTION", "action")}
                          >
                            {copied === "action" ? <CheckCircle2 className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {language === "es" ? i18n.recommendedAction : i18n.recommendedAction}:{" "}
                          <code className="font-mono">verify-for-benefits</code>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  4
                </div>
                <div className="space-y-2 flex-1">
                  <h4 className="font-semibold">{i18n.step4}</h4>
                  <p className="text-sm text-muted-foreground">{i18n.step4Desc}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="values" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold mb-2 block">{i18n.currentValues}</Label>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">NEXT_PUBLIC_WORLDCOIN_APP_ID</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        readOnly
                        value={process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID || "app_staging_0000000000000000"}
                        className="font-mono text-xs"
                      />
                      {!isConfigured && (
                        <Badge variant="outline" className="text-xs">
                          {language === "es" ? "Prueba" : "Test"}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">NEXT_PUBLIC_WORLDCOIN_ACTION</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        readOnly
                        value={process.env.NEXT_PUBLIC_WORLDCOIN_ACTION || "verify-human"}
                        className="font-mono text-xs"
                      />
                      {!isConfigured && (
                        <Badge variant="outline" className="text-xs">
                          {language === "es" ? "Prueba" : "Test"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {!isConfigured && (
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertTitle>{i18n.testModeDesc}</AlertTitle>
                  <AlertDescription className="text-xs mt-2">
                    {language === "es"
                      ? "Nota: En modo de prueba, las verificaciones no se guardarán en producción."
                      : "Note: In test mode, verifications won't be saved in production."}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="pt-4 border-t border-border">
          <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
            <a href="https://docs.world.org/world-id/id/web-react" target="_blank" rel="noopener noreferrer">
              {language === "es" ? "Ver documentación completa" : "View full documentation"}
              <ExternalLink className="ml-2 h-3 w-3" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
