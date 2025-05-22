// src/App.vue
<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar />
    <main class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div id="app-wrapper">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
</script>

<style>
/* Estilos globales que no son manejados por Tailwind */
</style>