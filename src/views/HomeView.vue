// src/views/HomeView.vue
<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6 text-center text-blue-700">VueDex</h1>

    <!-- Componente de Carga -->
    <div v-if="pokemonStore.isLoadingList" class="text-center">
      <LoadingSpinner />
    </div>

    <!-- Componente de Error -->
    <div v-if="pokemonStore.errorList && !pokemonStore.isLoadingList" class="my-4">
      <ErrorMessage :message="pokemonStore.errorList" />
    </div>

    <!-- Lista de Pokémon (componente PokemonList irá aquí) -->
    <div v-if="!pokemonStore.isLoadingList && !pokemonStore.errorList && pokemonStore.pokemonList.length > 0">
      <ul class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <li
          v-for="pokemon in pokemonStore.pokemonList"
          :key="pokemon.name"
          class="border p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer bg-white"
          @click="goToPokemonDetail(pokemon.name)"
        >
          <span class="capitalize font-semibold text-lg">{{ pokemon.name }}</span>
          <!-- Aquí podríamos poner una imagen placeholder o el componente PokemonCard más adelante -->
        </li>
      </ul>
      <!-- Botón para cargar más (Paginación simple) -->
      <div class="text-center mt-6" v-if="pokemonStore.pokemonList.length > 0">
         <button
            @click="loadMorePokemon"
            :disabled="pokemonStore.isLoadingList"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
          >
            {{ pokemonStore.isLoadingList ? 'Cargando...' : 'Cargar más Pokémon' }}
          </button>
      </div>
    </div>

    <p v-if="!pokemonStore.isLoadingList && !pokemonStore.errorList && pokemonStore.pokemonList.length === 0" class="text-center text-gray-500 mt-4">
      No se encontraron Pokémon.
    </p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePokemonStore } from '@/stores/pokemon'; // Importa nuestro store
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'; // Importa el componente
import ErrorMessage from '@/components/common/ErrorMessage.vue';   // Importa el componente

const pokemonStore = usePokemonStore();
const router = useRouter();

// Variables para paginación simple
const itemsPerPage = 20;
let currentPage = 0; // Comenzamos en la página 0 (offset 0)

const loadPokemon = async (isLoadMore = false) => {
  const offset = isLoadMore ? currentPage * itemsPerPage : 0;
  if (isLoadMore) {
    // Si es cargar más y ya no hay más que cargar (ej. API devuelve menos de limit)
    // Podríamos tener una lógica más avanzada si la API nos dijera `count`
  }
  await pokemonStore.fetchPokemonList(offset, itemsPerPage);
  if (!pokemonStore.errorList) {
     currentPage++;
  }
};

onMounted(() => {
  // Si queremos cargar la lista solo si está vacía
  if (pokemonStore.pokemonList.length === 0) {
    currentPage = 0; // Resetear página si la lista está vacía
    loadPokemon();
  }
  // Si queremos que siempre se recargue al montar HomeView:
  // currentPage = 0;
  // loadPokemon();
});

const goToPokemonDetail = (pokemonName) => {
  router.push({ name: 'pokemon-detail', params: { name: pokemonName } });
};

const loadMorePokemon = () => {
  loadPokemon(true);
};
</script>

<style scoped>
/* Estilos específicos para HomeView si son necesarios */
.container {
  max-width: 1200px;
}
</style>