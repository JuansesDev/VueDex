// src/views/AboutView.vue
<template>
  <div class="about-view py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
        Acerca de VueDex
      </h1>
      
      <section class="mb-6">
        <p class="text-gray-700 leading-relaxed text-lg">
          <strong>VueDex</strong> es una aplicación web interactiva diseñada para explorar el fascinante mundo de los Pokémon. Permite a los usuarios navegar por una extensa lista de Pokémon, ver detalles específicos de cada uno, incluyendo sus estadísticas, tipos, habilidades e imágenes, y realizar búsquedas para encontrar a sus criaturas favoritas rápidamente.
        </p>
        <p class="text-gray-700 leading-relaxed mt-4 text-lg">
          Este proyecto fue desarrollado como parte de una prueba técnica de frontend, con el objetivo de demostrar habilidades en el desarrollo de interfaces de usuario modernas, consumo de APIs públicas y aplicación de buenas prácticas en el desarrollo web.
        </p>
      </section>

      <section class="mb-6">
        <h2 class="text-2xl font-semibold text-gray-700 mb-3">Tecnologías Utilizadas</h2>
        <ul class="list-disc list-inside text-gray-700 space-y-2 text-lg">
          <li><strong>Vue.js 3.5:</strong> Framework progresivo para la construcción de interfaces de usuario.</li>
          <li><strong>Vite 6:</strong> Herramienta de desarrollo frontend moderna y extremadamente rápida.</li>
          <li><strong>Pinia 3:</strong> Gestor de estado intuitivo y modular para Vue.js.</li>
          <li><strong>Vue Router 4:</strong> Para la gestión de rutas en esta Single Page Application (SPA).</li>
          <li><strong>Tailwind CSS 4:</strong> Framework CSS utility-first para un diseño rápido y personalizable.</li>
          <li><strong>PokéAPI (pokeapi.co):</strong> API pública utilizada para obtener todos los datos de los Pokémon.</li>
          <li><strong>Vitest 3:</strong> Framework de pruebas unitarias rápido y compatible con Vite.</li>
          <li><strong>ESLint 9 & Prettier 3:</strong> Para asegurar la calidad y consistencia del código.</li>
        </ul>
      </section>

      <section>
        <h2 class="text-2xl font-semibold text-gray-700 mb-3">Desarrollado por</h2>
        <p class="text-gray-700 text-lg">
          JuansesDev <span class="text-gray-500">(¡Hola!)</span>
          <br />
          <a href="https://github.com/JuansesDev/VueDex" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 hover:underline">
            GitHub: JuansesDev/VueDex
          </a>
        </p>
      </section>
      
      <div class="mt-8 text-center">
        <router-link 
          to="/" 
          class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          Explorar Pokémon
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// Este componente no requiere lógica JavaScript adicional
</script>

<style scoped>
</style>