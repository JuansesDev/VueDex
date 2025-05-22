<template>
  <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    <strong class="font-bold">Error: </strong>
    <span class="block sm:inline">{{ message }}</span>
  </div>
</template>
<script setup>
defineProps({
  message: {
    type: String,
    default: 'Ha ocurrido un error inesperado.'
  }
});
</script>