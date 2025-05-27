<script setup lang="ts">
import { config } from '~/config'

const isOpen = ref(false)

// Cerrar el menú cuando cambia la ruta
watch(() => useRoute().fullPath, () => {
  isOpen.value = false
})

// Obtener enlaces de todos los módulos habilitados
const { getAllNavigationLinks } = useNuxtFastModules()

// Combinar enlaces de configuración con enlaces de módulos
const allNavigationLinks = computed(() => {
  // Filtrar enlaces del blog de la configuración estática para evitar duplicados
  const configLinks = config.navigation.links.filter(link => link.href !== '/blog')
  const moduleLinks = getAllNavigationLinks()
  return [...moduleLinks, ...configLinks]
})
</script>

<template>
  <header class="bg-base-200">
    <nav
      class="container flex items-center justify-between px-8 py-4 mx-auto"
      aria-label="Global"
    >
      <!-- Logo/nombre en pantallas grandes -->
      <div class="flex lg:flex-1">
        <NuxtLink
          class="flex items-center gap-2 shrink-0"
          href="/"
          :title="`${config.appName} página principal`"
        >
          <NuxtImg
            src="/icon.png"
            :alt="`${config.appName} logo`"
            class="w-8"
            width="32"
            height="32"
            priority
          />
          <span class="font-extrabold text-lg">{{ config.appName }}</span>
        </NuxtLink>
      </div>

      <!-- Botón de menú en móvil -->
      <div class="flex lg:hidden">
        <button
          type="button"
          class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
          @click="isOpen = true"
        >
          <span class="sr-only">{{ config.navigation.mobileMenu.openText }}</span>
          <Icon
            name="heroicons:bars-3"
            class="w-6 h-6 text-base-content"
          />
        </button>
      </div>

      <!-- Enlaces en pantallas grandes -->
      <div class="hidden lg:flex lg:justify-center lg:gap-12 lg:items-center">
        <NuxtLink
          v-for="link in allNavigationLinks"
          :key="link.href"
          :href="link.href"
          class="link link-hover"
          :title="link.label"
        >
          {{ link.label }}
        </NuxtLink>
      </div>

      <!-- CTA en pantallas grandes -->
      <div class="hidden lg:flex lg:justify-end lg:flex-1 gap-2">
        <ButtonSignin extra-style="btn-primary" />
        <ThemeSelector/>
      </div>
    </nav>

    <!-- Menú móvil -->
    <div
      v-show="isOpen"
      class="relative z-50"
    >
      <div class="fixed inset-y-0 right-0 z-10 w-full px-8 py-4 overflow-y-auto bg-base-200 sm:max-w-sm sm:ring-1 sm:ring-neutral/10 transform origin-right transition ease-in-out duration-300">
        <!-- Logo/nombre en pantallas pequeñas -->
        <div class="flex items-center justify-between">
          <NuxtLink
            class="flex items-center gap-2 shrink-0"
            :title="`${config.appName} página principal`"
            href="/"
          >
            <NuxtImg
              src="/icon.png"
              :alt="`${config.appName} logo`"
              class="w-8"
              width="32"
              height="32"
              priority
            />
            <span class="font-extrabold text-lg">{{ config.appName }}</span>
          </NuxtLink>

          <button
            type="button"
            class="-m-2.5 rounded-md p-2.5"
            @click="isOpen = false"
          >
            <span class="sr-only">{{ config.navigation.mobileMenu.closeText }}</span>
            <Icon
              name="heroicons:x-mark"
              class="w-6 h-6"
            />
          </button>
        </div>

        <!-- Enlaces en pantallas pequeñas -->
        <div class="flow-root mt-6">
          <div class="py-4">
            <div class="flex flex-col gap-y-4 items-start">
              <NuxtLink
                v-for="link in allNavigationLinks"
                :key="link.href"
                :href="link.href"
                class="link link-hover"
                :title="link.label"
              >
                {{ link.label }}
              </NuxtLink>
            </div>
          </div>
          <div class="divider" />
          <!-- CTA en pantallas pequeñas -->
          <div class="flex flex-col">
            <ButtonSignin extra-style="btn-primary" />
          </div>
        </div>
      </div>
    </div>
  </header>
</template> 