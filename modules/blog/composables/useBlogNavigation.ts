interface BlogConfig {
  enabled?: boolean
  prefix?: string
  showInNavigation?: boolean
  showInFooter?: boolean
}

export const useBlogNavigation = () => {
  const config = useRuntimeConfig()
  
  const blogConfig = config.public.blog as BlogConfig | undefined
  
  const isBlogEnabled = computed(() => {
    return blogConfig?.enabled ?? false
  })
  
  const showInNavigation = computed(() => {
    return blogConfig?.showInNavigation ?? false
  })
  
  const showInFooter = computed(() => {
    return blogConfig?.showInFooter ?? false
  })
  
  const blogPrefix = computed(() => {
    return blogConfig?.prefix ?? '/blog'
  })
  
  const getBlogLinks = () => {
    if (!isBlogEnabled.value) return []
    
    return [
      {
        href: blogPrefix.value,
        label: 'Blog'
      }
    ]
  }
  
  return {
    isBlogEnabled,
    showInNavigation,
    showInFooter,
    blogPrefix,
    getBlogLinks
  }
} 