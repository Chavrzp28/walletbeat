"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "es"

interface Translations {
  [key: string]: string
}

const translations: Record<Language, Translations> = {
  en: {
    appName: "WorldID Verify",
    betaLabel: "Powered by World ID",
    heroTitle: "Get Access to Worldcoin Benefits",
    heroDescription:
      "Verify your humanity with World ID and unlock exclusive rewards, airdrops, and WLD tokens without needing to visit an Orb location.",
    verifiedUser: "✓ Verified Human",
    verificationSuccess: "Successfully verified with World ID!",
    verificationSuccessDescription: "You now have access to all Worldcoin benefits",
    verificationError: "Verification failed",
    verificationErrorDescription: "Please try again or contact support",
    howItWorks: "Why World ID?",
    feature1Title: "Proof of Personhood",
    feature1Description:
      "Verify you're a unique human without revealing your identity using zero-knowledge cryptography",
    feature2Title: "Access WLD Tokens",
    feature2Description: "Receive free WLD token grants and participate in the Worldcoin economy",
    feature3Title: "Exclusive Benefits",
    feature3Description: "Access apps, airdrops, and services that require verified human users",
    verifyWithWorldId: "Verify with World ID",
    verifyDescription: "Complete your verification to access all Worldcoin benefits",
    referralActive: "Referral code active",
    whatYouGet: "What you'll get:",
    benefit1: "Regular WLD token grants delivered to your World App wallet",
    benefit2: "Access to exclusive airdrops from partner projects",
    benefit3: "Verified status for all compatible apps and platforms",
    startVerification: "Verify with World ID",
    verifying: "Verifying...",
    privacyNote: "Your verification is private and secure. We never see your personal data.",
    alreadyVerified: "Already Verified",
    alreadyVerifiedDescription: "You have successfully completed World ID verification",
    verifiedBenefitsActive: "All benefits are now active for your account",
    availableBenefits: "Worldcoin Benefits",
    availableBenefitsDesc: "Unlock these benefits by verifying with World ID",
    benefitWldTokens: "WLD Token Grants",
    benefitWldTokensDesc: "Receive regular WLD token distributions to your World App wallet",
    benefitAirdrops: "Exclusive Airdrops",
    benefitAirdropsDesc: "Get early access to airdrops from partner projects in the ecosystem",
    benefitApps: "Verified App Access",
    benefitAppsDesc: "Use your World ID across hundreds of apps requiring proof of personhood",
    active: "Active",
    unlockBenefitsMessage: "Complete verification above to unlock all benefits",
    ownerDashboard: "Owner Dashboard",
    adminOnly: "Admin Only",
    totalVerifications: "Total Verifications",
    today: "today",
    totalEarnings: "Estimated Revenue",
    estimatedValue: "based on referral value",
    conversionRate: "Conversion Rate",
    visitorsToVerified: "visitors to verified",
    avgPerUser: "Avg Per User",
    perVerification: "per verification",
    footerText: "© 2025 World ID Verification Service. Not affiliated with Worldcoin Foundation.",
    badgeGenerator: "Create Your Verified Badge",
    badgeGeneratorDesc: "Generate a personalized badge to showcase your World ID verification",
    yourName: "Your Name (optional)",
    badgeStyle: "Badge Style",
    styleModern: "Modern",
    styleClassic: "Classic",
    styleMinimal: "Minimal",
    preview: "Preview",
    download: "Download Badge",
    share: "Share",
    badgeDownloaded: "Badge Downloaded!",
    badgeDownloadedDesc: "Your verified badge has been saved to your device",
    badgeShared: "Badge Shared!",
    badgeSharedDesc: "Your verified badge has been shared successfully",
    shareTitle: "I'm World ID Verified!",
    shareText: "I've verified my humanity with World ID and unlocked exclusive Worldcoin benefits.",
    badgeTip:
      "Share your badge on social media to showcase your verified status and help others discover World ID benefits.",
    premiumAvatarMarketplace: "Premium Avatar Collection",
    avatarMarketplaceDesc: "Exclusive futuristic avatars with dynamic pricing. More popular = Higher price!",
    exclusiveCollection: "Exclusive to verified users",
    avatarsLocked: "Premium Avatars Locked",
    avatarsLockedDesc: "Complete World ID verification above to unlock the exclusive avatar marketplace",
    sales: "sales",
    dynamicPricing: "Dynamic Price",
    owned: "Owned",
    verifyToUnlock: "Verify to Unlock",
    purchase: "Purchase Avatar",
    exclusiveToIdXmutH: "Exclusive id_XmutH™ Collection",
    dynamicPricingExplained: "How Dynamic Pricing Works",
    dynamicPricingDesc:
      "Avatar prices increase with popularity. Early adopters get the best prices. The more an avatar sells, the more valuable it becomes!",
    verificationRequired: "Verification Required",
    verificationRequiredDesc: "You must be verified with World ID to purchase premium avatars",
    avatarPurchased: "Avatar Purchased!",
    avatarPurchasedDesc: "Your exclusive avatar has been added to your collection",
    purchaseError: "Purchase Failed",
    purchaseErrorDesc: "Unable to complete purchase. Please try again.",
  },
  es: {
    appName: "Verificación WorldID",
    betaLabel: "Powered by World ID",
    heroTitle: "Accede a los Beneficios de Worldcoin",
    heroDescription:
      "Verifica tu humanidad con World ID y desbloquea recompensas exclusivas, airdrops y tokens WLD sin necesidad de visitar un Orb.",
    verifiedUser: "✓ Humano Verificado",
    verificationSuccess: "¡Verificación exitosa con World ID!",
    verificationSuccessDescription: "Ahora tienes acceso a todos los beneficios de Worldcoin",
    verificationError: "Error en la verificación",
    verificationErrorDescription: "Por favor intenta de nuevo o contacta soporte",
    howItWorks: "¿Por qué World ID?",
    feature1Title: "Prueba de Personalidad",
    feature1Description:
      "Verifica que eres un humano único sin revelar tu identidad usando criptografía de conocimiento cero",
    feature2Title: "Acceso a Tokens WLD",
    feature2Description: "Recibe tokens WLD gratuitos y participa en la economía de Worldcoin",
    feature3Title: "Beneficios Exclusivos",
    feature3Description: "Accede a apps, airdrops y servicios que requieren usuarios humanos verificados",
    verifyWithWorldId: "Verificar con World ID",
    verifyDescription: "Completa tu verificación para acceder a todos los beneficios de Worldcoin",
    referralActive: "Código de referencia activo",
    whatYouGet: "Lo que obtendrás:",
    benefit1: "Tokens WLD regulares entregados a tu billetera World App",
    benefit2: "Acceso a airdrops exclusivos de proyectos asociados",
    benefit3: "Estado verificado para todas las apps y plataformas compatibles",
    startVerification: "Verificar con World ID",
    verifying: "Verificando...",
    privacyNote: "Tu verificación es privada y segura. Nunca vemos tus datos personales.",
    alreadyVerified: "Ya Verificado",
    alreadyVerifiedDescription: "Has completado exitosamente la verificación de World ID",
    verifiedBenefitsActive: "Todos los beneficios están ahora activos para tu cuenta",
    availableBenefits: "Beneficios de Worldcoin",
    availableBenefitsDesc: "Desbloquea estos beneficios verificándote con World ID",
    benefitWldTokens: "Tokens WLD Gratis",
    benefitWldTokensDesc: "Recibe distribuciones regulares de tokens WLD en tu billetera World App",
    benefitAirdrops: "Airdrops Exclusivos",
    benefitAirdropsDesc: "Obtén acceso anticipado a airdrops de proyectos asociados del ecosistema",
    benefitApps: "Acceso a Apps Verificadas",
    benefitAppsDesc: "Usa tu World ID en cientos de apps que requieren prueba de personalidad",
    active: "Activo",
    unlockBenefitsMessage: "Completa la verificación arriba para desbloquear todos los beneficios",
    ownerDashboard: "Panel de Propietario",
    adminOnly: "Solo Admin",
    totalVerifications: "Verificaciones Totales",
    today: "hoy",
    totalEarnings: "Ingresos Estimados",
    estimatedValue: "basado en valor de referencia",
    conversionRate: "Tasa de Conversión",
    visitorsToVerified: "visitantes a verificados",
    avgPerUser: "Promedio por Usuario",
    perVerification: "por verificación",
    footerText: "© 2025 Servicio de Verificación World ID. No afiliado con Worldcoin Foundation.",
    badgeGenerator: "Crea tu Badge Verificado",
    badgeGeneratorDesc: "Genera un badge personalizado para mostrar tu verificación de World ID",
    yourName: "Tu Nombre (opcional)",
    badgeStyle: "Estilo del Badge",
    styleModern: "Moderno",
    styleClassic: "Clásico",
    styleMinimal: "Minimalista",
    preview: "Vista Previa",
    download: "Descargar Badge",
    share: "Compartir",
    badgeDownloaded: "¡Badge Descargado!",
    badgeDownloadedDesc: "Tu badge verificado se ha guardado en tu dispositivo",
    badgeShared: "¡Badge Compartido!",
    badgeSharedDesc: "Tu badge verificado se ha compartido exitosamente",
    shareTitle: "¡Estoy Verificado con World ID!",
    shareText: "He verificado mi humanidad con World ID y desbloqueado beneficios exclusivos de Worldcoin.",
    badgeTip:
      "Comparte tu badge en redes sociales para mostrar tu estado verificado y ayudar a otros a descubrir los beneficios de World ID.",
    premiumAvatarMarketplace: "Colección Premium de Avatares",
    avatarMarketplaceDesc: "Avatares futuristas exclusivos con precios dinámicos. ¡Más popular = Precio más alto!",
    exclusiveCollection: "Exclusivo para usuarios verificados",
    avatarsLocked: "Avatares Premium Bloqueados",
    avatarsLockedDesc:
      "Completa la verificación de World ID arriba para desbloquear el marketplace exclusivo de avatares",
    sales: "ventas",
    dynamicPricing: "Precio Dinámico",
    owned: "En Posesión",
    verifyToUnlock: "Verificar para Desbloquear",
    purchase: "Comprar Avatar",
    exclusiveToIdXmutH: "Colección Exclusiva id_XmutH™",
    dynamicPricingExplained: "Cómo Funciona el Precio Dinámico",
    dynamicPricingDesc:
      "Los precios de avatares aumentan con la popularidad. Los primeros compradores obtienen los mejores precios. ¡Mientras más se vende un avatar, más valioso se vuelve!",
    verificationRequired: "Verificación Requerida",
    verificationRequiredDesc: "Debes estar verificado con World ID para comprar avatares premium",
    avatarPurchased: "¡Avatar Comprado!",
    avatarPurchasedDesc: "Tu avatar exclusivo ha sido agregado a tu colección",
    purchaseError: "Compra Fallida",
    purchaseErrorDesc: "No se pudo completar la compra. Por favor intenta de nuevo.",
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es")

  useEffect(() => {
    const stored = localStorage.getItem("language") as Language
    if (stored && (stored === "en" || stored === "es")) {
      setLanguageState(stored)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
