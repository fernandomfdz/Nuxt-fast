<script setup lang="ts">
import { ref } from 'vue'

const { data: session, status } = useAuth()
const isLoading = ref(false)
const showButton = ref(false)

const handleSignOut = () => {
  const { signOut } = useAuth()
  signOut({ callbackUrl: '/' })
}

const handleBilling = async () => {
  isLoading.value = true

  try {
    const { data } = await useFetch('/api/stripe/create-portal', {
      method: 'POST',
      body: {
        returnUrl: window.location.href
      }
    })

    window.location.href = data.value?.url
  } catch (e) {
    console.error(e)
  }

  isLoading.value = false
}

// No mostrar nada si no está autenticado
if (status.value === 'unauthenticated') { 
  showButton.value = false
} else {
  showButton.value = true
}
</script>

<template>
  <div v-if="showButton" class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-ghost gap-2 flex items-center">
      <div 
        v-if="session?.user?.image"
        class="w-6 h-6 rounded-full overflow-hidden"
      >
        <img
          :src="session.user.image"
          :alt="session.user?.name || 'Account'"
          class="w-full h-full object-cover"
          referrerpolicy="no-referrer"
          width="24"
          height="24"
        >
      </div>
      <div
        v-else
        class="w-6 h-6 bg-neutral flex justify-center items-center rounded-full text-xs font-medium text-neutral-content"
      >
        {{ session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || 'U' }}
      </div>
      
      <span class="text-sm">{{ session?.user?.name || 'Account' }}</span>
      
      <Icon name="heroicons:chevron-down" class="w-4 h-4 opacity-60" />
    </div>

    <ul tabindex="0" class="dropdown-content menu bg-base-100 border border-neutral rounded-box z-[1] w-52 p-2 shadow-lg">
      <li>
        <button
          class="flex items-center gap-2 text-sm"
          :class="{ 'loading': isLoading }"
          @click="handleBilling"
        >
          <Icon name="heroicons:credit-card" class="w-4 h-4" />
          Billing
        </button>
      </li>
      
      <li><hr class="border-neutral/20 my-1"></li>
      
      <li>
        <button
          class="flex items-center gap-2 text-sm text-error hover:bg-error/10"
          @click="handleSignOut"
        >
          <Icon name="heroicons:arrow-right-on-rectangle" class="w-4 h-4" />
          Logout
        </button>
      </li>
    </ul>
  </div>
</template> 