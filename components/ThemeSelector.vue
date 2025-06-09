<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-ghost gap-1 normal-case">
      <div class="flex items-center gap-2">
        <div :class="currentThemeColors" class="w-4 h-4 rounded-full"/>
        <span class="hidden sm:inline">{{ currentThemeLabel }}</span>
      </div>
      <Icon name="heroicons:chevron-down" class="w-4 h-4" />
    </div>
    <ul tabindex="0" class="dropdown-content bg-base-200 rounded-box z-[1] w-fit p-2 shadow-lg border border-base-300 max-h-96 overflow-y-scroll">
      <li v-for="theme in availableThemes" :key="theme.value">
        <button 
          class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-base-300 transition-colors justify-start"
          :class="{ 'bg-primary text-primary-content': currentTheme === theme.value }"
          @click="setTheme(theme.value)"
        >
          <div :class="theme.colors" class="w-4 h-4 rounded-full flex-shrink-0"/>
          <span class="flex-1 text-left">{{ theme.label }}</span>
          <Icon v-if="currentTheme === theme.value" name="heroicons:check" class="w-4 h-4 flex-shrink-0" />
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { config } from '~/config'

// Todos los temas disponibles de DaisyUI con sus colores representativos
const allThemes = [
  { 
    value: 'light', 
    label: 'light', 
    colors: 'bg-gradient-to-r from-blue-500 to-purple-500'
  },
  { 
    value: 'dark', 
    label: 'dark', 
    colors: 'bg-gradient-to-r from-gray-800 to-gray-900'
  },
  { 
    value: 'cupcake', 
    label: 'cupcake', 
    colors: 'bg-gradient-to-r from-pink-300 to-purple-300'
  },
  { 
    value: 'bumblebee', 
    label: 'bumblebee', 
    colors: 'bg-gradient-to-r from-yellow-400 to-orange-400'
  },
  { 
    value: 'emerald', 
    label: 'emerald', 
    colors: 'bg-gradient-to-r from-emerald-400 to-green-500'
  },
  { 
    value: 'corporate', 
    label: 'corporate', 
    colors: 'bg-gradient-to-r from-blue-600 to-indigo-600'
  },
  { 
    value: 'synthwave', 
    label: 'synthwave', 
    colors: 'bg-gradient-to-r from-purple-600 to-pink-600'
  },
  { 
    value: 'retro', 
    label: 'retro', 
    colors: 'bg-gradient-to-r from-yellow-600 to-orange-600'
  },
  { 
    value: 'cyberpunk', 
    label: 'cyberpunk', 
    colors: 'bg-gradient-to-r from-yellow-400 to-pink-500'
  },
  { 
    value: 'valentine', 
    label: 'valentine', 
    colors: 'bg-gradient-to-r from-pink-400 to-red-400'
  },
  { 
    value: 'halloween', 
    label: 'halloween', 
    colors: 'bg-gradient-to-r from-orange-600 to-gray-800'
  },
  { 
    value: 'garden', 
    label: 'garden', 
    colors: 'bg-gradient-to-r from-green-400 to-emerald-500'
  },
  { 
    value: 'forest', 
    label: 'forest', 
    colors: 'bg-gradient-to-r from-green-700 to-emerald-800'
  },
  { 
    value: 'aqua', 
    label: 'aqua', 
    colors: 'bg-gradient-to-r from-cyan-400 to-blue-500'
  },
  { 
    value: 'lofi', 
    label: 'lofi', 
    colors: 'bg-gradient-to-r from-gray-400 to-gray-600'
  },
  { 
    value: 'pastel', 
    label: 'pastel', 
    colors: 'bg-gradient-to-r from-purple-300 to-pink-300'
  },
  { 
    value: 'fantasy', 
    label: 'fantasy', 
    colors: 'bg-gradient-to-r from-purple-500 to-indigo-600'
  },
  { 
    value: 'wireframe', 
    label: 'wireframe', 
    colors: 'bg-gradient-to-r from-gray-300 to-gray-400'
  },
  { 
    value: 'black', 
    label: 'black', 
    colors: 'bg-gradient-to-r from-gray-900 to-black'
  },
  { 
    value: 'luxury', 
    label: 'luxury', 
    colors: 'bg-gradient-to-r from-yellow-600 to-amber-700'
  },
  { 
    value: 'dracula', 
    label: 'dracula', 
    colors: 'bg-gradient-to-r from-purple-700 to-gray-800'
  },
  { 
    value: 'cmyk', 
    label: 'cmyk', 
    colors: 'bg-gradient-to-r from-cyan-500 to-pink-500'
  },
  { 
    value: 'autumn', 
    label: 'autumn', 
    colors: 'bg-gradient-to-r from-orange-500 to-red-600'
  },
  { 
    value: 'business', 
    label: 'business', 
    colors: 'bg-gradient-to-r from-blue-700 to-indigo-800'
  },
  { 
    value: 'acid', 
    label: 'acid', 
    colors: 'bg-gradient-to-r from-lime-400 to-green-500'
  },
  { 
    value: 'lemonade', 
    label: 'lemonade', 
    colors: 'bg-gradient-to-r from-yellow-300 to-lime-400'
  },
  { 
    value: 'night', 
    label: 'night', 
    colors: 'bg-gradient-to-r from-blue-900 to-indigo-900'
  },
  { 
    value: 'coffee', 
    label: 'coffee', 
    colors: 'bg-gradient-to-r from-amber-700 to-orange-800'
  },
  { 
    value: 'winter', 
    label: 'winter', 
    colors: 'bg-gradient-to-r from-blue-200 to-cyan-300'
  },
  { 
    value: 'dim', 
    label: 'dim', 
    colors: 'bg-gradient-to-r from-gray-600 to-gray-700'
  },
  { 
    value: 'nord', 
    label: 'nord', 
    colors: 'bg-gradient-to-r from-blue-400 to-indigo-500'
  },
  { 
    value: 'sunset', 
    label: 'sunset', 
    colors: 'bg-gradient-to-r from-orange-400 to-pink-500'
  },
  { 
    value: 'system', 
    label: 'system', 
    colors: 'bg-gradient-to-r from-gray-500 to-blue-500'
  }
]

