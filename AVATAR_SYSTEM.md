# Sistema de Avatares Premium id_XmutH™

## Descripción General

Sistema exclusivo de marketplace de avatares NFT con precios dinámicos para la plataforma de verificación World ID. Los avatares son únicos, futuristas y premium, diseñados específicamente para usuarios verificados.

## Características Principales

### 1. Precios Dinámicos
Los precios de los avatares aumentan automáticamente basándose en su popularidad:

- **Legendary**: +15% por cada venta
- **Epic**: +10% por cada venta  
- **Rare**: +8% por cada venta

**Ejemplo**: Un avatar Legendary que comienza en $99.99 aumentará a $114.99 después de la primera venta, luego a $132.24, y así sucesivamente.

### 2. Sistema de Niveles

#### Legendary (Legendario)
- Precio base: $89.99 - $99.99
- Gradientes: Dorado, ámbar, naranja
- Efectos: Brillo dorado intenso, animaciones épicas
- Ejemplos: Cyber Phoenix, Quantum Crown

#### Epic (Épico)
- Precio base: $39.99 - $49.99
- Gradientes: Púrpura, fucsia, rosa
- Efectos: Brillo púrpura, animaciones dinámicas
- Ejemplos: Neon Dragon, Plasma Wolf, Holographic Lion

#### Rare (Raro)
- Precio base: $19.99 - $24.99
- Gradientes: Cian, azul, índigo
- Efectos: Brillo eléctrico, animaciones suaves
- Ejemplos: Electric Eagle, Digital Shark, Laser Tiger, Crystal Butterfly

### 3. Modelo de Negocio para Propietarios

Cada venta de avatar genera ingresos para el propietario de la plataforma:

- **Comisión estándar**: 30% de cada venta
- **Ejemplo**: Venta de $50 = $15 para el propietario
- **Dashboard**: Estadísticas en tiempo real de ventas y ganancias

### 4. Requisitos de Acceso

- **Verificación obligatoria**: Solo usuarios verificados con World ID pueden comprar
- **Exclusividad**: Colección limitada con marca registrada id_XmutH™
- **Propiedad**: Los usuarios que compran un avatar lo poseen exclusivamente

### 5. Diseño Futurista

Características visuales únicas:

- Gradientes metálicos vibrantes con colores fluorescentes
- Animaciones de flotación y pulso de brillo
- Efectos de sombra neón
- Marca de agua id_XmutH™ en cada avatar
- Badges de nivel (Legendary, Epic, Rare)

### 6. Sistema de Tracking

El sistema registra automáticamente:

- Número total de ventas por avatar
- Precio actual vs precio base
- Porcentaje de incremento
- Ingresos generados para el propietario
- Avatares más populares (trending)

## Integración API

### GET /api/avatars/list
Obtiene la lista completa de avatares con precios actualizados.

**Respuesta**:
\`\`\`json
{
  "success": true,
  "avatars": [
    {
      "id": "legendary-01",
      "name": "Cyber Phoenix",
      "nameEs": "Fénix Cibernético",
      "tier": "legendary",
      "basePrice": 99.99,
      "currentPrice": 132.24,
      "salesCount": 3,
      "gradient": "from-amber-500 via-orange-500 to-red-600",
      "glowColor": "#fbbf24",
      "icon": "🔥"
    }
  ]
}
\`\`\`

### POST /api/avatars/purchase
Procesa la compra de un avatar.

**Request**:
\`\`\`json
{
  "avatarId": "legendary-01",
  "price": 132.24
}
\`\`\`

**Respuesta**:
\`\`\`json
{
  "success": true,
  "avatarId": "legendary-01",
  "paidPrice": 132.24,
  "ownerEarnings": 39.67,
  "message": "Avatar purchased successfully"
}
\`\`\`

## Estadísticas del Propietario

Accede al dashboard con: `?ref=owner-dashboard-2025`

Métricas disponibles:
- Total de avatares vendidos
- Ingresos totales por avatares
- Avatar más vendido
- Tendencias de ventas
- Ingresos combinados (verificaciones + avatares)

## Marca Registrada

**id_XmutH™** es la marca exclusiva de esta colección de avatares premium. Todos los avatares incluyen:

- Marca de agua visible en la imagen
- Badge en metadatos
- Certificado de autenticidad
- Exclusividad garantizada

## Roadmap Futuro

- [ ] Avatares animados en 3D
- [ ] Sistema de rareza ultra (Mythic tier)
- [ ] Marketplace secundario para reventa
- [ ] Personalización de avatares
- [ ] Integración con NFT en blockchain
- [ ] Sistema de avatares de edición limitada temporal
