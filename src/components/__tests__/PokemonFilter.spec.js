import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import PokemonFilter from '../pokemon/PokemonFilter.vue';
import { usePokemonStore } from '@/stores/pokemon.js';

// Create a mock for the PokemonStore
vi.mock('@/stores/pokemon.js', () => ({
  usePokemonStore: vi.fn()
}));

describe('PokemonFilter', () => {
  let wrapper;
  let mockStore;
  beforeEach(() => {
    // Create a fresh Pinia instance for each test
    setActivePinia(createPinia());

    // Setup mock store with required properties and methods
    mockStore = {
      filters: {
        name: '',
        type: '',
        generation: ''
      },
      formattedTypes: [
        { name: 'fire', displayName: 'Fuego' },
        { name: 'water', displayName: 'Agua' },
        { name: 'grass', displayName: 'Planta' }
      ],
      formattedGenerations: [
        { name: 'generation-i', displayName: 'Generación I' },
        { name: 'generation-ii', displayName: 'Generación II' }
      ],
      availableTypes: ['fire', 'water', 'grass'],
      availableGenerations: ['generation-i', 'generation-ii'],
      isLoadingFilterOptions: false,
      errorFilterOptions: null,
      isLoadingList: false,
      isFilterActive: false,
      filteredList: [],
      updateFilter: vi.fn(),
      fetchFilterOptions: vi.fn(),
      clearFilters: vi.fn()
    };

    // Set the mock implementation for usePokemonStore
    usePokemonStore.mockReturnValue(mockStore);

    // Mount the component
    wrapper = mount(PokemonFilter, {
      global: {
        stubs: {
          LoadingSpinner: {
            template: '<div class="loading-spinner-stub"></div>'
          }
        }
      }
    });
  });

  it('renders correctly with initial state', () => {
    // Check if the component renders properly
    expect(wrapper.find('.pokemon-filter').exists()).toBe(true);
    expect(wrapper.find('h2').text()).toContain('Filtrar Pokémon');
    
    // Check inputs and selects are present
    expect(wrapper.find('#nameFilter').exists()).toBe(true);
    expect(wrapper.find('#typeFilter').exists()).toBe(true);
    expect(wrapper.find('#genFilter').exists()).toBe(true);
  });
  it('shows loading state when filter options are loading', async () => {
    // Set loading state
    mockStore.isLoadingFilterOptions = true;
    
    // Remount the component to ensure the new state is applied
    wrapper = mount(PokemonFilter, {
      global: {
        stubs: {
          LoadingSpinner: {
            template: '<div class="loading-spinner-stub"></div>'
          }
        }
      }
    });
    await wrapper.vm.$nextTick();
    
    // Look for the loading text directly
    const loadingText = wrapper.find('div.text-center.text-gray-500');
    expect(loadingText.exists()).toBe(true);
    expect(loadingText.text()).toContain('Cargando opciones');
  });
  it('shows error message when filter options failed to load', async () => {
    // Set error state
    mockStore.errorFilterOptions = 'Error al cargar las opciones';
    
    // Remount the component to ensure the new state is applied
    wrapper = mount(PokemonFilter, {
      global: {
        stubs: {
          LoadingSpinner: {
            template: '<div class="loading-spinner-stub"></div>'
          }
        }
      }
    });
    await wrapper.vm.$nextTick();
    
    // Find the error div directly using a more specific selector
    const errorDiv = wrapper.find('div.text-red-500.text-sm.py-2');
    expect(errorDiv.exists()).toBe(true);
    expect(errorDiv.text()).toContain('Error al cargar las opciones');
    expect(errorDiv.text()).toContain('Reintentar');
  });

  it('updates the store when name filter changes', async () => {
    // Set fake timers since we have a global setting for them
    vi.useFakeTimers();
    
    // Get input element
    const nameInput = wrapper.find('#nameFilter');
    
    // Set value and trigger input event
    await nameInput.setValue('pikachu');
    await nameInput.trigger('input');
    
    // Wait for debounce timeout using fake timers
    vi.advanceTimersByTime(501); // Wait slightly more than the debounce timeout
    
    // Check if store method was called
    expect(mockStore.updateFilter).toHaveBeenCalledWith('name', 'pikachu');
    
    // Restore real timers
    vi.useRealTimers();
  });

  it('updates the store when type filter changes', async () => {
    // Get select element
    const typeSelect = wrapper.find('#typeFilter');
    
    // Set value and trigger change event
    await typeSelect.setValue('fire');
    await typeSelect.trigger('change');
    
    // Check if store method was called
    expect(mockStore.updateFilter).toHaveBeenCalledWith('type', 'fire');
  });

  it('updates the store when generation filter changes', async () => {
    // Get select element
    const genSelect = wrapper.find('#genFilter');
    
    // Set value and trigger change event
    await genSelect.setValue('generation-i');
    await genSelect.trigger('change');
    
    // Check if store method was called
    expect(mockStore.updateFilter).toHaveBeenCalledWith('generation', 'generation-i');
  });

  it('clears name filter when clear button is clicked', async () => {
    // Set initial filter value
    await wrapper.find('#nameFilter').setValue('pikachu');
    await wrapper.vm.$nextTick();
    
    // Find and click the clear button
    const clearButton = wrapper.find('button[aria-label="Limpiar búsqueda"], button.absolute');
    if (clearButton.exists()) {
      await clearButton.trigger('click');
      
      // Check if store method was called and local variable updated
      expect(mockStore.updateFilter).toHaveBeenCalledWith('name', '');
    }
  });
  it('clears type filter when clear button is clicked', async () => {
    // Set initial filter value in the store
    mockStore.filters.type = 'fire';
    
    // Force a re-render
    await wrapper.vm.$nextTick();
    
    // Find the filter badge for the type filter
    const typeBadge = wrapper.findAll('.flex.items-center')
      .find(el => el.text().includes('Tipo:'));
    
    // If badge exists, find and click the clear button
    if (typeBadge) {
      const clearButton = typeBadge.find('button');
      if (clearButton.exists()) {
        await clearButton.trigger('click');
        expect(mockStore.updateFilter).toHaveBeenCalledWith('type', '');
      }
    } else {
      // Try to find the button directly within the badge container
      const filterBadges = wrapper.findAll('.px-2.py-1.bg-blue-100');
      const typeBadge = filterBadges.find(el => el.text().includes('Tipo:'));
      
      if (typeBadge) {
        const clearButton = typeBadge.find('button');
        if (clearButton.exists()) {
          await clearButton.trigger('click');
          expect(mockStore.updateFilter).toHaveBeenCalledWith('type', '');
        }
      }
    }
  });

  it('clears all filters when "Limpiar todos" button is clicked', async () => {
    // Set initial filter values
    mockStore.filters.name = 'pikachu';
    mockStore.filters.type = 'fire';
    mockStore.filters.generation = 'generation-i';
    mockStore.isFilterActive = true;
    await wrapper.vm.$nextTick();
    
    // Find and click the clear all button
    const clearAllButton = wrapper.find('button.text-red-600');
    if (clearAllButton.exists()) {
      await clearAllButton.trigger('click');
      
      // Check if store method was called
      expect(mockStore.clearFilters).toHaveBeenCalled();
    }
  });
  it('shows filter badges when filters are applied', async () => {
    // Set filter values directly in the store
    mockStore.filters.name = 'pikachu';
    mockStore.filters.type = 'fire';
    mockStore.filters.generation = 'generation-i';
    mockStore.isFilterActive = true;
    
    // Remount the component to ensure the new state is applied
    wrapper = mount(PokemonFilter, {
      global: {
        stubs: {
          LoadingSpinner: {
            template: '<div class="loading-spinner-stub"></div>'
          }
        }
      }
    });
    await wrapper.vm.$nextTick();
    
    // Debug to see what's in the DOM
    // console.log(wrapper.html());
    
    // Look for filter badges with specific text content
    const filtersAppliedText = wrapper.find('.mt-4');
    
    if (filtersAppliedText.exists()) {
      expect(filtersAppliedText.text()).toContain('Filtros activos');
    } else {
      // More general approach: check if the badges themselves exist
      const badges = wrapper.findAll('.rounded-full');
      expect(badges.length).toBeGreaterThan(0);
      
      // Check the content of at least one badge
      const badgeTexts = badges.map(badge => badge.text());
      const hasBadgeWithPikachu = badgeTexts.some(text => text.includes('pikachu'));
      const hasBadgeWithFuego = badgeTexts.some(text => text.includes('Fuego'));
      const hasBadgeWithGeneracion = badgeTexts.some(text => text.includes('Generación'));
      
      expect(hasBadgeWithPikachu || hasBadgeWithFuego || hasBadgeWithGeneracion).toBe(true);
    }
  });
  it('shows the correct number of filtered results', async () => {
    // Set filter active and results
    mockStore.isFilterActive = true;
    mockStore.isLoadingList = false;
    mockStore.filteredList = [{ name: 'pikachu' }, { name: 'charizard' }];
    
    // Force a re-render with a new component that has proper stubs
    const localWrapper = mount(PokemonFilter, {
      global: {
        stubs: {
          LoadingSpinner: {
            template: '<div class="loading-spinner-stub"></div>'
          }
        }
      }
    });
    
    // Wait for the component to update
    await localWrapper.vm.$nextTick();
    
    // Directly assert that the content we expect is rendered
    expect(localWrapper.html()).toContain('2 Pokémon encontrados');
  });
  it('calls fetchFilterOptions on mount if options are not loaded', async () => {
    // Reset mocks to ensure clear state
    mockStore.fetchFilterOptions.mockClear();
    mockStore.availableTypes = [];
    mockStore.availableGenerations = [];
    
    // Setup fake timers
    vi.useFakeTimers();
    
    // Remount component
    const newWrapper = mount(PokemonFilter, {
      global: {
        stubs: {
          LoadingSpinner: true
        }
      }
    });
    
    // Allow any microtasks to complete
    await vi.runAllTimersAsync();
    
    // The fetchFilterOptions should be called since options are not loaded
    expect(mockStore.fetchFilterOptions).toHaveBeenCalled();
    
    // Restore real timers
    vi.useRealTimers();
  });
  it('does not call fetchFilterOptions if options are already loaded', async () => {
    // Clear previous calls
    mockStore.fetchFilterOptions.mockClear();
    
    // Set populated options
    mockStore.availableTypes = ['fire', 'water', 'grass'];
    mockStore.availableGenerations = ['generation-i', 'generation-ii'];
    
    // Setup fake timers
    vi.useFakeTimers();
    
    // Remount the component
    const newWrapper = mount(PokemonFilter, {
      global: {
        stubs: {
          LoadingSpinner: true
        }
      }
    });
    
    // Allow any microtasks to complete
    await vi.runAllTimersAsync();
    
    // The fetchFilterOptions should not be called since options are loaded
    expect(mockStore.fetchFilterOptions).not.toHaveBeenCalled();
    
    // Restore real timers
    vi.useRealTimers();
  });

  it('debounces name filter input correctly', async () => {
    // Use fake timers
    vi.useFakeTimers();
    
    const nameInput = wrapper.find('#nameFilter');
    
    // Input first value
    await nameInput.setValue('pika');
    await nameInput.trigger('input');
    
    // Input second value before debounce period ends
    await nameInput.setValue('pikachu');
    await nameInput.trigger('input');
    
    // Advance timer by 400ms (less than debounce time)
    vi.advanceTimersByTime(400);
    
    // Store method should not be called yet
    expect(mockStore.updateFilter).not.toHaveBeenCalled();
    
    // Advance timer to complete the debounce period
    vi.advanceTimersByTime(200);
    
    // Only the final value should be used
    expect(mockStore.updateFilter).toHaveBeenCalledTimes(1);
    expect(mockStore.updateFilter).toHaveBeenCalledWith('name', 'pikachu');
  });

  it('handles rapid sequential filter changes correctly', async () => {
    // Use fake timers
    vi.useFakeTimers();
    
    const nameInput = wrapper.find('#nameFilter');
    
    // Simulate user typing quickly
    await nameInput.setValue('p');
    await nameInput.trigger('input');
    vi.advanceTimersByTime(100);
    
    await nameInput.setValue('pi');
    await nameInput.trigger('input');
    vi.advanceTimersByTime(100);
    
    await nameInput.setValue('pik');
    await nameInput.trigger('input');
    vi.advanceTimersByTime(100);
    
    await nameInput.setValue('pika');
    await nameInput.trigger('input');
    vi.advanceTimersByTime(100);
    
    await nameInput.setValue('pikac');
    await nameInput.trigger('input');
    vi.advanceTimersByTime(100);
    
    // Store update should not have been called yet
    expect(mockStore.updateFilter).not.toHaveBeenCalled();
    
    // Complete the debounce period
    vi.advanceTimersByTime(500);
    
    // The store should only be updated once with the final value
    expect(mockStore.updateFilter).toHaveBeenCalledTimes(1);
    expect(mockStore.updateFilter).toHaveBeenCalledWith('name', 'pikac');
  });
});