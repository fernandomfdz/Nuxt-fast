<template>
  <NuxtLink
    v-if="isAuthenticated"
    :to="config.modules?.auth?.callbackUrl || '/dashboard'"
    :class="['btn', extraStyle]"
  >
    <img
      v-if="user?.image"
      :src="user.image"
      :alt="user?.name || 'Account'"
      class="w-6 h-6 rounded-full shrink-0"
      referrerpolicy="no-referrer"
      width="24"
      height="24"
    >
    <span
      v-else
      class="w-6 h-6 bg-base-300 flex justify-center items-center rounded-full shrink-0"
    >
      {{ user?.name?.charAt(0) || user?.email?.charAt(0) }}
    </span>
    {{ user?.name || user?.email || 'Account' }}
  </NuxtLink>

  <button
    v-else
    :class="['btn', extraStyle]"
    :disabled="isLoading"
    @click="handleClick"
  >
    <span v-if="isLoading" class="loading loading-spinner loading-sm"/>
    {{ isLoading ? 'Cargando...' : text }}
  </button>
</template>

<script setup lang="ts">
import { config } from '~/config'

const props = defineProps<{
  text?: string
  extraStyle?: string
}>()

const { text = 'Get started' } = props

const { isAuthenticated, user, signInWithProvider, isLoading } = useAuth()

const handleClick = async () => {
  if (isAuthenticated.value) {
    await navigateTo(config.modules?.auth?.callbackUrl || '/dashboard')
  } else {
    try {
      await signInWithProvider('google')
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
    }
  }
}
</script> 