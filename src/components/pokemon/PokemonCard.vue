// src/components/pokemon/PokemonCard.vue
<template>
  <div
    class="
      bg-white rounded-xl shadow hover:shadow-md 
      border border-gray-100 
      p-5 flex flex-col items-center 
      transition-all duration-300 ease-in-out transform hover:-translate-y-1
      cursor-pointer
    "
    @click="navigateToDetail"
  >
    <!-- Estado de Carga -->
    <div v-if="isLoadingDetails" class="flex flex-col items-center justify-center h-56 w-full text-gray-400">
      <LoadingSpinner />
      <p class="text-sm mt-2">Cargando {{ localPokemon.name }}...</p>
    </div>

    <!-- Estado de Error -->
    <div v-else-if="errorDetails" class="flex flex-col items-center justify-center h-56 w-full text-center text-red-500">
      <p class="font-semibold">¡Oops!</p>
      <p class="text-xs break-all">{{ errorDetails }}</p>
      <button @click.stop="fetchDetails" class="mt-3 px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400">Reintentar</button>
    </div>

    <!-- Contenido Principal de la Tarjeta -->
    <div v-else-if="pokemonDetails" class="flex flex-col items-center w-full">
      <div class="relative w-32 h-32 md:w-36 md:h-36 mb-4">
        <img
          v-if="pokemonDetails.sprites?.front_default"
          :src="pokemonDetails.sprites.front_default"
          :alt="localPokemon.name"
          class="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
          @error="onImageError"
        />
        <div v-else class="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-xs">
          No Sprite
        </div>
        <!-- Número del Pokémon en la esquina -->
        <span class="absolute top-0 right-0 bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-bl-lg rounded-tr-lg">
          #{{ pokemonDetails.id }}
        </span>
      </div>

      <h3 class="text-xl font-bold capitalize mb-2 text-gray-700 tracking-wide">{{ localPokemon.name }}</h3>

      <div class="flex space-x-2 mb-3">
        <span
          v-for="typeInfo in pokemonDetails.types"
          :key="typeInfo.type.name"
          class="px-3 py-1 text-xs rounded-full text-white font-medium capitalize"
          :class="getTypeColor(typeInfo.type.name)"
        >
          {{ typeInfo.type.name }}
        </span>
      </div>
      
      <!-- Datos básicos con mejor presentación -->
      <div class="w-full flex justify-between text-xs text-gray-500 border-t border-gray-100 pt-3 mt-1">
        <span>{{ (pokemonDetails.height / 10).toFixed(1) }}m</span>
        <span>{{ (pokemonDetails.weight / 10).toFixed(1) }}kg</span>
      </div>
    </div>
    
    <!-- Placeholder inicial si no hay detalles aún -->
    <div v-else class="flex flex-col items-center justify-center h-56 w-full text-gray-400">
       <p class="text-sm">Cargando...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getFromUrl } from '@/services/pokemonService.js';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

/**
 * Props del componente
 * @typedef {Object} Props
 * @property {Object} pokemon - Datos básicos del Pokémon (name, url)
 */
const props = defineProps({
  pokemon: { type: Object, required: true },
});

const router = useRouter();
const pokemonDetails = ref(null);
const isLoadingDetails = ref(false);
const errorDetails = ref(null);
const localPokemon = ref(props.pokemon);

/**
 * Obtiene los detalles del Pokémon desde la API
 */
const fetchDetails = async () => {
  if (!localPokemon.value?.url && !localPokemon.value?.name) {
    errorDetails.value = 'Datos insuficientes para cargar detalles del Pokémon.';
    return;
  }
  isLoadingDetails.value = true;
  errorDetails.value = null;
  try {
    const data = await getFromUrl(localPokemon.value.url);
    pokemonDetails.value = data;
  } catch (error) {
    console.error(`Error cargando detalles para ${localPokemon.value.name}:`, error);
    errorDetails.value = error.message || 'No se pudieron cargar los detalles.';
  } finally {
    isLoadingDetails.value = false;
  }
};

/**
 * Mapa de clases CSS para los diferentes tipos de Pokémon
 * Incluye colores de texto adaptados para tipos claros
 */
const typeColors = {
  normal: 'bg-gray-400',
  fire: 'bg-orange-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-500 text-gray-800',
  grass: 'bg-emerald-500',
  ice: 'bg-cyan-400 text-gray-800',
  fighting: 'bg-red-600',
  poison: 'bg-purple-500',
  ground: 'bg-amber-600',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500 text-gray-800',
  rock: 'bg-stone-500',
  ghost: 'bg-violet-600',
  dragon: 'bg-indigo-600',
  dark: 'bg-gray-700',
  steel: 'bg-slate-400 text-gray-800',
  fairy: 'bg-rose-400 text-gray-800',
};

/**
 * Obtiene la clase CSS correspondiente al tipo de Pokémon
 * @param {string} typeName - Nombre del tipo de Pokémon
 * @returns {string} Clase CSS para el color de fondo y texto
 */
const getTypeColor = (typeName) => typeColors[typeName.toLowerCase()] || 'bg-gray-300';

/**
 * Navega a la vista de detalle del Pokémon actual
 */
const navigateToDetail = () => {
  if (pokemonDetails.value || localPokemon.value.name) {
    router.push({ name: 'pokemon-detail', params: { name: localPokemon.value.name } });
  }
};

/**
 * Maneja errores de carga de imagen
 * @param {Event} event - Evento de error de la imagen
 */
const onImageError = (event) => {
  console.warn(`No se pudo cargar la imagen: ${event.target.src}`);
};

// Observar cambios en la prop 'pokemon' y recargar si cambia
watch(() => props.pokemon, (newPokemon) => {
  localPokemon.value = newPokemon;
  pokemonDetails.value = null;
  fetchDetails();
}, { deep: true });

// Cargar detalles cuando el componente se monta
onMounted(() => {
  fetchDetails();
});
</script>

<style scoped>
/* Aquí puedes definir estilos específicos como altura mínima para la tarjeta */
</style>