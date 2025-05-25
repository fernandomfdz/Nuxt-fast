<template>
  <NuxtLink
    v-if="status === 'authenticated'"
    :to="config.auth.callbackUrl"
    :class="['btn', extraStyle]"
  >
    <img
      v-if="session?.user?.image"
      :src="session.user.image"
      :alt="session.user?.name || 'Account'"
      class="w-6 h-6 rounded-full shrink-0"
      referrerpolicy="no-referrer"
      width="24"
      height="24"
    >
    <span
      v-else
      class="w-6 h-6 bg-base-300 flex justify-center items-center rounded-full shrink-0"
    >
      {{ session.user?.name?.charAt(0) || session.user?.email?.charAt(0) }}
    </span>
    {{ session.user?.name || session.user?.email || 'Account' }}
  </NuxtLink>

  <button
    v-else
    :class="['btn', extraStyle]"
    :disabled="status === 'loading'"
    @click="handleClick"
  >
    <span v-if="status === 'loading'" class="loading loading-spinner loading-sm"/>
    {{ status === 'loading' ? 'Cargando...' : text }}
  </button>
</template>

<script setup lang="ts">
import { config } from '~/config'

const props = defineProps<{
  text?: string
  extraStyle?: string
}>()

const { text = 'Get started' } = props

const { status, data: session, signIn } = useAuth()

const handleClick = async () => {
  if (status.value === 'authenticated') {
    await navigateTo(config.auth.callbackUrl)
  } else {
    try {
      await signIn('google', { 
        callbackUrl: config.auth.callbackUrl,
        redirect: true 
      })
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
    }
  }
}
</script> 