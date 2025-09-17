<script setup lang="ts"></script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <header class="bg-white border-b">
      <div class="container mx-auto p-4 flex items-center justify-between">
        <h1 class="text-xl font-semibold">Rent Rooms Map</h1>
        <nav class="flex gap-4">
          <RouterLink :to="{ name: 'home' }" class="text-blue-600 hover:underline">Главная</RouterLink>
          <RouterLink :to="{ name: 'map' }" class="text-blue-600 hover:underline">Карта</RouterLink>
        </nav>
      </div>
    </header>
    <main class="py-4">
      <RouterView />
    </main>
  </div>
  
</template>

<style scoped></style>
