<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold">Página de Prueba Simple</h1>
    <p>Esta página no usa auth y debería funcionar correctamente.</p>
    <p>Hora actual: {{ new Date().toLocaleString() }}</p>
  </div>
</template>

<script setup>
// No usar ningún composable de auth aquí
console.log('Página simple cargada correctamente')
</script> 