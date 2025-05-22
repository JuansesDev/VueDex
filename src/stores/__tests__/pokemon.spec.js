import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { usePokemonStore } from '../pokemon';
import * as pokemonService from '@/services/pokemonService';

// Mock the pokemonService module with all required functions
vi.mock('@/services/pokemonService', () => ({
  getPokemonList: vi.fn(),
  getPokemonDetails: vi.fn(),
  getPokemonTypes: vi.fn(),
  getPokemonGenerations: vi.fn(),
  searchPokemonByName: vi.fn(),
  getPokemonByType: vi.fn(),
  getPokemonByGeneration: vi.fn()
}));

describe('Pokemon Store', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance for each test
    setActivePinia(createPinia());
    
    // Reset mocks
    vi.clearAllMocks();
  });

  it('initializes with correct state', () => {
    const store = usePokemonStore();
    
    expect(store.pokemonList).toEqual([]);
    expect(store.currentPokemonDetails).toBeNull();
    expect(store.isLoadingList).toBe(false);
    expect(store.errorList).toBeNull();
  });

  it('fetches pokemons successfully', async () => {
    const mockPokemons = [
      { id: 1, name: 'bulbasaur' },
      { id: 2, name: 'ivysaur' }
    ];
    
    pokemonService.getPokemonList.mockResolvedValue(mockPokemons);

    const store = usePokemonStore();
    await store.fetchPokemonList();
    
    expect(store.pokemonList).toEqual(mockPokemons);
    expect(store.isLoadingList).toBe(false);
    expect(store.errorList).toBeNull();
  });

  it('handles fetch error properly', async () => {
    const errorMessage = 'Failed to fetch';
    pokemonService.getPokemonList.mockRejectedValue(new Error(errorMessage));

    const store = usePokemonStore();
    await store.fetchPokemonList();
    
    expect(store.pokemonList).toEqual([]);
    expect(store.isLoadingList).toBe(false);
    expect(store.errorList).toBe(errorMessage);
  });

  it('sets and clears current pokemon', async () => {
    const store = usePokemonStore();
    const mockPokemon = { name: 'pikachu', id: 25 };
    
    // Test fetch details
    pokemonService.getPokemonDetails.mockResolvedValue(mockPokemon);
    await store.fetchPokemonDetails('pikachu');
    expect(store.currentPokemonDetails).toEqual(mockPokemon);
    
    // Test clear details
    store.clearPokemonDetails();
    expect(store.currentPokemonDetails).toBeNull();
  });
});
