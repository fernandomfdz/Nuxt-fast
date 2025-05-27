---
title: Configuración Completa de NuxtFast con config.ts
description: Aprende a personalizar completamente tu aplicación NuxtFast usando el archivo config.ts. Desde el hero hasta los pagos, todo en un solo lugar.
publishedAt: 2024-01-20
categories:
  - slug: tutorial
  - slug: development
author:
  slug: fer
image:
  src: https://picsum.photos/800/400?random=16
  urlRelative: https://picsum.photos/800/400?random=16
  alt: Configuración de NuxtFast
---

¿Quieres personalizar completamente tu aplicación NuxtFast sin tocar múltiples archivos? El archivo `config.ts` es tu herramienta principal para configurar todo desde un solo lugar. En esta guía te explico cada sección y cómo aprovecharla al máximo.

## 🎯 Introducción al Sistema de Configuración

El archivo `config.ts` es el corazón de la configuración de NuxtFast. Desde aquí puedes personalizar:

- 🏠 **Información básica** - Nombre, descripción, dominio
- 🎨 **Sección Hero** - Título, descripción, CTA
- 🧭 **Navegación** - Enlaces del menú principal
- 💰 **Planes de Stripe** - Precios y características
- 📧 **Configuración de emails** - Remitentes y soporte
- 🎨 **Temas y colores** - Personalización visual
- 🔐 **Autenticación** - URLs y callbacks

## 📋 Estructura Completa del Config

### Configuración Básica

```typescript
export const config = {
  // REQUERIDO: Nombre de tu aplicación
  appName: "NuxtFast",
  
  // REQUERIDO: Descripción corta para SEO
  appDescription: "El boilerplate de NuxtJS con todo lo que necesitas para construir tu SaaS, herramienta AI o cualquier otra aplicación web. De idea a producción en 5 minutos.",
  
  // REQUERIDO: Dominio sin https:// ni slash final
  domainName: "nuxtfa.st",
}
```

**Personalización:**

```typescript
export const config = {
  appName: "MiApp Increíble",
  appDescription: "La mejor aplicación para gestionar tu negocio de forma eficiente y moderna.",
  domainName: "miapp.com",
}
```

## 🎨 Sección Hero

La sección hero es lo primero que ven tus usuarios:

```typescript
hero: {
  title: "Termina tu startup en días, no semanas",
  description: "El boilerplate de NuxtJS con todo lo que necesitas para construir tu SaaS, herramienta AI o cualquier otra aplicación web. De idea a producción en 5 minutos.",
  ctaText: "Obtén",
  ctaTextSuffix: "", // Se concatenará con appName
  productHuntUrl: "https://www.producthunt.com/posts/NuxtFast-2",
  image: {
    src: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2",
    alt: "Product Demo"
  }
}
```

**Ejemplo personalizado:**

```typescript
hero: {
  title: "Revoluciona tu forma de trabajar",
  description: "Nuestra plataforma te ayuda a automatizar tareas repetitivas y aumentar tu productividad hasta un 300%.",
  ctaText: "Comenzar gratis",
  ctaTextSuffix: "ahora",
  productHuntUrl: "https://www.producthunt.com/posts/mi-producto",
  image: {
    src: "/images/hero-dashboard.png",
    alt: "Dashboard de MiApp"
  }
}
```

## 🧭 Configuración de Navegación

Define los enlaces del menú principal:

```typescript
navigation: {
  links: [
    {
      href: '/blog',
      label: 'Blog'
    },
    {
      href: '/#pricing',
      label: 'Precios'
    },
    {
      href: '/#testimonials',
      label: 'Opiniones'
    },
    {
      href: '/#faq',
      label: 'FAQ'
    }
  ],
  mobileMenu: {
    openText: "Abrir menú principal",
    closeText: "Cerrar menú"
  }
}
```

**Navegación personalizada:**

```typescript
navigation: {
  links: [
    {
      href: '/productos',
      label: 'Productos'
    },
    {
      href: '/soluciones',
      label: 'Soluciones'
    },
    {
      href: '/empresa',
      label: 'Empresa'
    },
    {
      href: '/contacto',
      label: 'Contacto'
    },
    {
      href: '/blog',
      label: 'Blog'
    }
  ],
  mobileMenu: {
    openText: "Abrir menú",
    closeText: "Cerrar menú"
  }
}
```

## 💰 Configuración de Stripe

