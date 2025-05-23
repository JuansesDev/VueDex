import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LoadingSpinner from '../common/LoadingSpinner.vue';

describe('LoadingSpinner', () => {
  it('renders the loading spinner correctly', () => {
    const wrapper = mount(LoadingSpinner);
    
    // Verificar que el spinner se renderiza correctamente
    expect(wrapper.find('.animate-spin').exists()).toBe(true);
    expect(wrapper.text()).toContain('Cargando...');
  });

  it('has the correct styling classes', () => {
    const wrapper = mount(LoadingSpinner);
    
    // Verificar las clases CSS específicas que definen el spinner
    const spinnerElement = wrapper.find('.animate-spin');
    expect(spinnerElement.classes()).toContain('animate-spin');
    expect(spinnerElement.classes()).toContain('rounded-full');
    expect(spinnerElement.classes()).toContain('border-4');
    expect(spinnerElement.classes()).toContain('border-blue-200');
    expect(spinnerElement.classes()).toContain('border-t-blue-500');
  });

  it('is properly centered with flex layout', () => {
    const wrapper = mount(LoadingSpinner);
    
    // Verificar que el contenedor tiene las clases de centrado correctas
    const container = wrapper.find('div').element;
    expect(container.className).toContain('flex');
    expect(container.className).toContain('justify-center');
    expect(container.className).toContain('items-center');
  });

  it('has accessible text content', () => {
    const wrapper = mount(LoadingSpinner);
    
    // Verificar que el texto de carga es visible para lectores de pantalla
    const loadingText = wrapper.find('p');
    expect(loadingText.exists()).toBe(true);
    expect(loadingText.text()).toBe('Cargando...');
    expect(loadingText.classes()).toContain('text-gray-500');
  });
});
