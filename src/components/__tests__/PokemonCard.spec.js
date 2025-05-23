import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import PokemonCard from '../pokemon/PokemonCard.vue';
import * as pokemonService from '@/services/pokemonService';

// Mock the pokemonService
vi.mock('@/services/pokemonService', () => ({
  getFromUrl: vi.fn()
}));

// Setup for all tests
let router;

beforeEach(() => {
  // Create fresh router for each test
  router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { 
        path: '/pokemon/:name', 
        name: 'pokemon-detail',
        component: { template: '<div>Pokemon Details</div>' }
      },
      {
        path: '/',
        name: 'home',
        component: { template: '<div>Home</div>' }
      }
    ]
  });

  // Reset mocks
  vi.clearAllMocks();
});

describe('PokemonCard', () => {
  it('renders pokemon information correctly', async () => {
    // Mock pokemon data with URL
    const pokemon = {
      name: 'pikachu',
      url: 'https://pokeapi.co/api/v2/pokemon/25/'
    };

    const pokemonDetails = {
      id: 25,
      name: 'pikachu',
      sprites: {
        front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
      },
      types: [
        { type: { name: 'electric' } }
      ],
      height: 40,
      weight: 60
    };

    // Setup the mock for getFromUrl to return the pokemon details
    pokemonService.getFromUrl.mockResolvedValue(pokemonDetails);

    const wrapper = mount(PokemonCard, {
      props: {
        pokemon
      },
      global: {
        plugins: [router],
        stubs: {
          RouterLink: true,
          LoadingSpinner: true
        }
      }
    });

    // Wait for any async operations to complete
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    // Check if the component renders the Pokemon name
    expect(wrapper.text().toLowerCase()).toContain('pikachu');
    
    // Check if ID is displayed
    expect(wrapper.text()).toContain('#25');
    
    // Check if type is displayed
    expect(wrapper.text().toLowerCase()).toContain('electric');
    
    // Check if image is rendered with correct src
    const img = wrapper.find('img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe(pokemonDetails.sprites.front_default);
    expect(img.attributes('alt').toLowerCase()).toContain('pikachu');
  });

  it('navigates to detail page when clicked', async () => {
    const pokemon = {
      name: 'pikachu',
      url: 'https://pokeapi.co/api/v2/pokemon/25/'
    };

    const pokemonDetails = {
      id: 25,
      name: 'pikachu',
      sprites: { front_default: 'image-url' },
      types: [{ type: { name: 'electric' } }],
      height: 40,
      weight: 60
    };

    // Setup the mock for getFromUrl
    pokemonService.getFromUrl.mockResolvedValue(pokemonDetails);

    // Mock router.push
    const pushSpy = vi.spyOn(router, 'push');

    const wrapper = mount(PokemonCard, {
      props: {
        pokemon
      },
      global: {
        plugins: [router],
        stubs: {
          RouterLink: true,
          LoadingSpinner: true
        }
      }
    });

    // Wait for any async operations to complete
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    // Trigger click on the card
    await wrapper.trigger('click');
    
    // Check if router.push was called with correct arguments
    expect(pushSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'pokemon-detail',
        params: { name: 'pikachu' }
      })
    );
  });

  it('shows loading state initially', async () => {
    const pokemon = {
      name: 'pikachu',
      url: 'https://pokeapi.co/api/v2/pokemon/25/'
    };

    // Setup the mock but don't resolve it immediately
    const promise = new Promise(resolve => {
      // Don't resolve to keep in loading state
    });
    pokemonService.getFromUrl.mockReturnValue(promise);

    const wrapper = mount(PokemonCard, {
      props: {
        pokemon
      },
      global: {
        plugins: [router],
        stubs: {
          RouterLink: true,
          // We need to use true here instead of the component name
          LoadingSpinner: true
        }
      }
    });

    // Check for loading state
    expect(wrapper.text().toLowerCase()).toContain('cargando');
    // Use find instead of findComponent since the LoadingSpinner is stubbed
    expect(wrapper.find('.flex.flex-col.items-center.justify-center').exists()).toBe(true);
  });

  it('shows error state when API fails', async () => {
    const pokemon = {
      name: 'pikachu',
      url: 'https://pokeapi.co/api/v2/pokemon/25/'
    };

    // Setup the mock to reject
    pokemonService.getFromUrl.mockRejectedValue(new Error('API Error'));

    const wrapper = mount(PokemonCard, {
      props: {
        pokemon
      },
      global: {
        plugins: [router],
        stubs: {
          RouterLink: true,
          LoadingSpinner: true
        }
      }
    });

    // Wait for the error state to be displayed
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    // Check that error state is shown
    expect(wrapper.text().toLowerCase()).toContain('oops');
    expect(wrapper.text().toLowerCase()).toContain('api error');
    expect(wrapper.find('button').exists()).toBe(true);
    expect(wrapper.find('button').text().toLowerCase()).toContain('reintentar');
  });

  it('handles retry functionality correctly', async () => {
    const pokemon = {
      name: 'pikachu',
      url: 'https://pokeapi.co/api/v2/pokemon/25/'
    };

    // First reject, then resolve on retry
    pokemonService.getFromUrl.mockRejectedValueOnce(new Error('Network error'));
    
    const pokemonDetails = {
      id: 25,
      name: 'pikachu',
      sprites: { front_default: 'image-url' },
      types: [{ type: { name: 'electric' } }],
      height: 40,
      weight: 60
    };
    
    // Need to use a Promise for the second call to properly test the loading state
    let resolveSecondCall;
    const secondCallPromise = new Promise(resolve => {
      resolveSecondCall = () => resolve(pokemonDetails);
    });
    
    pokemonService.getFromUrl.mockReturnValueOnce(secondCallPromise);

    const wrapper = mount(PokemonCard, {
      props: {
        pokemon
      },
      global: {
        plugins: [router],
        stubs: {
          RouterLink: true,
          LoadingSpinner: true
        }
      }
    });

    // Wait for the error state to be displayed
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    // Check that error state is shown
    expect(wrapper.text().toLowerCase()).toContain('network error');
    
    // Click the retry button
    await wrapper.find('button').trigger('click');
    
    // Should be in loading state now
    expect(wrapper.text().toLowerCase()).toContain('cargando');
    
    // Resolve the promise to load the Pokemon details
    resolveSecondCall();
    
    // Wait for successful load
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    
    // Now should show pokemon details
    expect(wrapper.text().toLowerCase()).toContain('pikachu');
    expect(wrapper.text()).toContain('#25');
  });

  it('handles missing sprite correctly', async () => {
    const pokemon = {
      name: 'missingno',
      url: 'https://pokeapi.co/api/v2/pokemon/0/'
    };

    const pokemonDetails = {
      id: 0,
      name: 'missingno',
      sprites: { front_default: null }, // Missing sprite
      types: [{ type: { name: 'normal' } }],
      height: 30,
      weight: 30
    };

    pokemonService.getFromUrl.mockResolvedValue(pokemonDetails);

    const wrapper = mount(PokemonCard, {
      props: {
        pokemon
      },
      global: {
        plugins: [router],
        stubs: {
          RouterLink: true,
          LoadingSpinner: true
        }
      }
    });

    // Wait for any async operations to complete
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    // Should display "No Sprite" instead of an image
    expect(wrapper.text().toLowerCase()).toContain('no sprite');
    expect(wrapper.find('img').exists()).toBe(false);
  });

  it('applies correct type colors', async () => {
    const pokemon = {
      name: 'charizard',
      url: 'https://pokeapi.co/api/v2/pokemon/6/'
    };

    const pokemonDetails = {
      id: 6,
      name: 'charizard',
      sprites: { front_default: 'charizard.png' },
      types: [
        { type: { name: 'fire' } },
        { type: { name: 'flying' } }
      ],
      height: 170,
      weight: 905
    };

    pokemonService.getFromUrl.mockResolvedValue(pokemonDetails);

    const wrapper = mount(PokemonCard, {
      props: {
        pokemon
      },
      global: {
        plugins: [router],
        stubs: {
          RouterLink: true,
          LoadingSpinner: true
        }
      }
    });

    // Wait for any async operations to complete
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    // Should have two type badges
    const typeBadges = wrapper.findAll('.rounded-full');
    expect(typeBadges.length).toBe(2);
    
    // First type should be fire (orange)
    expect(typeBadges[0].classes()).toContain('bg-orange-500');
    expect(typeBadges[0].text()).toBe('fire');
    
    // Second type should be flying (indigo)
    expect(typeBadges[1].classes()).toContain('bg-indigo-400');
    expect(typeBadges[1].text()).toBe('flying');
  });

  it('displays height and weight correctly', async () => {
    const pokemon = {
      name: 'bulbasaur',
      url: 'https://pokeapi.co/api/v2/pokemon/1/'
    };

    const pokemonDetails = {
      id: 1,
      name: 'bulbasaur',
      sprites: { front_default: 'bulbasaur.png' },
      types: [{ type: { name: 'grass' } }],
      height: 7, // 0.7 m in API format
      weight: 69 // 6.9 kg in API format
    };

    pokemonService.getFromUrl.mockResolvedValue(pokemonDetails);

    const wrapper = mount(PokemonCard, {
      props: {
        pokemon
      },
      global: {
        plugins: [router],
        stubs: {
          RouterLink: true,
          LoadingSpinner: true
        }
      }
    });

    // Wait for any async operations to complete
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    // Check if height and weight are displayed correctly
    // Height should be 0.7 m (API gives in decimetres)
    expect(wrapper.text()).toContain('0.7m');
    
    // Weight should be 6.9 kg (API gives in hectograms)
    expect(wrapper.text()).toContain('6.9kg');
  });

  it('handles image load error', async () => {
    const pokemon = {
      name: 'pikachu',
      url: 'https://pokeapi.co/api/v2/pokemon/25/'
    };

    const pokemonDetails = {
      id: 25,
      name: 'pikachu',
      sprites: { front_default: 'invalid-image-url.png' },
      types: [{ type: { name: 'electric' } }],
      height: 40,
      weight: 60
    };

    pokemonService.getFromUrl.mockResolvedValue(pokemonDetails);

    // Mock console.warn to avoid output in tests
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mount(PokemonCard, {
      props: {
        pokemon
      },
      global: {
        plugins: [router],
        stubs: {
          RouterLink: true,
          LoadingSpinner: true
        }
      }
    });

    // Wait for any async operations to complete
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    // Trigger image error event
    await wrapper.find('img').trigger('error');
    
    // Check if onImageError was called
    expect(consoleWarnSpy).toHaveBeenCalled();
    expect(consoleWarnSpy.mock.calls[0][0]).toContain('No se pudo cargar la imagen');
    
    consoleWarnSpy.mockRestore();
  });
});
