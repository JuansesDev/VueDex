// src/views/HomeView.vue
<template>
  <div class="container mx-auto px-4 pb-12">
    <!-- El título que pusiste en App.vue ya es "VueDex", así que quizás no necesites otro aquí,
         o puedes hacerlo más específico como "Lista de Pokémon" -->
    <!-- <h1 class="text-3xl font-bold mb-8 text-center text-gray-800">Explorar Pokémon</h1> -->

    <div v-if="pokemonStore.isLoadingList && pokemonStore.pokemonList.length === 0" class="text-center my-12">
      <LoadingSpinner />
    </div>
    <div v-if="pokemonStore.errorList && pokemonStore.pokemonList.length === 0" class="my-8">
      <ErrorMessage :message="pokemonStore.errorList" />
    </div>

    <div v-if="pokemonStore.pokemonList.length > 0">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6">
        <PokemonCard
          v-for="pokemonItem in pokemonStore.pokemonList" 
          :key="pokemonItem.name" 
          :pokemon="pokemonItem" 
        /> <!-- Aquí se pasa { name, url } -->
      </div>
    </div>

    <p v-if="!pokemonStore.isLoadingList && !pokemonStore.errorList && pokemonStore.pokemonList.length === 0" class="text-center text-gray-500 mt-8 py-10">
      No se encontraron Pokémon. ¡Intenta recargar o verifica tu conexión!
    </p>

    <!-- Botón de Cargar Más -->
    <div 
      class="text-center mt-12 mb-8" 
      v-if="!pokemonStore.errorList && pokemonStore.pokemonList.length > 0" 
      role="navigation" 
      aria-label="Paginación de Pokémon"
    >
       <button
          @click="loadMorePokemon"
          :disabled="pokemonStore.isLoadingList"
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transform hover:scale-105 active:scale-95"
        >
          <span v-if="pokemonStore.isLoadingList && pokemonStore.pokemonList.length > 0">
            <LoadingSpinner class="inline-block w-5 h-5 mr-2 border-2 border-white border-t-transparent" />
            Cargando...
          </span>
          <span v-else>Cargar más Pokémon</span>
        </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'; // ref no se usa aquí, se podría quitar
import { usePokemonStore } from '@/stores/pokemon.js';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ErrorMessage from '@/components/common/ErrorMessage.vue';
import PokemonCard from '@/components/pokemon/PokemonCard.vue';

const pokemonStore = usePokemonStore();
const itemsPerPage = 20;
// currentPage ahora se basa en la longitud de la lista para continuar correctamente
let currentPage = Math.floor(pokemonStore.pokemonList.length / itemsPerPage);

const loadPokemon = async () => {
  const offset = currentPage * itemsPerPage;
  await pokemonStore.fetchPokemonList(offset, itemsPerPage);
  // Incrementar currentPage solo si no hubo error y la lista realmente podría haber crecido.
  // Una lógica más robusta verificaría si se devolvieron menos items que itemsPerPage para detenerse.
  if (!pokemonStore.errorList) { 
     currentPage++;
  }
};

onMounted(() => {
  // Si la lista está vacía al montar, cargar la primera página.
  // Si ya hay datos (ej. por navegación atrás/adelante y Pinia persiste), no se recarga.
  if (pokemonStore.pokemonList.length === 0) {
    currentPage = 0; // Asegurar que empezamos desde el principio
    loadPokemon();
  }
});

const loadMorePokemon = () => {
  loadPokemon();
};
</script>

<style scoped>
.container { 
  max-width: 1380px; /* Un poco más de espacio para el grid */
}
/* Si LoadingSpinner dentro del botón necesita un color específico */
/* button:disabled .inline-block { ... } */
</style>