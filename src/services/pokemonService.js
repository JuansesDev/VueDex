// src/services/pokemonService.js

const API_BASE_URL = 'https://pokeapi.co/api/v2/';

/**
 * Obtiene una lista paginada de Pokémon.
 * @param {number} offset - El número de Pokémon a saltar.
 * @param {number} limit - El número máximo de Pokémon a devolver.
 * @returns {Promise<Array<{name: string, url: string}>>} Una promesa que resuelve a una lista de Pokémon.
 * @throws {Error} Si la respuesta de la API no es exitosa.
 */
export async function getPokemonList(offset = 0, limit = 20) {
  try {
    const response = await fetch(`${API_BASE_URL}pokemon?offset=${offset}&limit=${limit}`);

    if (!response.ok) {
      // Lanza un error si la respuesta no fue exitosa (ej. 404, 500)
      throw new Error(`Error al obtener la lista de Pokémon: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    // La API devuelve un objeto con 'count', 'next', 'previous', y 'results'.
    // Nos interesa 'results' que es el array de Pokémon.
    return data.results;
  } catch (error) {
    console.error('Error en getPokemonList:', error);
    // Re-lanzamos el error para que el componente que llama pueda manejarlo
    // o mostrar un mensaje al usuario.
    throw error;
  }
}

/**
 * Obtiene los detalles de un Pokémon específico por su nombre o ID.
 * @param {string|number} nameOrId - El nombre o ID del Pokémon.
 * @returns {Promise<Object>} Una promesa que resuelve a los detalles del Pokémon.
 * @throws {Error} Si la respuesta de la API no es exitosa o el Pokémon no se encuentra.
 */
export async function getPokemonDetails(nameOrId) {
  if (!nameOrId) {
    throw new Error('Se requiere un nombre o ID de Pokémon.');
  }
  try {
    const response = await fetch(`${API_BASE_URL}pokemon/${String(nameOrId).toLowerCase()}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Pokémon no encontrado: ${nameOrId}`);
      }
      throw new Error(`Error al obtener los detalles del Pokémon ${nameOrId}: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Devuelve el objeto completo con los detalles del Pokémon
  } catch (error) {
    console.error(`Error en getPokemonDetails para ${nameOrId}:`, error);
    throw error;
  }
}

// Opcional: Función para obtener datos de una URL específica (útil para 'species_url', etc.)
/**
 * Obtiene datos de una URL específica (generalmente de la PokéAPI).
 * @param {string} url - La URL completa de la cual obtener los datos.
 * @returns {Promise<Object>} Una promesa que resuelve a los datos de la URL.
 * @throws {Error} Si la respuesta de la API no es exitosa.
 */
export async function getFromUrl(url) {
  if (!url) {
    throw new Error('Se requiere una URL.');
  }
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al obtener datos de ${url}: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error en getFromUrl para ${url}:`, error);
    throw error;
  }
}