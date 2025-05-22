// src/components/pokemon/PokemonCard.vue
<template>
  <div
    class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full cursor-pointer group"
    @click="navigateToDetail"
  >
    <!-- Estado de Carga -->
    <div v-if="isLoadingDetails" class="flex flex-col items-center justify-center flex-grow p-4 text-gray-500">
      <LoadingSpinner />
      <p class="text-sm mt-2">Cargando {{ localPokemon.name }}...</p>
    </div>

    <!-- Estado de Error -->
    <div v-else-if="errorDetails" class="flex flex-col items-center justify-center flex-grow p-4 text-center text-red-600">
      <p class="font-semibold">¡Error!</p>
      <p class="text-xs break-all">{{ errorDetails }}</p>
      <button 
        @click.stop="fetchCardDetails" 
        class="mt-3 px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Reintentar
      </button>
    </div>

    <!-- Contenido Principal de la Tarjeta -->
    <div v-else-if="cardDetails" class="flex flex-col items-center h-full">
      <div class="p-4 flex justify-center relative w-full">
        <img 
          v-if="cardDetails.sprites?.front_default"
          :src="cardDetails.sprites.front_default" 
          :alt="localPokemon.name"
          class="w-32 h-32 object-contain transition-transform duration-300 group-hover:scale-110"
          @error="onImageError"
        />
        <div v-else class="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-xs">
          No Sprite
        </div>
         <span class="absolute top-1 right-1 bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-0.5 rounded-full">
          #{{ cardDetails.id }}
        </span>
      </div>
      <div class="p-4 bg-gray-50 flex-grow w-full text-center">
        <h3 class="text-lg font-semibold text-gray-800 capitalize mb-2">{{ localPokemon.name }}</h3>
        <div class="flex flex-wrap gap-1 justify-center">
          <span 
            v-for="typeInfo in cardDetails.types" 
            :key="typeInfo.type.name"
            class="px-2.5 py-0.5 text-xs rounded-full text-white font-bold shadow-sm capitalize"
            :class="getTypeColor(typeInfo.type.name)"
          >
            {{ typeInfo.type.name }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- Placeholder inicial -->
    <div v-else class="flex flex-col items-center justify-center flex-grow p-4 text-gray-400">
       <p class="text-sm">Preparando tarjeta...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { getFromUrl, getPokemonDetails } from '@/services/pokemonService.js'; 
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const props = defineProps({
  /**
   * Datos básicos del Pokémon: {name, url}
   * @type {Object}
   * @required
   */
  pokemon: {
    type: Object,
    required: true
  }
});

// Usar toRefs para mantener la reactividad cuando se accede a props.pokemon
const { pokemon: localPokemon } = toRefs(props);

const router = useRouter();

const cardDetails = ref(null); // Almacena detalles completos (id, sprites, types)
const isLoadingDetails = ref(false);
const errorDetails = ref(null);

/**
 * Mapa de clases CSS para cada tipo de Pokémon
 */
const typeColors = {
  normal: 'bg-gray-400 hover:bg-gray-500',
  fire: 'bg-red-500 hover:bg-red-600',
  water: 'bg-blue-500 hover:bg-blue-600',
  electric: 'bg-yellow-400 hover:bg-yellow-500 text-gray-800',
  grass: 'bg-green-500 hover:bg-green-600',
  ice: 'bg-cyan-400 hover:bg-cyan-500 text-gray-800',
  fighting: 'bg-orange-600 hover:bg-orange-700',
  poison: 'bg-purple-600 hover:bg-purple-700',
  ground: 'bg-amber-600 hover:bg-amber-700',
  flying: 'bg-indigo-400 hover:bg-indigo-500',
  psychic: 'bg-pink-500 hover:bg-pink-600',
  bug: 'bg-lime-500 hover:bg-lime-600 text-gray-800',
  rock: 'bg-stone-500 hover:bg-stone-600',
  ghost: 'bg-violet-700 hover:bg-violet-800',
  dragon: 'bg-fuchsia-700 hover:bg-fuchsia-800',
  dark: 'bg-neutral-700 hover:bg-neutral-800',
  steel: 'bg-slate-500 hover:bg-slate-600',
  fairy: 'bg-rose-400 hover:bg-rose-500',
};

/**
 * Obtiene la clase CSS correspondiente al tipo de Pokémon
 * @param {string} typeName - Nombre del tipo de Pokémon
 * @returns {string} Clase CSS para el color de fondo
 */
const getTypeColor = (typeName) => {
  return typeColors[typeName.toLowerCase()] || 'bg-gray-300 hover:bg-gray-400';
};

/**
 * Obtiene los detalles del Pokémon desde la API
 */
const fetchCardDetails = async () => {
  if (!localPokemon.value?.url && !localPokemon.value?.name) {
    errorDetails.value = 'Prop de Pokémon inválida o URL faltante.';
    return;
  }

  isLoadingDetails.value = true;
  errorDetails.value = null;
  try {
    // Usar la URL que viene en la prop 'pokemon' de la lista
    const data = await getFromUrl(localPokemon.value.url);
    cardDetails.value = data;
  } catch (error) {
    console.error(`Error cargando detalles para ${localPokemon.value.name} en PokemonCard:`, error);
    errorDetails.value = error.message || `No se pudo cargar ${localPokemon.value.name}.`;
  } finally {
    isLoadingDetails.value = false;
  }
};

/**
 * Navega a la vista de detalle del Pokémon actual
 */
const navigateToDetail = () => {
  router.push({ name: 'pokemon-detail', params: { name: localPokemon.value.name } });
};

/**
 * Maneja errores de carga de imagen
 * @param {Event} event - Evento de error de la imagen
 */
const onImageError = (event) => {
  console.warn(`No se pudo cargar la imagen para ${localPokemon.value.name}: ${event.target.src}`);
  // Se podría establecer una imagen predeterminada:
  // event.target.src = '/path/to/default-placeholder.png';
};

// Cargar detalles cuando el componente se monta
onMounted(() => {
  fetchCardDetails();
});

// Observar cambios en la prop 'pokemon' y recargar si cambia
watch(localPokemon, (newVal, oldVal) => {
  if (newVal && oldVal && newVal.url !== oldVal.url) {
    fetchCardDetails();
  }
}, { deep: true });

</script>