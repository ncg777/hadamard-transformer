<template>
  <v-app>
    <v-main>
      <RhythmSelector :value="hexRhythm" />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const hexRhythm = ref("AAAA");
</script>
