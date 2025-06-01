---
title: "Corrección de Warnings de Autenticación en el Servidor"
description: "Solución a los warnings del sistema de autenticación anterior y creación de utilidades compatibles con Better Auth"
publishedAt: "2025-01-27"
author:
  - slug: fer
    avatar: "/avatars/team.jpg"
categories:
  - slug: "mejoras"
    title: "Mejoras"
  - slug: "autenticacion"
    title: "Autenticación"
image:
  src: "https://picsum.photos/800/400?random=9"
  alt: "Corrección de Warnings de Autenticación en el Servidor"
---

# 🔧 Corrección de Warnings de Autenticación en el Servidor

Hemos identificado y solucionado warnings en el servidor relacionados con el sistema de autenticación anterior. Esta actualización garantiza compatibilidad completa con **Better Auth** sin errores en el servidor.

## 🚨 Problema Identificado

### **Warnings del Sistema Anterior**
```
[WARN] Could not resolve import "#auth" in server/api/stripe/create-portal.post.ts
[WARN] Could not resolve import "#auth" in server/api/stripe/create-checkout.post.ts
[WARN] "#auth" is imported by server files, but could not be resolved
```

### **Causa del Problema**
Los archivos del servidor seguían importando del sistema anterior de autenticación:
```typescript
// ❌ Sistema anterior (causaba warnings)
import { getServerSession } from '#auth'
```

## ✅ Solución Implementada

### **1. Crear Utilidades del Servidor**
Creamos `server/utils/auth.ts` con funciones compatibles:

```typescript
import { auth } from "~/utils/auth"
import type { H3Event } from "h3"
import { toWebRequest } from "h3"

/**
 * Obtiene la sesión del usuario en el servidor usando Better Auth
 * Función compatible con el sistema anterior para evitar breaking changes
 */
export async function getServerSession(event: H3Event) {
  try {
    const request = toWebRequest(event)
    const session = await auth.api.getSession({
      headers: request.headers
    })
    
    if (!session) {
      return null
    }

    // Devolver en formato compatible con el sistema anterior
    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image
      }
    }
  } catch (error) {
    console.error('Error obteniendo sesión del servidor:', error)
    return null
  }
}

/**
 * Middleware para requerir autenticación en el servidor
 */
export async function requireAuth(event: H3Event) {
  const session = await getServerSession(event)
  
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No autorizado'
    })
  }
  
  return session
}
```

### **2. Actualizar Archivos de Stripe**

**Antes:**
```typescript
// ❌ Importación del sistema anterior
import { getServerSession } from '#auth'
```

**Después:**
```typescript
// ✅ Importación del nuevo sistema
import { getServerSession } from '~/server/utils/auth'
```

### **Archivos Actualizados:**
- `server/api/stripe/create-checkout.post.ts`
- `server/api/stripe/create-portal.post.ts`

## 🔄 Compatibilidad Garantizada

### **API Idéntica**
La nueva función `getServerSession` mantiene la misma API:

```typescript
// El código existente sigue funcionando sin cambios
const session = await getServerSession(event)

if (session?.user?.email) {
  // Lógica de usuario autenticado
  const user = await User.findOne({ email: session.user.email })
}
```

### **Formato de Respuesta Compatible**
```typescript
// Estructura de datos idéntica
{
  user: {
    id: string,
    email: string,
    name: string,
    image: string
  }
}
```

## 🚀 Beneficios de la Migración

### **1. Sin Warnings del Servidor**
- ✅ **Imports resueltos** correctamente
- ✅ **Compilación limpia** sin advertencias
- ✅ **Logs del servidor** sin errores

### **2. Better Auth Nativo**
- ✅ **Performance mejorada** con APIs nativas
- ✅ **Compatibilidad futura** garantizada
- ✅ **Funcionalidades avanzadas** disponibles

### **3. Código Mantenible**
- ✅ **Utilidades centralizadas** en `server/utils/auth.ts`
- ✅ **Funciones reutilizables** para otros endpoints
- ✅ **API consistente** en todo el servidor

## 🛠️ Funciones Disponibles

### **getServerSession(event)**
Obtiene la sesión actual del usuario:
```typescript
const session = await getServerSession(event)
if (session) {
  console.log('Usuario:', session.user.email)
}
```

### **requireAuth(event)**
Requiere autenticación o lanza error 401:
```typescript
// Lanza error si el usuario no está autenticado
const session = await requireAuth(event)
// El usuario está garantizado como autenticado aquí
```

## 🔧 Uso en Nuevos Endpoints

### **Ejemplo de Endpoint Protegido**
```typescript
// server/api/protected-endpoint.post.ts
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  // Requiere autenticación automáticamente
  const session = await requireAuth(event)
  
  // Lógica del endpoint...
  return {
    message: `Hola ${session.user.email}!`
  }
})
```

### **Ejemplo de Endpoint Opcional**
```typescript
// server/api/optional-auth.get.ts
import { getServerSession } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  
  if (session) {
    // Usuario autenticado
    return { message: `Bienvenido ${session.user.name}` }
  } else {
    // Usuario anónimo
    return { message: 'Bienvenido usuario anónimo' }
  }
})
```

## 🎯 Resultado Final

### **Servidor Limpio**
- ❌ **0 warnings** relacionados con autenticación
- ✅ **Compilación exitosa** en todos los archivos
- ✅ **Logs limpios** durante el desarrollo

### **Funcionalidad Intacta**
- ✅ **Stripe Checkout** funcionando perfectamente
- ✅ **Portal de Cliente** operativo
- ✅ **Autenticación** en todos los endpoints

### **Preparado para el Futuro**
- ✅ **Better Auth nativo** en todo el servidor
- ✅ **APIs avanzadas** disponibles para usar
- ✅ **Escalabilidad** mejorada

---

*Esta corrección garantiza que el servidor funcione sin warnings y esté completamente migrado a Better Auth, manteniendo compatibilidad total con el código existente.* 