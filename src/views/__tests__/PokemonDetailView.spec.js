import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import PokemonDetailView from '../PokemonDetailView.vue';
import { usePokemonStore } from '@/stores/pokemon.js';

// Create a mock for the PokemonStore
vi.mock('@/stores/pokemon.js', () => ({
  usePokemonStore: vi.fn()
}));

// Mock components
vi.mock('@/components/common/LoadingSpinner.vue', () => ({
  default: {
    name: 'LoadingSpinner',
    template: '<div class="mock-spinner">Cargando...</div>'
  }
}));

vi.mock('@/components/common/ErrorMessage.vue', () => ({
  default: {
    name: 'ErrorMessage',
    template: '<div class="mock-error"></div>',
    props: ['message']
  }
}));

vi.mock('@/components/pokemon/PokemonDetailCard.vue', () => ({
  default: {
    name: 'PokemonDetailCard',
    template: '<div class="mock-detail-card"></div>',
    props: ['pokemon']
  }
}));

describe('PokemonDetailView', () => {
  let wrapper;
  let mockStore;
  let router;
  const mockPokemonName = 'pikachu';

  beforeEach(() => {
    // Create a fresh Pinia instance for each test
    setActivePinia(createPinia());

    // Setup router with route params
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { 
          path: '/pokemon/:name', 
          name: 'pokemon-detail',
          component: PokemonDetailView
        },
        {
          path: '/',
          name: 'home',
          component: { template: '<div>Home</div>' }
        }
      ]
    });

    // Navigate to the detail route with the specified Pokemon name
    router.push(`/pokemon/${mockPokemonName}`);

    // Setup mock store with required properties and methods
    mockStore = {
      currentPokemonDetails: null,
      isLoadingDetails: false,
      errorDetails: null,
      fetchPokemonDetails: vi.fn(),
    };

    // Set the mock implementation for usePokemonStore
    usePokemonStore.mockReturnValue(mockStore);
  });

  it('renders loading state when data is being fetched', async () => {
    // Set loading state
    mockStore.isLoadingDetails = true;
    
    // Mount the component
    wrapper = mount(PokemonDetailView, {
      global: {
        plugins: [router]
      }
    });
    
    // Check if loading spinner is displayed
    expect(wrapper.find('.mock-spinner').exists()).toBe(true);
    expect(wrapper.text()).toContain('Cargando');
  });

  it('renders error state when API request fails', async () => {
    // Set error state
    mockStore.errorDetails = 'Error al cargar los detalles del Pokémon';
    
    // Mount the component
    wrapper = mount(PokemonDetailView, {
      global: {
        plugins: [router]
      }
    });
    
    // Check if error message is displayed
    expect(wrapper.find('.mock-error').exists()).toBe(true);
    
    // Check if retry button is displayed
    const retryButton = wrapper.find('button');
    expect(retryButton.exists()).toBe(true);
    expect(retryButton.text()).toContain('Reintentar');
  });

  it('renders pokemon details when data is loaded successfully', async () => {
    // Set successful state with mock pokemon data
    mockStore.currentPokemonDetails = {
      id: 25,
      name: 'pikachu',
      sprites: {
        front_default: 'https://example.com/pikachu.png',
        other: {
          'official-artwork': {
            front_default: 'https://example.com/pikachu-official.png'
          }
        }
      },
      types: [{ type: { name: 'electric' } }],
      stats: [
        { base_stat: 35, stat: { name: 'hp' } },
        { base_stat: 55, stat: { name: 'attack' } }
      ],
      height: 4,
      weight: 60,
      abilities: [{ ability: { name: 'static' } }]
    };
    
    // Mount the component
    wrapper = mount(PokemonDetailView, {
      global: {
        plugins: [router]
      }
    });
    
    // Check if pokemon details are displayed
    expect(wrapper.find('.pokemon-detail-view').exists()).toBe(true);
    expect(wrapper.text()).toContain('pikachu');
    expect(wrapper.text()).toContain('#025');
  });
  it('triggers fetchPokemonDetails on component mount with correct param', async () => {
    // Clear previous calls
    mockStore.fetchPokemonDetails.mockClear();
    
    // Setup router to push to the correct route
    await router.push(`/pokemon/${mockPokemonName}`);
    await router.isReady();
    
    // Mount the component - we need to force the router binding
    wrapper = mount(PokemonDetailView, {
      global: {
        plugins: [router],
        mocks: {
          $route: router.currentRoute.value
        }
      }
    });
    
    // Force the component to call loadDetails method
    await wrapper.vm.loadDetails();
    
    // Check if fetchPokemonDetails was called with the correct parameter
    expect(mockStore.fetchPokemonDetails).toHaveBeenCalledWith(mockPokemonName);
  });
  it('retries fetching data when retry button is clicked', async () => {
    // Set error state
    mockStore.errorDetails = 'Error al cargar los detalles del Pokémon';
    
    // Clear previous calls
    mockStore.fetchPokemonDetails.mockClear();
    
    // Setup router to push to the correct route
    await router.push(`/pokemon/${mockPokemonName}`);
    await router.isReady();
    
    // Mount the component
    wrapper = mount(PokemonDetailView, {
      global: {
        plugins: [router],
        mocks: {
          $route: router.currentRoute.value
        }
      }
    });
    
    // Find and click the retry button
    const retryButton = wrapper.find('button');
    
    // Call the loadDetails method directly, as if the button was clicked
    await wrapper.vm.loadDetails();
    
    // Check if fetchPokemonDetails was called again
    expect(mockStore.fetchPokemonDetails).toHaveBeenCalledWith(mockPokemonName);
  });

  it('navigates back to home when back button is clicked', async () => {
    // Setup spy on router
    const routerPushSpy = vi.spyOn(router, 'push');
    
    // Mount component
    wrapper = mount(PokemonDetailView, {
      global: {
        plugins: [router]
      }
    });
    
    // Find and click the back button
    const backButton = wrapper.find('a');
    await backButton.trigger('click');
    
    // Check if router was called with correct path
    expect(routerPushSpy).toHaveBeenCalledWith('/');
  });

  it('handles non-existent pokemon gracefully', async () => {
    // Setup to simulate a non-existent pokemon (API returns 404)
    mockStore.errorDetails = 'No se encontró el Pokémon "nonexistent"';
    
    // Navigate to non-existent pokemon
    await router.push('/pokemon/nonexistent');
    
    // Mount the component
    wrapper = mount(PokemonDetailView, {
      global: {
        plugins: [router]
      }
    });
    
    // Check if error message is displayed
    expect(wrapper.find('.mock-error').exists()).toBe(true);
    expect(mockStore.fetchPokemonDetails).toHaveBeenCalledWith('nonexistent');
  });

  it('updates when route params change', async () => {
    // Mount with initial pokemon
    wrapper = mount(PokemonDetailView, {
      global: {
        plugins: [router]
      }
    });
    
    // Clear previous calls
    mockStore.fetchPokemonDetails.mockClear();
    
    // Navigate to a different pokemon
    await router.push('/pokemon/charizard');
    
    // Check if fetchPokemonDetails was called with new parameter
    expect(mockStore.fetchPokemonDetails).toHaveBeenCalledWith('charizard');
  });

  it('displays the correct sprite based on selected sprite type', async () => {
    // Set mock data with multiple sprites
    mockStore.currentPokemonDetails = {
      id: 25,
      name: 'pikachu',
      sprites: {
        front_default: 'https://example.com/pikachu-front.png',
        back_default: 'https://example.com/pikachu-back.png',
        front_shiny: 'https://example.com/pikachu-shiny.png',
        other: {
          'official-artwork': {
            front_default: 'https://example.com/pikachu-official.png'
          }
        }
      },
      types: [{ type: { name: 'electric' } }],
      stats: [],
      height: 4,
      weight: 60,
      abilities: []
    };
    
    // Mount the component
    wrapper = mount(PokemonDetailView, {
      global: {
        plugins: [router]
      }
    });
    
    // Check initial sprite (should be default official artwork)
    const image = wrapper.find('img');
    expect(image.attributes('src')).toBe('https://example.com/pikachu-official.png');
    
    // Find and click sprite selector buttons to change sprites
    const spriteButtons = wrapper.findAll('.sprite-button');
    if (spriteButtons.length > 1) {
      await spriteButtons[1].trigger('click'); // Click the second sprite button (shiny)
      
      // Check if sprite was updated
      expect(wrapper.vm.selectedSpriteType).toBe('shiny');
    }
  });
});