Define tus planes de suscripción:

```typescript
stripe: {
  plans: [
    {
      // ID del precio en Stripe
      priceId: process.env.NODE_ENV === "development" 
        ? "price_1Niyy5AxyNprDp7iZIqEyD2h" 
        : "price_456",
      name: "Starter",
      description: "Perfect for small projects",
      price: 79,
      priceAnchor: 99, // Precio tachado
      features: [
        { name: "NuxtJS boilerplate" },
        { name: "User oauth" },
        { name: "Database" },
        { name: "Emails" }
      ]
    },
    {
      isFeatured: true, // Plan destacado
      priceId: process.env.NODE_ENV === "development" 
        ? "price_1O5KtcAxyNprDp7iftKnrrpw" 
        : "price_456",
      name: "Advanced",
      description: "You need more power",
      price: 99,
      priceAnchor: 149,
      features: [
        { name: "NuxtJS boilerplate" },
        { name: "User oauth" },
        { name: "Database" },
        { name: "Emails" },
        { name: "1 year of updates" },
        { name: "24/7 support" }
      ]
    }
  ]
}
```

**Planes personalizados:**

```typescript
stripe: {
  plans: [
    {
      priceId: process.env.NODE_ENV === "development" 
        ? "price_dev_basic" 
        : "price_prod_basic",
      name: "Básico",
      description: "Ideal para emprendedores",
      price: 29,
      priceAnchor: 49,
      features: [
        { name: "Hasta 1,000 usuarios" },
        { name: "5 GB de almacenamiento" },
        { name: "Soporte por email" },
        { name: "Dashboard básico" }
      ]
    },
    {
      isFeatured: true,
      priceId: process.env.NODE_ENV === "development" 
        ? "price_dev_pro" 
        : "price_prod_pro",
      name: "Profesional",
      description: "Para equipos en crecimiento",
      price: 79,
      priceAnchor: 99,
      features: [
        { name: "Hasta 10,000 usuarios" },
        { name: "50 GB de almacenamiento" },
        { name: "Soporte prioritario" },
        { name: "Analytics avanzados" },
        { name: "API completa" },
        { name: "Integraciones" }
      ]
    },
    {
      priceId: process.env.NODE_ENV === "development" 
        ? "price_dev_enterprise" 
        : "price_prod_enterprise",
      name: "Enterprise",
      description: "Para grandes organizaciones",
      price: 199,
      features: [
        { name: "Usuarios ilimitados" },
        { name: "Almacenamiento ilimitado" },
        { name: "Soporte 24/7" },
        { name: "Manager dedicado" },
        { name: "SLA garantizado" },
        { name: "Personalización completa" }
      ]
    }
  ]
}
```

## 🎨 Sección de Características

Muestra las funcionalidades principales:

```typescript
features: {
  title: "Todo lo que necesitas para lanzar tu startup rápidamente",
  subtitle: "y ser rentable",
  description: "Desde la autenticación hasta los pagos, tenemos todo lo que necesitas",
  items: [
    {
      title: 'Emails',
      description: 'Envía emails transaccionales, configura tu DNS para evitar la carpeta de spam',
      type: 'video', // 'video' o 'image'
      path: 'https://d3m8mk7e1mf7xn.cloudfront.net/app/newsletter.webm',
      format: 'video/webm',
      icon: 'heroicons:at-symbol'
    },
    {
      title: 'Pagos',
      description: 'Crea sesiones de pago, maneja webhooks para actualizar la cuenta del usuario',
      type: 'image',
      path: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2',
      alt: 'Un computador',
      icon: 'heroicons:credit-card'
    },
    {
      title: 'Autenticación',
      description: 'Magic links, Google OAuth, páginas protegidas y llamadas a API',
      icon: 'heroicons:lock-closed'
    },
    {
      title: 'Estilos',
      description: 'Componentes, animaciones, 20+ temas con daisyUI, modo oscuro automático',
      icon: 'heroicons:paint-brush'
    }
  ]
}
```

**Características personalizadas:**

