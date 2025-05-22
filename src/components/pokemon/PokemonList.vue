<template>
  <div class="pokemon-list mt-16">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <!-- Aquí irían las tarjetas de Pokémon -->
      <div>Lista de Pokémon Cards</div>
    </div>
    
    <div class="flex justify-center mt-8">
      <button 
        @click="loadMorePokemon" 
        class="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg shadow-md transition-colors"
      >
        Cargar más Pokémon
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Estado para el control de la carga de más Pokémon
const isLoading = ref(false);

// Función para cargar más Pokémon
const loadMorePokemon = () => {
  isLoading.value = true;
  // Aquí iría la lógica para cargar más Pokémon
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
};
</script>