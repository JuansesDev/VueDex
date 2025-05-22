// src/stores/pokemon.js
import { defineStore } from 'pinia';
// Asegúrate que la ruta al servicio es correcta. Si tu carpeta de servicios está en src/services:
import { getPokemonList } from '@/services/pokemonService';

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemonList: [],
    isLoadingList: false,
    errorList: null,
    // Podríamos añadir un contador total de Pokémon si la API lo proporciona fácilmente
    // para mejorar la lógica de "cargar más".
    // totalPokemonCountFromApi: 0,
  }),

  getters: {
    // Ejemplo de getter (no usado activamente por ahora)
    // hasPokemon: (state) => state.pokemonList.length > 0,
  },

  actions: {
    async fetchPokemonList(offset = 0, limit = 20) {
      // Si es la primera carga (offset 0) y ya tenemos datos, podríamos decidir si recargar o no.
      // Por simplicidad en este punto, siempre recargaremos si se pide offset 0,
      // o limpiaremos la lista si offset es 0 para asegurar que no se dupliquen al recargar la "primera página".
      if (offset === 0) {
        this.pokemonList = []; // Limpiar para la primera carga/recarga de la primera página
      }

      this.isLoadingList = true;
      this.errorList = null;

      try {
        const listFromApi = await getPokemonList(offset, limit);

        // --- SOLO PARA PRUEBA DE LOADER (DESCOMENTAR SI QUIERES VER EL SPINNER) ---
        // console.log('Simulando retardo para ver el loader...');
        // await new Promise(resolve => setTimeout(resolve, 1500)); // Espera 1.5 segundos
        // --- FIN DE PRUEBA DE LOADER ---

        if (listFromApi && listFromApi.length > 0) {
          // Si es la primera carga (offset 0) o la lista estaba vacía, asignamos directamente.
          // Si no, concatenamos para la paginación.
          this.pokemonList = offset === 0 ? listFromApi : [...this.pokemonList, ...listFromApi];
        } else if (offset > 0 && (!listFromApi || listFromApi.length === 0)) {
          // Si estamos intentando cargar más (offset > 0) pero la API no devuelve nada,
          // podríamos indicar que no hay más Pokémon para cargar.
          // Por ahora, simplemente no se añadirán más.
          console.log('No se encontraron más Pokémon para cargar.');
        }
        // Idealmente, la API nos daría el 'count' total para gestionar mejor la paginación
        // y saber cuándo deshabilitar el botón "cargar más".
        // this.totalPokemonCountFromApi = data.count; // Si la API devolviera un objeto con count

      } catch (error) {
        console.error('Error en la acción fetchPokemonList:', error); // Loguear el error aquí también es útil
        this.errorList = error.message || 'Error desconocido al obtener la lista de Pokémon.';
        // Es importante decidir si limpiar la lista en caso de error
        // Si es un error de paginación, quizás no queremos limpiar los ya cargados.
        // Si es un error de carga inicial, sí.
        if (offset === 0) {
          this.pokemonList = [];
        }
      } finally {
        this.isLoadingList = false;
      }
    },

    // Acción para el detalle del Pokémon (la implementaremos más adelante)
    /*
    async fetchPokemonDetails(nameOrId) {
      this.isLoadingDetails = true;
      this.errorDetails = null;
      this.currentPokemonDetails = null;
      try {
        // const details = await getPokemonDetails(nameOrId); // Desde tu servicio
        // this.currentPokemonDetails = details;
      } catch (error) {
        // this.errorDetails = error.message || `Error al obtener detalles de ${nameOrId}.`;
      } finally {
        // this.isLoadingDetails = false;
      }
    }
    */
  },
});