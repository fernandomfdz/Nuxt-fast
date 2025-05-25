<template>
  <div>
    <h1>Página Aislada</h1>
    <p>Esta página no debería tener problemas de auth.</p>
  </div>
</template>

<script setup>
// Deshabilitar layout para evitar problemas
definePageMeta({
  layout: false
})

console.log('Página aislada cargada')
</script> 