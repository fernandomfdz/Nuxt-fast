<template>
  <span :class="badgeClasses">
    {{ displayText }}
  </span>
</template>

<script setup lang="ts">
// Re-exportar el componente BadgeCategory como BlogBadgeCategory
// para mantener consistencia en el naming

interface CategoryFromContent {
  slug?: string
  title: string
  titleShort?: string
  description?: string
  descriptionShort?: string
}

interface Props {
  category: CategoryFromContent
  variant?: 'default' | 'featured' | 'compact' | 'large'
  color?: 'primary' | 'secondary' | 'accent' | 'neutral'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  color: 'primary'
})

const displayText = computed(() => {
  switch (props.variant) {
    case 'compact':
      return props.category.titleShort || props.category.title.substring(0, 8) + '...'
    case 'large':
      return props.category.title
    default:
      return props.category.titleShort || props.category.title
  }
})

// Clases CSS basadas en la variante y color
const badgeClasses = computed(() => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full transition-all duration-200'
  
  // Clases por variante
  const variantClasses = {
    default: 'px-3 py-1 text-xs',
    featured: 'px-3 py-1 text-xs bg-base-100/90 text-base-content backdrop-blur-sm',
    compact: 'px-2 py-0.5 text-xs',
    large: 'px-4 py-2 text-sm'
  }
  
  // Clases por color (solo para variantes no featured)
  const colorClasses = {
    primary: 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20',
    secondary: 'bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20',
    accent: 'bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20',
    neutral: 'bg-neutral/10 text-neutral border border-neutral/20 hover:bg-neutral/20'
  }
  
  if (props.variant === 'featured') {
    return `${baseClasses} ${variantClasses[props.variant]}`
  }
  
  return `${baseClasses} ${variantClasses[props.variant]} ${colorClasses[props.color]}`
})
</script> 