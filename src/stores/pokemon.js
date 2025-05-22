// src/stores/pokemon.js
import { defineStore } from 'pinia';
import { 
  getPokemonList, 
  getPokemonDetails, 
  getPokemonTypes, 
  getPokemonGenerations,
  searchPokemonByName,
  getPokemonByType,
  getPokemonByGeneration
} from '@/services/pokemonService.js';

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemonList: [],
    filteredList: [], // Nueva propiedad para la lista filtrada
    isLoadingList: false,
    errorList: null,

    // Propiedades para los filtros
    filters: {
      name: '',
      type: '',
      generation: '',
    },
    isFilterActive: false, // Indicador para saber si hay filtros activos
    
    // Opciones de filtros
    availableTypes: [],
    availableGenerations: [],
    isLoadingFilterOptions: false,
    errorFilterOptions: null,

    // Propiedades para los detalles del Pokémon (existentes)
    currentPokemonDetails: null,
    isLoadingDetails: false,
    errorDetails: null,
  }),

  getters: {
    // Getter para obtener la lista que se debe mostrar (filtrada o completa)
    displayList: (state) => {
      return state.isFilterActive ? state.filteredList : state.pokemonList;
    },
    
    // Convierte los nombres de generación a formatos más amigables
    formattedGenerations: (state) => {
      return state.availableGenerations.map(gen => ({
        ...gen,
        displayName: gen.name.replace('generation-', 'Generación ').replace('-', ' ').toUpperCase()
      }));
    },
    
    // Convierte los nombres de tipos a formatos más amigables
    formattedTypes: (state) => {
      return state.availableTypes.map(type => ({
        ...type,
        displayName: type.name.charAt(0).toUpperCase() + type.name.slice(1)
      }));
    }
  },

  actions: {
    async fetchPokemonList(offset = 0, limit = 20) {
      // ... (código existente de fetchPokemonList) ...
      if (offset === 0) {
        this.pokemonList = [];
      }
      this.isLoadingList = true;
      this.errorList = null;
      try {
        const listFromApi = await getPokemonList(offset, limit);
        if (listFromApi && listFromApi.length > 0) {
          this.pokemonList = [...this.pokemonList, ...listFromApi];
        } else if (offset > 0 && (!listFromApi || listFromApi.length === 0)) {
          console.log('No se encontraron más Pokémon para cargar.');
        }
      } catch (error) {
        console.error('Error en la acción fetchPokemonList:', error);
        this.errorList = error.message || 'Error desconocido al obtener la lista de Pokémon.';
        if (offset === 0) {
          this.pokemonList = [];
        }
      } finally {
        this.isLoadingList = false;
      }
    },

    // Nueva acción para obtener los detalles de un Pokémon
    async fetchPokemonDetails(nameOrId) {
      // Resetear el estado antes de una nueva carga para evitar mostrar datos antiguos
      this.currentPokemonDetails = null;
      this.isLoadingDetails = true;
      this.errorDetails = null;

      try {
        const details = await getPokemonDetails(nameOrId); // Llama al servicio
        this.currentPokemonDetails = details;
      } catch (error) {
        console.error(`Error en la acción fetchPokemonDetails para ${nameOrId}:`, error);
        this.errorDetails = error.message || `No se pudieron cargar los detalles para ${nameOrId}.`;
      } finally {
        this.isLoadingDetails = false;
      }
    },

    // Acción para limpiar los detalles del Pokémon actual (útil al salir de la vista de detalle)
    clearPokemonDetails() {
      this.currentPokemonDetails = null;
      this.errorDetails = null;
    },

    // Cargar las opciones de filtro (tipos y generaciones)
    async fetchFilterOptions() {
      this.isLoadingFilterOptions = true;
      this.errorFilterOptions = null;
      
      try {
        // Cargar tipos y generaciones en paralelo
        const [types, generations] = await Promise.all([
          getPokemonTypes(),
          getPokemonGenerations()
        ]);
        
        this.availableTypes = types;
        this.availableGenerations = generations;
      } catch (error) {
        console.error('Error al cargar opciones de filtro:', error);
        this.errorFilterOptions = 'Error al cargar las opciones de filtro. Por favor, intente de nuevo.';
      } finally {
        this.isLoadingFilterOptions = false;
      }
    },
    
    // Aplicar filtros a la lista
    async applyFilters() {
      this.isLoadingList = true;
      this.errorList = null;
      this.isFilterActive = !!(this.filters.name || this.filters.type || this.filters.generation);
      
      try {
        // Si no hay filtros activos, usar la lista completa
        if (!this.isFilterActive) {
          this.filteredList = [];
          return;
        }
        
        // Aplicar filtros según lo seleccionado
        if (this.filters.name) {
          const results = await searchPokemonByName(this.filters.name);
          this.filteredList = results;
          
        } else if (this.filters.type) {
          const results = await getPokemonByType(this.filters.type);
          // Transformar la estructura para que coincida con lo esperado
          this.filteredList = results.map(item => item.pokemon);
          
        } else if (this.filters.generation) {
          const results = await getPokemonByGeneration(this.filters.generation);
          // La API devuelve pokemon_species, necesitamos convertirlo al formato URL de pokemon
          this.filteredList = results.map(species => ({
            name: species.name,
            url: species.url.replace('pokemon-species', 'pokemon')
          }));
        }
      } catch (error) {
        console.error('Error al aplicar filtros:', error);
        this.errorList = 'Error al filtrar Pokémon. Por favor, intente de nuevo.';
        this.filteredList = [];
      } finally {
        this.isLoadingList = false;
      }
    },
    
    // Limpiar todos los filtros
    clearFilters() {
      this.filters.name = '';
      this.filters.type = '';
      this.filters.generation = '';
      this.isFilterActive = false;
      this.filteredList = [];
      
      // Opcionalmente recargar la lista completa si está vacía
      if (this.pokemonList.length === 0) {
        this.fetchPokemonList(0, 20);
      }
    },
    
    // Actualizar un filtro específico
    updateFilter(filterType, value) {
      // Limpiar otros filtros para evitar conflictos
      if (filterType !== 'name') this.filters.name = '';
      if (filterType !== 'type') this.filters.type = '';
      if (filterType !== 'generation') this.filters.generation = '';
      
      // Establecer el nuevo valor de filtro
      this.filters[filterType] = value;
      
      // Aplicar el filtro actualizado
      this.applyFilters();
    }
  }
});