# VueDex 🐉

VueDex es una aplicación web interactiva y moderna diseñada para explorar el fascinante mundo de los Pokémon. Permite a los usuarios navegar por una extensa lista de Pokémon, ver detalles específicos de cada uno —incluyendo sus estadísticas, tipos, habilidades e imágenes— y realizar búsquedas para encontrar a sus criaturas favoritas rápidamente.

Este proyecto fue desarrollado como parte de una prueba técnica de frontend, enfocándose en la creación de una interfaz de usuario agradable, funcional y responsiva, consumiendo datos de la API pública [PokéAPI](https://pokeapi.co/).

📲 **[Ver Demo Desplegada](https://juansesdev.github.io/VueDex/)**

## ✨ Características Principales

*   **Listado de Pokémon:** Navega por una lista paginada de Pokémon.
*   **Vista de Detalle:** Obtén información completa de cada Pokémon, incluyendo:
    *   Imágenes y sprites (incluyendo shiny si está disponible).
    *   Tipos.
    *   Estadísticas base (HP, Ataque, Defensa, etc.) con representación visual.
    *   Altura y peso.
    *   Habilidades.
*   **Búsqueda Dinámica:** Filtra la lista de Pokémon por nombre en tiempo real.
*   **Diseño Responsivo:** Interfaz adaptable a diferentes tamaños de pantalla (móvil, tablet, escritorio).
*   **Carga de Datos Asíncrona:** Estados de carga y manejo de errores para una mejor experiencia de usuario.
*   **Navegación Fluida:** Uso de Vue Router para una experiencia de Single Page Application (SPA).

## 🛠️ Tecnologías Utilizadas

*   **Vue.js 3.5:** Framework progresivo para la construcción de la interfaz de usuario.
*   **Vite 6:** Herramienta de desarrollo frontend para un entorno de desarrollo y build extremadamente rápido.
*   **Pinia 3:** Gestor de estado oficial para Vue.js, utilizado para manejar el estado global de la aplicación.
*   **Vue Router 4:** Librería oficial para la gestión de rutas en la SPA.
*   **Tailwind CSS 4:** Framework CSS utility-first para un diseño rápido, personalizable y responsivo.
*   **PokéAPI (pokeapi.co):** API RESTful pública utilizada como fuente de datos para toda la información de los Pokémon.
*   **Vitest 3:** Framework de pruebas unitarias integrado con Vite.
*   **ESLint 9 & Prettier 3:** Herramientas para el formateo y la calidad del código.
*   **Git & GitHub:** Para el control de versiones y la gestión del repositorio.

## 📁 Estructura del Proyecto

```
VueDex/
├── public/                  # Archivos estáticos públicos
├── src/
│   ├── assets/              # CSS, imágenes, fuentes
│   ├── components/
│   │   ├── common/          # Componentes reutilizables (Spinner, ErrorMessage)
│   │   └── pokemon/         # Componentes específicos de Pokémon (PokemonCard, PokemonDetailCard, PokemonFilter)
│   ├── router/              # Configuración de Vue Router
│   ├── services/            # Lógica de llamadas a la API (pokemonService.js)
│   ├── stores/              # Módulos de Pinia (pokemon.js)
│   ├── views/               # Componentes de página (HomeView, PokemonDetailView, NotFoundView)
│   ├── App.vue              # Componente raíz
│   └── main.js              # Punto de entrada de la aplicación
├── .eslintrc.js             # Configuración de ESLint
├── tailwind.config.js       # Configuración de Tailwind CSS
├── vite.config.js           # Configuración de Vite
├── package.json             # Dependencias y scripts del proyecto
└── README.md                # Esta documentación
```

## 🚀 Configuración y Ejecución del Proyecto

### Prerrequisitos

*   Node.js (v18.x o v20.x+ recomendado)
*   npm (o yarn / pnpm)

### Instalación

1.  Clona el repositorio:
    ```sh
    git clone [URL_DEL_REPOSITOR_AQUÍ]
    cd VueDex 
    ```
2.  Instala las dependencias:
    ```sh
    npm install
    ```

### Desarrollo

Para iniciar el servidor de desarrollo con hot-reload:
```sh
npm run dev
```
La aplicación estará disponible en `http://localhost:5173` (o el puerto que indique Vite).

### Build para Producción

Para compilar y minificar la aplicación para producción:
```sh
npm run build
```
Los archivos optimizados se generarán en la carpeta `dist/`.

### Despliegue en GitHub Pages

Para desplegar la aplicación en GitHub Pages automáticamente:
```sh
npm run deploy
```

Este comando ejecuta el script `deploy.js` que:
- Construye la aplicación para producción (`npm run build`)
- Despliega el contenido de la carpeta `dist` en la rama `gh-pages`
- Muestra la URL donde la aplicación estará disponible

El despliegue usa la librería `gh-pages` y configura automáticamente la rama adecuada para GitHub Pages.

📲 **La aplicación está desplegada en: [https://juansesdev.github.io/VueDex/](https://juansesdev.github.io/VueDex/)**

### Pruebas Unitarias

Para ejecutar las pruebas unitarias con Vitest:
```sh
npm run test:unit
```

### Linting y Formato

Para verificar y corregir problemas de estilo con ESLint:
```sh
npm run lint
```

Para formatear el código con Prettier:
```sh
npm run format
```

## 📝 Justificaciones Técnicas y Decisiones

*   **Vue.js 3.5 con Composition API (`<script setup>`):** Elegido por su reactividad mejorada, mejor organización del código, y por ser la dirección moderna de Vue. `<script setup>` simplifica la escritura de componentes.
*   **Pinia 3 para Gestión de Estado:** Preferido sobre Vuex por su API más simple, mejor soporte para TypeScript (aunque no se usó aquí extensivamente), y por ser el gestor de estado recomendado actualmente para Vue 3. Facilita la separación de la lógica de estado.
*   **Tailwind CSS 4:** Última versión estable que permite un desarrollo rápido de UI y alta personalización sin escribir CSS extensivo. Su enfoque utility-first es ideal para crear diseños consistentes y responsivos.
*   **PokéAPI:** Una API pública rica en datos y bien documentada, ideal para este tipo de aplicaciones.
*   **Vite 6 + Vitest 3:** Ecosistema moderno que proporciona tiempos de desarrollo rápidos y herramientas de prueba integradas.
*   **Estrategia de Ramas Git:** Se utilizó un flujo simplificado con una rama `main` estable y ramas de funcionalidad (`feature/...`) para cada nueva característica o corrección importante, fusionando a `main` mediante Pull Requests.

## Diagrama de Flujo de Datos

```mermaid
graph TD
    A[Usuario interactúa con HomeView] -->|Solicita lista| B(Pinia Store: pokemon.js);
    B -->|Llama a fetchPokemonList| C(Service: pokemonService.js);
    C -->|GET /pokemon| D[PokéAPI];
    D -->|Respuesta JSON| C;
    C -->|Retorna datos procesados| B;
    B -->|Actualiza estado pokemonList| A;
    A -->|Renderiza PokemonCard| E[Componente: PokemonCard.vue];
    E -->|En onMounted, pide detalles| C;
    C -->|GET /pokemon/{id_o_nombre}| D;
    D -->|Respuesta JSON con detalles| C;
    C -->|Retorna detalles| E;
    E -->|Renderiza UI| E;
```

## 🔮 Posibles Mejoras Futuras

*   Implementación de pruebas unitarias y de integración más extensas (cobertura >80%).
*   Implementar caché local para optimizar las llamadas a la API.
*   Filtrado avanzado por tipo, generación, estadísticas, etc.
*   Visualización de cadenas evolutivas.
*   Modo offline con almacenamiento local.
*   Optimización del rendimiento para listas muy grandes (virtual scrolling).
*   Mejoras de accesibilidad (ARIA, navegación por teclado completa).
*   Modo oscuro utilizando las capacidades de Tailwind CSS 4.
*   Internacionalización (i18n) para soporte multi-idioma.

---

_Proyecto desarrollado como prueba técnica._