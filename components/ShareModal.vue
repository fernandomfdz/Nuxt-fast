<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Overlay -->
    <div 
      class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      @click="closeModal"
    />
    
    <!-- Modal -->
    <div class="relative bg-base-100 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 transform transition-all">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-base-content">
          Compartir Artículo
        </h3>
        <button 
          class="btn btn-ghost btn-sm btn-circle"
          @click="closeModal"
        >
          <Icon name="heroicons:x-mark" class="w-5 h-5" />
        </button>
      </div>

      <!-- Opciones de compartir -->
      <div class="space-y-3">
        <!-- Web Share API nativo (si está disponible) -->
        <button
          v-if="isNativeShareSupported"
          class="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-base-200 transition-colors group"
          @click="handleNativeShare"
        >
          <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Icon name="heroicons:share" class="w-6 h-6 text-primary" />
          </div>
          <div class="flex-1 text-left">
            <p class="font-semibold text-base-content">Compartir</p>
            <p class="text-sm text-base-content/60">Usar opciones del sistema</p>
          </div>
        </button>

        <!-- WhatsApp -->
        <button
          class="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-base-200 transition-colors group"
          @click="shareToWhatsApp"
        >
          <div class="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
            <Icon name="simple-icons:whatsapp" class="w-6 h-6 text-green-600" />
          </div>
          <div class="flex-1 text-left">
            <p class="font-semibold text-base-content">WhatsApp</p>
            <p class="text-sm text-base-content/60">Compartir por WhatsApp</p>
          </div>
        </button>

        <!-- Twitter/X -->
        <button
          class="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-base-200 transition-colors group"
          @click="shareToTwitter"
        >
          <div class="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
            <Icon name="simple-icons:x" class="w-6 h-6 text-blue-600" />
          </div>
          <div class="flex-1 text-left">
            <p class="font-semibold text-base-content">X (Twitter)</p>
            <p class="text-sm text-base-content/60">Compartir en X</p>
          </div>
        </button>

        <!-- Telegram -->
        <button
          class="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-base-200 transition-colors group"
          @click="shareToTelegram"
        >
          <div class="w-12 h-12 bg-blue-400/10 rounded-full flex items-center justify-center group-hover:bg-blue-400/20 transition-colors">
            <Icon name="simple-icons:telegram" class="w-6 h-6 text-blue-500" />
          </div>
          <div class="flex-1 text-left">
            <p class="font-semibold text-base-content">Telegram</p>
            <p class="text-sm text-base-content/60">Compartir en Telegram</p>
          </div>
        </button>

        <!-- Copiar enlace -->
        <button
          class="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-base-200 transition-colors group"
          @click="copyLink"
        >
          <div class="w-12 h-12 bg-base-content/10 rounded-full flex items-center justify-center group-hover:bg-base-content/20 transition-colors">
            <Icon name="heroicons:link" class="w-6 h-6 text-base-content" />
          </div>
          <div class="flex-1 text-left">
            <p class="font-semibold text-base-content">Copiar enlace</p>
            <p class="text-sm text-base-content/60">Copiar URL al portapapeles</p>
          </div>
          <Icon v-if="linkCopied" name="heroicons:check" class="w-5 h-5 text-success" />
        </button>
      </div>

      <!-- Nota sobre Instagram -->
      <div class="mt-6 p-4 bg-info/10 rounded-xl">
        <div class="flex gap-3">
          <Icon name="heroicons:information-circle" class="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
          <div>
            <p class="text-sm font-medium text-info">Nota sobre Instagram</p>
            <p class="text-xs text-info/80 mt-1">
              Instagram no permite compartir enlaces directamente. Puedes copiar el enlace y pegarlo en tu historia o post.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useShare } from '~/composables/useShare'

interface Props {
  isOpen: boolean
  title: string
  text: string
  url: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const { shareContent, shareToSocial, isNativeShareSupported } = useShare()

const linkCopied = ref(false)

// Función para cerrar el modal
const closeModal = () => {
  emit('close')
}

// Función para compartir nativamente
const handleNativeShare = async () => {
  const success = await shareContent({
    title: props.title,
    text: props.text,
    url: props.url
  })
  
  if (success) {
    closeModal()
  }
}

// Funciones para compartir en redes sociales específicas
const shareToWhatsApp = () => {
  shareToSocial({
    platform: 'whatsapp',
    title: props.title,
    text: props.text,
    url: props.url
  })
  closeModal()
}

const shareToTwitter = () => {
  shareToSocial({
    platform: 'twitter',
    title: props.title,
    text: props.text,
    url: props.url
  })
  closeModal()
}

const shareToTelegram = () => {
  shareToSocial({
    platform: 'telegram',
    title: props.title,
    text: props.text,
    url: props.url
  })
  closeModal()
}

const copyLink = async () => {
  const success = await shareToSocial({
    platform: 'copy',
    title: props.title,
    text: props.text,
    url: props.url
  })
  
  if (success) {
    linkCopied.value = true
    setTimeout(() => {
      linkCopied.value = false
    }, 2000)
  }
}

// Cerrar modal con Escape
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.isOpen) {
      closeModal()
    }
  }
  
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>

<style scoped>
/* Animaciones para el modal */
.fixed {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style> 