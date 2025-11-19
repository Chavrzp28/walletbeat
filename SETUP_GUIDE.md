# Guía de Configuración - World ID Verification Platform

Esta aplicación te permite ayudar a usuarios a verificarse con World ID y ganar ingresos por cada verificación exitosa.

## Configuración Inicial

### 1. Obtener Credenciales de World ID

1. **Crear cuenta en World ID Developer Portal**
   - Ve a: https://developer.worldcoin.org/
   - Crea una cuenta o inicia sesión

2. **Crear una nueva aplicación**
   - En el Developer Portal, haz clic en "New Application"
   - Dale un nombre descriptivo (ej: "Mi Plataforma de Verificación")
   - Copia el **App ID** que se genera

3. **Crear una Action**
   - Dentro de tu aplicación, ve a la sección "Actions"
   - Crea una nueva Action con el nombre: `verify-for-benefits`
   - Guarda el nombre exacto de la Action

### 2. Configurar Variables de Entorno en v0

En la interfaz de v0, sigue estos pasos:

1. **Abrir el panel de Variables**
   - Haz clic en el icono de menú (☰) en la barra lateral izquierda
   - Selecciona "Vars" (Variables de entorno)

2. **Agregar las variables**
   - Haz clic en "+ Add Variable"
   - Agrega estas dos variables con los valores de tu Developer Portal:

   \`\`\`
   Variable 1:
   Nombre: NEXT_PUBLIC_WORLDCOIN_APP_ID
   Valor: [Tu App ID del Developer Portal]
   
   Variable 2:
   Nombre: NEXT_PUBLIC_WORLDCOIN_ACTION
   Valor: verify-for-benefits
   \`\`\`

3. **Guardar cambios**
   - Haz clic en "Save" para aplicar los cambios
   - La aplicación se recargará automáticamente con las nuevas configuraciones

### 3. Probar la Aplicación

Una vez configuradas las variables de entorno:

1. **Modo de usuario normal**
   - Visita tu aplicación
   - El banner de configuración mostrará que todo está listo
   - Prueba el botón "Verify with World ID"

2. **Panel de propietario (Dashboard)**
   - Agrega `?ref=owner-dashboard-2025` a tu URL
   - Ejemplo: `https://tu-app.vercel.app?ref=owner-dashboard-2025`
   - Verás estadísticas de verificaciones y ganancias estimadas

3. **Compartir tu link de referencia**
   - Crea tu código único de referencia
   - Ejemplo: `https://tu-app.vercel.app?ref=micodigo123`
   - Comparte este link para rastrear tus referidos

## Modelo de Negocio

### Cómo Generas Ingresos

1. **Verificaciones directas**: Cobras una tarifa por cada usuario que verificas
2. **Programas de afiliados**: Partners de Worldcoin pueden pagar comisiones
3. **Servicios premium**: Ofrece verificación express o soporte personalizado

### Métricas en el Dashboard

- **Total Verifications**: Número total de usuarios verificados
- **Estimated Revenue**: Ingresos estimados basados en tu modelo
- **Conversion Rate**: Porcentaje de visitantes que completan verificación
- **Average Per User**: Ganancia promedio por verificación

## Características de la App

### Para Usuarios

- ✅ Interfaz bilingüe (Español/Inglés)
- ✅ Verificación segura con World ID
- ✅ Acceso inmediato a beneficios de Worldcoin
- ✅ Sistema de tracking de referidos
- ✅ Diseño responsive y moderno

### Para el Propietario

- ✅ Dashboard con métricas en tiempo real
- ✅ Sistema de tracking de códigos de referencia
- ✅ Estimación de ingresos
- ✅ Analytics de conversión

## Seguridad y Privacidad

- Las verificaciones usan criptografía de conocimiento cero
- No almacenamos datos personales de los usuarios
- Cada verificación es única y no se puede duplicar
- Compatible con GDPR y regulaciones de privacidad

## Soporte

Si tienes problemas:

1. Verifica que las variables de entorno estén correctamente configuradas
2. Revisa la consola del navegador para errores
3. Consulta la documentación oficial: https://docs.world.org/world-id
4. Abre un ticket en: https://vercel.com/help

## Próximos Pasos

1. ✅ Configurar variables de entorno
2. ✅ Probar verificación de prueba
3. ⬜ Personalizar textos y branding
4. ⬜ Configurar tu modelo de precios
5. ⬜ Promocionar tu plataforma
6. ⬜ Monitorear conversiones en el dashboard

---

**Nota**: Esta plataforma no está afiliada con Worldcoin Foundation. Es una herramienta independiente para facilitar verificaciones de World ID.
