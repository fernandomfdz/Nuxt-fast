---
title: Guía Completa para Empezar con NuxtFast
description: Aprende a configurar y usar NuxtFast desde cero. Una guía paso a paso para desarrolladores que quieren crear aplicaciones web modernas rápidamente.
publishedAt: 2024-01-15
categories:
  - slug: tutorial
  - slug: nuxt
author:
  slug: marc
  name: Marc Lou
  job: Maker of ByeDispute
  description: Marc is a developer and an entrepreneur. He's built 20 startups in the last 3 years.
  avatar: https://picsum.photos/100/100?random=1
  socials:
    - name: Twitter
      icon: simple-icons:twitter
      url: https://twitter.com/marc_louvion
image:
  src: https://picsum.photos/800/400?random=3
  urlRelative: https://picsum.photos/800/400?random=3
  alt: NuxtFast getting started guide
---

¡Bienvenido a NuxtFast! En esta guía te enseñaremos todo lo que necesitas saber para empezar a desarrollar aplicaciones web modernas con nuestro stack optimizado.

## ¿Qué es NuxtFast?

NuxtFast es un boilerplate completo basado en **Nuxt 3** que incluye todas las herramientas y configuraciones necesarias para crear aplicaciones web profesionales en tiempo récord.

### Características Principales

- ⚡ **Nuxt 3** - Framework Vue.js de última generación
- 🎨 **Tailwind CSS + DaisyUI** - Diseño moderno y responsive
- 🔐 **Autenticación** - Sistema completo con múltiples proveedores
- 💾 **Base de Datos** - Integración con MongoDB y Supabase
- 💳 **Pagos** - Stripe integrado y listo para usar
- 📧 **Emails** - Sistema de notificaciones automáticas
- 🚀 **SEO Optimizado** - Meta tags y sitemap automático

## Instalación Rápida

### Prerrequisitos

Antes de empezar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm**, **yarn** o **pnpm**
- **Git**

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/nuxt-fast.git
cd nuxt-fast
```

### Paso 2: Instalar Dependencias

```bash
# Con npm
npm install

# Con yarn
yarn install

# Con pnpm
pnpm install
```

### Paso 3: Configurar Variables de Entorno

Copia el archivo de ejemplo y configura tus variables:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
# Base de datos
MONGODB_URI=tu_mongodb_uri

# Autenticación
AUTH_SECRET=tu_secret_super_seguro
AUTH_ORIGIN=http://localhost:3000/api/auth
GOOGLE_ID=tu_google_client_id
GOOGLE_SECRET=tu_google_client_secret

# Stripe (opcional)
STRIPE_SECRET_KEY=tu_stripe_secret_key
STRIPE_WEBHOOK_SECRET=tu_webhook_secret

# Email (opcional)
RESEND_API_KEY=tu_resend_api_key
```

### Paso 4: Ejecutar en Desarrollo

```bash
npm run dev
```

¡Tu aplicación estará disponible en `http://localhost:3000`!

## Configuración Inicial

### Autenticación

NuxtFast viene con autenticación preconfigurada usando `@sidebase/nuxt-auth`. Para configurar Google OAuth:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+
4. Crea credenciales OAuth 2.0
5. Agrega `http://localhost:3000/api/auth/callback/google` como URI de redirección

### Base de Datos

#### Opción 1: MongoDB Atlas (Recomendado)

1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crea un cluster gratuito
3. Configura un usuario de base de datos
4. Obtén tu connection string
5. Agrégalo a tu `.env` como `MONGODB_URI`

#### Opción 2: Supabase

1. Crea una cuenta en [Supabase](https://supabase.com)
2. Crea un nuevo proyecto
3. Obtén tu URL y API key
4. Configura las variables en tu `.env`

### Pagos con Stripe

Para habilitar pagos:

1. Crea una cuenta en [Stripe](https://stripe.com)
2. Obtén tus API keys del dashboard
3. Configura los webhooks para eventos de pago
4. Agrega las variables a tu `.env`

## Estructura del Proyecto

```
nuxt-fast/
├── components/          # Componentes Vue reutilizables
├── composables/         # Lógica reutilizable
├── content/            # Contenido del blog (Nuxt Content)
├── layouts/            # Layouts de página
├── middleware/         # Middleware de rutas
├── pages/              # Páginas de la aplicación
├── plugins/            # Plugins de Nuxt
├── server/             # API routes y utilidades del servidor
├── types/              # Definiciones de TypeScript
└── utils/              # Utilidades generales
```

## Primeros Pasos

### 1. Personalizar el Diseño

Edita `app.vue` y los componentes en `components/` para personalizar el diseño según tu marca.

### 2. Configurar Páginas

Las páginas se crean automáticamente basándose en los archivos en `pages/`. Crea `pages/about.vue` para una página "Acerca de".

### 3. Agregar Contenido al Blog

Crea archivos `.md` en `content/blog/` para agregar artículos a tu blog.

### 4. Configurar SEO

Usa `useSeoMeta()` en tus páginas para optimizar el SEO:

```vue
<script setup>
useSeoMeta({
  title: 'Mi Página',
  description: 'Descripción de mi página',
  ogImage: '/images/og-image.jpg'
})
</script>
```

## Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Netlify

1. Conecta tu repositorio a Netlify
2. Configura el comando de build: `npm run build`
3. Configura las variables de entorno

### VPS/Servidor Propio

```bash
# Build para producción
npm run build

# Ejecutar en producción
npm run start
```

## Próximos Pasos

Ahora que tienes NuxtFast funcionando, puedes:

- 📚 Explorar la [documentación completa](/docs)
- 🎨 Personalizar el diseño con Tailwind CSS
- 🔌 Integrar APIs externas
- 📱 Hacer tu app PWA
- 🚀 Optimizar para producción

## Soporte

¿Necesitas ayuda? Únete a nuestra comunidad:

- 💬 [Discord](https://discord.gg/nuxtfast)
- 📧 [Email de soporte](mailto:support@nuxtfast.com)
- 📖 [Documentación](https://docs.nuxtfast.com)

---

*¡Felicidades! Ya tienes todo listo para crear aplicaciones increíbles con NuxtFast. 🚀* 