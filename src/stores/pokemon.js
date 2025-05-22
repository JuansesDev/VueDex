// src/stores/pokemon.js
import { defineStore } from 'pinia';
import { getPokemonList } from '@/services/pokemonService'; // Ajusta la ruta si es necesario

// Definimos nuestro store, 'pokemon' será el ID único del store.
export const usePokemonStore = defineStore('pokemon', {
  // State: define las propiedades reactivas del store.
  state: () => ({
    pokemonList: [],      // Array para almacenar la lista de Pokémon
    isLoadingList: false, // Para indicar si la lista se está cargando
    errorList: null,      // Para almacenar mensajes de error al cargar la lista
    // Más adelante podríamos añadir:
    // currentPokemonDetails: null,
    // isLoadingDetails: false,
    // errorDetails: null,
    // pagination: { offset: 0, limit: 20, count: 0 }
  }),

  // Getters: son como propiedades computadas para los stores.
  // Por ahora no necesitamos getters complejos, pero un ejemplo sería:
  getters: {
    // totalPokemon: (state) => state.pokemonList.length,
    // getPokemonByName: (state) => (name) => {
    //   return state.pokemonList.find(p => p.name === name);
    // }
  },

  // Actions: métodos que pueden contener lógica asíncrona y mutar el estado.
  actions: {
    async fetchPokemonList(offset = 0, limit = 20) {
      if (this.pokemonList.length > 0 && offset === 0) { // Evitar recargar si ya tenemos la primera página y no se pide otra
         // Opcional: podríamos tener una lógica más sofisticada para caché o paginación aquí.
         // Por ahora, si se llama sin offset, asumimos que se quiere la primera página.
         // Si ya hay datos y el offset es 0, podríamos decidir no hacer nada o limpiar y recargar.
         // Para esta prueba, la recargaremos.
         // this.pokemonList = []; // Descomentar si queremos limpiar antes de cada fetch de offset 0
      }

      this.isLoadingList = true;
      this.errorList = null;
      try {
        const list = await getPokemonList(offset, limit);
        // La API devuelve objetos con { name, url }. Podríamos querer procesarlos aquí
        // o directamente en el componente. Por ahora, los guardamos tal cual.
        if (offset === 0) {
          this.pokemonList = list;
        } else {
          // Si es paginación, añadimos a la lista existente
          this.pokemonList = [...this.pokemonList, ...list];
        }
        // Aquí podríamos actualizar también datos de paginación (count, next, etc.)
      } catch (error) {
        // El error ya fue logueado por el servicio, aquí lo guardamos para la UI.
        this.errorList = error.message || 'Error desconocido al cargar la lista de Pokémon.';
        this.pokemonList = []; // Limpiar la lista en caso de error
      } finally {
        this.isLoadingList = false;
      }
    },

    // Más adelante:
    // async fetchPokemonDetails(nameOrId) { ... }
  },
});