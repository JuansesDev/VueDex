// src/views/PokemonDetailView.vue
<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">Detalles de: {{ pokemonName }}</h2>
    <p>Más detalles del Pokémon aparecerán aquí.</p>
    <!-- Aquí irá el componente PokemonDetailCard -->
    <router-link to="/" class="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Volver a la lista
    </router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const pokemonName = computed(() => route.params.name);

// Lógica para obtener y mostrar los detalles del Pokémon más adelante
</script>