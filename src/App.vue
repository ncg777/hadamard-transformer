<template>
  <v-app>
    <v-main>
      <!-- Help Button floating at top right -->
      <v-btn
        color="primary"
        floating
        @click="showHelpModal"
        class="help-button"
      >?</v-btn>
      <RhythmSelector :value="hexRhythm" @update:value="updateHexRhythm" /><br />
      <v-row justify="center">
        <v-col cols="12" md="12">
          <div style="text-align: center;">
            Interval vector
          </div>
          <div style="text-align: center;">
            <RhythmIV :value="hexRhythm" :height="'65vh'" />
          </div>
        </v-col>
      </v-row>
      <!-- Help Modal -->
      <v-dialog v-model="isHelpModalOpen" persistent max-width="600px" hide-overlay>
        <v-card >
          <v-card-title class="headline">
            Rhythm Analyzer
            <v-btn
              icon
              @click="isHelpModalOpen = false"
              aria-label="Close"
              style="float: right;"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <h3>Rhythm selector</h3>
            <p>
              The rhythm selector lets one specify a rhythm as hexadecimal or by toggling individual cells.
            </p>
            <p>
              At each active cell, the contour value is displayed. 
            </p>
            <p>
              The shadow is also displayed as circles with their corresponding shadow contour values.
            </p>
            <h3>Interval vector</h3>
            <p>
              Below is the normalized interval vector of the rhythm:
            </p>
            <ul>
              <li>Lower frequencies are at the bottom and borders are red.</li>
              <li>Higher frequencies are on top and borders are blue.</li>
              <li>A higher energy level means a whiter cell content.</li>
            </ul>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const hexRhythm = ref(localStorage.getItem("rhythm") ?? "A8A88A8A");

const isHelpModalOpen = ref<boolean>(false);

function updateHexRhythm(newValue:string) {
  hexRhythm.value = newValue;
  localStorage.setItem("rhythm",newValue);
}
// Function to show the help modal
function showHelpModal() {
  isHelpModalOpen.value = true;
}
</script>

<style scoped>
.help-button {
  float: right;
  margin-right: 10px;
  margin-top: 10px;
}
</style>
