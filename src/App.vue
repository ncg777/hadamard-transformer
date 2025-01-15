<template>
  <v-app>
    <v-main>
      <RhythmSelector :value="hexRhythm" @update:value="updateHexRhythm" /><br />
      <RhythmDFT :value="hexRhythm" :height="'35vh'" />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const hexRhythm = ref("8000");
function updateHexRhythm(newValue:string) {
  hexRhythm.value = newValue;
}
</script>
