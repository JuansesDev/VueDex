// src/stores/pokemon.js
import { defineStore } from 'pinia';
import { getPokemonList, getPokemonDetails } from '@/services/pokemonService.js'; // Asegúrate que getPokemonDetails esté importado

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemonList: [],
    isLoadingList: false,
    errorList: null,

    // Nuevas propiedades de estado para los detalles del Pokémon
    currentPokemonDetails: null,   // Para almacenar el objeto de detalles del Pokémon actual
    isLoadingDetails: false,       // Para el estado de carga de los detalles
    errorDetails: null,            // Para errores al cargar los detalles
  }),

  getters: {
    // ... (getters existentes si los tienes)
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
    }
  },
});