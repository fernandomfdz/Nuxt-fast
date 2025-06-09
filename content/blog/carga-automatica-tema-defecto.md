---
title: "Carga Automática del Tema por Defecto"
description: "Implementación de carga automática del tema configurado en config.ts desde el inicio de la aplicación, sin necesidad de selector visible."
publishedAt: "2024-01-20"
author:
  - slug: fer
    avatar: "/avatars/team.jpg"
categories:
  - slug: "mejoras"
    title: "Mejoras"
  - slug: "configuracion"
    title: "Configuración"
image:
  src: "https://picsum.photos/800/400?random=18"
  alt: "Carga automática de tema por defecto"
---

# Carga Automática del Tema por Defecto

Hemos implementado un sistema que **carga automáticamente el tema por defecto** configurado en `config.ts` desde el inicio de la aplicación, incluso cuando el selector de temas está desactivado.

## 🎯 Funcionalidad Implementada

### Carga Automática desde app.vue
El componente raíz `app.vue` ahora lee la configuración de temas y aplica automáticamente:
- **Tema por defecto configurado** en `config.themes.defaultTheme`
- **Fallback al tema legacy** de `config.colors.theme` 
- **Fallback final** a "light" si no hay configuración

### Respeto a Preferencias del Usuario
El sistema es inteligente y:
- **Prioriza la elección del usuario** si ya eligió un tema previamente
- **Aplica el tema por defecto** solo para usuarios nuevos
- **Mantiene la persistencia** entre sesiones

## 🔧 Implementación Técnica

### Flujo de Decisión
1. **Verificar localStorage**: ¿Hay tema guardado del usuario?
2. **Si NO hay tema guardado**: Usar `config.themes.defaultTheme`
3. **Si SÍ hay tema guardado**: Respetar la elección del usuario
4. **Aplicar al DOM**: Establecer `data-theme` en el HTML
5. **Guardar en localStorage**: Para futuras visitas

## 🎨 Casos de Uso

### Aplicación con Tema Fijo
```typescript
themes: {
  showThemeSelector: false,
  defaultTheme: "cyberpunk"
}
```
**Resultado**: Todos los usuarios nuevos ven automáticamente el tema cyberpunk, sin selector visible.

### Aplicación con Tema Corporativo
```typescript
themes: {
  showThemeSelector: false,
  defaultTheme: "business"
}
```
**Resultado**: Experiencia consistente con tema corporativo para toda la organización.

## 🚀 Beneficios

### Para la Experiencia de Usuario
- **Carga inmediata**: No hay flash de tema incorrecto
- **Consistencia visual**: Todos los usuarios nuevos ven el mismo tema
- **Respeto a preferencias**: Mantiene las elecciones del usuario
- **Sin configuración manual**: Funciona automáticamente

### Para Desarrolladores
- **Configuración simple**: Un solo valor en config.ts
- **Fallbacks robustos**: Múltiples niveles de respaldo
- **Compatibilidad**: Funciona con el sistema legacy de temas
- **Mantenimiento**: Sin código adicional necesario

Este sistema garantiza que tu aplicación siempre tenga una apariencia consistente desde el primer momento, respetando tanto la configuración global como las preferencias individuales de los usuarios. 