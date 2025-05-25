<script setup lang="ts">
import { config } from '~/config'

interface Testimonial {
  username?: string
  name: string
  text: string
  img?: string
}

const testimonials: Testimonial[] = [
  {
    username: 'marclou',
    name: 'Marc Lou',
    text: '¡Muy fácil de usar! Los tutoriales son realmente útiles y explican cómo funciona todo. ¡Espero lanzar mi próximo proyecto muy rápido!',
    img: 'https://pbs.twimg.com/profile_images/1514863683574599681/9k7PqDTA_400x400.jpg'
  },
  {
    username: 'the_mcnaveen',
    name: 'Naveen',
    text: 'Configurar todo desde cero es un proceso realmente difícil y que consume mucho tiempo. Lo que pagas definitivamente te ahorrará tiempo.'
  },
  {
    username: 'wahab',
    name: 'Wahab Shaikh',
    text: 'Me ahorra fácilmente más de 15 horas configurando cosas triviales. Ahora puedo centrarme directamente en lanzar funcionalidades en lugar de pasar horas configurando las mismas tecnologías desde cero. ¡Se siente como un superpoder! :D'
  }
]
</script>

<template>
  <section id="testimonials">
    <div class="py-24 px-8 max-w-7xl mx-auto">
      <div class="flex flex-col text-center w-full mb-20">
        <div class="mb-8">
          <h2 class="sm:text-5xl text-4xl font-extrabold text-base-content">
            ¡212 creadores ya están lanzando más rápido!
          </h2>
        </div>
        <p class="lg:w-2/3 mx-auto leading-relaxed text-base text-base-content/80">
          No tomes solo nuestra palabra. Esto es lo que dicen sobre {{ config.appName }}.
        </p>
      </div>

      <ul
        role="list"
        class="flex flex-col items-center lg:flex-row lg:items-stretch gap-6 lg:gap-8"
      >
        <li
          v-for="(testimonial, i) in testimonials"
          :key="i"
        >
          <figure class="relative max-w-lg h-full p-6 md:p-10 bg-base-200 rounded-2xl max-md:text-sm flex flex-col">
            <blockquote class="relative flex-1">
              <p class="text-base-content/80 leading-relaxed">
                {{ testimonial.text }}
              </p>
            </blockquote>
            <figcaption class="relative flex items-center justify-start gap-4 pt-4 mt-4 md:gap-8 md:pt-8 md:mt-8 border-t border-base-content/5">
              <div class="w-full flex items-center justify-between gap-2">
                <div>
                  <div class="font-medium text-base-content md:mb-0.5">
                    {{ testimonial.name }}
                  </div>
                  <div
                    v-if="testimonial.username"
                    class="mt-0.5 text-sm text-base-content/80"
                  >
                    @{{ testimonial.username }}
                  </div>
                </div>

                <div class="overflow-hidden rounded-full bg-base-300 shrink-0">
                  <template v-if="testimonial.img">
                    <NuxtImg
                      class="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                      :src="testimonial.img"
                      :alt="`Testimonio de ${testimonial.name} para ${config.appName}`"
                      width="48"
                      height="48"
                    />
                  </template>
                  <template v-else>
                    <span class="w-10 h-10 md:w-12 md:h-12 rounded-full flex justify-center items-center text-lg font-medium bg-base-300">
                      {{ testimonial.name.charAt(0) }}
                    </span>
                  </template>
                </div>
              </div>
            </figcaption>
          </figure>
        </li>
      </ul>
    </div>
  </section>
</template> 