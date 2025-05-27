# NuxtFast 🚀

El boilerplate de NuxtJS con todo lo que necesitas para construir tu SaaS, herramienta AI o cualquier otra aplicación web. De idea a producción en 5 minutos.

## ✨ Características Principales

- 🎨 **UI Moderna**: Componentes con Tailwind CSS y DaisyUI
- 🔐 **Autenticación**: Magic links y OAuth con NextAuth
- 💳 **Pagos**: Integración completa con Stripe
- 📧 **Emails**: Sistema de emails transaccionales con Resend
- 📱 **Responsive**: Diseño mobile-first
- 🌙 **Modo Oscuro**: Soporte automático
- 📊 **SEO Optimizado**: Meta tags y sitemap automático
- 🚀 **Performance**: Optimizado para Core Web Vitals

##  Sistema de Módulos (Opcional)

NuxtFast incluye un **sistema de módulos centralizados** que te permite activar funcionalidades con una sola línea de código en `config.ts`. **¡La configuración de módulos es completamente opcional!**

### Sin Módulos (Aplicación Básica)
```typescript
// config.ts - Configuración mínima
export const config = {
  appName: "Mi App",
  appDescription: "Una aplicación simple",
  // ¡No necesitas la sección modules!
}
```

### 📝 Blog
```typescript
modules: {
  blog: true  // ¡Así de simple!
}
```

### ⚙️ Panel de Administración
```typescript
modules: {
  admin: {
    enabled: true,
    showInNavigation: true
  }
}
```

### 🔐 Autenticación Avanzada
```typescript
modules: {
  authentication: {
    enabled: true,
    showInNavigation: true
  }
}
```

### 👥 Gestión de Usuarios
```typescript
modules: {
  userManagement: {
    enabled: true,
    requireAdmin: true
  }
}
```

## 🚀 Inicio Rápido

1. **Clona el repositorio**
```bash
git clone https://github.com/tu-usuario/nuxtfast.git
cd nuxtfast
```

2. **Instala dependencias**
```bash
npm install
```

3. **Configura tu aplicación**
Edita `config.ts` para personalizar tu app:
```typescript
export const config = {
  appName: "Tu SaaS",
  appDescription: "Descripción de tu aplicación",
  
  // Activa los módulos que necesites (OPCIONAL)
  modules: {
    blog: true,
    admin: { enabled: true, showInNavigation: true }
  }
  
  // O simplemente omite la sección modules para una app básica
}
```

4. **Configura variables de entorno**
```bash
cp .env.example .env.local
```

5. **Ejecuta en desarrollo**
```bash
npm run dev
```

## 🛠️ CLI de NuxtFast

Añade módulos a tu proyecto con un solo comando:

```bash
# Añadir módulo de blog (o crear nuevo artículo si ya está instalado)
npx nuxtfast add blog

# Próximamente
npx nuxtfast add admin
npx nuxtfast add auth
```

### 🎯 Comportamiento Inteligente

El CLI detecta automáticamente el estado de tu proyecto:

#### 📦 Si el blog NO está instalado:
- ✅ Actualiza automáticamente `config.ts`
- ✅ Crea estructura de carpetas necesaria
- ✅ Inicializa archivos de configuración
- ✅ Opción de contenido de prueba
- ✅ No sobrescribe datos existentes

#### ✍️ Si el blog YA está instalado:
- 📝 **Crea un nuevo artículo interactivamente**
- 🎯 Solicita título y descripción
- 👥 Selecciona autor desde `authors.json`
- 🏷️ Elige categoría desde `categories.json`
- 🔗 Genera slug automáticamente
- 📄 Crea plantilla completa lista para editar

### 📝 Flujo de Creación de Artículos

```bash
npx nuxtfast add blog

# Si el blog ya existe:
✅ El módulo blog ya está instalado en tu proyecto
📝 ¿Te gustaría crear un nuevo artículo?

¿Quieres crear un nuevo artículo? (s/n): s

📰 Título del artículo: Mi Nuevo Tutorial
📄 Descripción breve: Aprende a usar esta funcionalidad

👥 Autores disponibles:
   1. Equipo NuxtFast
   2. Juan Pérez
✍️  Selecciona el autor (1-2): 1

🏷️  Categorías disponibles:
   1. Tutorial
   2. Desarrollo
🏷️  Selecciona la categoría (1-2): 1

✅ ¡Artículo creado exitosamente!
📁 Archivo: content/blog/mi-nuevo-tutorial.md
🌐 URL: /blog/mi-nuevo-tutorial
```

### 🛡️ Características de Seguridad
- ✅ **JavaScript nativo** (sin compilación necesaria)
- ✅ Previene duplicados de archivos
- ✅ Valida entradas del usuario
- ✅ Maneja archivos JSON corruptos
- ✅ Proporciona valores por defecto

[Ver documentación completa del CLI →](./content/blog/cli-nuxtfast.md)
[Ver guía de creación de artículos →](./content/blog/cli-crear-articulos.md)

## 🛠️ Configuración de Módulos

### Configuración Simple
```typescript
// config.ts
modules: {
  blog: true,           // Activar con configuración por defecto
  admin: false,         // Desactivar
  authentication: true  // Activar con configuración por defecto
}
```

### Configuración Avanzada
```typescript
// config.ts
modules: {
  blog: {
    enabled: true,
    prefix: '/noticias',
    showInNavigation: true,
    showInFooter: true,
    contentDir: 'content/blog'
  },
  admin: {
    enabled: true,
    prefix: '/dashboard',
    showInNavigation: false,
    requireAuth: true
  }
}
```

## 📁 Estructura del Proyecto

```
nuxtfast/
├── components/          # Componentes Vue reutilizables
├── composables/         # Composables de Vue
├── content/            # Contenido para Nuxt Content
├── modules/            # Módulos de NuxtFast
│   ├── blog/          # Módulo de blog
│   ├── admin/         # Módulo de administración
│   └── ...
├── pages/              # Páginas de la aplicación
├── server/             # API del servidor
├── utils/              # Utilidades
├── config.ts           # ⭐ Configuración principal
└── nuxt.config.ts      # Configuración de Nuxt (auto-generada)
```

## 🎯 Casos de Uso

### Startup MVP
```typescript
modules: {
  blog: true  // Solo blog para marketing de contenidos
}
```

### SaaS Completo
```typescript
modules: {
  blog: true,
  admin: { enabled: true, showInNavigation: true },
  authentication: { enabled: true, showInNavigation: true },
  userManagement: { enabled: true, requireAdmin: true }
}
```

### Blog Corporativo
```typescript
modules: {
  blog: {
    enabled: true,
    prefix: '/noticias',
    showInNavigation: true
  }
}
```

## 🛠️ Tecnologías

- **Framework**: Nuxt 3
- **Styling**: Tailwind CSS + DaisyUI
- **Autenticación**: NextAuth.js
- **Base de datos**: MongoDB / Supabase
- **Pagos**: Stripe
- **Emails**: Resend
- **Contenido**: Nuxt Content
- **Deployment**: Vercel / Netlify

## 📚 Documentación

- [Configuración de Módulos](./content/blog/configuracion-centralizada-modulos.md)
- [Módulo de Blog](./modules/blog/README.md)
- [Guía de Desarrollo](./docs/development.md)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

- 📧 Email: support@nuxtfast.com
- 💬 Discord: [Únete a nuestra comunidad](https://discord.gg/nuxtfast)
- 📖 Documentación: [docs.nuxtfast.com](https://docs.nuxtfast.com)

---

Hecho con ❤️ por el equipo de NuxtFast
