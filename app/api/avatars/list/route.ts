import { NextResponse } from "next/server"

// Base de datos simulada de avatares con precios dinámicos
const avatarsDatabase = [
  {
    id: "legendary-01",
    name: "Cyber Phoenix",
    nameEs: "Fénix Cibernético",
    tier: "legendary" as const,
    basePrice: 99.99,
    salesCount: 0,
    gradient: "from-amber-500 via-orange-500 to-red-600",
    glowColor: "#fbbf24",
    icon: "🔥",
  },
  {
    id: "legendary-02",
    name: "Quantum Crown",
    nameEs: "Corona Cuántica",
    tier: "legendary" as const,
    basePrice: 89.99,
    salesCount: 0,
    gradient: "from-yellow-400 via-amber-500 to-orange-600",
    glowColor: "#fcd34d",
    icon: "👑",
  },
  {
    id: "epic-01",
    name: "Neon Dragon",
    nameEs: "Dragón Neón",
    tier: "epic" as const,
    basePrice: 49.99,
    salesCount: 0,
    gradient: "from-purple-500 via-fuchsia-500 to-pink-600",
    glowColor: "#d946ef",
    icon: "🐉",
  },
  {
    id: "epic-02",
    name: "Plasma Wolf",
    nameEs: "Lobo de Plasma",
    tier: "epic" as const,
    basePrice: 44.99,
    salesCount: 0,
    gradient: "from-violet-500 via-purple-500 to-fuchsia-600",
    glowColor: "#a855f7",
    icon: "🐺",
  },
  {
    id: "epic-03",
    name: "Holographic Lion",
    nameEs: "León Holográfico",
    tier: "epic" as const,
    basePrice: 39.99,
    salesCount: 0,
    gradient: "from-pink-500 via-rose-500 to-red-600",
    glowColor: "#ec4899",
    icon: "🦁",
  },
  {
    id: "rare-01",
    name: "Electric Eagle",
    nameEs: "Águila Eléctrica",
    tier: "rare" as const,
    basePrice: 24.99,
    salesCount: 0,
    gradient: "from-cyan-500 via-blue-500 to-indigo-600",
    glowColor: "#06b6d4",
    icon: "🦅",
  },
  {
    id: "rare-02",
    name: "Digital Shark",
    nameEs: "Tiburón Digital",
    tier: "rare" as const,
    basePrice: 19.99,
    salesCount: 0,
    gradient: "from-blue-500 via-cyan-500 to-teal-600",
    glowColor: "#3b82f6",
    icon: "🦈",
  },
  {
    id: "rare-03",
    name: "Laser Tiger",
    nameEs: "Tigre Láser",
    tier: "rare" as const,
    basePrice: 24.99,
    salesCount: 0,
    gradient: "from-orange-500 via-amber-500 to-yellow-600",
    glowColor: "#f97316",
    icon: "🐯",
  },
  {
    id: "rare-04",
    name: "Crystal Butterfly",
    nameEs: "Mariposa de Cristal",
    tier: "rare" as const,
    basePrice: 19.99,
    salesCount: 0,
    gradient: "from-teal-500 via-emerald-500 to-green-600",
    glowColor: "#14b8a6",
    icon: "🦋",
  },
  {
    id: "quantum-nexus",
    name: "Quantum Nexus",
    nameEs: "Nexo Cuántico",
    tier: "legendary" as const,
    basePrice: 149.99,
    salesCount: 0,
    gradient: "from-amber-500 via-orange-500 to-red-600",
    glowColor: "#fbbf24",
    icon: "quantum-nexus",
  },
  {
    id: "cyber-sovereign",
    name: "Cyber Sovereign",
    nameEs: "Soberano Cibernético",
    tier: "legendary" as const,
    basePrice: 139.99,
    salesCount: 0,
    gradient: "from-gray-400 via-slate-300 to-gray-500",
    glowColor: "#cbd5e1",
    icon: "cyber-sovereign",
  },
  {
    id: "hologram-emperor",
    name: "Hologram Emperor",
    nameEs: "Emperador Holográfico",
    tier: "legendary" as const,
    basePrice: 129.99,
    salesCount: 0,
    gradient: "from-yellow-400 via-amber-500 to-orange-600",
    glowColor: "#fcd34d",
    icon: "hologram-emperor",
  },
  {
    id: "plasma-titan",
    name: "Plasma Titan",
    nameEs: "Titán de Plasma",
    tier: "epic" as const,
    basePrice: 79.99,
    salesCount: 0,
    gradient: "from-purple-500 via-fuchsia-500 to-pink-600",
    glowColor: "#d946ef",
    icon: "plasma-titan",
  },
  {
    id: "neon-overlord",
    name: "Neon Overlord",
    nameEs: "Señor del Neón",
    tier: "epic" as const,
    basePrice: 69.99,
    salesCount: 0,
    gradient: "from-violet-500 via-purple-500 to-fuchsia-600",
    glowColor: "#a855f7",
    icon: "neon-overlord",
  },
  {
    id: "chrome-vanguard",
    name: "Chrome Vanguard",
    nameEs: "Vanguardia Cromada",
    tier: "epic" as const,
    basePrice: 74.99,
    salesCount: 0,
    gradient: "from-pink-500 via-rose-500 to-red-600",
    glowColor: "#ec4899",
    icon: "chrome-vanguard",
  },
  {
    id: "fusion-apex",
    name: "Fusion Apex",
    nameEs: "Ápice de Fusión",
    tier: "rare" as const,
    basePrice: 44.99,
    salesCount: 0,
    gradient: "from-cyan-500 via-blue-500 to-indigo-600",
    glowColor: "#06b6d4",
    icon: "fusion-apex",
  },
  {
    id: "volt-prime",
    name: "Volt Prime",
    nameEs: "Volt Primario",
    tier: "rare" as const,
    basePrice: 39.99,
    salesCount: 0,
    gradient: "from-blue-500 via-cyan-500 to-teal-600",
    glowColor: "#3b82f6",
    icon: "volt-prime",
  },
  {
    id: "pulse-guardian",
    name: "Pulse Guardian",
    nameEs: "Guardián del Pulso",
    tier: "rare" as const,
    basePrice: 34.99,
    salesCount: 0,
    gradient: "from-teal-500 via-emerald-500 to-green-600",
    glowColor: "#14b8a6",
    icon: "pulse-guardian",
  },
]

