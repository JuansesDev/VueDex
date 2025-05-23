<template>
  <div class="pokemon-list-container mt-16">
    <!-- Estado de carga -->
    <div v-if="pokemonStore.isLoadingList && !displayList.length" class="flex flex-col items-center py-10">
      <LoadingSpinner class="w-12 h-12 text-blue-500" />
      <p class="mt-4 text-lg text-gray-600">Cargando Pokémon...</p>
    </div>
    
    <!-- Estado de error -->
    <div v-else-if="pokemonStore.errorList" class="py-10">
      <ErrorMessage :message="pokemonStore.errorList" />
      <div class="flex justify-center mt-4">
        <button 
          @click="pokemonStore.fetchPokemonList()" 
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
    
    <!-- Sin resultados con filtros activos -->
    <div v-else-if="pokemonStore.isFilterActive && !pokemonStore.filteredList.length" class="py-10 text-center">
      <p class="text-lg text-gray-600">No se encontraron Pokémon que coincidan con los filtros.</p>
      <button 
        @click="pokemonStore.clearFilters()" 
        class="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
      >
        Limpiar Filtros
      </button>
    </div>
    
    <!-- Sin resultados en la carga inicial -->
    <div v-else-if="!pokemonStore.isFilterActive && !pokemonStore.pokemonList.length && !pokemonStore.isLoadingList" class="py-10 text-center">
      <p class="text-lg text-gray-600">No se encontraron Pokémon. Intenta recargar.</p>
      <button 
        @click="pokemonStore.fetchPokemonList()" 
        class="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
      >
        Recargar
      </button>
    </div>
    
    <!-- Resultados de Pokémon -->
    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <PokemonCard 
          v-for="pokemon in displayList" 
          :key="pokemon.name" 
          :pokemon="pokemon"
          class="pokemon-card"
        />
      </div>
      
      <!-- Botón de cargar más -->
      <div class="flex justify-center mt-8" v-if="!pokemonStore.isFilterActive && pokemonStore.hasMorePokemon">
        <button 
          @click="pokemonStore.loadMorePokemon()" 
          class="load-more px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg shadow-md transition-colors flex items-center space-x-2"
          :disabled="pokemonStore.isLoadingList"
        >
          <LoadingSpinner v-if="pokemonStore.isLoadingList" class="w-5 h-5" />
          <span>{{ pokemonStore.isLoadingList ? 'Cargando...' : 'Cargar más Pokémon' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { usePokemonStore } from '@/stores/pokemon.js';
import PokemonCard from '@/components/pokemon/PokemonCard.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ErrorMessage from '@/components/common/ErrorMessage.vue';

const pokemonStore = usePokemonStore();

// Computed para determinar qué lista mostrar basándose en los filtros
const displayList = computed(() => {
  return pokemonStore.isFilterActive ? pokemonStore.filteredList : pokemonStore.pokemonList;
});

// Cargar datos al montar el componente
onMounted(() => {
  if (pokemonStore.pokemonList.length === 0) {
    pokemonStore.fetchPokemonList();
  }
});
</script>

<style scoped>
.pokemon-list-container {
  min-height: 400px;
}

.pokemon-card {
  transition: transform 0.3s ease;
}

.pokemon-card:hover {
  transform: translateY(-5px);
}
</style>