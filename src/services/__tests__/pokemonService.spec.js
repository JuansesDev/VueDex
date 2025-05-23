import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { 
  getPokemonList,
  getPokemonDetails,
  getFromUrl,
  getPokemonTypes,
  getPokemonGenerations,
  searchPokemonByName,
  getPokemonByType,
  getPokemonByGeneration
} from '@/services/pokemonService.js';

describe('Pokemon Service', () => {
  // Setup fetch mock before each test
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  // Clean up after each test
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getPokemonList', () => {
    it('fetches pokemon list with default pagination', async () => {
      // Mock API response
      const mockResponse = {
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' }
        ]
      };

      // Setup fetch mock
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      // Call the service
      const result = await getPokemonList();

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');
      expect(result).toEqual(mockResponse.results);
    });

    it('fetches pokemon list with custom pagination', async () => {
      // Mock API response
      const mockResponse = {
        results: [
          { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
          { name: 'charmeleon', url: 'https://pokeapi.co/api/v2/pokemon/5/' }
        ]
      };

      // Setup fetch mock
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      // Call the service with custom pagination
      const result = await getPokemonList(20, 10);

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?offset=20&limit=10');
      expect(result).toEqual(mockResponse.results);
    });

    it('handles API errors gracefully', async () => {
      // Setup fetch mock to reject
      global.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: ''
      });

      // Call the service and expect error
      await expect(getPokemonList()).rejects.toThrow('Error al obtener la lista de Pokémon');
    });
  });

  describe('getPokemonDetails', () => {
    it('fetches pokemon details by name', async () => {
      // Mock API response
      const mockResponse = {
        id: 25,
        name: 'pikachu',
        height: 4,
        weight: 60,
        types: [{ type: { name: 'electric' } }]
      };

      // Setup fetch mock
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      // Call the service
      const result = await getPokemonDetails('pikachu');

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/pikachu');
      expect(result).toEqual(mockResponse);
    });

    it('fetches pokemon details by ID', async () => {
      // Mock API response
      const mockResponse = {
        id: 25,
        name: 'pikachu',
        height: 4,
        weight: 60,
        types: [{ type: { name: 'electric' } }]
      };

      // Setup fetch mock
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      // Call the service
      const result = await getPokemonDetails(25);

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/25');
      expect(result).toEqual(mockResponse);
    });

    it('handles API errors gracefully', async () => {
      // Setup fetch mock to reject with 404
      global.fetch.mockResolvedValue({
        ok: false,
        status: 404
      });
      
      // Call the service and expect error
      await expect(getPokemonDetails('nonexistent')).rejects.toThrow('Pokémon no encontrado: nonexistent');
    });
  });

  describe('getPokemonTypes', () => {
    it('fetches all pokemon types', async () => {
      // Mock API response
      const mockResponse = {
        results: [
          { name: 'normal', url: 'https://pokeapi.co/api/v2/type/1/' },
          { name: 'fighting', url: 'https://pokeapi.co/api/v2/type/2/' }
        ]
      };

      // Setup fetch mock
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      // Call the service
      const result = await getPokemonTypes();

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/type');
      expect(result).toEqual(mockResponse.results);
    });

    it('handles API errors gracefully', async () => {
      // Setup fetch mock to reject
      global.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: ''
      });

      // Call the service and expect error
      await expect(getPokemonTypes()).rejects.toThrow('Error al obtener tipos de Pokémon');
    });
  });

  describe('getPokemonGenerations', () => {
    it('fetches all pokemon generations', async () => {
      // Mock API response
      const mockResponse = {
        results: [
          { name: 'generation-i', url: 'https://pokeapi.co/api/v2/generation/1/' },
          { name: 'generation-ii', url: 'https://pokeapi.co/api/v2/generation/2/' }
        ]
      };

      // Setup fetch mock
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      // Call the service
      const result = await getPokemonGenerations();

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/generation');
      expect(result).toEqual(mockResponse.results);
    });

    it('handles API errors gracefully', async () => {
      // Setup fetch mock to reject
      global.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: ''
      });

      // Call the service and expect error
      await expect(getPokemonGenerations()).rejects.toThrow('Error al obtener generaciones de Pokémon');
    });
  });

  describe('searchPokemonByName', () => {
    it('searches pokemon by name prefix', async () => {
      // Mock API response
      const mockResponse = {
        results: [
          { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
          { name: 'pikipek', url: 'https://pokeapi.co/api/v2/pokemon/731/' },
          { name: 'pichu', url: 'https://pokeapi.co/api/v2/pokemon/172/' },
          { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' }
        ]
      };

      // Setup fetch mock
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      // Call the service
      const result = await searchPokemonByName('pi');

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=2000');
      expect(result.length).toBe(3);
      expect(result[0].name).toBe('pikachu');
      expect(result[1].name).toBe('pikipek');
      expect(result[2].name).toBe('pichu');
    });

    it('returns empty array when no matches found', async () => {
      // Mock API response
      const mockResponse = {
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' }
        ]
      };

      // Setup fetch mock
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      // Call the service
      const result = await searchPokemonByName('xyz');

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=2000');
      expect(result).toEqual([]);
    });

    it('handles API errors gracefully', async () => {
      // Setup fetch mock to reject
      global.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: ''
      });

      // Call the service and expect error
      await expect(searchPokemonByName('pi')).rejects.toThrow('Error al buscar Pokémon');
    });
  });

  describe('getPokemonByType', () => {
    it('fetches pokemon by type', async () => {
      // Mock API response
      const mockResponse = {
        pokemon: [
          { pokemon: { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' } },
          { pokemon: { name: 'charmeleon', url: 'https://pokeapi.co/api/v2/pokemon/5/' } }
        ]
      };

      // Setup fetch mock
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      // Call the service
      const result = await getPokemonByType('fire');

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/type/fire');
      expect(result).toEqual(mockResponse.pokemon);
    });

    it('handles API errors gracefully', async () => {
      // Setup fetch mock to reject
      global.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: ''
      });

      // Call the service and expect error
      await expect(getPokemonByType('fire')).rejects.toThrow('Error al obtener Pokémon por tipo fire');
    });
  });

  describe('getPokemonByGeneration', () => {
    it('fetches pokemon by generation', async () => {
      // Mock API response matching the actual API structure
      const mockResponse = {
        pokemon_species: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
          { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon-species/2/' }
        ]
      };

      // Setup fetch mock
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      // Call the service
      const result = await getPokemonByGeneration('generation-i');

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/generation/generation-i');
      expect(result).toEqual(mockResponse.pokemon_species);
    });

    it('handles API errors gracefully', async () => {
      // Setup fetch mock to reject
      global.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: ''
      });

      // Call the service and expect error
      await expect(getPokemonByGeneration('generation-i')).rejects.toThrow('Error al obtener Pokémon por generación generation-i');
    });
  });

  describe('getFromUrl', () => {
    it('fetches data from a specific URL', async () => {
      // Mock API response
      const mockResponse = {
        id: 25,
        name: 'pikachu'
      };

      // Setup fetch mock
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      // Call the service
      const result = await getFromUrl('https://pokeapi.co/api/v2/pokemon/25/');

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/25/');
      expect(result).toEqual(mockResponse);
    });

    it('handles API errors gracefully', async () => {
      // Setup fetch mock to reject
      global.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: ''
      });

      // Call the service and expect error
      await expect(getFromUrl('https://pokeapi.co/api/v2/pokemon/0/')).rejects.toThrow('Error al obtener datos de');
    });
  });
});