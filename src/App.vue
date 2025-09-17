<script setup lang="ts"></script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <header class="bg-white border-b">
      <div class="container mx-auto p-4 flex items-center justify-between">
        <h1 class="text-2xl md:text-3xl font-bold tracking-tight">Оренда приміщень</h1>
        <nav class="flex gap-2">
          <RouterLink
            :to="{ name: 'home' }"
            class="relative px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 hover:text-gray-900 border border-transparent hover:border-gray-300 hover:shadow-sm transition"
            exact-active-class="ring-2 ring-gray-900 text-gray-900"
          >
            <span class="mr-1">🏠</span> Головна
          </RouterLink>
          <RouterLink
            :to="{ name: 'map' }"
            class="relative px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 hover:text-gray-900 border border-transparent hover:border-gray-300 hover:shadow-sm transition"
            exact-active-class="ring-2 ring-gray-900 text-gray-900"
          >
            <span class="mr-1">🗺️</span> Мапа
          </RouterLink>
        </nav>
      </div>
    </header>
    <main class="py-4">
      <RouterView />
    </main>
  </div>
  
</template>

<style scoped></style>
