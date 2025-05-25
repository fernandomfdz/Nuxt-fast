<script setup lang="ts">
import { ref } from 'vue'
import { config } from '~/config'

interface RefType {
  id: string
  ariaLabel?: string
  icon: string
}

interface Testimonial {
  username?: string
  name: string
  text: string
  type: RefType
  link?: string
  img?: string
  videoSrc?: string
  videoPoster?: string
  videoHeight?: number
  videoWidth?: number
  videoType?: string
}

// Tipos de referencias (Twitter, Product Hunt, etc.)
const refTypes = {
  productHunt: {
    id: 'product_hunt',
    ariaLabel: 'Ver reseña de usuario en Product Hunt',
    icon: 'custom:product-hunt'
  },
  twitter: {
    id: 'twitter',
    ariaLabel: 'Ver publicación de usuario en Twitter',
    icon: 'custom:twitter'
  },
  video: {
    id: 'video',
    icon: 'heroicons:video-camera'
  },
  other: {
    id: 'other',
    icon: 'heroicons:chat-bubble-left-ellipsis'
  }
} as const

// Lista de testimonios
const testimonials: Testimonial[] = [
  {
    username: 'marclou',
    name: 'Marc Lou',
    text: 'Realmente fácil de usar. Los tutoriales son muy útiles y explican cómo funciona todo. ¡Espero lanzar mi próximo proyecto muy rápido!',
    type: refTypes.twitter,
    link: 'https://twitter.com/marc_louvion',
    img: 'https://pbs.twimg.com/profile_images/1514863683574599681/9k7PqDTA_400x400.jpg'
  },
  {
    username: 'the_mcnaveen',
    name: 'Naveen',
    text: 'Configurar todo desde cero es un proceso realmente difícil y que consume mucho tiempo. Lo que pagas definitivamente te ahorrará tiempo.',
    type: refTypes.twitter,
    link: 'https://twitter.com/the_mcnaveen'
  },
  {
    username: 'wahab',
    name: 'Wahab Shaikh',
    text: 'Me ahorra fácilmente más de 15 horas configurando cosas triviales. Ahora puedo centrarme directamente en implementar funciones en lugar de pasar horas configurando las mismas tecnologías desde cero. ¡Se siente como un superpoder! :D',
    type: refTypes.productHunt,
    link: 'https://www.producthunt.com/products/NuxtFast-2/reviews?review=667971'
  },
  {
    name: 'Sean',
    text: '¡Acabo de comprarlo y clonarlo y *guau!* ¡Me encanta lo que estoy viendo aquí!',
    type: refTypes.other
  },
  {
    username: 'krishna',
    name: 'Krishna Kant',
    text: 'Finalmente un buen boilerplate para Nuxt, ahora no tengo que llorar comparándolo con el ecosistema de Laravel.',
    type: refTypes.productHunt,
    link: 'https://www.producthunt.com/posts/NuxtFast-2?comment=2707061'
  },
  {
    username: 'imgyf',
    name: 'Yifan Goh',
    text: 'Es un cambio de juego 🚀 Viene con tutoriales fáciles de seguir y te ahorra mucho tiempo. ¿Qué más se puede pedir?',
    type: refTypes.twitter,
    link: 'https://twitter.com/imgyf/status/1697549891080532236?s=20'
  },
  {
    name: 'Yazdun',
    text: 'Oye Marc, conseguí el boilerplate, es fantástico, me acabas de ahorrar 10 horas en cada proyecto',
    type: refTypes.other
  },
  {
    name: 'Marc Lou',
    text: 'La herramienta es exactamente lo que ni siquiera sabía que necesitaba.',
    videoPoster: 'https://d1wkquwg5s1b04.cloudfront.net/demo/marcPoster.jpg',
    videoSrc: 'https://d1wkquwg5s1b04.cloudfront.net/demo/marcVideo.mp4',
    videoHeight: 250,
    videoWidth: 500,
    videoType: 'video/mp4',
    type: refTypes.video
  },
  {
    username: 'zawwadx',
    name: 'Zawwad Ul Sami',
    text: 'Es un boilerplate minimalista y ligero increíble con código bien organizado. Tiene casi todas las características principales que querrías en un boilerplate SaaS. Como equipo nuevo el año pasado, nos llevó meses construir un conjunto similar de características a un nivel estable.',
    type: refTypes.twitter
  },
  {
    username: 'dan',
    name: 'Dan Mindru',
    text: 'Probablemente una de las cosas más poderosas que puedes "npm install" que he visto',
    type: refTypes.productHunt,
    link: 'https://www.producthunt.com/posts/NuxtFast-2?comment=2706763'
  },
  {
    username: 'VicPivots',
    name: 'Victor Abeledo',
    text: 'Marc, conseguí tu boilerplate y tener la configuración de pagos con Stripe + autenticación de usuarios es una bendición. Esto me ahorrará como una semana de trabajo por cada nuevo proyecto que inicie. Aprecio que esté bien documentado también. 100% vale la pena 🚀🚀🚀',
    type: refTypes.twitter,
    link: 'https://twitter.com/VicPivots/status/1697352442986250413?s=20'
  }
]
</script>

