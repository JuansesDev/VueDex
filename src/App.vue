// src/App.vue
<template>
  <div id="app-wrapper">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style>
/* Puedes añadir estilos globales aquí si no los maneja Tailwind completamente */
/* Por ejemplo, un color de fondo base para body si es necesario */
/* body {
  @apply bg-gray-100;
} */
</style>