import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ErrorMessage from '../common/ErrorMessage.vue';

describe('ErrorMessage', () => {
  it('renders error message correctly with default message', () => {
    const wrapper = mount(ErrorMessage);
    
    // Verificar que el mensaje de error por defecto se muestra correctamente
    expect(wrapper.text()).toContain('Error:');
    expect(wrapper.text()).toContain('Ha ocurrido un error inesperado.');
  });

  it('displays custom error message when provided', () => {
    const customMessage = 'No se pudo cargar la información del Pokémon';
    const wrapper = mount(ErrorMessage, {
      props: {
        message: customMessage
      }
    });
    
    // Verificar que el mensaje personalizado se muestra correctamente
    expect(wrapper.text()).toContain('Error:');
    expect(wrapper.text()).toContain(customMessage);
  });

  it('has the correct styling for error alert', () => {
    const wrapper = mount(ErrorMessage);
    
    // Verificar las clases CSS que definen el estilo de alerta de error
    const alertElement = wrapper.find('div[role="alert"]');
    expect(alertElement.exists()).toBe(true);
    expect(alertElement.classes()).toContain('bg-red-100');
    expect(alertElement.classes()).toContain('border-red-400');
    expect(alertElement.classes()).toContain('text-red-700');
    expect(alertElement.classes()).toContain('rounded');
  });

  it('has appropriate semantic structure with bold error label', () => {
    const wrapper = mount(ErrorMessage);
    
    // Verificar la estructura semántica del mensaje de error
    const boldLabel = wrapper.find('strong');
    expect(boldLabel.exists()).toBe(true);
    expect(boldLabel.text()).toBe('Error:');
    expect(boldLabel.classes()).toContain('font-bold');
    
    // Verificar que el mensaje se muestra en un elemento span
    const messageSpan = wrapper.find('span');
    expect(messageSpan.exists()).toBe(true);
  });

  it('properly handles empty message prop', () => {
    const wrapper = mount(ErrorMessage, {
      props: {
        message: ''
      }
    });
    
    // Verificar que incluso con un mensaje vacío el componente se renderiza correctamente
    expect(wrapper.text()).toContain('Error:');
    expect(wrapper.find('span').exists()).toBe(true);
  });
});