```typescript
features: {
  title: "Potencia tu negocio con herramientas profesionales",
  subtitle: "Todo integrado",
  description: "No pierdas tiempo configurando herramientas separadas",
  items: [
    {
      title: 'CRM Inteligente',
      description: 'Gestiona tus clientes con IA que predice comportamientos y sugiere acciones',
      type: 'image',
      path: '/images/features/crm-dashboard.png',
      alt: 'Dashboard del CRM',
      icon: 'heroicons:users'
    },
    {
      title: 'Automatización',
      description: 'Workflows que se ejecutan automáticamente según reglas que defines',
      type: 'video',
      path: '/videos/automation-demo.mp4',
      format: 'video/mp4',
      icon: 'heroicons:cog-6-tooth'
    },
    {
      title: 'Analytics en Tiempo Real',
      description: 'Métricas actualizadas al segundo para tomar decisiones informadas',
      icon: 'heroicons:chart-bar'
    },
    {
      title: 'Integraciones',
      description: 'Conecta con más de 100 herramientas que ya usas',
      icon: 'heroicons:puzzle-piece'
    }
  ]
}
```

## 💬 Testimonios

Muestra la opinión de tus usuarios:

```typescript
testimonials: {
  title: "Lo que dicen nuestros usuarios",
  subtitle: "Testimonios",
  items: [
    {
      name: "Alex Rivera",
      username: "@alexr",
      body: "Este boilerplate me ahorró semanas de desarrollo. Increíble!",
      img: "https://picsum.photos/100/100?random=1"
    },
    {
      name: "Sarah Chen",
      username: "@sarahc", 
      body: "La mejor inversión que he hecho para mi startup. Todo funciona perfectamente.",
      img: "https://picsum.photos/100/100?random=2"
    },
    {
      name: "Mike Johnson",
      username: "@mikej",
      body: "Documentación excelente y soporte de primera. Muy recomendado.",
      img: "https://picsum.photos/100/100?random=3"
    }
  ]
}
```

**Testimonios reales:**

```typescript
testimonials: {
  title: "Nuestros clientes hablan por nosotros",
  subtitle: "Casos de éxito",
  items: [
    {
      name: "María González",
      username: "CEO, TechStart",
      body: "Aumentamos nuestras ventas un 150% en solo 3 meses usando esta plataforma.",
      img: "/images/testimonials/maria.jpg"
    },
    {
      name: "Carlos Ruiz",
      username: "Director, InnovateCorp",
      body: "La automatización nos ahorró 20 horas semanales. ROI increíble.",
      img: "/images/testimonials/carlos.jpg"
    },
    {
      name: "Ana Martín",
      username: "Fundadora, GrowthLab",
      body: "Soporte excepcional y funcionalidades que realmente necesitábamos.",
      img: "/images/testimonials/ana.jpg"
    }
  ]
}
```

## ❓ Sección FAQ

Responde las preguntas más frecuentes:

```typescript
faq: {
  subtitle: "Preguntas Frecuentes",
  title: "Preguntas Más Comunes",
  items: [
    {
      question: '¿Qué obtengo exactamente?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    },
    {
      question: '¿Puedo obtener un reembolso?',
      answer: 'Sí! Puedes solicitar un reembolso dentro de los 7 días posteriores a tu compra.'
    },
    {
      question: 'Tengo otra pregunta',
      answer: 'Genial, contáctanos por correo electrónico.'
    }
  ]
}
```

**FAQ personalizado:**

```typescript
faq: {
  subtitle: "Resolvemos tus dudas",
  title: "Preguntas Frecuentes",
  items: [
    {
      question: '¿Cómo funciona el período de prueba?',
      answer: 'Tienes 14 días completamente gratis para probar todas las funcionalidades. No necesitas tarjeta de crédito para empezar.'
    },
    {
      question: '¿Puedo cambiar de plan en cualquier momento?',
      answer: 'Absolutamente. Puedes actualizar o degradar tu plan cuando quieras. Los cambios se aplican inmediatamente.'
    },
    {
      question: '¿Qué tipo de soporte ofrecen?',
      answer: 'Ofrecemos soporte por email para todos los planes, chat en vivo para planes Pro y Enterprise, y soporte telefónico para Enterprise.'
    },
    {
      question: '¿Mis datos están seguros?',
      answer: 'Sí, utilizamos encriptación de grado militar y cumplimos con GDPR. Tus datos nunca se comparten con terceros.'
    },
    {
      question: '¿Ofrecen descuentos para startups?',
      answer: 'Sí, tenemos un programa especial para startups con hasta 50% de descuento. Contáctanos para más información.'
    }
  ]
}
```

## 📧 Configuración de Emails

Define los remitentes y emails de soporte:

