// src/App.vue
<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white text-gray-800 p-4 shadow-sm border-b border-gray-200">
      <div class="container mx-auto flex justify-between items-center">
        <router-link to="/" class="text-2xl font-bold text-blue-600">VueDex</router-link>
        <nav>
          <router-link to="/" class="mx-2 hover:text-blue-500 transition-colors">Inicio</router-link>
          <router-link to="/about" class="mx-2 hover:text-blue-500 transition-colors">Acerca de</router-link>
        </nav>
      </div>
    </header>
    <main class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div id="app-wrapper">
        <RouterView />
      </div>
    </main>
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