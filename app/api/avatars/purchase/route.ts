import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { avatarId, price } = body

    console.log("[v0] Compra de avatar:", { avatarId, price })

    // Validar que el usuario esté verificado
    // En producción, verificar el token JWT o sesión

    // Registrar la venta
    await recordSale(avatarId, price)

    // Calcular comisión para el propietario (ejemplo: 30%)
    const ownerCommission = price * 0.3
    await recordOwnerEarnings(ownerCommission)

    return NextResponse.json({
      success: true,
      avatarId,
      paidPrice: price,
      ownerEarnings: ownerCommission,
      message: "Avatar purchased successfully",
    })
  } catch (error) {
    console.error("[v0] Error en /api/avatars/purchase:", error)
    return NextResponse.json({ success: false, error: "Purchase failed" }, { status: 500 })
  }
}

// Función para registrar la venta
async function recordSale(avatarId: string, price: number) {
  // En producción, guardar en base de datos
  console.log("[v0] Venta registrada:", { avatarId, price, timestamp: new Date().toISOString() })
}

// Función para registrar ganancias del propietario
async function recordOwnerEarnings(amount: number) {
  // En producción, actualizar balance del propietario en base de datos
  console.log("[v0] Ganancias del propietario:", { amount, timestamp: new Date().toISOString() })
}
