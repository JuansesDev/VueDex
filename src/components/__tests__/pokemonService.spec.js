// src/services/pokemonService.spec.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getPokemonList, getPokemonDetails, getFromUrl } from '../../services/pokemonService'; // Ajusta la ruta si es necesario

// Guardamos la implementación original de fetch
const originalFetch = global.fetch;

beforeEach(() => {
  // Mockeamos global.fetch antes de cada prueba
  // vi.fn() crea una función mock que podemos espiar y controlar
  global.fetch = vi.fn();
});

afterEach(() => {
  // Restauramos la implementación original de fetch después de cada prueba
  // y limpiamos cualquier mock para evitar interferencias entre pruebas.
  global.fetch = originalFetch;
  vi.resetAllMocks(); // Opcional si gestionas mocks manualmente, pero bueno para limpieza general.
});

const API_BASE_URL = 'https://pokeapi.co/api/v2/';

describe('PokemonService', () => {
  describe('getPokemonList', () => {
    it('should fetch a list of Pokémon successfully', async () => {
      const mockResponseData = {
        count: 100,
        next: 'some-next-url',
        previous: null,
        results: [
          { name: 'bulbasaur', url: `${API_BASE_URL}pokemon/1/` },
          { name: 'ivysaur', url: `${API_BASE_URL}pokemon/2/` },
        ],
      };
      // Configuramos el mock de fetch para que resuelva con una respuesta exitosa
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponseData, // .json() también debe ser una función mockeada que retorna una promesa
      });

      const offset = 0;
      const limit = 2;
      const pokemonList = await getPokemonList(offset, limit);

      // Verificamos que fetch fue llamado con la URL correcta
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}pokemon?offset=${offset}&limit=${limit}`);

      // Verificamos que los datos devueltos son los esperados
      expect(pokemonList).toEqual(mockResponseData.results);
    });

    it('should throw an error if the API call fails', async () => {
      // Configuramos el mock de fetch para que resuelva con una respuesta de error
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      // Usamos .rejects.toThrow() para verificar que la promesa es rechazada con un error
      await expect(getPokemonList(0, 20))
        .rejects.toThrow('Error al obtener la lista de Pokémon: 500 Internal Server Error');
    });
  });

  describe('getPokemonDetails', () => {
    it('should fetch details for a specific Pokémon successfully', async () => {
      const pokemonName = 'pikachu';
      const mockResponseData = {
        id: 25,
        name: 'pikachu',
        height: 4,
        weight: 60,
        sprites: { front_default: 'pikachu.png' },
      };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponseData,
      });

      const details = await getPokemonDetails(pokemonName);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}pokemon/${pokemonName}`);
      expect(details).toEqual(mockResponseData);
    });

    it('should throw a "Pokémon no encontrado" error for 404 responses', async () => {
      const pokemonName = 'nonexistentpokemon';
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(getPokemonDetails(pokemonName))
        .rejects.toThrow(`Pokémon no encontrado: ${pokemonName}`);
    });

    it('should throw a generic error for other non-ok responses', async () => {
      const pokemonName = 'pikachu';
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
      });

      await expect(getPokemonDetails(pokemonName))
        .rejects.toThrow(`Error al obtener los detalles del Pokémon ${pokemonName}: 503 Service Unavailable`);
    });

     it('should throw an error if nameOrId is not provided', async () => {
      // No necesitamos mockear fetch aquí porque la validación es síncrona y anterior
      await expect(getPokemonDetails(undefined))
        .rejects.toThrow('Se requiere un nombre o ID de Pokémon.');
      await expect(getPokemonDetails(null))
        .rejects.toThrow('Se requiere un nombre o ID de Pokémon.');
       await expect(getPokemonDetails(''))
        .rejects.toThrow('Se requiere un nombre o ID de Pokémon.');
    });
  });

  // Pruebas para getFromUrl (si la implementaste y quieres probarla)
  describe('getFromUrl', () => {
    it('should fetch data from a specific URL successfully', async () => {
      const fullUrl = 'https://pokeapi.co/api/v2/pokemon-species/1/';
      const mockResponseData = { name: 'bulbasaur', flavor_text_entries: [] };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponseData,
      });

      const data = await getFromUrl(fullUrl);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(fullUrl);
      expect(data).toEqual(mockResponseData);
    });

    it('should throw an error if the getFromUrl API call fails', async () => {
      const fullUrl = 'https://pokeapi.co/api/v2/pokemon-species/error/';
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error',
      });

      await expect(getFromUrl(fullUrl))
        .rejects.toThrow(`Error al obtener datos de ${fullUrl}: 500 Server Error`);
    });

    it('should throw an error if URL is not provided to getFromUrl', async () => {
      await expect(getFromUrl(undefined))
        .rejects.toThrow('Se requiere una URL.');
    });
  });
});