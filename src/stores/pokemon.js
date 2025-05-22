// src/stores/pokemon.js
import { defineStore } from 'pinia';
import { getPokemonList } from '@/services/pokemonService.js'; // Ajusta la ruta si es necesario

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemonList: [],
    isLoadingList: false,
    errorList: null,
    // totalPokemonCountFromApi: 0, // Opcional para paginación más inteligente
  }),

  getters: {
    // hasPokemon: (state) => state.pokemonList.length > 0,
  },

  actions: {
    async fetchPokemonList(offset = 0, limit = 20) {
      if (offset === 0) {
        // Para la primera carga o recarga de la primera página, limpiar la lista actual.
        // Esto evita que se acumulen Pokémon si el usuario vuelve a cargar.
        this.pokemonList = [];
      }

      this.isLoadingList = true;
      this.errorList = null;

      try {
        const listFromApi = await getPokemonList(offset, limit); // Esto devuelve [{ name, url }, ...]

        if (listFromApi && listFromApi.length > 0) {
          this.pokemonList = [...this.pokemonList, ...listFromApi]; // Siempre concatenar para paginación
        } else if (offset > 0 && (!listFromApi || listFromApi.length === 0)) {
          console.log('No se encontraron más Pokémon para cargar.');
          // Aquí podrías setear una bandera para deshabilitar el botón "Cargar más"
        }
        // Si la API proporcionara 'count' total:
        // this.totalPokemonCountFromApi = data.count; 
      } catch (error) {
        console.error('Error en la acción fetchPokemonList:', error);
        this.errorList = error.message || 'Error desconocido al obtener la lista de Pokémon.';
        if (offset === 0) { // Solo limpiar la lista si es un error en la carga inicial
          this.pokemonList = [];
        }
      } finally {
        this.isLoadingList = false;
      }
    },
  },
});