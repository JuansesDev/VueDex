import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import PokemonList from '../pokemon/PokemonList.vue';
import { usePokemonStore } from '@/stores/pokemon.js';

// Create a mock for the PokemonStore
vi.mock('@/stores/pokemon.js', () => ({
  usePokemonStore: vi.fn()
}));

describe('PokemonList', () => {
  let wrapper;
  let mockStore;
  
  beforeEach(() => {
    // Create a fresh Pinia instance for each test
    setActivePinia(createPinia());

    // Setup mock store with required properties and methods
    mockStore = {
      pokemonList: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
        { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' }
      ],
      filteredList: [],
      isLoadingList: false,
      errorList: null,
      isFilterActive: false,
      hasMorePokemon: true,
      fetchPokemonList: vi.fn(),
      loadMorePokemon: vi.fn(),
      clearFilters: vi.fn()
    };

    // Set the mock implementation for usePokemonStore
    usePokemonStore.mockReturnValue(mockStore);
  });
  
  // Helper function to remount component with current store state
  const remountComponent = () => {
    wrapper = mount(PokemonList, {
      global: {
        stubs: {
          PokemonCard: {
            template: '<div class="pokemon-card-stub" :pokemon="pokemon"></div>',
            props: ['pokemon']
          },
          LoadingSpinner: {
            template: '<div class="loading-spinner-stub"></div>'
          },
          ErrorMessage: {
            template: '<div class="error-message-stub">{{ message }}</div>',
            props: ['message']
          }
        }
      }
    });
    return wrapper;
  };
  
  beforeEach(() => {
    // Mount the component
    remountComponent();
  });

  it('renders pokemon list correctly', async () => {
    // Check if the component renders properly
    expect(wrapper.find('.pokemon-list-container').exists()).toBe(true);
    
    // Check if all pokemon cards are displayed
    const pokemonCards = wrapper.findAll('.pokemon-card-stub');
    expect(pokemonCards.length).toBe(3);
  });
  it('shows loading state', async () => {
    // Set loading state
    mockStore.isLoadingList = true;
    mockStore.pokemonList = [];
    mockStore.filteredList = [];
    
    // Remount component with updated store state
    wrapper = remountComponent();
    await wrapper.vm.$nextTick();
    
    // Find the loading spinner and check text
    const loadingDiv = wrapper.find('.flex.flex-col.items-center.py-10');
    expect(loadingDiv.exists()).toBe(true);
    expect(loadingDiv.text()).toContain('Cargando Pokémon');
  });
  it('shows error state when API fails', async () => {
    // Set error state
    mockStore.errorList = 'Error al cargar los Pokémon';
    mockStore.isLoadingList = false;
    mockStore.pokemonList = []; // Empty list to show error state
    
    // Remount component with updated store state
    wrapper = remountComponent();
    await wrapper.vm.$nextTick();
    
    // Find the error component and retry button
    const errorDiv = wrapper.find('.py-10');
    expect(errorDiv.exists()).toBe(true);
    const retryButton = errorDiv.find('button');
    expect(retryButton.exists()).toBe(true);
    expect(retryButton.text()).toBe('Reintentar');
  });
  it('displays filtered results when filters are active', async () => {
    // Set filter state
    mockStore.isFilterActive = true;
    mockStore.filteredList = [
      { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' }
    ];
    
    // Remount component with updated store state
    wrapper = remountComponent();
    await wrapper.vm.$nextTick();
    
    // Check the number of card elements
    const pokemonCards = wrapper.findAll('.pokemon-card-stub');
    expect(pokemonCards.length).toBe(1);
  });
  it('shows "no results" message when filtered list is empty', async () => {
    // Set filter state with no results
    mockStore.isFilterActive = true;
    mockStore.filteredList = [];
    mockStore.isLoadingList = false;
    
    // Remount component with updated store state
    wrapper = remountComponent();
    await wrapper.vm.$nextTick();
    
    // Find the no results message and clear filters button
    const noResultsDiv = wrapper.find('.py-10.text-center');
    expect(noResultsDiv.exists()).toBe(true);
    expect(noResultsDiv.text()).toContain('No se encontraron Pokémon que coincidan con los filtros');
    
    const clearFiltersBtn = noResultsDiv.find('button');
    expect(clearFiltersBtn.exists()).toBe(true);
    expect(clearFiltersBtn.text()).toBe('Limpiar Filtros');
  });
  it('calls loadMorePokemon when "Cargar más" button is clicked', async () => {
    // Ensure mock store state allows the button to appear
    mockStore.isFilterActive = false;
    mockStore.hasMorePokemon = true;
    mockStore.isLoadingList = false;
    await wrapper.vm.$nextTick();
    
    // Check if "Cargar más" button is displayed
    const loadMoreButton = wrapper.find('button.load-more');
    expect(loadMoreButton.exists()).toBe(true);
    
    // Click the button
    await loadMoreButton.trigger('click');
    
    // Check if store method was called
    expect(mockStore.loadMorePokemon).toHaveBeenCalled();
  });
  it('hides "Cargar más" button when there are no more pokemon to load', async () => {
    // Set state to indicate no more pokemon
    mockStore.hasMorePokemon = false;
    
    // Remount component with updated store state
    wrapper = remountComponent();
    await wrapper.vm.$nextTick();
    
    // Check if the load more button is not present
    const loadMoreButton = wrapper.find('button.load-more');
    expect(loadMoreButton.exists()).toBe(false);
  });

  it('hides "Cargar más" button when filters are active', async () => {
    // Set filter state
    mockStore.isFilterActive = true;
    mockStore.filteredList = [
      { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' }
    ];
    
    // Remount component with updated store state
    wrapper = remountComponent();
    await wrapper.vm.$nextTick();
    
    // Check if the load more button is not present
    const loadMoreButton = wrapper.find('button.load-more');
    expect(loadMoreButton.exists()).toBe(false);
  });

  it('fetches pokemon list on mount', () => {
    // We need to create a new component instance to test onMount behavior
    mockStore.pokemonList = [];
    mockStore.fetchPokemonList.mockClear();
    
    // Mount a new component when list is empty
    const newWrapper = mount(PokemonList, {
      global: {
        stubs: {
          PokemonCard: true,
          LoadingSpinner: true,
          ErrorMessage: true
        }
      }
    });
    
    // Check if the fetchPokemonList was called on mount
    expect(mockStore.fetchPokemonList).toHaveBeenCalled();
  });  it('renders the correct number of pokemon cards', async () => {
    // Setup with a specific number of Pokemon and ensure we're not in filtered mode
    mockStore.isFilterActive = false;
    mockStore.pokemonList = Array(5).fill().map((_, i) => ({
      name: `pokemon${i+1}`,
      url: `https://pokeapi.co/api/v2/pokemon/${i+1}/`
    }));
    mockStore.filteredList = [];
    
    // Re-mount the component with the new data
    wrapper = mount(PokemonList, {
      global: {
        stubs: {
          PokemonCard: {
            template: '<div class="pokemon-card-stub" :pokemon="pokemon"></div>',
            props: ['pokemon']
          },
          LoadingSpinner: {
            template: '<div class="loading-spinner-stub"></div>'
          },
          ErrorMessage: {
            template: '<div class="error-message-stub">{{ message }}</div>',
            props: ['message']
          }
        }
      }
    });
    
    // Check that all cards are rendered
    const pokemonCards = wrapper.findAll('.pokemon-card-stub');
    expect(pokemonCards.length).toBe(5);
  });
  it('disables "Cargar más" button during loading state', async () => {
    // Set loading state for more button
    mockStore.isLoadingList = true;
    mockStore.hasMorePokemon = true;
    mockStore.isFilterActive = false;
    
    // Remount component with updated store state
    wrapper = remountComponent();
    await wrapper.vm.$nextTick();
    
    // Find the load more button and check its text and disabled state
    const loadMoreButton = wrapper.find('button.load-more');
    expect(loadMoreButton.exists()).toBe(true);
    expect(loadMoreButton.attributes('disabled')).toBeDefined();
    expect(loadMoreButton.text()).toContain('Cargando');
  });
  it('shows appropriate message when there are no pokemon and no errors', async () => {
    // Set empty state
    mockStore.pokemonList = [];
    mockStore.filteredList = [];
    mockStore.isFilterActive = false;
    mockStore.isLoadingList = false;
    mockStore.errorList = null;
    
    // Remount component with updated store state
    wrapper = remountComponent();
    await wrapper.vm.$nextTick();
    
    // Find the empty state message div
    const emptyStateDiv = wrapper.find('.py-10.text-center');
    expect(emptyStateDiv.exists()).toBe(true);
    expect(emptyStateDiv.text()).toContain('No se encontraron Pokémon');
    expect(emptyStateDiv.text()).toContain('Intenta recargar');
    
    const reloadButton = emptyStateDiv.find('button');
    expect(reloadButton.exists()).toBe(true);
    expect(reloadButton.text()).toBe('Recargar');
  });
  it('handles transition between loading and error states correctly', async () => {
    // Initial loading state
    mockStore.isLoadingList = true;
    mockStore.pokemonList = [];
    mockStore.errorList = null;
    
    // Remount component with loading state
    wrapper = remountComponent();
    await wrapper.vm.$nextTick();
    
    // Check for loading spinner and text
    const loadingDiv = wrapper.find('.flex.flex-col.items-center');
    expect(loadingDiv.exists()).toBe(true);
    expect(loadingDiv.text()).toContain('Cargando Pokémon');
    
    // Transition to error state
    mockStore.isLoadingList = false;
    mockStore.errorList = 'Error al cargar';
    
    // Need to remount again for the error state
    wrapper = remountComponent();
    await wrapper.vm.$nextTick();
    
    // Check for error message
    const errorMessageStub = wrapper.find('.error-message-stub');
    expect(errorMessageStub.exists()).toBe(true);
    
    // Find the retry button within the parent div
    const retryButtonDiv = wrapper.find('.flex.justify-center.mt-4');
    expect(retryButtonDiv.exists()).toBe(true);
    
    const retryButton = retryButtonDiv.find('button');
    expect(retryButton.exists()).toBe(true);
    expect(retryButton.text()).toBe('Reintentar');
  });  it('transitions smoothly from filtered to unfiltered state', async () => {
    // First set up filtered state
    mockStore.isFilterActive = true;
    mockStore.filteredList = [
      { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' }
    ];
    
    // Remount component with filtered state
    wrapper = remountComponent();
    await wrapper.vm.$nextTick();
    
    // Check filtered state - should show only 1 card
    const filteredCards = wrapper.findAll('.pokemon-card-stub');
    expect(filteredCards.length).toBe(1);
    
    // Now transition to unfiltered state
    mockStore.isFilterActive = false;
    mockStore.pokemonList = [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
      { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' }
    ];
    
    // Need to remount again for the unfiltered state
    wrapper = remountComponent();
    await wrapper.vm.$nextTick();
    
    // Check unfiltered state - should show original 3 cards
    const unfilteredCards = wrapper.findAll('.pokemon-card-stub');
    expect(unfilteredCards.length).toBe(3);
  });
  it('shows different behavior based on filter vs pagination states', async () => {
    // Regular state - check if load more button is visible
    const loadMoreButton = wrapper.find('button.load-more');
    expect(loadMoreButton.exists()).toBe(true);
    
    // Switch to filtered state
    mockStore.isFilterActive = true;
    mockStore.filteredList = [
      { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' }
    ];
    
    // Remount component with updated store state
    wrapper = remountComponent();
    await wrapper.vm.$nextTick();
    
    // Verify pagination controls are hidden in filtered state
    const filteredStateLoadMoreButton = wrapper.find('button.load-more');
    expect(filteredStateLoadMoreButton.exists()).toBe(false);
    
    // Verify we still see the filtered content (1 card)
    const filteredCards = wrapper.findAll('.pokemon-card-stub');
    expect(filteredCards.length).toBe(1);
  });
  it('handles empty results differently between initial load and filtering', async () => {
    // First test empty initial state
    mockStore.pokemonList = [];
    mockStore.filteredList = [];
    mockStore.isFilterActive = false;
    mockStore.isLoadingList = false;
    mockStore.errorList = null;
    
    // Remount component with empty initial state
    wrapper = remountComponent();
    await wrapper.vm.$nextTick();
    
    // Find the empty state message div
    const initialEmptyDiv = wrapper.find('.py-10.text-center');
    expect(initialEmptyDiv.exists()).toBe(true);
    expect(initialEmptyDiv.text()).toContain('No se encontraron Pokémon');
    expect(initialEmptyDiv.text()).toContain('Intenta recargar');
    
    // Now test empty filtered state
    mockStore.isFilterActive = true;
    
    // Create a new component instance with updated state
    const filteredWrapper = mount(PokemonList, {
      global: {
        stubs: {
          PokemonCard: {
            template: '<div class="pokemon-card-stub" :pokemon="pokemon"></div>',
            props: ['pokemon']
          },
          LoadingSpinner: {
            template: '<div class="loading-spinner-stub"></div>'
          },
          ErrorMessage: {
            template: '<div class="error-message-stub">{{ message }}</div>',
            props: ['message']
          }
        }
      }
    });
    await filteredWrapper.vm.$nextTick();
    
    // Find the filtered empty state message div
    const filteredEmptyDiv = filteredWrapper.find('.py-10.text-center');
    expect(filteredEmptyDiv.exists()).toBe(true);
    expect(filteredEmptyDiv.text()).toContain('No se encontraron Pokémon');
    expect(filteredEmptyDiv.text()).toContain('coincidan con los filtros');
  });
  it('calls clearFilters when button is clicked in empty filter results', async () => {
    // Set up filter state with no results
    mockStore.isFilterActive = true;
    mockStore.filteredList = [];
    mockStore.isLoadingList = false;
    
    // Remount component with updated store state
    wrapper = remountComponent();
    await wrapper.vm.$nextTick();
    
    // Find the clear filters button and click it
    const clearFiltersButton = wrapper.find('.py-10.text-center button');
    expect(clearFiltersButton.exists()).toBe(true);
    expect(clearFiltersButton.text()).toBe('Limpiar Filtros');
    await clearFiltersButton.trigger('click');
    
    // Verify the clearFilters method was called
    expect(mockStore.clearFilters).toHaveBeenCalled();
  });
  it('calls fetchPokemonList when retry button is clicked in error state', async () => {
    // Set up error state
    mockStore.errorList = 'Error al cargar los Pokémon';
    mockStore.isLoadingList = false;
    mockStore.fetchPokemonList.mockClear();
    
    // Remount component with updated store state
    wrapper = remountComponent();
    await wrapper.vm.$nextTick();
    
    // Find the retry button by looking for the button within the error state div
    const errorStateDiv = wrapper.find('.py-10:not(.text-center)');
    expect(errorStateDiv.exists()).toBe(true);
    
    const retryButton = errorStateDiv.find('button');
    expect(retryButton.exists()).toBe(true);
    expect(retryButton.text()).toBe('Reintentar');
    await retryButton.trigger('click');
    
    // Verify the fetchPokemonList method was called
    expect(mockStore.fetchPokemonList).toHaveBeenCalled();
  });
  it('does not fetch pokemon list on mount if list is already populated', () => {
    // Clear previous calls
    mockStore.fetchPokemonList.mockClear();
    
    // Set up store with existing pokemon
    mockStore.pokemonList = [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }
    ];
    
    // Mount a new component
    const newWrapper = mount(PokemonList, {
      global: {
        stubs: {
          PokemonCard: true,
          LoadingSpinner: true,
          ErrorMessage: true
        }
      }
    });
    
    // Verify fetchPokemonList was not called
    expect(mockStore.fetchPokemonList).not.toHaveBeenCalled();
  });
});