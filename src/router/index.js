// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
// Importa la nueva vista
import AboutView from '../views/AboutView.vue' 
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
      path: '/pokemon/:name',
      name: 'pokemon-detail',
      component: PokemonDetailView, // Asumiendo que este es el nombre de tu componente de vista de detalle
      props: true 
    },
    // Nueva ruta para "Acerca de"
    {
      path: '/about',
      name: 'about',
      component: AboutView 
    }
    // { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/NotFoundView.vue') } // Opcional: Ruta 404
  ]
})

export default router