```typescript
resend: {
  // Email 'From' para magic links
  fromNoReply: `NuxtFast <noreply@resend.shipfa.st>`,
  
  // Email 'From' para otros emails
  fromAdmin: `Marc at NuxtFast <marc@resend.shipfa.st>`,
  
  // Email de soporte (si está vacío, usar Crisp)
  supportEmail: "marc.louvion@gmail.com",
}
```

**Configuración personalizada:**

```typescript
resend: {
  fromNoReply: `MiApp <noreply@miapp.com>`,
  fromAdmin: `Equipo MiApp <hola@miapp.com>`,
  supportEmail: "soporte@miapp.com",
}
```

## 🎨 Colores y Temas

Personaliza la apariencia visual:

```typescript
colors: {
  // Tema de DaisyUI (light, dark, o cualquier tema personalizado)
  theme: "light",
  
  // Color principal de la app (HEX)
  main: "#f37055",
}
```

**Temas disponibles en DaisyUI:**

```typescript
colors: {
  theme: "dark", // Tema oscuro
  main: "#3b82f6", // Azul
}

// O temas personalizados
colors: {
  theme: "corporate", // Tema corporativo
  main: "#1f2937", // Gris oscuro
}

// Otros temas: cupcake, bumblebee, emerald, corporate, synthwave, retro, cyberpunk, valentine, halloween, garden, forest, aqua, lofi, pastel, fantasy, wireframe, black, luxury, dracula, cmyk, autumn, business, acid, lemonade, night, coffee, winter
```

## 🔐 Configuración de Autenticación

Define las URLs de login y callback:

```typescript
auth: {
  // URL para hacer login
  loginUrl: "/api/auth/signin",
  
  // URL de redirección después del login
  callbackUrl: "/dashboard",
}
```

**Configuración personalizada:**

```typescript
auth: {
  loginUrl: "/login",
  callbackUrl: "/app/dashboard",
}
```

## 💬 Configuración de Crisp

Para chat de soporte:

```typescript
crisp: {
  // ID del website en Crisp
  id: "",
  
  // Mostrar solo en rutas específicas
  onlyShowOnRoutes: ["/"] as const,
}
```

**Configuración completa:**

```typescript
crisp: {
  id: "tu-crisp-website-id",
  onlyShowOnRoutes: ["/", "/pricing", "/contact"] as const,
}
```

## 🌐 Configuración de AWS

Para S3 y CloudFront:

