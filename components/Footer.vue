<template>
  <footer class="bg-base-200 border-t border-base-content/10">
    <div class="max-w-7xl mx-auto px-8 py-24">
      <div class="flex lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
        <div class="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
          <NuxtLink
            href="/#"
            aria-current="page"
            class="flex gap-2 justify-center md:justify-start items-center"
          >
            <NuxtImg
              src="/icon.png"
              :alt="`${config.appName} logo`"
              priority
              class="w-6 h-6"
              width="24"
              height="24"
            />
            <strong class="font-extrabold tracking-tight text-base md:text-lg">
              {{ config.appName }}
            </strong>
          </NuxtLink>

          <p class="mt-3 text-sm text-base-content/80">
            {{ config.appDescription }}
          </p>
          <p class="mt-3 text-sm text-base-content/60">
            {{ config.footer.copyright }}
          </p>

          <!-- Redes sociales -->
          <div v-if="config.footer.social.length > 0" class="mt-4 flex justify-center md:justify-start gap-4">
            <a
              v-for="social in config.footer.social"
              :key="social.name"
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              class="text-base-content/60 hover:text-primary transition-colors"
              :title="social.name"
            >
              <Icon :name="social.icon" class="w-5 h-5" />
            </a>
          </div>

          <a
            href="https://shipfa.st/?ref=NuxtFast_badge"
            title="Go to NuxtFast"
            target="_blank"
            class="mt-4 inline-block cursor-pointer rounded bg-neutral px-2 py-1 text-sm text-neutral-content ring-1 ring-base-content/10 duration-200 hover:ring-neutral"
          >
            <div class="flex items-center gap-1">
              <span class="opacity-90">Built with</span>
              <span class="flex items-center gap-0.5 font-semibold tracking-tight">
                <svg
                  class="size-5"
                  viewBox="0 0 375 509"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M233.962 11.7151L233.954 11.7229L186.393 57.3942L186.392 57.3948C116.335 124.657 57.1377 202.349 10.9069 287.707L10.8624 287.789L10.8164 287.87C10.5281 288.38 10.3791 288.954 10.383 289.537C10.387 290.12 10.5438 290.693 10.839 291.198C11.1342 291.704 11.5582 292.125 12.0701 292.419C12.5819 292.713 13.1633 292.868 13.756 292.869H129.042H139.042V302.869V494.875V494.888C139.042 495.535 139.229 496.17 139.584 496.715L131.361 502.072L139.584 496.715C139.939 497.26 140.447 497.692 141.048 497.957C141.648 498.222 142.314 498.308 142.963 498.202C143.613 498.096 144.215 497.804 144.698 497.365L144.7 497.363L165.966 477.999L165.97 477.996C239.677 410.959 302.226 332.637 351.272 245.969L351.274 245.966L364.435 222.73L364.44 222.721L364.445 222.712C364.735 222.203 364.885 221.627 364.882 221.043C364.879 220.459 364.723 219.886 364.427 219.379C364.132 218.872 363.707 218.45 363.194 218.156C362.681 217.862 362.099 217.707 361.505 217.707H361.5H249.685H239.685V207.707V14.1248C239.685 13.47 239.492 12.8285 239.129 12.28M233.962 11.7151L239.129 12.28M233.962 11.7151C234.438 11.2571 235.04 10.9473 235.694 10.8267C236.349 10.7061 237.024 10.7805 237.635 11.0399C238.246 11.2993 238.765 11.7314 239.129 12.28M233.962 11.7151L247.465 6.75675L239.129 12.28"
                    fill="#FFBE18"
                    stroke="black"
                    stroke-width="20"
                  />
                </svg>
                NuxtFast
              </span>
            </div>
          </a>
        </div>
        
        <div class="flex-grow flex flex-wrap justify-center -mb-10 md:mt-0 mt-10 text-center">
          <div
            v-for="section in config.footer.links"
            :key="section.title"
            class="lg:w-1/3 md:w-1/2 w-full px-4"
          >
            <div class="footer-title font-semibold text-base-content tracking-widest text-sm md:text-left mb-3">
              {{ section.title.toUpperCase() }}
            </div>

            <div class="flex flex-col justify-center items-center md:items-start gap-2 mb-10 text-sm">
              <NuxtLink
                v-for="item in section.items"
                :key="item.name"
                :to="item.href"
                class="link link-hover"
              >
                {{ item.name }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { config } from '~/config'
</script> 