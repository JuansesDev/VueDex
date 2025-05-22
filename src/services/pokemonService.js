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

/**
 * Obtiene todos los tipos de Pokémon disponibles.
 * @returns {Promise<Array<{name: string, url: string}>>} Una promesa que resuelve a una lista de tipos.
 */
export async function getPokemonTypes() {
  try {
    const response = await fetch(`${API_BASE_URL}type`);
    
    if (!response.ok) {
      throw new Error(`Error al obtener tipos de Pokémon: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.results; // Devuelve la lista de tipos
  } catch (error) {
    console.error('Error en getPokemonTypes:', error);
    throw error;
  }
}

/**
 * Obtiene todas las generaciones de Pokémon disponibles.
 * @returns {Promise<Array<{name: string, url: string}>>} Una promesa que resuelve a una lista de generaciones.
 */
export async function getPokemonGenerations() {
  try {
    const response = await fetch(`${API_BASE_URL}generation`);
    
    if (!response.ok) {
      throw new Error(`Error al obtener generaciones de Pokémon: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.results; // Devuelve la lista de generaciones
  } catch (error) {
    console.error('Error en getPokemonGenerations:', error);
    throw error;
  }
}

/**
 * Busca Pokémon que coincidan con un nombre específico.
 * @param {string} name - El nombre o parte del nombre a buscar.
 * @returns {Promise<Array<{name: string, url: string}>>} Una promesa que resuelve a una lista de Pokémon que coinciden.
 */
export async function searchPokemonByName(name) {
  try {
    // La API no soporta búsqueda por nombre parcial, así que obtendremos algunos
    // y filtraremos en el cliente
    const response = await fetch(`${API_BASE_URL}pokemon?limit=2000`); // Un límite alto para obtener la mayoría
    
    if (!response.ok) {
      throw new Error(`Error al buscar Pokémon: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    // Filtrado en el cliente por nombre
    const filteredResults = data.results.filter(pokemon => 
      pokemon.name.toLowerCase().includes(name.toLowerCase())
    );
    
    return filteredResults;
  } catch (error) {
    console.error(`Error en searchPokemonByName para "${name}":`, error);
    throw error;
  }
}

/**
 * Obtiene Pokémon de un tipo específico.
 * @param {string} typeName - El nombre del tipo.
 * @returns {Promise<Array<{pokemon: {name: string, url: string}}>>} Una promesa que resuelve a una lista de Pokémon del tipo especificado.
 */
export async function getPokemonByType(typeName) {
  try {
    const response = await fetch(`${API_BASE_URL}type/${typeName.toLowerCase()}`);
    
    if (!response.ok) {
      throw new Error(`Error al obtener Pokémon por tipo ${typeName}: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.pokemon; // Devuelve la lista de Pokémon de este tipo
  } catch (error) {
    console.error(`Error en getPokemonByType para "${typeName}":`, error);
    throw error;
  }
}

/**
 * Obtiene Pokémon de una generación específica.
 * @param {string} generationName - El nombre de la generación.
 * @returns {Promise<Array<{name: string, url: string}>>} Una promesa que resuelve a una lista de especies de Pokémon de la generación.
 */
export async function getPokemonByGeneration(generationName) {
  try {
    const response = await fetch(`${API_BASE_URL}generation/${generationName.toLowerCase()}`);
    
    if (!response.ok) {
      throw new Error(`Error al obtener Pokémon por generación ${generationName}: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.pokemon_species; // Devuelve las especies de Pokémon de esta generación
  } catch (error) {
    console.error(`Error en getPokemonByGeneration para "${generationName}":`, error);
    throw error;
  }
}