```typescript
aws: {
  bucket: "mi-bucket-name",
  bucketUrl: `https://mi-bucket-name.s3.amazonaws.com/`,
  cdn: "https://mi-cdn-id.cloudfront.net/",
}
```

## 🔧 Configuración Avanzada

### Sección CTA (Call to Action)

```typescript
cta: {
  title: "Impulsa tu app, lanza y gana",
  description: "No pierdas tiempo integrando APIs o diseñando una sección de precios...",
  buttonText: "Obtén",
  buttonTextSuffix: "",
  backgroundImage: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2"
}
```

### Sección de Problema

```typescript
problem: {
  title: "¿Cansado de configurar siempre lo mismo?",
  subtitle: "El problema",
  description: "Cada vez que empiezas un proyecto, pierdes tiempo configurando autenticación, pagos, emails...",
  items: [
    "⏱️ Semanas configurando APIs",
    "💸 Costos de desarrollo elevados", 
    "🔧 Mantenimiento complejo",
    "📱 Responsive design desde cero"
  ]
}
```

### Footer

```typescript
footer: {
  links: [
    {
      title: "Producto",
      items: [
        { name: "Características", href: "/#features" },
        { name: "Precios", href: "/#pricing" },
        { name: "FAQ", href: "/#faq" }
      ]
    },
    {
      title: "Recursos",
      items: [
        { name: "Blog", href: "/blog" },
        { name: "Documentación", href: "/docs" },
        { name: "Soporte", href: "/support" }
      ]
    },
    {
      title: "Empresa",
      items: [
        { name: "Sobre nosotros", href: "/about" },
        { name: "Contacto", href: "/contact" },
        { name: "Términos", href: "/tos" },
        { name: "Privacidad", href: "/privacy-policy" }
      ]
    }
  ],
  social: [
    {
      name: "Twitter",
      href: "https://twitter.com/yourcompany",
      icon: "simple-icons:twitter"
    },
    {
      name: "GitHub", 
      href: "https://github.com/yourcompany",
      icon: "simple-icons:github"
    },
    {
      name: "Discord",
      href: "https://discord.gg/yourserver",
      icon: "simple-icons:discord"
    }
  ],
  copyright: `© ${new Date().getFullYear()} NuxtFast. Todos los derechos reservados.`
}
```

## 🎯 Ejemplo de Configuración Completa

Aquí tienes un ejemplo completo para una aplicación de gestión de proyectos:

```typescript
export const config = {
  // Información básica
  appName: "ProjectFlow",
  appDescription: "La plataforma de gestión de proyectos que tu equipo necesita. Organiza, colabora y entrega proyectos exitosos.",
  domainName: "projectflow.app",

  // Hero section
  hero: {
    title: "Gestiona proyectos como un profesional",
    description: "Organiza tu equipo, rastrea el progreso y entrega proyectos a tiempo con nuestra plataforma intuitiva y poderosa.",
    ctaText: "Comenzar gratis",
    ctaTextSuffix: "por 14 días",
    productHuntUrl: "https://www.producthunt.com/posts/projectflow",
    image: {
      src: "/images/hero-dashboard.png",
      alt: "Dashboard de ProjectFlow"
    }
  },

  // Navegación
  navigation: {
    links: [
      { href: '/funcionalidades', label: 'Funcionalidades' },
      { href: '/#pricing', label: 'Precios' },
      { href: '/casos-de-uso', label: 'Casos de Uso' },
      { href: '/blog', label: 'Blog' },
      { href: '/#faq', label: 'FAQ' }
    ],
    mobileMenu: {
      openText: "Abrir menú",
      closeText: "Cerrar menú"
    }
  },

  // Características
  features: {
    title: "Todo lo que necesitas para gestionar proyectos exitosos",
    subtitle: "En una sola plataforma",
    description: "Desde la planificación hasta la entrega, tenemos todas las herramientas que necesitas",
    items: [
      {
        title: 'Gestión de Tareas',
        description: 'Crea, asigna y rastrea tareas con tableros Kanban intuitivos y vistas de calendario',
        type: 'image',
        path: '/images/features/task-management.png',
        alt: 'Gestión de tareas',
        icon: 'heroicons:clipboard-document-list'
      },
      {
        title: 'Colaboración en Tiempo Real',
        description: 'Comenta, comparte archivos y mantén a todo el equipo sincronizado',
        type: 'video',
        path: '/videos/collaboration-demo.mp4',
        format: 'video/mp4',
        icon: 'heroicons:users'
      },
      {
        title: 'Reportes y Analytics',
        description: 'Métricas detalladas sobre productividad, tiempo y progreso del proyecto',
        icon: 'heroicons:chart-bar'
      },
      {
        title: 'Integraciones',
        description: 'Conecta con Slack, GitHub, Google Drive y más de 50 herramientas',
        icon: 'heroicons:puzzle-piece'
      }
    ]
  },

  // Planes de precios
  stripe: {
    plans: [
      {
        priceId: process.env.NODE_ENV === "development" 
          ? "price_dev_starter" 
          : "price_prod_starter",
        name: "Starter",
        description: "Perfecto para equipos pequeños",
        price: 19,
        priceAnchor: 29,
        features: [
          { name: "Hasta 5 usuarios" },
          { name: "10 proyectos activos" },
          { name: "5 GB de almacenamiento" },
          { name: "Soporte por email" }
        ]
      },
      {
        isFeatured: true,
        priceId: process.env.NODE_ENV === "development" 
          ? "price_dev_professional" 
          : "price_prod_professional",
        name: "Professional",
        description: "Para equipos en crecimiento",
        price: 49,
        priceAnchor: 69,
        features: [
          { name: "Hasta 25 usuarios" },
          { name: "Proyectos ilimitados" },
          { name: "100 GB de almacenamiento" },
          { name: "Reportes avanzados" },
          { name: "Integraciones premium" },
          { name: "Soporte prioritario" }
        ]
      },
      {
        priceId: process.env.NODE_ENV === "development" 
          ? "price_dev_enterprise" 
          : "price_prod_enterprise",
        name: "Enterprise",
        description: "Para grandes organizaciones",
        price: 99,
        features: [
          { name: "Usuarios ilimitados" },
          { name: "Almacenamiento ilimitado" },
          { name: "SSO y seguridad avanzada" },
          { name: "Manager dedicado" },
          { name: "SLA garantizado" },
          { name: "Personalización completa" }
        ]
      }
    ]
  },

  // Testimonios
  testimonials: {
    title: "Equipos exitosos confían en ProjectFlow",
    subtitle: "Casos de éxito",
    items: [
      {
        name: "Laura Sánchez",
        username: "Project Manager, TechCorp",
        body: "Reducimos el tiempo de entrega de proyectos en un 40%. La visibilidad que nos da es increíble.",
        img: "/images/testimonials/laura.jpg"
      },
      {
        name: "David López",
        username: "CEO, StartupXYZ",
        body: "Finalmente encontramos una herramienta que todo el equipo ama usar. Intuitiva y potente.",
        img: "/images/testimonials/david.jpg"
      },
      {
        name: "Carmen Ruiz",
        username: "Directora de Operaciones, AgencyPro",
        body: "Gestionar 20+ proyectos simultáneos nunca fue tan fácil. ROI increíble.",
        img: "/images/testimonials/carmen.jpg"
      }
    ]
  },

  // FAQ
  faq: {
    subtitle: "Resolvemos tus dudas",
    title: "Preguntas Frecuentes",
    items: [
      {
        question: '¿Cómo funciona la prueba gratuita?',
        answer: 'Tienes 14 días completamente gratis con acceso a todas las funcionalidades del plan Professional. No necesitas tarjeta de crédito.'
      },
      {
        question: '¿Puedo importar proyectos existentes?',
        answer: 'Sí, ofrecemos importación desde las principales herramientas como Trello, Asana, Monday.com y archivos CSV.'
      },
      {
        question: '¿Qué pasa si excedo el límite de usuarios?',
        answer: 'Te notificaremos cuando te acerques al límite y podrás actualizar tu plan fácilmente desde la configuración.'
      },
      {
        question: '¿Ofrecen capacitación para equipos?',
        answer: 'Sí, incluimos sesiones de onboarding gratuitas para planes Professional y Enterprise.'
      }
    ]
  },

  // Configuración de emails
  resend: {
    fromNoReply: `ProjectFlow <noreply@projectflow.app>`,
    fromAdmin: `Equipo ProjectFlow <hola@projectflow.app>`,
    supportEmail: "soporte@projectflow.app",
  },

  // Tema y colores
  colors: {
    theme: "light",
    main: "#3b82f6", // Azul profesional
  },

  // Autenticación
  auth: {
    loginUrl: "/api/auth/signin",
    callbackUrl: "/dashboard",
  },

  // Footer
  footer: {
    links: [
      {
        title: "Producto",
        items: [
          { name: "Funcionalidades", href: "/funcionalidades" },
          { name: "Precios", href: "/#pricing" },
          { name: "Integraciones", href: "/integraciones" },
          { name: "Seguridad", href: "/seguridad" }
        ]
      },
      {
        title: "Recursos",
        items: [
          { name: "Blog", href: "/blog" },
          { name: "Guías", href: "/guias" },
          { name: "API", href: "/api-docs" },
          { name: "Soporte", href: "/soporte" }
        ]
      },
      {
        title: "Empresa",
        items: [
          { name: "Sobre nosotros", href: "/sobre-nosotros" },
          { name: "Carreras", href: "/carreras" },
          { name: "Contacto", href: "/contacto" },
          { name: "Términos", href: "/terminos" },
          { name: "Privacidad", href: "/privacidad" }
        ]
      }
    ],
    social: [
      {
        name: "Twitter",
        href: "https://twitter.com/projectflow",
        icon: "simple-icons:twitter"
      },
      {
        name: "LinkedIn",
        href: "https://linkedin.com/company/projectflow",
        icon: "simple-icons:linkedin"
      },
      {
        name: "GitHub",
        href: "https://github.com/projectflow",
        icon: "simple-icons:github"
      }
    ],
    copyright: `© ${new Date().getFullYear()} ProjectFlow. Todos los derechos reservados.`
  }
} as const
```

## 🔄 Usando la Configuración en Componentes

### En páginas y componentes

```vue
<template>
  <div>
    <h1>{{ config.appName }}</h1>
    <p>{{ config.appDescription }}</p>
    
    <!-- Usar datos del hero -->
    <section class="hero">
      <h2>{{ config.hero.title }}</h2>
      <p>{{ config.hero.description }}</p>
      <button>{{ config.hero.ctaText }} {{ config.appName }}</button>
    </section>
  </div>
