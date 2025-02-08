<template>
  <v-app  >
    <v-main :style="'padding:2vw; max-width: 95vw;padding-top: 3vh; position:relative;'">
      <a @click.prevent="showHelpModal" class="help-link">?</a>
      <v-row>
        <h1 style="text-align: center; width:100%">Hadamard Transformer</h1>
        <v-col cols="12">
          <RhythmSelector :value="hexRhythm" @update:value="updateHexRhythm" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="3">
          <div>
            <h3 style="text-align: center; width:100%">IV</h3>
            <RhythmIV :value="hexRhythm" :height="'45vh'" :width="'100%'" />
          </div>
        </v-col>
        <v-col cols="9">
          <div >
            <RhythmHadamard :value="hexRhythm" :height="'48vh'" :width="'100%'" @update:value="updateHexRhythm" />
          </div>
        </v-col>
      </v-row>
      <!-- Help Modal -->
      <v-dialog v-model="isHelpModalOpen" persistent hide-overlay>
        <v-card >
          <v-card-title class="headline">
            Hadamard Transformer Help
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
            <br />
            <h3>IV (Interval vector)</h3>
            <p>
              Below is the interval vector of the rhythm:
            </p>
            <ul>
              <li>Lower frequencies are at the bottom and borders are red.</li>
              <li>Higher frequencies are on top and borders are blue.</li>
            </ul>
            <br />
            <h3>Hadamard</h3>
            <p>
              Displays the Hadamard matrix associated with the rhythm if any.
            </p>
            <p>
              The color scheme encodes the values of the Hadamard transform of the rhythm as either red or green for negative 
              and positive values respectively. The brighter the color, the higher the value is.
            </p>
            <p>
              When a cell is clicked, unless it is on the diagonal, a unit is subtracted from position "rowIndex" and added to the position "colIndex"
              in the transformed vector and the transform is applied again until there is a change or a limit is reached without change.
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
.help-link {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 20pt;
  color: #00ff00;
  cursor: pointer;;
}
.help-link:hover {
  text-decoration: underline; /* Adds underline on hover if desired */
}
</style>
