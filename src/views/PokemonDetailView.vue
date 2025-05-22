// src/views/PokemonDetailView.vue
<template>
  <div class="pokemon-detail-view container mx-auto p-4 md:p-6 lg:p-8">
    <!-- Botón de Volver -->
    <div class="mb-6">
      <router-link 
        to="/" 
        class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Volver a la lista
      </router-link>
    </div>

    <!-- Estado de Carga -->
    <div v-if="pokemonStore.isLoadingDetails" class="text-center my-12">
      <LoadingSpinner />
      <p class="mt-2 text-lg text-gray-600">Cargando detalles del Pokémon...</p>
    </div>

    <!-- Estado de Error -->
    <div v-else-if="pokemonStore.errorDetails" class="my-8 text-center">
      <ErrorMessage :message="pokemonStore.errorDetails" />
      <button 
        @click="loadDetails" 
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Reintentar Carga
      </button>
    </div>

    <!-- Contenido de Detalles del Pokémon -->
    <div v-else-if="pokemonStore.currentPokemonDetails" class="bg-white shadow-xl rounded-lg overflow-hidden">
      <div :class="`p-6 md:p-8 bg-gradient-to-br ${getTypeGradient(pokemonStore.currentPokemonDetails.types[0]?.type.name)} text-white`">
        <div class="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 class="text-4xl md:text-5xl font-bold capitalize mb-1">{{ pokemonStore.currentPokemonDetails.name }}</h1>
            <div class="flex space-x-2 mb-2">
              <span 
                v-for="typeInfo in pokemonStore.currentPokemonDetails.types" 
                :key="typeInfo.type.name"
                :class="`px-3 py-1 text-sm rounded-full ${getTypeBackgroundColor(typeInfo.type.name)} ${getTypeTextColor(typeInfo.type.name)} font-semibold capitalize shadow-md`"
              >
                {{ typeInfo.type.name }}
              </span>
            </div>
          </div>
          <div class="text-3xl md:text-4xl font-mono mt-2 md:mt-0">
            #{{ String(pokemonStore.currentPokemonDetails.id).padStart(3, '0') }}
          </div>
        </div>
      </div>

      <div class="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
        <!-- Columna de Imagen y Sprites -->
        <div class="flex flex-col items-center">
          <img 
            :src="selectedSprite" 
            :alt="pokemonStore.currentPokemonDetails.name"
            class="w-64 h-64 md:w-80 md:h-80 object-contain mb-4 rounded-md bg-slate-100 p-2 shadow-inner"
          >
          <!-- Sprites Seleccionables -->
          <div class="flex flex-wrap justify-center gap-2 mt-2">
            <button 
              v-if="getSprite('default')" 
              @click="selectSprite('default')"
              class="sprite-button"
              :class="{'sprite-selected': selectedSpriteType === 'default'}"
            >
              <img :src="getSprite('default')" alt="Default Sprite" class="w-16 h-16 bg-slate-50 p-1 rounded-md border">
              <span class="text-xs text-center mt-1 block">Normal</span>
            </button>
            <button 
              v-if="getSprite('shiny')" 
              @click="selectSprite('shiny')"
              class="sprite-button"
              :class="{'sprite-selected': selectedSpriteType === 'shiny'}"
            >
              <img :src="getSprite('shiny')" alt="Shiny Sprite" class="w-16 h-16 bg-slate-50 p-1 rounded-md border">
              <span class="text-xs text-center mt-1 block">Shiny</span>
            </button>
            <button 
              v-if="getSprite('female')" 
              @click="selectSprite('female')"
              class="sprite-button"
              :class="{'sprite-selected': selectedSpriteType === 'female'}"
            >
              <img :src="getSprite('female')" alt="Female Sprite" class="w-16 h-16 bg-slate-50 p-1 rounded-md border">
              <span class="text-xs text-center mt-1 block">Female</span>
            </button>
            <button 
              v-if="getSprite('shiny-female')" 
              @click="selectSprite('shiny-female')"
              class="sprite-button"
              :class="{'sprite-selected': selectedSpriteType === 'shiny-female'}"
            >
              <img :src="getSprite('shiny-female')" alt="Shiny Female Sprite" class="w-16 h-16 bg-slate-50 p-1 rounded-md border">
              <span class="text-xs text-center mt-1 block">Shiny F</span>
            </button>
            <button 
              v-if="getSprite('artwork')" 
              @click="selectSprite('artwork')"
              class="sprite-button"
              :class="{'sprite-selected': selectedSpriteType === 'artwork'}"
            >
              <img :src="getSprite('artwork')" alt="Official Artwork" class="w-16 h-16 bg-slate-50 p-1 rounded-md border">
              <span class="text-xs text-center mt-1 block">Artwork</span>
            </button>
          </div>
        </div>

        <!-- Columna de Información -->
        <div>
          <!-- Descripción (esto requeriría otra llamada a species endpoint) -->
          <!-- <p class="text-gray-700 mb-6 text-lg leading-relaxed">{{ speciesDescription }}</p> -->

          <h2 class="text-2xl font-semibold text-gray-800 mb-3">Estadísticas Base</h2>
          <div class="space-y-2">
            <div v-for="stat in pokemonStore.currentPokemonDetails.stats" :key="stat.stat.name" class="flex items-center mb-2">
              <span class="w-1/3 text-gray-800 capitalize font-medium text-sm md:text-base">{{ formatStatName(stat.stat.name) }}:</span>
              <div class="w-2/3 bg-gray-200 rounded-full h-6 overflow-hidden relative">
                <div 
                  :class="`h-full rounded-full flex items-center justify-end px-2 text-xs font-bold ${getStatBarColor(stat.stat.name)}`" 
                  :style="{ width: `${Math.min(stat.base_stat / 1.5, 100)}%` }" 
                >
                  <span :class="`${stat.base_stat < 30 ? 'text-gray-800' : 'text-white'}`">{{ stat.base_stat }}</span>
                </div>
              </div>
            </div>
          </div>

          <h2 class="text-2xl font-semibold text-gray-800 mt-6 mb-3">Información General</h2>
          <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-gray-700">
            <div><strong class="text-gray-600">Altura:</strong> {{ pokemonStore.currentPokemonDetails.height / 10 }} m</div>
            <div><strong class="text-gray-600">Peso:</strong> {{ pokemonStore.currentPokemonDetails.weight / 10 }} kg</div>
            <div class="col-span-2"><strong class="text-gray-600">Habilidades:</strong> 
              <span v-for="(ability, index) in pokemonStore.currentPokemonDetails.abilities" :key="ability.ability.name" class="capitalize">
                {{ ability.ability.name.replace('-', ' ') }}{{ index < pokemonStore.currentPokemonDetails.abilities.length - 1 ? ', ' : '' }}
              </span>
            </div>
          </div>
          
          <!-- Podríamos añadir evoluciones, debilidades, etc. aquí con más llamadas API -->
        </div>
      </div>
    </div>

    <!-- Placeholder si no hay Pokémon cargado (ej. al entrar a la ruta directamente sin params) -->
    <div v-else-if="!pokemonNameFromRoute" class="text-center my-10 text-gray-500">
      <p>No se ha especificado un Pokémon.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePokemonStore } from '@/stores/pokemon.js';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ErrorMessage from '@/components/common/ErrorMessage.vue';

