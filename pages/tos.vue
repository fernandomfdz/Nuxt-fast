<template>
  <main class="max-w-xl mx-auto">
    <div class="p-5">
      <NuxtLink to="/" class="btn btn-ghost">
        <Icon name="heroicons:arrow-left" class="w-5 h-5" />
        Volver
      </NuxtLink>

      <h1 class="text-3xl font-extrabold pb-6">
        Términos y Condiciones de {{ config.appName }}
      </h1>

      <pre
        class="leading-relaxed whitespace-pre-wrap"
        style="font-family: sans-serif"
      >
Última actualización: {{ new Date().toLocaleDateString('es-ES') }}

¡Bienvenido a {{ config.appName }}!

Estos Términos de Servicio ("Términos") rigen su uso del sitio web de {{ config.appName }} en https://{{ config.domainName }} ("Sitio Web") y los servicios proporcionados por {{ config.appName }}. Al utilizar nuestro Sitio Web y servicios, usted acepta estos Términos.

1. Descripción de {{ config.appName }}

{{ config.appName }} es una plataforma que ofrece {{ config.appDescription }}.

2. Propiedad y Derechos de Uso

Cuando compra un paquete de {{ config.appName }}, obtiene el derecho a descargar y utilizar el código proporcionado para crear aplicaciones. Usted es propietario del código que crea, pero no tiene derecho a revenderlo. Ofrecemos un reembolso completo dentro de los 7 días posteriores a la compra, según lo especificado en nuestra política de reembolso.

3. Datos del Usuario y Privacidad

Recopilamos y almacenamos datos del usuario, incluyendo nombre, correo electrónico e información de pago, según sea necesario para proporcionar nuestros servicios. Para obtener detalles sobre cómo manejamos sus datos, consulte nuestra Política de Privacidad en https://{{ config.domainName }}/privacy-policy.

4. Recopilación de Datos No Personales

Utilizamos cookies web para recopilar datos no personales con el propósito de mejorar nuestros servicios y la experiencia del usuario.

5. Ley Aplicable

Estos Términos se rigen por las leyes de España.

6. Actualizaciones de los Términos

Podemos actualizar estos Términos de vez en cuando. Los usuarios serán notificados de cualquier cambio por correo electrónico.

7. Limitación de Responsabilidad

{{ config.appName }} y sus propietarios, empleados y afiliados no serán responsables de ningún daño directo, indirecto, incidental, especial o consecuente que resulte del uso o la imposibilidad de usar nuestros servicios.

8. Cuenta de Usuario

Usted es responsable de mantener la confidencialidad de su cuenta y contraseña. Debe notificarnos inmediatamente sobre cualquier uso no autorizado de su cuenta.

9. Propiedad Intelectual

Todo el contenido presente en {{ config.appName }}, incluyendo pero no limitado a texto, gráficos, logotipos, iconos, imágenes, clips de audio, descargas digitales y compilaciones de datos, es propiedad de {{ config.appName }} o sus proveedores de contenido y está protegido por las leyes internacionales de derechos de autor.

10. Terminación

Nos reservamos el derecho de terminar o suspender su acceso a nuestros servicios inmediatamente, sin previo aviso ni responsabilidad, por cualquier razón.

Para cualquier pregunta o inquietud con respecto a estos Términos de Servicio, por favor contáctenos en:

Correo electrónico: {{ config.resend.supportEmail }}

¡Gracias por usar {{ config.appName }}!</pre>
    </div>
  </main>
</template>

<script setup lang="ts">
import { config } from '~/config'

useHead({
  title: `Términos y Condiciones | ${config.appName}`,
  meta: [
    {
      name: 'description',
      content: `Términos y condiciones de uso de ${config.appName}. Lea nuestras políticas y condiciones de servicio.`
    }
  ]
})
</script> 