// Calcular precio dinámico basado en ventas
function calculateDynamicPrice(basePrice: number, salesCount: number, tier: string): number {
  let multiplier = 1

  // Diferentes tasas de crecimiento según tier
  switch (tier) {
    case "legendary":
      multiplier = 1 + salesCount * 0.15 // 15% por venta
      break
    case "epic":
      multiplier = 1 + salesCount * 0.1 // 10% por venta
      break
    case "rare":
      multiplier = 1 + salesCount * 0.08 // 8% por venta
      break
  }

  return Math.round(basePrice * multiplier * 100) / 100
}

export async function GET() {
  try {
    // Cargar datos de ventas desde almacenamiento (simulado)
    const salesData = await loadSalesData()

    // Actualizar conteo de ventas y calcular precios dinámicos
    const avatarsWithPrices = avatarsDatabase.map((avatar) => {
      const sales = salesData[avatar.id] || 0
      return {
        ...avatar,
        salesCount: sales,
        currentPrice: calculateDynamicPrice(avatar.basePrice, sales, avatar.tier),
      }
    })

    return NextResponse.json({
      success: true,
      avatars: avatarsWithPrices,
    })
  } catch (error) {
    console.error("[v0] Error en /api/avatars/list:", error)
    return NextResponse.json({ success: false, error: "Failed to load avatars" }, { status: 500 })
  }
}

// Función simulada para cargar datos de ventas
async function loadSalesData(): Promise<Record<string, number>> {
  // En producción, esto vendría de una base de datos
  // Por ahora, simulamos algunos datos
  return {
    "legendary-01": 3,
    "legendary-02": 5,
    "epic-01": 12,
    "epic-02": 8,
    "epic-03": 15,
    "rare-01": 25,
    "rare-02": 30,
    "rare-03": 20,
    "rare-04": 35,
    "quantum-nexus": 2,
    "cyber-sovereign": 4,
    "hologram-emperor": 6,
    "plasma-titan": 10,
    "neon-overlord": 15,
    "chrome-vanguard": 8,
    "fusion-apex": 22,
    "volt-prime": 28,
    "pulse-guardian": 35,
  }
}