const route = useRoute();
const router = useRouter();
const pokemonStore = usePokemonStore();

const pokemonNameFromRoute = ref(route.params.name);

// Colores para el gradiente del header de la tarjeta de detalle
// Puedes personalizarlos mucho más
const typeGradients = {
  normal: 'from-gray-400 to-gray-500',
  fire: 'from-red-600 to-orange-600',
  water: 'from-blue-500 to-blue-700',
  electric: 'from-yellow-400 to-amber-500',
  grass: 'from-green-500 to-green-700',
  ice: 'from-cyan-400 to-blue-400',
  fighting: 'from-red-700 to-red-800',
  poison: 'from-purple-600 to-purple-800',
  ground: 'from-yellow-700 to-amber-800',
  flying: 'from-indigo-400 to-blue-500',
  psychic: 'from-pink-500 to-pink-700',
  bug: 'from-lime-500 to-green-600',
  rock: 'from-stone-600 to-stone-700',
  ghost: 'from-violet-700 to-indigo-900',
  dragon: 'from-purple-600 to-purple-900',
  dark: 'from-neutral-800 to-neutral-900',
  steel: 'from-slate-500 to-slate-700',
  fairy: 'from-rose-400 to-pink-500',
};

const typeBackgroundColors = {
  normal: 'bg-gray-400',
  fire: 'bg-red-600',
  water: 'bg-blue-600',
  electric: 'bg-yellow-500',
  grass: 'bg-green-600',
  ice: 'bg-cyan-400',
  fighting: 'bg-red-700',
  poison: 'bg-purple-700',
  ground: 'bg-amber-800',
  flying: 'bg-indigo-500',
  psychic: 'bg-pink-600',
  bug: 'bg-lime-600',
  rock: 'bg-stone-600',
  ghost: 'bg-violet-800',
  dragon: 'bg-purple-700',
  dark: 'bg-neutral-800',
  steel: 'bg-slate-600',
  fairy: 'bg-rose-400',
};

