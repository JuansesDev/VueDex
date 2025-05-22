import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import PokemonCard from '../PokemonCard.vue';
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
      ]
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
    await vi.runAllTimers();
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
      types: [{ type: { name: 'electric' } }]
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
    await vi.runAllTimers();
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
      setTimeout(() => {
        resolve({
          id: 25,
          name: 'pikachu',
          sprites: { front_default: 'image-url' },
          types: [{ type: { name: 'electric' } }]
        });
      }, 100);
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
          LoadingSpinner: true
        }
      }
    });

    // Update this assertion to check for "cargando..." which is what the component displays
    expect(wrapper.text().toLowerCase()).toContain('cargando');
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
    await vi.runAllTimers();
    await wrapper.vm.$nextTick();

    // Check that error state is shown
    expect(wrapper.text().toLowerCase()).toContain('error');
    expect(wrapper.find('button').exists()).toBe(true);
  });
});
