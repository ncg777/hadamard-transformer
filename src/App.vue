<template>
  <v-app>
    <v-main>
      <RhythmSelector :value="hexRhythm" @update:value="updateHexRhythm" /><br />
      
        <v-row justify="center">
          <RhythmDFT :value="hexRhythm" :height="'65vh'" />
        </v-row>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const hexRhythm = ref(localStorage.getItem("rhythm") ?? "A8A88A8A");
function updateHexRhythm(newValue:string) {
  hexRhythm.value = newValue;
  localStorage.setItem("rhythm",newValue);
}
</script>