// Obtener el color de fondo apropiado para las insignias de tipo
const getTypeBackgroundColor = (typeName) => {
  return typeName ? (typeBackgroundColors[typeName.toLowerCase()] || 'bg-gray-500') : 'bg-gray-500';
};

// Añadimos colores de texto para tipos claros
const getTypeTextColor = (typeName) => {
  // Tipos claros que necesitan texto oscuro
  const darkTextTypes = ['electric', 'ice', 'fairy'];
  return darkTextTypes.includes(typeName?.toLowerCase()) ? 'text-gray-800' : 'text-white';
};

const getTypeGradient = (typeName) => {
  return typeName ? (typeGradients[typeName.toLowerCase()] || 'from-gray-400 to-gray-600') : 'from-gray-400 to-gray-600';
};

// Colores para las barras de estadísticas con mejor contraste
const statBarColors = {
  'hp': 'bg-red-500 text-white',
  'attack': 'bg-orange-600 text-white',
  'defense': 'bg-yellow-600 text-white',
  'special-attack': 'bg-blue-600 text-white',
  'special-defense': 'bg-green-600 text-white',
  'speed': 'bg-purple-600 text-white'
};

const getStatBarColor = (statName) => {
  return statBarColors[statName] || 'bg-blue-600 text-white';
};

const formatStatName = (statName) => {
  return statName.replace(/-/g, ' ');
};

const loadDetails = async () => {
  if (pokemonNameFromRoute.value) {
    await pokemonStore.fetchPokemonDetails(pokemonNameFromRoute.value);
  }
};

onMounted(() => {
  loadDetails();
});

// Limpiar los detalles del Pokémon cuando el componente se desmonte
// para evitar mostrar datos incorrectos brevemente si se navega a otro detalle.
onUnmounted(() => {
  pokemonStore.clearPokemonDetails();
});

// Observar cambios en el parámetro de la ruta (si el usuario navega de un detalle a otro directamente)
watch(() => route.params.name, (newName) => {
  if (newName) {
    pokemonNameFromRoute.value = newName;
    loadDetails(); // Recargar para el nuevo Pokémon
  }
});

// Estado para el sprite seleccionado
const selectedSpriteType = ref('artwork');
const selectedSprite = computed(() => {
  return getSprite(selectedSpriteType.value);
});

// Función para obtener los diferentes sprites
const getSprite = (type) => {
  const sprites = pokemonStore.currentPokemonDetails?.sprites;
  if (!sprites) return null;
  
  switch(type) {
    case 'default':
      return sprites.front_default;
    case 'shiny':
      return sprites.front_shiny;
    case 'female':
      return sprites.front_female;
    case 'shiny-female':
      return sprites.front_shiny_female;
    case 'artwork':
    default:
      return sprites.other?.['official-artwork']?.front_default || sprites.front_default;
  }
};

// Función para seleccionar un sprite
const selectSprite = (type) => {
  selectedSpriteType.value = type;
};

</script>

<style scoped>
.pokemon-detail-view {
  max-width: 1024px; /* Ajusta según preferencia */
}
/* Estilo para las barras de stats, un poco más dinámico si quieres colores por stat */
/* .stat-bar-hp { background-color: #FF5959; } */
/* .stat-bar-attack { background-color: #F5AC78; } */
/* ... etc ... */

.sprite-button {
  transition: all 0.2s;
  position: relative;
}

.sprite-button:hover img {
  transform: scale(1.05);
  border-color: #3b82f6;
}

.sprite-selected img {
  border: 2px solid #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}
</style>