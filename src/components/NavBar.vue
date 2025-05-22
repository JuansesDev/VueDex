<template>
  <header class="bg-white text-gray-800 p-4 shadow-sm border-b border-gray-200">
    <div class="container mx-auto flex justify-between items-center">
      <router-link to="/" class="flex items-center text-2xl font-bold text-green-600">
        <img src="/VueDexIcon.png" alt="VueDex Icon" class="h-8 w-8 mr-2" />
        VueDex
      </router-link>
      <nav>
        <router-link to="/" class="mx-2 text-gray-700 hover:text-green-600 hover:bg-green-50 px-3 py-2 rounded-md transition-colors">Inicio</router-link>
        <router-link to="/about" class="mx-2 text-gray-700 hover:text-green-600 hover:bg-green-50 px-3 py-2 rounded-md transition-colors">Acerca de</router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
// No additional logic needed at this time
</script>
