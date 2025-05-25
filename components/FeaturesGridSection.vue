<script setup lang="ts">
interface Reply {
  id: number
  text: string
  userImg: string
  userName: string
  createdAt: string
  transition?: string
}

const features = [
  {
    title: 'Recolecta feedback de usuarios',
    description: 'Usa tu tablero de Insighto para permitir que los usuarios sugieran funcionalidades.',
    styles: 'bg-primary text-primary-content'
  },
  {
    title: 'Prioriza funcionalidades',
    description: 'Los usuarios votan las funcionalidades que desean. Tú sabes qué construir después.',
    styles: 'md:col-span-2 bg-base-300 text-base-content'
  },
  {
    title: 'Tu marca, tu tablero',
    description: 'Personaliza tu tablero Insighto con 7 temas.',
    styles: 'md:col-span-2 bg-base-100 text-base-content'
  },
  {
    title: 'Descubre nuevas ideas',
    description: 'Los usuarios pueden chatear y discutir funcionalidades.',
    styles: 'bg-neutral text-neutral-content'
  }
]

const replies: Reply[] = [
  {
    id: 1,
    text: '¿Podemos tener una función para agregar un dominio personalizado a IndiePage?',
    userImg: 'https://pbs.twimg.com/profile_images/1514863683574599681/9k7PqDTA_400x400.jpg',
    userName: 'Marc Lou',
    createdAt: '2024-09-01T00:00:00Z'
  },
  {
    id: 2,
    text: '¡Definitivamente pagaría por eso! 🤩',
    userImg: 'https://pbs.twimg.com/profile_images/1778434561556320256/knBJT1OR_400x400.jpg',
    userName: 'Dan K.',
    createdAt: '2024-09-02T00:00:00Z',
    transition: 'opacity-0 group-hover:opacity-100 duration-500 translate-x-1/4 group-hover:translate-x-0'
  }
]

const votingFeatures = [
  {
    text: 'Agregar integración con LemonSqueezy al boilerplate',
    secondaryText: '¡Sí, construye esto! ✅',
    votes: 48,
    transition: 'group-hover:-mt-36 group-hover:md:-mt-28 duration-500'
  },
  {
    text: 'Una nueva tabla de precios para facturación por uso',
    secondaryText: 'Tal vez construir esto 🤔',
    votes: 12
  },
  {
    text: 'Una nueva librería UI para el dashboard',
    secondaryText: 'Pero no construyas eso ❌',
    votes: 1
  }
]

const themes = [
  {
    buttonStyles: 'bg-primary text-primary-content',
    css: '-ml-1 rotate-[6deg] w-72 h-72 z-30 bg-base-200 text-base-content rounded-2xl group-hover:-ml-64 group-hover:opacity-0 group-hover:scale-75 transition-all duration-500 p-4'
  },
  {
    buttonStyles: 'bg-secondary text-secondary-content',
    css: 'rotate-[6deg] bg-base-200 text-base-content w-72 h-72 -mr-20 -ml-20 z-20 rounded-xl p-4'
  },
  {
    buttonStyles: 'bg-accent text-accent-content',
    css: 'rotate-[6deg] bg-base-200 text-base-content z-10 w-72 h-72 rounded-xl p-4'
  },
  {
    buttonStyles: 'bg-neutral text-neutral-content',
    css: 'rotate-[6deg] bg-base-200 text-base-content w-72 h-72 -ml-20 rounded-xl p-4'
  },
  {
    buttonStyles: 'bg-base-100 text-base-content',
    css: 'rotate-[6deg] bg-base-200 text-base-content w-72 h-72 -ml-10 -z-10 rounded-xl p-4 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300'
  }
]
</script>