</template>

<script setup>
import { config } from '~/config'

// También puedes usar computed para datos reactivos
const heroTitle = computed(() => config.hero.title)
</script>
```

### En composables

```typescript
// composables/useConfig.ts
export const useConfig = () => {
  return {
    config: readonly(config),
    
    // Helpers útiles
    getFeatureByTitle: (title: string) => {
      return config.features.items.find(item => item.title === title)
    },
    
    getPlanByName: (name: string) => {
      return config.stripe.plans.find(plan => plan.name === name)
    },
    
    getFeaturedPlan: () => {
      return config.stripe.plans.find(plan => plan.isFeatured)
    }
  }
}
```

### En server routes

```typescript
// server/api/config.get.ts
export default defineEventHandler(() => {
  // Devolver solo datos públicos
  return {
    appName: config.appName,
    appDescription: config.appDescription,
    domainName: config.domainName,
    hero: config.hero,
    features: config.features,
    testimonials: config.testimonials
  }
})
```

## 🎯 Mejores Prácticas

### 1. Organización por Entornos

```typescript
// config/base.ts
export const baseConfig = {
  appName: "MiApp",
  appDescription: "Descripción base"
}

// config/development.ts
export const developmentConfig = {
  ...baseConfig,
  domainName: "localhost:3000",
  stripe: {
    plans: [
      {
        priceId: "price_dev_123",
        // ...
      }
    ]
  }
}

