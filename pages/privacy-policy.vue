<template>
  <main class="max-w-xl mx-auto">
    <div class="p-5">
      <NuxtLink to="/" class="btn btn-ghost">
        <Icon name="heroicons:arrow-left" class="w-5 h-5" />
        Volver
      </NuxtLink>

      <h1 class="text-3xl font-extrabold pb-6">
        Política de Privacidad de {{ config.appName }}
      </h1>

      <pre
        class="leading-relaxed whitespace-pre-wrap"
        style="font-family: sans-serif"
      >
Última actualización: {{ new Date().toLocaleDateString('es-ES') }}

Gracias por visitar {{ config.appName }} ("nosotros," "nos," o "nuestro"). Esta Política de Privacidad describe cómo recopilamos, utilizamos y protegemos su información personal y no personal cuando utiliza nuestro sitio web ubicado en https://{{ config.domainName }} (el "Sitio Web").

Al acceder o utilizar el Sitio Web, usted acepta los términos de esta Política de Privacidad. Si no está de acuerdo con las prácticas descritas en esta política, por favor no utilice el Sitio Web.

1. Información que Recopilamos

1.1 Datos Personales

Recopilamos la siguiente información personal:

- Nombre: Para personalizar su experiencia y comunicarnos con usted de manera efectiva.
- Correo electrónico: Para enviarle información importante sobre sus pedidos, actualizaciones y comunicaciones.
- Información de pago: Para procesar sus pedidos de forma segura. No almacenamos su información de pago en nuestros servidores. Los pagos son procesados por procesadores de pago de terceros de confianza.

1.2 Datos No Personales

Podemos utilizar cookies web y tecnologías similares para recopilar información no personal como su dirección IP, tipo de navegador, información del dispositivo y patrones de navegación. Esta información nos ayuda a mejorar su experiencia de navegación, analizar tendencias y mejorar nuestros servicios.

2. Propósito de la Recopilación de Datos

Recopilamos y utilizamos sus datos personales con el único propósito de procesar pedidos. Esto incluye procesar sus pedidos, enviar confirmaciones de pedidos, proporcionar soporte al cliente y mantenerlo actualizado sobre el estado de sus pedidos.

3. Compartir Datos

No compartimos sus datos personales con terceros, excepto cuando sea necesario para el procesamiento de pedidos (por ejemplo, compartir su información con procesadores de pago). No vendemos, comerciamos ni alquilamos su información personal a terceros.

4. Privacidad de los Niños

{{ config.appName }} no está destinado a niños menores de 13 años. No recopilamos intencionalmente información personal de niños. Si usted es padre o tutor y cree que su hijo nos ha proporcionado información personal, póngase en contacto con nosotros en el correo electrónico proporcionado a continuación.

5. Actualizaciones de la Política de Privacidad

Podemos actualizar esta Política de Privacidad de vez en cuando para reflejar cambios en nuestras prácticas o por otras razones operativas, legales o regulatorias. Cualquier actualización será publicada en esta página, y podemos notificarle por correo electrónico sobre cambios significativos.

6. Información de Contacto

Si tiene alguna pregunta, inquietud o solicitud relacionada con esta Política de Privacidad, puede contactarnos en:

Correo electrónico: {{ config.resend.supportEmail }}

Para todas las demás consultas, visite nuestra página de Contacto en el Sitio Web.

Al utilizar {{ config.appName }}, usted acepta los términos de esta Política de Privacidad.</pre>
    </div>
  </main>
</template>

<script setup lang="ts">
import { config } from '~/config'

useHead({
  title: `Política de Privacidad | ${config.appName}`,
  meta: [
    {
      name: 'description',
      content: `Política de privacidad de ${config.appName}. Lea cómo protegemos y utilizamos sus datos.`
    }
  ]
})
</script> 