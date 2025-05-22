<template>
  <div class="pokemon-card bg-white rounded-lg shadow-lg overflow-hidden">
    <!-- Pokemon Header with background based on type -->
    <div :class="`p-4 ${typeBackground}`">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-white capitalize">{{ pokemon.name }}</h2>
        <span class="text-xl font-mono text-white">#{{ formatId(pokemon.id) }}</span>
      </div>
      <!-- Types with high contrast -->
      <div class="flex mt-2 gap-2">
        <span 
          v-for="(type, index) in pokemon.types" 
          :key="index"
          :class="`px-3 py-1 rounded-full border ${getTypeBorderColor(type.type.name)} ${getTypeBackgroundColor(type.type.name)} ${getTypeTextColor(type.type.name)} text-sm font-medium shadow-md`"
        >
          {{ type.type.name }}
        </span>
      </div>
    </div>
    
    <!-- Pokemon Image -->
    <div class="p-4 bg-slate-50 flex justify-center">
      <img 
        :src="getOfficialArtwork(pokemon.sprites)" 
        :alt="pokemon.name"
        class="h-40 w-40 object-contain"
      />
    </div>
    
    <!-- Pokemon Stats -->
    <div class="p-4">
      <h3 class="text-lg font-semibold text-gray-800 mb-2">Estadísticas</h3>
      <div class="space-y-2">
        <div v-for="(stat, index) in pokemon.stats" :key="index" class="flex items-center">
          <span class="w-1/3 text-gray-800 text-sm capitalize">{{ formatStatName(stat.stat.name) }}:</span>
          <div class="w-2/3 bg-gray-200 rounded-full h-5">
            <div 
              :class="`rounded-full h-full ${getStatBarColor(stat.stat.name)} flex items-center justify-end px-2`"
              :style="{ width: `${Math.min(stat.base_stat / 1.5, 100)}%` }"
            >
              <span :class="`text-xs font-bold ${stat.base_stat < 30 ? 'text-gray-800' : 'text-white'}`">
                {{ stat.base_stat }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Base info -->
      <div class="mt-4 grid grid-cols-2 gap-2">
        <div class="text-sm"><span class="font-medium text-gray-700">Altura:</span> {{ pokemon.height / 10 }} m</div>
        <div class="text-sm"><span class="font-medium text-gray-700">Peso:</span> {{ pokemon.weight / 10 }} kg</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  pokemon: {
    type: Object,
    required: true
  }
});

// Format Pokemon ID with leading zeros
const formatId = (id) => {
  return String(id).padStart(3, '0');
};

// Get official artwork or fallback to default sprite
const getOfficialArtwork = (sprites) => {
  return sprites?.other?.['official-artwork']?.front_default || sprites?.front_default;
};

// Format stat name for display
const formatStatName = (statName) => {
  return statName.replace(/-/g, ' ');
};

// Type specific colors with good contrast
const typeColors = {
  normal: 'gray-500',
  fire: 'red-600',
  water: 'blue-600',
  electric: 'yellow-500',
  grass: 'green-600',
  ice: 'cyan-500',
  fighting: 'red-700',
  poison: 'purple-700',
  ground: 'amber-700',
  flying: 'indigo-500',
  psychic: 'pink-600',
  bug: 'lime-600',
  rock: 'stone-600',
  ghost: 'violet-800',
  dragon: 'purple-700',
  dark: 'neutral-800',
  steel: 'slate-600',
  fairy: 'rose-500',
};

// Get background that's slightly darker for better contrast against the card background
const getTypeBackgroundColor = (typeName) => {
  // Get the base color
  const baseColor = typeColors[typeName.toLowerCase()] || 'gray-500';
  // Extract color name and intensity
  const [colorName, intensity] = baseColor.split('-');
  // Calculate a darker shade for better contrast (increase by 200)
  const darkerIntensity = Math.min(parseInt(intensity) + 200, 900);
  return `bg-${colorName}-${darkerIntensity}`;
};

// Add a contrasting border to make types stand out
const getTypeBorderColor = (typeName) => {
  return 'border-white border-opacity-30';
};

const getTypeTextColor = (typeName) => {
  // All types should have white text for better contrast on darker backgrounds
  return 'text-white';
};

// Background color based on primary type is lighter
const typeBackground = computed(() => {
  const primaryType = props.pokemon.types?.[0]?.type.name || 'normal';
  const baseColor = typeColors[primaryType.toLowerCase()] || 'gray-500';
  // Extract color name and use a lighter shade for background
  const [colorName, intensity] = baseColor.split('-');
  return `bg-${colorName}-${intensity}`;
});

// Colors for stat bars with improved contrast
const statBarColors = {
  'hp': 'bg-red-600 text-white',
  'attack': 'bg-orange-600 text-white',
  'defense': 'bg-yellow-600 text-white',
  'special-attack': 'bg-blue-600 text-white',
  'special-defense': 'bg-green-600 text-white',
  'speed': 'bg-purple-600 text-white'
};

const getStatBarColor = (statName) => {
  return statBarColors[statName] || 'bg-blue-600';
};
</script>

<style scoped>
.pokemon-card {
  max-width: 400px;
  margin: 0 auto;
}

@media (min-width: 640px) {
  .pokemon-card {
    max-width: none;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .pokemon-card > div {
    padding: 2rem;
  }
}
</style>