export const config = {
  // REQUIRED
  appName: "NuxtFast",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription:
    "El boilerplate de NuxtJS con todo lo que necesitas para construir tu SaaS, herramienta AI o cualquier otra aplicación web. De idea a producción en 5 minutos.",
  // REQUIRED (no https://, not trialing slash at the end, just the naked domain)
  domainName: "nuxtfa.st",

  // === HERO SECTION ===
  hero: {
    title: "Termina tu startup en días, no semanas",
    description: "El boilerplate de NuxtJS con todo lo que necesitas para construir tu SaaS, herramienta AI o cualquier otra aplicación web. De idea a producción en 5 minutos.",
    ctaText: "Obtén",
    ctaTextSuffix: "", // Se concatenará con appName
    productHuntUrl: "https://www.producthunt.com/posts/NuxtFast-2?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-NuxtFast&#0045;2",
    image: {
      src: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
      alt: "Product Demo"
    }
  },

  // === NAVIGATION ===
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
  },

  // === CTA SECTION ===
  cta: {
    title: "Impulsa tu app, lanza y gana",
    description: "No pierdas tiempo integrando APIs o diseñando una sección de precios...",
    buttonText: "Obtén",
    buttonTextSuffix: "", // Se concatenará con appName
    backgroundImage: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80"
  },

  // === FAQ SECTION ===
  faq: {
    subtitle: "Preguntas Frecuentes",
    title: "Preguntas Más Comunes",
    items: [
      {
        question: '¿Qué obtengo exactamente?',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nulla sit amet aliquam lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet lorem.'
      },
      {
        question: '¿Puedo obtener un reembolso?',
        answer: 'Sí! Puedes solicitar un reembolso dentro de los 7 días posteriores a tu compra. Contáctanos por correo electrónico.'
      },
      {
        question: 'Tengo otra pregunta',
        answer: 'Genial, contáctanos por correo electrónico.'
      }
    ]
  },

  // === FEATURES SECTION ===
  features: {
    title: "Todo lo que necesitas para lanzar tu startup rápidamente",
    subtitle: "y ser rentable",
    description: "Desde la autenticación hasta los pagos, tenemos todo lo que necesitas",
    items: [
      {
        title: 'Emails',
        description: 'Envía emails transaccionales, configura tu DNS para evitar la carpeta de spam (DKIM, DMARC, SPF en subdominio), y escucha webhooks para recibir y reenviar emails',
        type: 'video',
        path: 'https://d3m8mk7e1mf7xn.cloudfront.net/app/newsletter.webm',
        format: 'video/webm',
        icon: 'heroicons:at-symbol'
      },
      {
        title: 'Pagos',
        description: 'Crea sesiones de pago, maneja webhooks para actualizar la cuenta del usuario (suscripciones, pagos únicos...) y consejos para configurar tu cuenta y reducir contracargos',
        type: 'image',
        path: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80',
        alt: 'Un computador',
        icon: 'heroicons:credit-card'
      },
      {
        title: 'Autenticación',
        description: 'Configuración de magic links, inicio de sesión con Google, guardado de usuarios en MongoDB/Supabase, páginas privadas/protegidas y llamadas a API',
        icon: 'heroicons:lock-closed'
      },
      {
        title: 'Estilos',
        description: 'Componentes, animaciones y secciones (como esta sección de características), 20+ temas con daisyUI, modo oscuro automático',
        icon: 'heroicons:paint-brush'
      }
    ]
  },

  // === TESTIMONIALS SECTION ===
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
  },

  // === PROBLEM SECTION ===
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
  },

  // === FOOTER ===
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
  },

  crisp: {
    // Crisp website ID. IF YOU DON'T USE CRISP: just remove this => Then add a support email in this config file (resend.supportEmail) otherwise customer support won't work.
    id: "",
    // Hide Crisp by default, except on route "/". Crisp is toggled with <ButtonSupport/>. If you want to show Crisp on every routes, just remove this below
    onlyShowOnRoutes: ["/"] as const
  },
  stripe: {
    // Create multiple plans in your Stripe dashboard, then add them here. You can add as many plans as you want, just make sure to add the priceId
    plans: [
      {
        // REQUIRED — we use this to find the plan in the webhook (for instance if you want to update the user's credits based on the plan)
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1Niyy5AxyNprDp7iZIqEyD2h"
            : "price_456",
        //  REQUIRED - Name of the plan, displayed on the pricing page
        name: "Starter",
        // A friendly description of the plan, displayed on the pricing page. Tip: explain why this plan and not others
        description: "Perfect for small projects",
        // The price you want to display, the one user will be charged on Stripe.
        price: 79,
        // If you have an anchor price (i.e. $29) that you want to display crossed out, put it here. Otherwise, leave it empty
        priceAnchor: 99,
        features: [
          {
            name: "NuxtJS boilerplate"
          },
          { name: "User oauth" },
          { name: "Database" },
          { name: "Emails" },
        ]
      },
      {
        // This plan will look different on the pricing page, it will be highlighted. You can only have one plan with isFeatured: true
        isFeatured: true,
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1O5KtcAxyNprDp7iftKnrrpw"
            : "price_456",
        name: "Advanced",
        description: "You need more power",
        price: 99,
        priceAnchor: 149,
        features: [
          {
            name: "NuxtJS boilerplate"
          },
          { name: "User oauth" },
          { name: "Database" },
          { name: "Emails" },
          { name: "1 year of updates" },
          { name: "24/7 support" },
        ]
      },
    ]
  },
  aws: {
    // If you use AWS S3/Cloudfront, put values in here
    bucket: "bucket-name",
    bucketUrl: `https://bucket-name.s3.amazonaws.com/`,
    cdn: "https://cdn-id.cloudfront.net/"
  },
  resend: {
    // REQUIRED — Email 'From' field to be used when sending magic login links
    fromNoReply: `NuxtFast <noreply@resend.shipfa.st>`,
    // REQUIRED — Email 'From' field to be used when sending other emails, like abandoned carts, updates etc..
    fromAdmin: `Marc at NuxtFast <marc@resend.shipfa.st>`,
    // Email shown to customer if need support. Leave empty if not needed => if empty, set up Crisp above, otherwise you won't be able to offer customer support."
    supportEmail: "marc.louvion@gmail.com"
  },
  colors: {
    // REQUIRED — The DaisyUI theme to use (added to the main layout.js). Leave blank for default (light & dark mode). If you any other theme than light/dark, you need to add it in config.tailwind.js in daisyui.themes.
    theme: "cyberpunk",
    // REQUIRED — This color will be reflected on the whole app outside of the document (loading bar, Chrome tabs, etc..). By default it takes the primary color from your DaisyUI theme (make sure to update your the theme name after "data-theme=")
    // OR you can just do this to use a custom color: main: "#f37055". HEX only.
    main: "#f37055"
  },

  // === CONFIGURACIÓN DE TEMAS ===
  themes: {
    // Mostrar selector de temas en la interfaz
    showThemeSelector: true,
    // Tema por defecto al cargar la aplicación
    defaultTheme: "light",
    // Temas disponibles en el selector (dejar vacío para mostrar todos)
    // Si se especifica, solo estos temas aparecerán en el selector
    availableThemes: [
      "light",
      "dark",
    ]
  },

  // === MÓDULOS DE NUXTFAST ===
  modules: {
    blog: true,
    auth: {
      enabled: true,
      emailAndPassword: true,
      showInNavigation: false,
      // URLs de autenticación - corregidas para coincidir con el módulo
      loginPath: "/auth/signin",
      registerPath: "/auth/signup",
      profilePath: "/dashboard", 
      callbackPath: "/auth/callback",
      // URLs de redirección (para compatibilidad)
      loginUrl: "/auth/signin",
      callbackUrl: "/dashboard", 
      // Proveedores sociales - solo incluir si las variables están disponibles
      socialProviders: {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID, // Se llenará automáticamente desde GOOGLE_CLIENT_ID
          clientSecret: process.env.GOOGLE_CLIENT_SECRET // Se llenará automáticamente desde GOOGLE_CLIENT_SECRET
        }
      },
      // Plugins de Better Auth
      plugins: {
        twoFactor: {
          enabled: false,
          issuer: "NuxtFast", // Nombre que aparece en apps de autenticación
          otpOptions: {
            period: 30,
            digits: 6
          }
        },
        emailOTP: {
          enabled: false,
          expiresIn: 300, // 5 minutos en segundos
          sendVerificationOTP: {
            // Configuración del proveedor de email (Resend, etc.)
            provider: "resend"
          }
        },
        oAuthProxy: {
          enabled: false,
          // Útil para desarrollo con diferentes URLs
        },
        adminPanel: {
          enabled: false,
          // Panel de administración para gestionar usuarios
          adminEmails: [] // Lista de emails con acceso admin
        }
      }
    },
    organizations: {
      enabled: true,
      showInNavigation: true,
      // URLs de organizaciones - cambiadas a settings/organizations
      listUrl: "/organizations",
      createUrl: "/organizations/create",
      dashboardUrl: "/organizations/dashboard",
      // Configuraciones de organización
      allowUserToCreateOrganization: true,
      organizationLimit: 5, // Máximo 5 organizaciones por usuario
      membershipLimit: 100, // Máximo 100 miembros por organización
      creatorRole: "owner", // Rol del creador: "owner" o "admin"
      // Invitaciones
      invitationExpiresIn: 172800, // 48 horas (2 días) en segundos
      invitationLimit: 50, // Máximo 50 invitaciones por organización
      cancelPendingInvitationsOnReInvite: true,
      // Teams (equipos dentro de organizaciones)
      teams: {
        enabled: true,
        maximumTeams: 10, // Máximo 10 equipos por organización
        allowRemovingAllTeams: false // No permitir eliminar todos los equipos
      },
      // Roles y permisos
      roles: {
        owner: {
          name: "Propietario",
          permissions: ["*"] // Todos los permisos
        },
        admin: {
          name: "Administrador", 
          permissions: [
            "organization:read",
            "organization:update",
            "member:invite",
            "member:remove",
            "member:update-role",
            "team:create",
            "team:update",
            "team:delete"
          ]
        },
        member: {
          name: "Miembro",
          permissions: [
            "organization:read",
            "team:read"
          ]
        }
      }
    }
  }
} as const;
