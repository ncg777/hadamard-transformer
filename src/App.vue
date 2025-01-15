<template>
  <v-app>
    <v-main>
      <RhythmSelector :value="hexRhythm" @update:value="updateHexRhythm" /><br />
      <v-row justify="center">
        <v-col cols="12" md="12">
          <div style="text-align: center;">
            DFT
          </div>
          <div style="text-align: center;">
            <RhythmDFT :value="hexRhythm" :height="'65vh'" />
          </div>
        </v-col>
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
