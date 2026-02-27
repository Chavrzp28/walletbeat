import { type NextRequest, NextResponse } from "next/server"

let verifyCloudProof: any
let IVerifyResponse: any

const getVerifyFunction = async () => {
  if (!verifyCloudProof) {
    try {
      const module = await import("@worldcoin/idkit-core")
      verifyCloudProof = module.verifyCloudProof
      IVerifyResponse = module.IVerifyResponse
    } catch (error) {
      console.error("[v0] Failed to load @worldcoin/idkit-core:", error)
      throw new Error("World ID verification module not available")
    }
  }
  return verifyCloudProof
}

export async function POST(request: NextRequest) {
  try {
    const { proof, referralCode } = await request.json()

    console.log("[v0] Verificando prueba de World ID...")

    const app_id = process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID as `app_${string}`
    const action = process.env.NEXT_PUBLIC_WORLDCOIN_ACTION || "verify-human"

    if (!app_id || app_id === "app_staging_0000000000000000") {
      console.error("[v0] World ID app_id not configured")
      return NextResponse.json(
        { success: false, error: "World ID not configured. Please set NEXT_PUBLIC_WORLDCOIN_APP_ID" },
        { status: 500 }
      )
    }

    const verifyFn = await getVerifyFunction()
    const verifyRes = await verifyFn(proof, app_id, action)

    if (verifyRes.success) {
      console.log("[v0] Verificación exitosa:", verifyRes)

      // Aquí conectarías con tu base de datos para registrar la verificación
      // y asociarla con el código de referencia para rastrear tus ganancias

      // Ejemplo de lo que guardarías:
      const verificationData = {
        nullifier_hash: proof.nullifier_hash,
        merkle_root: proof.merkle_root,
        proof: proof.proof,
        verification_level: proof.verification_level,
        referralCode: referralCode || null,
        timestamp: new Date().toISOString(),
      }

      console.log("[v0] Datos a guardar:", verificationData)

      // TODO: Guardar en base de datos
      // await db.insert(verifications).values(verificationData)

      return NextResponse.json({
        success: true,
        verified: true,
        nullifier_hash: proof.nullifier_hash,
      })
    } else {
      console.error("[v0] Verificación fallida:", verifyRes)
      return NextResponse.json({ success: false, error: "Verification failed" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Error en verificación:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}
