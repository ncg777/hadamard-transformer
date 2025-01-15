<template>
  <v-app  >
    <v-main>
      
      <v-btn
          color="primary"
          floating
          @click="showHelpModal"
          class="help-button"
        >?</v-btn>
      <v-row justify="center" style="max-width: 95vw;padding-top: 3vh;">
        
        <h1 style="text-align: center;">Rhythm Analyzer</h1>
        <v-col cols="12">
          <RhythmSelector :value="hexRhythm" @update:value="updateHexRhythm" />
        </v-col>
        <v-col cols="3">
          <div>
            <h3>IV</h3>
            <RhythmIV :value="hexRhythm" :height="'65vh'" :width="'100%'" />
          </div>
        </v-col>
        <v-col cols="9">
          <div >
            <h3>Hadamard</h3>
            <RhythmHadamard :value="hexRhythm" :height="'65vh'" :width="'100%'" />
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
            <h3>IV (Interval vector)</h3>
            <p>
              Below is the normalized interval vector of the rhythm:
            </p>
            <ul>
              <li>Lower frequencies are at the bottom and borders are red.</li>
              <li>Higher frequencies are on top and borders are blue.</li>
              <li>A higher energy level means a whiter cell content.</li>
            </ul>
            <h3>Hadamard</h3>
            <p>
              Displays the Hadamard matrix for the rhythm if any.
            </p>
            <p>
              The color scheme encodes the values of the Hadamard transform as either red or green for negative 
              and positive values respectively. The brighter the color, the higher the value is.
            </p>
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
  position: absolute;
  float: right;
  right: 5vw;
  margin-top: 10px;
}
h3 {
  text-align: center;
}
</style>
