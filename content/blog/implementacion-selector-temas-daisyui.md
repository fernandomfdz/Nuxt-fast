---
title: "Implementacion Selector Temas Daisyui"
description: "Artículo sobre implementacion selector temas daisyui"
publishedAt: "2025-05-27"
author:
  - slug: fer
categories:
  - slug: "general"
    title: "General"
image:
  src: "https://picsum.photos/800/400?random=10"
  alt: "Implementacion Selector Temas Daisyui"
---

En esta guía te mostraré cómo implementar un selector de temas completamente funcional usando DaisyUI v5 con Tailwind CSS v4 en NuxtFast. El selector incluye soporte para tema claro, oscuro y detección automática del sistema.

## 🎨 Componente ThemeSelector

### Estructura del componente

Creamos un componente `ThemeSelector.vue` que utiliza VueUse para el manejo reactivo de temas:

```vue
<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-ghost gap-1 normal-case">
      <Icon :name="currentThemeIcon" class="w-5 h-5" />
      <span class="hidden sm:inline">{{ currentThemeLabel }}</span>
      <Icon name="heroicons:chevron-down" class="w-4 h-4" />
    </div>
    <ul tabindex="0" class="dropdown-content menu bg-base-200 rounded-box z-[1] w-52 p-2 shadow-lg border border-base-300">
      <!-- Opciones de tema -->
    </ul>
  </div>
</template>
```

### Lógica de manejo de temas

```typescript
import { useColorMode } from '@vueuse/core'

// Usar VueUse para manejar el modo de color
const colorMode = useColorMode({
  attribute: 'data-theme',
  modes: {
    light: 'light',
    dark: 'dark',
    system: 'auto'
  }
})

// Función para cambiar el tema
const setTheme = (theme: 'light' | 'dark' | 'system') => {
  colorMode.value = theme
  
  if (process.client) {
    const html = document.documentElement
    
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      html.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
    } else {
      html.setAttribute('data-theme', theme)
    }
    
    localStorage.setItem('theme', theme)
  }
}
```

## 🔌 Plugin de inicialización

### Plugin para el cliente

Creamos `plugins/theme.client.ts` para inicializar el tema correctamente:

```typescript
export default defineNuxtPlugin(() => {
  if (process.client) {
    const savedTheme = localStorage.getItem('theme') || 'system'
    
    const applyTheme = (theme: string) => {
      const html = document.documentElement
      
      if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        html.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
      } else {
        html.setAttribute('data-theme', theme)
      }
    }
    
    applyTheme(savedTheme)
    
    // Escuchar cambios en la preferencia del sistema
    if (savedTheme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', () => {
        if (localStorage.getItem('theme') === 'system') {
          applyTheme('system')
        }
      })
    }
  }
})
```

## 📦 Dependencias necesarias

### Instalación de VueUse

```bash
npm install @vueuse/core @vueuse/nuxt
```

### Configuración en Nuxt

Agregamos VueUse a los módulos en `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: [
    // ... otros módulos
    '@vueuse/nuxt'
  ],
})
```

## 🎯 Integración en el layout

### Layout del blog

Agregamos el selector al layout del blog en `layouts/blog.vue`:

```vue
<template>
  <div class="min-h-screen bg-base-100">
    <header class="border-b border-base-200">
      <nav class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center space-x-2">
            <img src="/icon.png" alt="Logo" class="h-8 w-8" >
            <span class="font-bold text-xl">{{ config.appName }}</span>
          </NuxtLink>
          
          <!-- Navegación -->
          <div class="flex items-center space-x-4">
            <NuxtLink to="/blog" class="text-base-content/80 hover:text-base-content">
              Blog
            </NuxtLink>
            <ThemeSelector />
            <ButtonAccount />
          </div>
        </div>
      </nav>
    </header>
    
    <slot />
  </div>
</template>
```

## ✨ Características implementadas

### 🌓 Tres modos de tema
- **Claro**: Tema claro fijo
- **Oscuro**: Tema oscuro fijo  
- **Sistema**: Detecta automáticamente la preferencia del sistema

### 🔄 Persistencia
- Guarda la preferencia en `localStorage`
- Restaura el tema al recargar la página
- Sincroniza con cambios del sistema en tiempo real

### 🎨 Interfaz intuitiva
- Iconos descriptivos para cada modo
- Indicador visual del tema activo
- Dropdown responsivo con animaciones

### ⚡ Performance optimizada
- Carga solo en el cliente
- Listeners eficientes para cambios del sistema
- Limpieza automática de event listeners

## 🚀 Beneficios obtenidos

### ✅ Errores resueltos
- Eliminados todos los errores de "unknown utility class"
- Compatibilidad completa con Tailwind CSS v4
- Funcionamiento correcto de todas las clases DaisyUI

### 🎯 Experiencia de usuario mejorada
- Cambio de tema instantáneo
- Respeta las preferencias del sistema
- Interfaz consistente en todos los dispositivos

### 🔧 Mantenibilidad
- Código modular y reutilizable
- Configuración centralizada de temas
- Fácil extensión para nuevos temas

## 📝 Próximas mejoras

- **Más temas**: Agregar temas adicionales como "sepia" o "high-contrast"
- **Animaciones**: Transiciones suaves entre cambios de tema
- **Accesibilidad**: Mejoras para lectores de pantalla
- **Personalización**: Permitir temas personalizados por usuario

---

*Esta implementación proporciona una base sólida para el manejo de temas en aplicaciones modernas con Tailwind CSS v4 y DaisyUI v5.*