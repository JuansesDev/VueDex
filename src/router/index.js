// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
// Asegúrate que la importación de PokemonDetailView sea correcta
// Si lo creaste como PokemonDetailView.vue, la importación debe ser así:
import PokemonDetailView from '../views/PokemonDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      // Usaremos el nombre del Pokémon como parámetro en la ruta
      // La PokéAPI permite buscar por nombre o ID
      path: '/pokemon/:name',
      name: 'pokemon-detail',
      component: PokemonDetailView,
      props: true // Esto permite pasar los params de la ruta como props al componente si se desea
    }
    // Puedes añadir una ruta para "Not Found" (404) más adelante si quieres
    // { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/NotFoundView.vue') }
  ]
})

export default router