<template>
  <section class="py-24">
    <div class="max-w-6xl px-8 mx-auto">
      <ul class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="(testimonial, i) in testimonials"
          :key="i"
          :class="{
            'lg:col-span-2 lg:text-lg': i === testimonials.length - 1
          }"
        >
          <!-- Testimonial de Video -->
          <div
            v-if="testimonial.type.id === 'video'"
            class="relative h-full p-6 bg-base-100 rounded-lg"
          >
            <video
              :poster="testimonial.videoPoster"
              :width="testimonial.videoWidth"
              :height="testimonial.videoHeight"
              controls
              class="w-full rounded-lg"
            >
              <source
                :src="testimonial.videoSrc"
                :type="testimonial.videoType"
              >
              Tu navegador no soporta el elemento de video.
            </video>

            <figcaption class="relative flex items-center justify-start gap-4 pt-4 mt-4 border-t border-base-content/5">
              <div class="overflow-hidden rounded-full bg-base-300 shrink-0">
                <span class="w-10 h-10 rounded-full flex justify-center items-center text-lg font-medium">
                  {{ testimonial.name.charAt(0) }}
                </span>
              </div>
              <div>
                <div class="text-sm font-medium text-base-content">
                  {{ testimonial.name }}
                </div>
                <div
                  v-if="testimonial.username"
                  class="mt-0.5 text-sm text-base-content/80"
                >
                  @{{ testimonial.username }}
                </div>
              </div>
            </figcaption>
          </div>

          <!-- Testimonial Normal -->
          <figure
            v-else
            class="relative h-full p-6 bg-base-100 rounded-lg"
          >
            <blockquote class="relative">
              <p class="text-sm text-base-content/80">
                {{ testimonial.text }}
              </p>
            </blockquote>

            <figcaption class="relative flex items-center justify-start gap-4 pt-4 mt-4 border-t border-base-content/5">
              <div class="overflow-hidden rounded-full bg-base-300 shrink-0">
                <NuxtImg
                  v-if="testimonial.img"
                  class="w-10 h-10 rounded-full object-cover"
                  :src="testimonial.img"
                  :alt="`Testimonio de ${testimonial.name} para ${config.appName}`"
                  width="48"
                  height="48"
                />
                <span
                  v-else
                  class="w-10 h-10 rounded-full flex justify-center items-center text-lg font-medium"
                >
                  {{ testimonial.name.charAt(0) }}
                </span>
              </div>

              <div class="w-full flex items-end justify-between gap-2">
                <div>
                  <div class="text-sm font-medium text-base-content">
                    {{ testimonial.name }}
                  </div>
                  <div
                    v-if="testimonial.username"
                    class="mt-0.5 text-sm text-base-content/80"
                  >
                    @{{ testimonial.username }}
                  </div>
                </div>

                <NuxtLink
                  v-if="testimonial.link"
                  :to="testimonial.link"
                  target="_blank"
                  class="shrink-0"
                  :aria-label="testimonial.type.ariaLabel"
                >
                  <Icon
                    :name="testimonial.type.icon"
                    class="w-5 h-5"
                    :class="{
                      'fill-[#00aCee]': testimonial.type.id === 'twitter',
                      'fill-[#da552f]': testimonial.type.id === 'product_hunt'
                    }"
                  />
                </NuxtLink>
              </div>
            </figcaption>
          </figure>
        </li>
      </ul>
    </div>
  </section>
</template> 