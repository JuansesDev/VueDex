<template>
  <div class="pokemon-filter bg-white rounded-lg shadow-md p-6 mt-8 mb-12">
    <h2 class="text-xl font-bold text-gray-800 mb-4">Filtrar Pokémon</h2>
    
    <!-- Mensaje de carga de opciones de filtro -->
    <div v-if="pokemonStore.isLoadingFilterOptions" class="text-center text-gray-500 py-2">
      <LoadingSpinner class="inline-block w-5 h-5 mr-2" />
      <span>Cargando opciones...</span>
    </div>
    
    <!-- Mensaje de error al cargar opciones -->
    <div v-if="pokemonStore.errorFilterOptions" class="text-red-500 text-sm py-2">
      {{ pokemonStore.errorFilterOptions }}
      <button 
        @click="pokemonStore.fetchFilterOptions()" 
        class="ml-2 text-blue-500 hover:underline"
      >
        Reintentar
      </button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Filtro por Nombre -->
      <div class="filter-group">
        <label for="nameFilter" class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <div class="relative">
          <input
            id="nameFilter"
            v-model="nameFilter"
            @input="debounceNameFilter"
            type="text"
            placeholder="Buscar por nombre..."
            class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button 
            v-if="nameFilter"
            @click="clearNameFilter"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <span class="sr-only">Limpiar búsqueda</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Filtro por Tipo -->
      <div class="filter-group">
        <label for="typeFilter" class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
        <select
          id="typeFilter"
          v-model="selectedType"
          @change="applyTypeFilter"
          class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          :disabled="pokemonStore.isLoadingFilterOptions"
        >
          <option value="">Todos los tipos</option>
          <option 
            v-for="type in pokemonStore.formattedTypes" 
            :key="type.name" 
            :value="type.name"
          >
            {{ type.displayName }}
          </option>
        </select>
      </div>
      
      <!-- Filtro por Generación -->
      <div class="filter-group">
        <label for="genFilter" class="block text-sm font-medium text-gray-700 mb-1">Generación</label>
        <select
          id="genFilter"
          v-model="selectedGeneration"
          @change="applyGenerationFilter"
          class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          :disabled="pokemonStore.isLoadingFilterOptions"
        >
          <option value="">Todas las generaciones</option>
          <option 
            v-for="gen in pokemonStore.formattedGenerations" 
            :key="gen.name" 
            :value="gen.name"
          >
            {{ gen.displayName }}
          </option>
        </select>
      </div>
    </div>
    
    <!-- Filtros activos y botón para limpiarlos -->
    <div v-if="filtersApplied" class="mt-4 flex flex-wrap items-center text-sm">
      <span class="mr-2 text-gray-600">Filtros activos:</span>
      <div class="flex flex-wrap gap-2">
        <span 
          v-if="pokemonStore.filters.name" 
          class="px-2 py-1 bg-green-100 text-green-800 rounded-full flex items-center"
        >
          Nombre: {{ pokemonStore.filters.name }}
          <button @click="clearNameFilter" class="ml-1 text-green-600 hover:text-green-800">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </span>
        
        <span 
          v-if="pokemonStore.filters.type" 
          class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center"
        >
          Tipo: {{ getDisplayName(pokemonStore.filters.type, 'type') }}
          <button @click="clearTypeFilter" class="ml-1 text-blue-600 hover:text-blue-800">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </span>
        
        <span 
          v-if="pokemonStore.filters.generation" 
          class="px-2 py-1 bg-purple-100 text-purple-800 rounded-full flex items-center"
        >
          Generación: {{ getDisplayName(pokemonStore.filters.generation, 'generation') }}
          <button @click="clearGenerationFilter" class="ml-1 text-purple-600 hover:text-purple-800">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </span>
        
        <button 
          @click="pokemonStore.clearFilters()" 
          class="px-2 py-1 text-red-600 hover:text-red-800 font-medium text-sm"
        >
          Limpiar todos
        </button>
      </div>
    </div>
    
    <!-- Resultados de búsqueda -->
    <div v-if="pokemonStore.isFilterActive && !pokemonStore.isLoadingList" class="mt-3 text-sm text-gray-600">
      {{ pokemonStore.filteredList.length }} Pokémon encontrados
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { usePokemonStore } from '@/stores/pokemon.js';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const pokemonStore = usePokemonStore();

// Variables reactivas para los filtros de UI
const nameFilter = ref('');
const selectedType = ref('');
const selectedGeneration = ref('');
const debounceTimeout = ref(null);

// Computed para verificar si hay filtros aplicados
const filtersApplied = computed(() => {
  return pokemonStore.filters.name || pokemonStore.filters.type || pokemonStore.filters.generation;
});

// Función para obtener nombres de visualización
const getDisplayName = (value, filterType) => {
  if (filterType === 'type') {
    const type = pokemonStore.formattedTypes.find(t => t.name === value);
    return type ? type.displayName : value;
  } else if (filterType === 'generation') {
    const gen = pokemonStore.formattedGenerations.find(g => g.name === value);
    return gen ? gen.displayName : value;
  }
  return value;
};

// Funciones para aplicar filtros
const debounceNameFilter = () => {
  // Cancelar el timeout anterior si existe
  if (debounceTimeout.value) clearTimeout(debounceTimeout.value);
  
  // Establecer un nuevo timeout para retrasar la búsqueda
  debounceTimeout.value = setTimeout(() => {
    pokemonStore.updateFilter('name', nameFilter.value);
  }, 500); // Esperar 500ms después de que el usuario deje de escribir
};

const applyTypeFilter = () => {
  selectedGeneration.value = '';
  nameFilter.value = '';
  pokemonStore.updateFilter('type', selectedType.value);
};

const applyGenerationFilter = () => {
  selectedType.value = '';
  nameFilter.value = '';
  pokemonStore.updateFilter('generation', selectedGeneration.value);
};

// Funciones para limpiar filtros
const clearNameFilter = () => {
  nameFilter.value = '';
  pokemonStore.updateFilter('name', '');
};

const clearTypeFilter = () => {
  selectedType.value = '';
  pokemonStore.updateFilter('type', '');
};

const clearGenerationFilter = () => {
  selectedGeneration.value = '';
  pokemonStore.updateFilter('generation', '');
};

// Cargar opciones de filtro al montar el componente
onMounted(async () => {
  // Solo cargar si aún no están cargadas
  if (pokemonStore.availableTypes.length === 0 || pokemonStore.availableGenerations.length === 0) {
    await pokemonStore.fetchFilterOptions();
  }
});

// Observar cambios en los filtros del store para mantener sincronizado el UI
watch(() => pokemonStore.filters, (newFilters) => {
  nameFilter.value = newFilters.name || '';
  selectedType.value = newFilters.type || '';
  selectedGeneration.value = newFilters.generation || '';
}, { deep: true });
</script>

<style scoped>
.pokemon-filter {
  transition: all 0.3s ease;
}

.filter-group {
  transition: opacity 0.2s;
}

/* Estilo opcional para mostrar que un filtro está deshabilitado cuando otro está activo */
.filter-group.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