<template>
  <BaseFeatureGrid :features="features">
    <template #title>
      Construye funcionalidades
    </template>
    <template #highlight>
      que los usuarios realmente quieren
    </template>

    <!-- Feature 0: Feedback Collection -->
    <template #feature-0="{ feature }">
      <div class="overflow-hidden h-full flex items-stretch">
        <div class="w-full translate-x-12 bg-base-200 rounded-t-box h-full p-6">
          <p class="font-medium uppercase tracking-wide text-base-content/60 text-sm mb-3">
            Sugiere una funcionalidad
          </p>
          <div
            class="relative textarea py-4 h-full mr-12 bg-base-200 group-hover:bg-base-100 group-hover:border-base-content/10 text-base-content"
          >
            <div class="absolute left-4 top-4 group-hover:hidden flex items-center">
              <span>Notifica</span>
              <span class="w-[2px] h-6 bg-primary animate-pulse" />
            </div>
            <div class="opacity-0 group-hover:opacity-100 duration-500">
              Las notificaciones deberían ser visibles solo en ciertas páginas.
            </div>
            <div class="opacity-0 group-hover:opacity-100 duration-1000 flex items-center gap-0.5">
              <span>Las páginas de términos y privacidad no las necesitan</span>
              <span class="w-[2px] h-6 bg-primary animate-pulse" />
            </div>
            <button class="btn shadow-lg btn-primary absolute right-4 bottom-6 opacity-0 group-hover:opacity-100 duration-1000">
              Enviar
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- Feature 1: Feature Prioritization -->
    <template #feature-1="{ feature }">
      <div class="px-6 max-w-[600px] flex flex-col gap-4 overflow-hidden">
        <div
          v-for="(feature, i) in votingFeatures"
          :key="i"
          :class="['p-4 bg-base-100 text-base-content rounded-box flex justify-between mb-2 gap-4', feature.transition]"
        >
          <div>
            <p class="font-semibold mb-1">
              {{ feature.text }}
            </p>
            <p class="text-base-content-secondary">
              {{ feature.secondaryText }}
            </p>
          </div>
          <button class="px-4 py-2 rounded-box group text-center text-lg duration-150 border border-transparent bg-primary text-primary-content">
            <Icon
              name="heroicons:chevron-up"
              class="w-5 h-5 ease-in-out duration-150 -translate-y-0.5 group-hover:translate-y-0"
            />
            {{ feature.votes }}
          </button>
        </div>
      </div>
    </template>

    <!-- Feature 2: Theme Customization -->
    <template #feature-2="{ feature }">
      <div class="flex left-0 w-full h-full pt-0 lg:pt-8 overflow-hidden -mt-4">
        <div class="-rotate-[8deg] flex min-w-max overflow-x-visible h-full lg:pt-4">
          <div
            v-for="(theme, i) in themes"
            :key="i"
            :class="theme.css"
          >
            <div class="font-medium uppercase tracking-wide text-base-content/60 text-sm mb-3">
              Feedback destacado
            </div>
            <div class="space-y-2">
              <div class="p-4 bg-base-100 rounded-box flex justify-between">
                <div>
                  <p class="font-semibold mb-1">
                    Tarjetas clickeables
                  </p>
                  <p class="opacity-80">
                    Hacer las tarjetas más accesibles
                  </p>
                </div>
                <button :class="['px-4 py-2 rounded-box group text-center text-lg duration-150 border border-transparent', theme.buttonStyles]">
                  <Icon
                    name="heroicons:chevron-up"
                    class="w-5 h-5 ease-in-out duration-150 -translate-y-0.5 group-hover:translate-y-0"
                  />
                  8
                </button>
              </div>
              <div class="p-4 bg-base-100 rounded-box flex justify-between">
                <div>
                  <p class="font-semibold mb-1">
                    Imágenes más grandes
                  </p>
                  <p class="opacity-80">
                    Hacer las tarjetas más accesibles
                  </p>
                </div>
                <button :class="['px-4 py-2 rounded-box group text-center text-lg duration-150 border border-transparent', theme.buttonStyles]">
                  <Icon
                    name="heroicons:chevron-up"
                    class="w-5 h-5 ease-in-out duration-150 -translate-y-0.5 group-hover:translate-y-0"
                  />
                  5
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Feature 3: User Discussion -->
    <template #feature-3="{ feature }">
      <div class="text-neutral-content px-6 space-y-4">
        <div
          v-for="reply in replies"
          :key="reply.id"
          :class="['px-6 py-4 bg-neutral-content text-neutral rounded-box', reply.transition]"
        >
          <div class="mb-2 whitespace-pre-wrap">
            {{ reply.text }}
          </div>
          <div class="text-neutral/80 flex items-center gap-2 text-sm">
            <div class="flex items-center gap-2">
              <div class="avatar">
                <div class="w-7 rounded-full">
                  <img
                    :src="reply.userImg"
                    :alt="reply.userName"
                  >
                </div>
              </div>
              <div>{{ reply.userName }}</div>
            </div>
            •
            <div>
              {{ new Date(reply.createdAt).toLocaleDateString('es-ES', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }) }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseFeatureGrid>
</template> 