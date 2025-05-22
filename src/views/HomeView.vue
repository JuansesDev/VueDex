// src/views/HomeView.vue
<template>
  <div class="container mx-auto px-4 pb-12">
    <!-- Componente de filtrado -->
    <PokemonFilter class="mt-4" />
    
    <!-- Estado de carga inicial -->
    <div v-if="pokemonStore.isLoadingList && !hasDisplayedPokemon" class="text-center my-12">
      <LoadingSpinner />
      <p class="mt-2 text-gray-600">Cargando Pokémon...</p>
    </div>
    
    <!-- Estado de error -->
    <div v-if="pokemonStore.errorList && !hasDisplayedPokemon" class="my-8">
      <ErrorMessage :message="pokemonStore.errorList" />
      <div class="text-center mt-4">
        <button 
          @click="reloadPokemon" 
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reintentar
        </button>
      </div>
    </div>

    <!-- Lista de Pokémon -->
    <div v-if="hasDisplayedPokemon">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6 mt-8 mb-8">
        <PokemonCard
          v-for="pokemonItem in pokemonStore.displayList" 
          :key="pokemonItem.name" 
          :pokemon="pokemonItem" 
        />
      </div>
      
      <!-- Mensaje cuando no hay resultados en los filtros -->
      <div v-if="pokemonStore.isFilterActive && pokemonStore.filteredList.length === 0 && !pokemonStore.isLoadingList" 
           class="text-center my-10 py-6 bg-gray-50 rounded-lg">
        <p class="text-gray-600">No se encontraron Pokémon que coincidan con los filtros seleccionados.</p>
        <button 
          @click="pokemonStore.clearFilters()" 
          class="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Limpiar filtros
        </button>
      </div>
    </div>

    <!-- Mensaje cuando no hay Pokémon -->
    <p v-if="!pokemonStore.isLoadingList && !pokemonStore.errorList && !hasDisplayedPokemon" 
       class="text-center text-gray-500 mt-8 py-10">
      No se encontraron Pokémon. ¡Intenta recargar o verifica tu conexión!
    </p>

    <!-- Botón de Cargar Más (solo visible cuando no hay filtros activos) -->
    <div 
      class="text-center mt-12 mb-8" 
      v-if="!pokemonStore.isFilterActive && hasDisplayedPokemon && !pokemonStore.errorList" 
      role="navigation" 
      aria-label="Paginación de Pokémon"
    >
       <button
          @click="loadMorePokemon"
          :disabled="pokemonStore.isLoadingList"
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transform hover:scale-105 active:scale-95"
        >
          <span v-if="pokemonStore.isLoadingList">
            <LoadingSpinner class="inline-block w-5 h-5 mr-2 border-2 border-white border-t-transparent" />
            Cargando...
          </span>
          <span v-else>Cargar más Pokémon</span>
        </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { usePokemonStore } from '@/stores/pokemon.js';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ErrorMessage from '@/components/common/ErrorMessage.vue';
import PokemonCard from '@/components/pokemon/PokemonCard.vue';
import PokemonFilter from '@/components/pokemon/PokemonFilter.vue';

const pokemonStore = usePokemonStore();
const itemsPerPage = 20;
// currentPage ahora se basa en la longitud de la lista para continuar correctamente
let currentPage = Math.floor(pokemonStore.pokemonList.length / itemsPerPage);

// Computed para verificar si hay Pokémon para mostrar
const hasDisplayedPokemon = computed(() => {
  // Si hay filtros activos, verificamos la lista filtrada
  if (pokemonStore.isFilterActive) {
    return pokemonStore.filteredList.length > 0;
  }
  // Si no hay filtros, verificamos la lista original
  return pokemonStore.pokemonList.length > 0;
});

const loadPokemon = async () => {
  const offset = currentPage * itemsPerPage;
  await pokemonStore.fetchPokemonList(offset, itemsPerPage);
  
  if (!pokemonStore.errorList) { 
     currentPage++;
  }
};

const loadMorePokemon = () => {
  loadPokemon();
};

const reloadPokemon = () => {
  currentPage = 0;
  pokemonStore.clearFilters();
  loadPokemon();
};

onMounted(() => {
  // Si la lista está vacía al montar, cargar la primera página.
  if (pokemonStore.pokemonList.length === 0) {
    currentPage = 0;
    loadPokemon();
  }
});
</script>

<style scoped>
.container { 
  max-width: 1380px;
}
</style>