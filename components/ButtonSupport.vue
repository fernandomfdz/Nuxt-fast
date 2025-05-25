<script setup lang="ts">
import { Crisp } from 'crisp-sdk-web'
import { config } from '~/config'

const handleClick = () => {
  if (config.crisp?.id) {
    Crisp.chat.show()
    Crisp.chat.open()
  } else if (config.resend?.supportEmail) {
    // Abrir el cliente de correo predeterminado en una nueva ventana con "necesito ayuda con ${config.appName}" como asunto
    window.open(
      `mailto:${config.resend.supportEmail}?subject=Necesito ayuda con ${config.appName}`,
      '_blank'
    )
  }
}
</script>

<template>
  <button
    class="btn btn-sm"
    data-tooltip-id="tooltip"
    data-tooltip-content="Hablar con soporte"
    title="Chat con soporte"
    @click="handleClick"
  >
    <Icon
      name="heroicons:chat-bubble-left-right"
      class="w-5 h-5"
    />
    Soporte
  </button>
</template> 