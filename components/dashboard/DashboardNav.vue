<script setup lang="ts">
import { config } from '~/config'

const route = useRoute()

// Obtener módulos habilitados
const { enabledModules } = useNuxtFastModules()

// Items de navegación base
const baseNavItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'heroicons:home',
    current: route.path === '/dashboard'
  },
  {
    name: 'Configuración',
    href: '/dashboard/settings',
    icon: 'heroicons:cog-6-tooth',
    current: route.path === '/dashboard/settings'
  }
]

// Items de navegación dinámicos basados en módulos habilitados
const dynamicNavItems = computed(() => {
  const items: Array<{
    name: string
    href: string
    icon: string
    current: boolean
  }> = []

  // Agregar Organizaciones si está habilitado
  if (enabledModules.value.includes('organizations') && config.modules?.organizations?.enabled) {
    items.push({
      name: 'Organizaciones',
      href: '/settings/organizations',
      icon: 'heroicons:building-office',
      current: route.path.startsWith('/settings/organizations')
    })
  }

  return items
})

// Items de navegación combinados
const navItems = computed(() => [
  ...baseNavItems,
  ...dynamicNavItems.value
])
</script>

<template>
  <nav class="bg-base-200 border-b border-base-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <!-- Logo/Brand -->
          <div class="flex-shrink-0 flex items-center">
            <NuxtLink to="/" class="text-xl font-bold text-primary">
              {{ config.appName }}
            </NuxtLink>
          </div>
          
          <!-- Navigation Links -->
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <NuxtLink
              v-for="item in navItems"
              :key="item.name"
              :to="item.href"
              :class="[
                'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200',
                item.current
                  ? 'border-primary text-primary'
                  : 'border-transparent text-base-content/70 hover:text-base-content hover:border-base-content/30'
              ]"
            >
              <Icon :name="item.icon" class="w-4 h-4 mr-2" />
              {{ item.name }}
            </NuxtLink>
          </div>
        </div>

        <!-- User Menu -->
        <div class="flex items-center">
          <ButtonAccount />
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div class="sm:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.name"
          :to="item.href"
          :class="[
            'block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200',
            item.current
              ? 'bg-primary/10 border-primary text-primary'
              : 'border-transparent text-base-content/70 hover:text-base-content hover:bg-base-300 hover:border-base-content/30'
          ]"
        >
          <Icon :name="item.icon" class="w-4 h-4 mr-2 inline" />
          {{ item.name }}
        </NuxtLink>
      </div>
    </div>
  </nav>
</template> 