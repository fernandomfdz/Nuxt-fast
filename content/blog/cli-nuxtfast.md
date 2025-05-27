---
title: "Cli Nuxtfast"
description: "Artículo sobre cli nuxtfast"
publishedAt: "2025-05-27"
author:
  - slug: fer
categories:
  - slug: "general"
    title: "General"
image:
  src: "https://picsum.photos/800/400?random=4"
  alt: "Cli Nuxtfast"
---

# CLI de NuxtFast: Añade Módulos en Segundos

¿Cansado de configurar módulos manualmente? El **CLI de NuxtFast** automatiza todo el proceso para que puedas añadir funcionalidades a tu proyecto con un solo comando.

## 🚀 Instalación y Uso

### Comando Principal
```bash
npx nuxtfast add <módulo>
```

### Módulos Disponibles

#### 📝 Blog
Añade un sistema completo de blog con Nuxt Content:

```bash
npx nuxtfast add blog
```

## ✨ ¿Qué Hace el CLI?

Cuando ejecutas `npx nuxtfast add blog`, el CLI realiza automáticamente:

### 1. 📝 Actualiza `config.ts`
- Detecta si ya existe la sección `modules`
- Añade la configuración del blog
- Mantiene la configuración existente intacta

```typescript
// Antes
export const config = {
  appName: "Mi App",
  // ... otras configuraciones
}

// Después
export const config = {
  appName: "Mi App",
  // ... otras configuraciones
  
  modules: {
    blog: true
  }
}
```

### 2. 📁 Verifica Estructura de Carpetas
- Comprueba si existe `content/blog/`
- Si no existe, pregunta si quieres inicializar con contenido de prueba
- Crea la estructura necesaria

### 3. 📋 Inicializa Archivos JSON
- **`content/authors.json`**: Autores por defecto
- **`content/categories.json`**: Categorías predefinidas
- Solo los crea si no existen

### 4. 🎨 Contenido de Prueba (Opcional)
Si eliges inicializar con contenido de prueba, crea:
- Artículo de bienvenida
- Configuración de autores
- Categorías básicas

## 📖 Ejemplo de Uso Completo

```bash
# Ejecutar el comando
npx nuxtfast add blog

# Salida esperada:
🚀 Añadiendo módulo blog a NuxtFast...

📝 Actualizando config.ts...
   ✅ config.ts actualizado

📁 Verificando carpeta content/blog...
   ❓ La carpeta content/blog no existe.
   ¿Quieres que la inicialice con un blog de prueba? (s/n): s
   🎨 Creando blog de prueba...
   ✅ Artículo de ejemplo creado

📋 Verificando archivos JSON necesarios...
   📝 Creando authors.json...
   ✅ authors.json creado con autores por defecto
   📝 Creando categories.json...
   ✅ categories.json creado con categorías por defecto

✅ ¡Módulo blog añadido exitosamente!

🔄 Por favor, reinicia el servidor para que los cambios surtan efecto:
   npm run dev
```

## 🛡️ Características de Seguridad

### No Sobrescribe Datos Existentes
- ✅ Detecta configuración existente
- ✅ Preserva archivos JSON existentes
- ✅ Pregunta antes de crear contenido

### Validaciones Inteligentes
- ✅ Verifica que existe `config.ts`
- ✅ Detecta si el módulo ya está configurado
- ✅ Maneja errores graciosamente

## 📁 Archivos Creados

### `content/authors.json`
```json
[
  {
    "id": "equipo-nuxtfast",
    "name": "Equipo NuxtFast",
    "bio": "El equipo detrás de NuxtFast...",
    "avatar": "/avatars/team.jpg",
    "social": {
      "twitter": "https://twitter.com/nuxtfast",
      "github": "https://github.com/nuxtfast"
    }
  }
]
```

### `content/categories.json`
```json
[
  {
    "id": "tutorial",
    "name": "Tutorial",
    "description": "Guías paso a paso y tutoriales",
    "color": "#3B82F6"
  }
]
```

### `content/blog/bienvenido-a-tu-blog.md`
Artículo de ejemplo con:
- Frontmatter completo
- Contenido de bienvenida
- Guía de primeros pasos

## 🔧 Desarrollo del CLI

### Estructura del Código
```
cli/
├── index.js              # Punto de entrada (JavaScript nativo)
└── commands/
    └── add/
        └── blog.js       # Comando para añadir blog (JavaScript nativo)
```

### Ejecución Directa
```bash
node cli/index.js         # Ejecutar directamente
npx nuxtfast add blog     # Usar como comando global
```

**¡Sin compilación necesaria!** El CLI está escrito en JavaScript nativo, por lo que no necesitas ningún paso de build.

## 🚀 Próximas Funcionalidades

### Más Módulos
```bash
npx nuxtfast add admin           # Panel de administración
npx nuxtfast add auth            # Sistema de autenticación
npx nuxtfast add payments        # Integración de pagos
```

### Comandos Adicionales
```bash
npx nuxtfast remove blog         # Remover módulos
npx nuxtfast list               # Listar módulos disponibles
npx nuxtfast update blog        # Actualizar módulos
```

## 💡 Consejos de Uso

### 1. Ejecuta Desde la Raíz
Asegúrate de ejecutar el comando desde la raíz de tu proyecto NuxtFast.

### 2. Reinicia el Servidor
Después de añadir un módulo, siempre reinicia el servidor de desarrollo.

### 3. Personaliza Después
El CLI crea una configuración básica. Personalízala según tus necesidades.

### 4. Verifica los Cambios
Revisa los archivos creados/modificados antes de hacer commit.

## 🆘 Solución de Problemas

### Error: "No se encontró config.ts"
- Asegúrate de estar en la raíz del proyecto
- Verifica que existe el archivo `config.ts`

### Error: "Módulo ya configurado"
- El CLI detectó que el módulo ya está en `config.ts`
- Esto es normal y no es un error

### Permisos en macOS/Linux
```bash
chmod +x cli/index.js
```

## 🎯 Conclusión

El CLI de NuxtFast elimina la fricción de añadir nuevas funcionalidades a tu proyecto. Con un solo comando, tienes un módulo completamente configurado y listo para usar.

**¿Quieres un blog?** `npx nuxtfast add blog`
**¿Panel de admin?** `npx nuxtfast add admin` (próximamente)

¡Así de simple!

---

*¿Tienes ideas para nuevos comandos del CLI? [Compártelas con nosotros](mailto:support@nuxtfast.com)*