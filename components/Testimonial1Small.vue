<template>
  <section
    id="testimonials"
    class="relative isolate overflow-hidden bg-base-100 px-8 py-24 sm:py-32"
  >
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.base-300),theme(colors.base-100))] opacity-20" />
    <div class="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-base-100 shadow-lg ring-1 ring-base-content/10 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
    <div class="mx-auto max-w-2xl lg:max-w-5xl">
      <figure class="mt-10">
        <div class="flex flex-col lg:flex-row items-center gap-12">
          <div class="relative rounded-xl border border-base-content/5 bg-base-content/5 p-1.5 sm:-rotate-1">
            <NuxtImg
              width="320"
              height="320"
              class="rounded-lg max-w-[320px] md:max-w-[280px] lg:max-w-[320px] object-center border-2 border-white/10 shadow-md"
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2488&q=80"
              alt="Un testimonio de un cliente satisfecho"
            />
          </div>

          <div>
            <blockquote class="text-xl font-medium leading-8 text-base-content sm:text-2xl sm:leading-10">
              Obtuve tu boilerplate y tener la configuración de pagos con Stripe + autenticación de usuarios es una bendición. Esto me ahorrará como una semana de trabajo por cada nuevo proyecto que inicie. Aprecio que esté bien documentado también. ¡100% vale la pena!
            </blockquote>
            <figcaption class="mt-10 flex items-center justify-start gap-5">
              <div class="text-base">
                <div class="font-semibold text-base-content mb-0.5">
                  Amanda Lou
                </div>
                <div class="text-base-content/60">
                  Indie Maker y Desarrolladora
                </div>
              </div>

              <NuxtImg
                width="150"
                height="50"
                class="w-20 md:w-24"
                src="https://logos-world.net/wp-content/uploads/2020/10/Reddit-Logo.png"
                alt="Logo de Reddit"
              />
            </figcaption>
          </div>
        </div>
      </figure>
    </div>
  </section>
</template> 