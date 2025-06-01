export const useAuthNavigation = () => {
  const config = useRuntimeConfig().public.auth

  const navigationLinks = computed(() => {
    if (!config.showInNavigation) return []

    return [
      {
        label: 'Iniciar Sesión',
        href: config.loginPath || '/auth/signin',
        external: false
      },
      {
        label: 'Registrarse', 
        href: config.registerPath || '/auth/signup',
        external: false
      },
      {
        label: 'Perfil',
        href: config.profilePath || '/auth/profile',
        external: false,
        requiresAuth: true
      }
    ]
  })

  const publicLinks = computed(() => 
    navigationLinks.value.filter(link => !link.requiresAuth)
  )

  const protectedLinks = computed(() => 
    navigationLinks.value.filter(link => link.requiresAuth)
  )

  return {
    navigationLinks,
    publicLinks,
    protectedLinks
  }
} 