// Filtrar temas disponibles según configuración
const availableThemes = computed(() => {
  if (config.themes?.availableThemes && config.themes.availableThemes.length > 0) {
    return allThemes.filter(theme => config.themes!.availableThemes!.includes(theme.value))
  }
  return allThemes
})

// Estado reactivo del tema actual
const currentTheme = ref<string>('light')

// Etiqueta del tema actual
const currentThemeLabel = computed(() => {
  const theme = allThemes.find(t => t.value === currentTheme.value)
  return theme?.label || 'Theme'
})

// Colores del tema actual
const currentThemeColors = computed(() => {
  const theme = allThemes.find(t => t.value === currentTheme.value)
  return theme?.colors || 'bg-gradient-to-r from-gray-500 to-blue-500'
})

// Función para cambiar el tema
const setTheme = (theme: string) => {
  // Actualizar estado reactivo
  currentTheme.value = theme
  
  // Aplicar el tema al documento
  if (import.meta.client) {
    const html = document.documentElement
    
    if (theme === 'system') {
      // Detectar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      html.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
      currentTheme.value = prefersDark ? 'dark' : 'light'
    } else {
      html.setAttribute('data-theme', theme)
    }
    
    // Guardar en localStorage
    localStorage.setItem('theme', theme)
  }
}

// Inicializar tema al montar el componente
onMounted(() => {
  if (import.meta.client) {
    // Usar tema por defecto de la configuración si no hay tema guardado
    const defaultTheme = config.themes?.defaultTheme || 'light'
    const savedTheme = localStorage.getItem('theme') || defaultTheme
    setTheme(savedTheme)
    
    // Escuchar cambios en la preferencia del sistema si se usa 'system'
    if (savedTheme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        if (localStorage.getItem('theme') === 'system') {
          setTheme('system')
        }
      }
      
      mediaQuery.addEventListener('change', handleChange)
      
      // Limpiar listener al desmontar
      onUnmounted(() => {
        mediaQuery.removeEventListener('change', handleChange)
      })
    }
  }
})
</script>

<style scoped>
/* Estilos adicionales para el dropdown */
.dropdown-content {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Asegurar que el dropdown esté por encima de otros elementos */
.dropdown-content {
  z-index: 9999;
}
</style> 