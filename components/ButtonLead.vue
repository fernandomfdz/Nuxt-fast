<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/composables/useToast'

defineProps<{
  extraStyle?: string
}>()

const email = ref('')
const isLoading = ref(false)
const isDisabled = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const toast = useToast()

const handleSubmit = async (e?: Event) => {
  e?.preventDefault()

  isLoading.value = true
  try {
    await useFetch('/api/lead', {
      method: 'POST',
      body: { email: email.value }
    })

    toast.success('Thanks for joining the waitlist!')

    // just remove the focus on the input
    inputRef.value?.blur()
    email.value = ''
    isDisabled.value = true
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form
    :class="['w-full max-w-xs space-y-3', extraStyle]"
    @submit="handleSubmit"
  >
    <input
      ref="inputRef"
      v-model="email"
      required
      type="email"
      autocomplete="email"
      placeholder="tom@cruise.com"
      class="input input-bordered w-full placeholder:opacity-60"
    >

    <button
      class="btn btn-primary btn-block"
      type="submit"
      :disabled="isDisabled"
    >
      Join waitlist
      <span
        v-if="isLoading"
        class="loading loading-spinner loading-xs"
      />
      <Icon
        v-else
        name="heroicons:arrow-right"
        class="w-5 h-5"
      />
    </button>
  </form>
</template> 