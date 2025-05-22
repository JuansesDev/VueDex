import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import AboutView from '../AboutView.vue';

// Create mock router for the RouterLink component
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { 
      path: '/', 
      name: 'home',
      component: { template: '<div>Home Component</div>' } // Add component property
    }
  ]
});

describe('AboutView', () => {
  it('renders the component properly', async () => {
    const wrapper = mount(AboutView, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: {
            template: '<a :to="to" class="router-link-stub"><slot /></a>',
            props: ['to']
          }
        }
      }
    });
    
    // Check title
    expect(wrapper.find('h1').text()).toContain('Acerca de VueDex');
    
    // Check GitHub link exists and has correct attributes
    const githubLink = wrapper.find('a[href="https://github.com/JuansesDev/VueDex"]');
    expect(githubLink.exists()).toBe(true);
    expect(githubLink.attributes('target')).toBe('_blank');
    expect(githubLink.text()).toContain('GitHub: JuansesDev/VueDex');
    
    // Check for developer name
    expect(wrapper.text()).toContain('JuansesDev');
    
    // Check for the "Explorar Pokémon" button using custom stub
    const exploreButton = wrapper.find('.router-link-stub');
    expect(exploreButton.exists()).toBe(true);
    expect(exploreButton.text()).toBe('Explorar Pokémon');
    expect(exploreButton.attributes('to')).toBe('/');
  });
});