// config/production.ts
export const productionConfig = {
  ...baseConfig,
  domainName: "miapp.com",
  stripe: {
    plans: [
      {
        priceId: "price_prod_456",
        // ...
      }
    ]
  }
}

// config.ts
export const config = process.env.NODE_ENV === 'production' 
  ? productionConfig 
  : developmentConfig
```

### 2. Validación de Configuración

```typescript
// utils/validateConfig.ts
import { z } from 'zod'

const configSchema = z.object({
  appName: z.string().min(1),
  appDescription: z.string().min(10),
  domainName: z.string().regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
  hero: z.object({
    title: z.string().min(1),
    description: z.string().min(10),
    ctaText: z.string().min(1)
  }),
  stripe: z.object({
    plans: z.array(z.object({
      priceId: z.string().min(1),
      name: z.string().min(1),
      price: z.number().min(0)
    })).min(1)
  })
})

export const validateConfig = (config: any) => {
  try {
    configSchema.parse(config)
    console.log('✅ Configuración válida')
  } catch (error) {
    console.error('❌ Error en configuración:', error.errors)
    throw new Error('Configuración inválida')
  }
}
```

### 3. TypeScript para Mejor DX

```typescript
// types/config.ts
export interface AppConfig {
  appName: string
  appDescription: string
  domainName: string
  hero: {
    title: string
    description: string
    ctaText: string
    ctaTextSuffix?: string
    image: {
      src: string
      alt: string
    }
  }
  stripe: {
    plans: Array<{
      priceId: string
      name: string
      description: string
      price: number
      priceAnchor?: number
      isFeatured?: boolean
      features: Array<{ name: string }>
    }>
  }
  // ... más tipos
}

export const config: AppConfig = {
  // Tu configuración con tipos seguros
}
```

## 🎉 Conclusión

El archivo `config.ts` es la herramienta más poderosa de NuxtFast para personalizar tu aplicación. Con él puedes:

- ✅ **Centralizar toda la configuración** en un solo lugar
- ✅ **Personalizar completamente** la apariencia y contenido
- ✅ **Configurar planes de Stripe** fácilmente
- ✅ **Mantener consistencia** en toda la aplicación
- ✅ **Facilitar el mantenimiento** y actualizaciones

### Próximos Pasos

1. **Personaliza tu configuración** siguiendo los ejemplos
2. **Valida la configuración** con schemas
3. **Organiza por entornos** para desarrollo y producción
4. **Crea helpers** para acceder a datos específicos
5. **Documenta cambios** importantes para tu equipo

¿Necesitas ayuda configurando algún aspecto específico? ¡La comunidad de NuxtFast está aquí para apoyarte!

---

*¿Te ha sido útil esta guía? Compártela con otros desarrolladores y ayúdanos a hacer crecer la comunidad.* 🚀 